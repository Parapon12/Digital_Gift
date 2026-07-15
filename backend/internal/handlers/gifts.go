package handlers

import (
	"crypto/rand"
	"encoding/json"
	"errors"
	"math/big"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/giftlove/backend/internal/auth"
	"github.com/giftlove/backend/internal/config"
	"github.com/giftlove/backend/internal/models"
)

type Handler struct {
	DB  *pgxpool.Pool
	Cfg config.Config
}

func New(db *pgxpool.Pool, cfg config.Config) *Handler {
	return &Handler{DB: db, Cfg: cfg}
}

func (h *Handler) Health(w http.ResponseWriter, r *http.Request) {
	jsonResponse(w, http.StatusOK, map[string]string{"status": "ok", "service": "giftlove-api"})
}

func (h *Handler) SiteConfig(w http.ResponseWriter, r *http.Request) {
	jsonResponse(w, http.StatusOK, map[string]string{
		"line_url":     h.Cfg.LINEURL,
		"frontend_url": h.Cfg.FrontendURL,
		"share_url":    h.Cfg.ShareOrigin(),
	})
}

func (h *Handler) ListTemplates(w http.ResponseWriter, r *http.Request) {
	jsonResponse(w, http.StatusOK, models.Templates)
}

func (h *Handler) AdminLogin(w http.ResponseWriter, r *http.Request) {
	var req models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.Email != h.Cfg.AdminEmail || req.Password != h.Cfg.AdminPassword {
		jsonError(w, http.StatusUnauthorized, "อีเมลหรือรหัสผ่านไม่ถูกต้อง")
		return
	}
	token, err := auth.IssueToken(h.Cfg.JWTSecret, req.Email, 72*time.Hour)
	if err != nil {
		jsonError(w, http.StatusInternalServerError, "failed to issue token")
		return
	}
	jsonResponse(w, http.StatusOK, models.LoginResponse{Token: token, Email: req.Email})
}

func (h *Handler) GetGiftPublic(w http.ResponseWriter, r *http.Request) {
	publicID := chi.URLParam(r, "publicID")
	gift, err := h.fetchGiftByPublicID(r, publicID)
	if err != nil {
		jsonError(w, http.StatusNotFound, "ไม่พบของขวัญ")
		return
	}
	if !gift.IsPublished {
		jsonError(w, http.StatusNotFound, "ไม่พบของขวัญ")
		return
	}
	jsonResponse(w, http.StatusOK, gift)
}

func (h *Handler) GetDemo(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	for _, t := range models.Templates {
		if t.DemoSlug == slug {
			jsonResponse(w, http.StatusOK, demoGift(t))
			return
		}
	}
	jsonError(w, http.StatusNotFound, "ไม่พบ demo")
}

func (h *Handler) AdminListGifts(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query(r.Context(), `
		SELECT id, public_id, template_key, title, recipient_name, sender_name, content, is_published, created_at, updated_at
		FROM gifts ORDER BY created_at DESC
	`)
	if err != nil {
		jsonError(w, http.StatusInternalServerError, "failed to list gifts")
		return
	}
	defer rows.Close()

	gifts := []models.Gift{}
	for rows.Next() {
		g, err := scanGift(rows)
		if err != nil {
			jsonError(w, http.StatusInternalServerError, "failed to scan gift")
			return
		}
		gifts = append(gifts, g)
	}
	jsonResponse(w, http.StatusOK, gifts)
}

func (h *Handler) AdminGetGift(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		jsonError(w, http.StatusBadRequest, "invalid id")
		return
	}
	gift, err := h.fetchGiftByID(r, id)
	if err != nil {
		jsonError(w, http.StatusNotFound, "ไม่พบของขวัญ")
		return
	}
	jsonResponse(w, http.StatusOK, gift)
}

func (h *Handler) AdminCreateGift(w http.ResponseWriter, r *http.Request) {
	var req models.CreateGiftRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if !models.ValidTemplateKey(req.TemplateKey) {
		jsonError(w, http.StatusBadRequest, "เทมเพลตไม่ถูกต้อง")
		return
	}
	if len(req.Content) == 0 {
		req.Content = json.RawMessage(`{}`)
	}
	published := true
	if req.IsPublished != nil {
		published = *req.IsPublished
	}

	var gift models.Gift
	var err error
	for attempt := 0; attempt < 8; attempt++ {
		var publicID string
		publicID, err = generatePublicID()
		if err != nil {
			jsonError(w, http.StatusInternalServerError, "failed to generate id")
			return
		}

		err = h.DB.QueryRow(r.Context(), `
			INSERT INTO gifts (public_id, template_key, title, recipient_name, sender_name, content, is_published)
			VALUES ($1,$2,$3,$4,$5,$6,$7)
			RETURNING id, public_id, template_key, title, recipient_name, sender_name, content, is_published, created_at, updated_at
		`, publicID, req.TemplateKey, req.Title, req.RecipientName, req.SenderName, req.Content, published,
		).Scan(&gift.ID, &gift.PublicID, &gift.TemplateKey, &gift.Title, &gift.RecipientName, &gift.SenderName,
			&gift.Content, &gift.IsPublished, &gift.CreatedAt, &gift.UpdatedAt)
		if err == nil {
			jsonResponse(w, http.StatusCreated, gift)
			return
		}
		if isUniqueViolation(err) {
			continue
		}
		jsonError(w, http.StatusInternalServerError, "failed to create gift")
		return
	}
	jsonError(w, http.StatusInternalServerError, "ไม่สามารถสร้างรหัสลิงก์ที่ไม่ซ้ำได้")
}

func isUniqueViolation(err error) bool {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		return pgErr.Code == "23505"
	}
	return false
}

func (h *Handler) AdminUpdateGift(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		jsonError(w, http.StatusBadRequest, "invalid id")
		return
	}
	existing, err := h.fetchGiftByID(r, id)
	if err != nil {
		jsonError(w, http.StatusNotFound, "ไม่พบของขวัญ")
		return
	}

	var req models.UpdateGiftRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	title := existing.Title
	recipient := existing.RecipientName
	sender := existing.SenderName
	content := existing.Content
	published := existing.IsPublished
	if req.Title != nil {
		title = *req.Title
	}
	if req.RecipientName != nil {
		recipient = *req.RecipientName
	}
	if req.SenderName != nil {
		sender = *req.SenderName
	}
	if req.Content != nil {
		content = *req.Content
	}
	if req.IsPublished != nil {
		published = *req.IsPublished
	}

	var gift models.Gift
	err = h.DB.QueryRow(r.Context(), `
		UPDATE gifts SET title=$2, recipient_name=$3, sender_name=$4, content=$5, is_published=$6, updated_at=NOW()
		WHERE id=$1
		RETURNING id, public_id, template_key, title, recipient_name, sender_name, content, is_published, created_at, updated_at
	`, id, title, recipient, sender, content, published,
	).Scan(&gift.ID, &gift.PublicID, &gift.TemplateKey, &gift.Title, &gift.RecipientName, &gift.SenderName,
		&gift.Content, &gift.IsPublished, &gift.CreatedAt, &gift.UpdatedAt)
	if err != nil {
		jsonError(w, http.StatusInternalServerError, "failed to update gift")
		return
	}
	jsonResponse(w, http.StatusOK, gift)
}

func (h *Handler) AdminDeleteGift(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		jsonError(w, http.StatusBadRequest, "invalid id")
		return
	}
	tag, err := h.DB.Exec(r.Context(), `DELETE FROM gifts WHERE id = $1`, id)
	if err != nil {
		jsonError(w, http.StatusInternalServerError, "failed to delete gift")
		return
	}
	if tag.RowsAffected() == 0 {
		jsonError(w, http.StatusNotFound, "ไม่พบของขวัญ")
		return
	}
	jsonResponse(w, http.StatusOK, map[string]string{"message": "deleted"})
}

func (h *Handler) fetchGiftByPublicID(r *http.Request, publicID string) (models.Gift, error) {
	row := h.DB.QueryRow(r.Context(), `
		SELECT id, public_id, template_key, title, recipient_name, sender_name, content, is_published, created_at, updated_at
		FROM gifts WHERE public_id = $1
	`, publicID)
	return scanGiftRow(row)
}

func (h *Handler) fetchGiftByID(r *http.Request, id uuid.UUID) (models.Gift, error) {
	row := h.DB.QueryRow(r.Context(), `
		SELECT id, public_id, template_key, title, recipient_name, sender_name, content, is_published, created_at, updated_at
		FROM gifts WHERE id = $1
	`, id)
	return scanGiftRow(row)
}

type scannable interface {
	Scan(dest ...any) error
}

func scanGiftRow(row scannable) (models.Gift, error) {
	var g models.Gift
	err := row.Scan(&g.ID, &g.PublicID, &g.TemplateKey, &g.Title, &g.RecipientName, &g.SenderName,
		&g.Content, &g.IsPublished, &g.CreatedAt, &g.UpdatedAt)
	return g, err
}

func scanGift(rows pgx.Rows) (models.Gift, error) {
	return scanGiftRow(rows)
}

func generatePublicID() (string, error) {
	const alphabet = "abcdefghjkmnpqrstuvwxyz23456789"
	b := make([]byte, 8)
	for i := range b {
		n, err := rand.Int(rand.Reader, big.NewInt(int64(len(alphabet))))
		if err != nil {
			return "", err
		}
		b[i] = alphabet[n.Int64()]
	}
	return string(b), nil
}

func demoGift(t models.TemplateInfo) models.Gift {
	content := demoContent(t.Key)
	return models.Gift{
		ID:            uuid.Nil,
		PublicID:      "demo-" + t.DemoSlug,
		TemplateKey:   t.Key,
		Title:         t.NameTH + " (ตัวอย่าง)",
		RecipientName: "เธอ",
		SenderName:    "ฉัน",
		Content:       content,
		IsPublished:   true,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}
}

func demoContent(key models.TemplateKey) json.RawMessage {
	switch key {
	case models.TemplateLoveAdventure3D:
		return json.RawMessage(`{
			"message":"ทุกก้าวที่เราเดินด้วยกันคือความทรงจำที่ฉันเก็บไว้ และอยากเก็บต่อไปอีกนานแสนนาน",
			"catName":"Mochi",
			"memories":[
				{"title":"วันแรกที่เจอ","text":"ยิ้มของเธอทำให้โลกช้าลง ทุกอย่างดูสว่างขึ้นทันที","imageUrl":""},
				{"title":"ทริปทะเล","text":"เสียงคลื่นกับเสียงหัวเราะของเรา ยังก้องอยู่ในใจ","imageUrl":""},
				{"title":"วันที่เหนื่อย","text":"แค่ได้อยู่ข้างกัน ก็รู้สึกว่าโลกเบาลง","imageUrl":""},
				{"title":"วันนี้","text":"ยังเลือกเธอเหมือนเดิม และอยากเดินต่อไปด้วยกัน","imageUrl":""}
			]
		}`)
	case models.TemplateLoveStory:
		return json.RawMessage(`{
			"title":"ความทรงจำของเรา",
			"password":"14022025",
			"passwordHint":"วัน เดือน ปี ที่เราเริ่มคบกัน",
			"anniversaryDate":"2025-02-14",
			"couplePhotoUrl":"/love/couple-demo.png",
			"anniversaryLabel":"วันเริ่มคบกัน",
			"musicUrl":"",
			"targetDays":1000,
			"memories":[
				{"title":"ทะเลครั้งแรก","text":"วันแรกที่ไปเที่ยวทะเลด้วยกัน 🌊","caption":"วันแรกที่ไปเที่ยวทะเลด้วยกัน 🌊"},
				{"title":"ชาบูครั้งแรก","text":"ร้านชาบูครั้งแรก 🍲","caption":"ร้านชาบูครั้งแรก 🍲"},
				{"title":"วันเกิดปีแรก","text":"วันเกิดปีแรกที่ฉลองด้วยกัน 🎂","caption":"วันเกิดปีแรกที่ฉลองด้วยกัน 🎂"}
			],
			"capsules":[
				{"title":"เปิดได้เมื่อครบ 6 เดือน","unlockRule":"months","unlockValue":6,"text":"ผ่านมาครึ่งปีแล้วนะ ขอบคุณที่อยู่ด้วยกัน"},
				{"title":"เปิดได้เมื่อครบ 1 ปี","unlockRule":"years","unlockValue":1,"text":"หนึ่งปีของเรา… ยังอยากเดินต่อไปด้วยกัน"},
				{"title":"เปิดได้เมื่อทะเลาะกัน","unlockRule":"manual","unlocked":true,"text":"แม้ทะเลาะก็ยังเลือกกันอยู่ รักนะ"},
				{"title":"เปิดได้เมื่อคิดถึงกันมาก ๆ","unlockRule":"always","text":"คิดถึงแล้วเปิดซองนี้ได้นะ — ฉันก็คิดถึงเหมือนกัน"}
			]
		}`)
	case models.TemplateLoveQuiz:
		return json.RawMessage(`{
			"question":"รักฉันมั้ยที่รัก",
			"yesLabel":"รักที่สุด",
			"noLabel":"ไม่",
			"successTitle":"น่ารัก",
			"successMessage":"ได้ยินแล้วใจฟูเลย 😊",
			"photos":[]
		}`)
	case models.TemplateMemoryPage:
		return json.RawMessage(`{
			"theme":"couple",
			"title":"สมุดความทรงจำของเรา",
			"intro":"ใต้รูปบอกแค่ที่ไหน — เปิดซองเพื่ออ่านความรู้สึกที่เก็บไว้",
			"musicUrl":"",
			"letterTitle":"ขอบคุณที่เป็นเธอ",
			"letterBody":"ขอบคุณที่เดินมาด้วยกันจนถึงหน้านี้\n\nทุกภาพที่ผ่านมา อาจดูเป็นแค่ที่ไหนสักแห่ง — แต่สำหรับฉัน มันคือเหตุผลที่ยังยิ้มได้ในวันที่เหนื่อย\n\nขอบคุณที่ฟัง ขอบคุณที่อยู่ และขอบคุณที่ยังเลือกกันอยู่\n\nจากนี้ไป… ฉันยังอยากสร้างความทรงจำต่อไปด้วยกัน",
			"closingTitle":"ขอบคุณที่เป็นเธอ",
			"closingMessage":"ขอบคุณที่เดินมาด้วยกันจนถึงหน้านี้",
			"entries":[
				{"id":"1","date":"วันแรก","caption":"คาเฟ่มุมเงียบ · ย่านเก่า","imageUrl":"/love/couple-demo.png","secretNote":"วันนั้นหัวใจเต้นแรงกว่าที่แสดงออก แค่ได้มานั่งตรงข้ามเธอ ก็รู้สึกว่าโลกช้าลง และอยากเก็บช่วงเวลานั้นไว้นาน ๆ"},
				{"id":"2","date":"คืนที่คุยยาว","caption":"ห้องพัก · หน้าต่างเล็ก ๆ","imageUrl":"/love/memory-lock-ref.png","secretNote":"ข้อความยาว ๆ ในมือถือ แต่ฉันไม่เคยเบื่อ ยิ้มคนเดียวหลายรอบ เพราะรู้ว่าอีกฝั่งก็ยังไม่อยากนอนเหมือนกัน"},
				{"id":"3","date":"ทริปแรก","caption":"ชายหาด · ตอนเย็นลมแรง","imageUrl":"/love/quiz-meadow.png","secretNote":"เสียงคลื่นกลบความเขินไปบางส่วน แต่ความรู้สึกยังดังมาก อยากบอกเธอตอนนั้นเลยว่า ดีใจที่มาด้วยกัน"},
				{"id":"4","date":"วันธรรมดา","caption":"ม้านั่งริมทาง · หน้าบ้าน","imageUrl":"/brand/gift-hero-banner.png","secretNote":"ไม่ได้สวยอลังการ ไม่มีเหตุการณ์ใหญ่ แค่ได้อยู่ข้างกันหลังวันเหนื่อย ๆ ก็พอทำให้โลกเบาลงแล้ว"},
				{"id":"5","date":"วันแฮปปี้","caption":"มุมห้อง · ที่นั่งโปรด","imageUrl":"/love/mochi-cat.png","secretNote":"บางวันไม่ต้องพูดอะไรเลย แค่หัวเราะเพราะเรื่องเล็ก ๆ ก็รู้สึกว่าบ้านนี้มีเธอจริง ๆ"},
				{"id":"6","date":"ของขวัญเล็ก ๆ","caption":"โต๊ะทำงาน · กล่องใบนั้น","imageUrl":"/brand/gift-box-a.png","secretNote":"ของไม่ได้แพง แต่ฉันคิดถึงเธอทุกขั้นตั้งแต่เลือกรibbon จนผูกโบว์ — อยากให้รู้ว่าคิดถึงจริง"},
				{"id":"7","date":"วันที่เปิดใจ","caption":"สวนสาธารณะ · ม้านั่งใต้ต้นไม้","imageUrl":"/love/calico-cat.png","secretNote":"พูดเรื่องที่เก็บมานานด้วยเสียงสั่น แต่เธอฟังจนจบ ช่วงนั้นฉันขอบคุณมากจนพูดไม่ออก"},
				{"id":"8","date":"วันอุ่น ๆ","caption":"บ้าน · โต๊ะกินข้าว","imageUrl":"/brand/gift-box-b.png","secretNote":"กลิ่นข้าว เสียงช้อนจาน และการได้มองหน้าเธอตอนกิน — ความสุขแบบเรียบง่ายที่อยากมีต่อไป"},
				{"id":"9","date":"วันที่คิดถึง","caption":"ทุ่งหญ้า · ฟ้าหลังฝน","imageUrl":"/love/quiz-meadow.png","secretNote":"ลมผ่านแล้วคิดถึงเธอทันที ถึงอยู่คนเดียวก็ยังรู้สึกอุ่น เพราะรู้ว่ามีที่กลับไปในใจ"},
				{"id":"10","date":"วันนี้","caption":"ตรงนี้ · ที่เรายืนด้วยกัน","imageUrl":"/love/couple-demo.png","secretNote":"ยังเลือกเธออยู่ในทุกเช้า และยังอยากเลือกต่อไปในทุกพรุ่งนี้ — ถึงหน้าสุดท้ายของสมุด เรื่องของเรายังไม่จบ"}
			]
		}`)
	case models.TemplateBirthday:
		return json.RawMessage(`{
			"headline":"สุขสันต์ วันเกิด",
			"message":"ขอให้เป็นวันที่เต็มไปด้วยรอยยิ้ม ความสุข และสิ่งดี ๆ ในทุก ๆ วันนะ",
			"closingMessage":"ขอบคุณที่เข้ามาเป็นความสุขในชีวิตฉันนะ",
			"heroImageUrl":"birthday/cake-hero.png",
			"specialMessage":"สุขสันต์วันเกิดนะ\n\nขอบคุณที่เป็นแสงสว่างในทุกวันที่ผ่านมา ขอให้ปีนี้เต็มไปด้วยรอยยิ้ม สุขภาพแข็งแรง และเรื่องดี ๆ ที่ทำให้หัวใจเต้นแรงอย่างมีความสุข",
			"photos":["love/couple-demo.png","love/memory-05-cafe.jpg","love/memory-06-beach.jpg","love/memory-08-sunset.jpg"],
			"gameTitle":"เป่าเทียนวันเกิด",
			"gameMessage":"คำอวยพรพิเศษปลดล็อกแล้ว — ขอให้ทุกคำอธิษฐานเป็นจริงนะ",
			"giftTitle":"ของขวัญให้เธอ",
			"giftMessage":"เปิดกล่องนี้แล้ว… ของขวัญจริงคือเธอที่อยู่ในชีวิตฉันทุกวัน",
			"giftImageUrl":"brand/gift-box-a.png"
		}`)
	case models.TemplateGraduation:
		return json.RawMessage(`{"headline":"ยินดีด้วยนะบัณฑิต","message":"ภูมิใจในความพยายามของเธอมาก","photos":[]}`)
	case models.TemplateProposal:
		return json.RawMessage(`{"headline":"แต่งงานกับฉันนะ","message":"อยากเดินไปด้วยกันตลอดชีวิต","photos":[]}`)
	default:
		return json.RawMessage(`{}`)
	}
}

func jsonResponse(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(data)
}

func jsonError(w http.ResponseWriter, status int, message string) {
	jsonResponse(w, status, map[string]string{"error": message})
}
