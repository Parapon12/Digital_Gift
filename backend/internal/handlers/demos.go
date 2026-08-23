package handlers



import (

	"context"

	"encoding/json"

	"errors"

	"net/http"

	"time"



	"github.com/go-chi/chi/v5"

	"github.com/google/uuid"

	"github.com/jackc/pgx/v5"



	"github.com/giftlove/backend/internal/models"

)



// SeedDemoContent upserts missing catalog demos (never overwrites admin edits).

func (h *Handler) SeedDemoContent(ctx context.Context) error {

	for _, slug := range models.CatalogDemoSlugs {

		t, ok := models.TemplateByDemoSlug(slug)

		if !ok {

			continue

		}

		content := demoContent(t.Key)

		_, err := h.DB.Exec(ctx, `

			INSERT INTO demo_content (demo_slug, template_key, title, recipient_name, sender_name, content)

			VALUES ($1, $2, $3, $4, $5, $6)

			ON CONFLICT (demo_slug) DO NOTHING

		`, t.DemoSlug, string(t.Key), t.NameTH+" (ตัวอย่าง)", "เธอ", "ฉัน", content)

		if err != nil {

			return err

		}

	}

	return nil

}



func (h *Handler) GetDemo(w http.ResponseWriter, r *http.Request) {

	slug := chi.URLParam(r, "slug")

	demo, err := h.fetchDemoBySlug(r, slug)

	if err == nil {

		jsonResponse(w, http.StatusOK, demoToGift(demo))

		return

	}

	if !errors.Is(err, pgx.ErrNoRows) {

		jsonError(w, http.StatusInternalServerError, "failed to load demo")

		return

	}



	for _, t := range models.Templates {

		if t.DemoSlug == slug {

			jsonResponse(w, http.StatusOK, demoGift(t))

			return

		}

	}

	jsonError(w, http.StatusNotFound, "ไม่พบ demo")

}



func (h *Handler) AdminListDemos(w http.ResponseWriter, r *http.Request) {

	rows, err := h.DB.Query(r.Context(), `

		SELECT demo_slug, template_key, title, recipient_name, sender_name, content, updated_at

		FROM demo_content

		WHERE demo_slug = ANY($1)

	`, models.CatalogDemoSlugs)

	if err != nil {

		jsonError(w, http.StatusInternalServerError, "failed to list demos")

		return

	}

	defer rows.Close()



	demos := []models.DemoContent{}

	for rows.Next() {

		d, err := scanDemo(rows)

		if err != nil {

			jsonError(w, http.StatusInternalServerError, "failed to scan demo")

			return

		}

		demos = append(demos, d)

	}



	order := map[string]int{}

	for i, slug := range models.CatalogDemoSlugs {

		order[slug] = i

	}

	for i := 0; i < len(demos); i++ {

		for j := i + 1; j < len(demos); j++ {

			if order[demos[j].DemoSlug] < order[demos[i].DemoSlug] {

				demos[i], demos[j] = demos[j], demos[i]

			}

		}

	}



	jsonResponse(w, http.StatusOK, demos)

}



func (h *Handler) AdminGetDemo(w http.ResponseWriter, r *http.Request) {

	slug := chi.URLParam(r, "slug")

	if !models.IsCatalogDemoSlug(slug) {

		jsonError(w, http.StatusNotFound, "ไม่พบ demo")

		return

	}

	demo, err := h.fetchDemoBySlug(r, slug)

	if err != nil {

		if errors.Is(err, pgx.ErrNoRows) {

			jsonError(w, http.StatusNotFound, "ไม่พบ demo")

			return

		}

		jsonError(w, http.StatusInternalServerError, "failed to load demo")

		return

	}

	jsonResponse(w, http.StatusOK, demo)

}



func (h *Handler) AdminUpdateDemo(w http.ResponseWriter, r *http.Request) {

	slug := chi.URLParam(r, "slug")

	if !models.IsCatalogDemoSlug(slug) {

		jsonError(w, http.StatusNotFound, "ไม่พบ demo")

		return

	}

	var req models.UpdateDemoRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {

		jsonError(w, http.StatusBadRequest, "invalid request body")

		return

	}



	current, err := h.fetchDemoBySlug(r, slug)

	if err != nil {

		if errors.Is(err, pgx.ErrNoRows) {

			jsonError(w, http.StatusNotFound, "ไม่พบ demo")

			return

		}

		jsonError(w, http.StatusInternalServerError, "failed to load demo")

		return

	}



	title := current.Title

	if req.Title != nil {

		title = *req.Title

	}

	recipient := current.RecipientName

	if req.RecipientName != nil {

		recipient = *req.RecipientName

	}

	sender := current.SenderName

	if req.SenderName != nil {

		sender = *req.SenderName

	}

	content := current.Content

	if req.Content != nil {

		content = *req.Content

	}



	row := h.DB.QueryRow(r.Context(), `

		UPDATE demo_content

		SET title = $2, recipient_name = $3, sender_name = $4, content = $5, updated_at = NOW()

		WHERE demo_slug = $1

		RETURNING demo_slug, template_key, title, recipient_name, sender_name, content, updated_at

	`, slug, title, recipient, sender, content)



	demo, err := scanDemoRow(row)

	if err != nil {

		jsonError(w, http.StatusInternalServerError, "failed to update demo")

		return

	}

	jsonResponse(w, http.StatusOK, demo)

}



func (h *Handler) fetchDemoBySlug(r *http.Request, slug string) (models.DemoContent, error) {

	row := h.DB.QueryRow(r.Context(), `

		SELECT demo_slug, template_key, title, recipient_name, sender_name, content, updated_at

		FROM demo_content WHERE demo_slug = $1

	`, slug)

	return scanDemoRow(row)

}



type demoScanner interface {

	Scan(dest ...any) error

}



func scanDemoRow(row demoScanner) (models.DemoContent, error) {

	var d models.DemoContent

	var key string

	err := row.Scan(&d.DemoSlug, &key, &d.Title, &d.RecipientName, &d.SenderName, &d.Content, &d.UpdatedAt)

	d.TemplateKey = models.TemplateKey(key)

	return d, err

}



func scanDemo(rows pgx.Rows) (models.DemoContent, error) {

	return scanDemoRow(rows)

}



func demoToGift(d models.DemoContent) models.Gift {

	now := time.Now()

	return models.Gift{

		ID:            uuid.Nil,

		PublicID:      "demo-" + d.DemoSlug,

		TemplateKey:   d.TemplateKey,

		Title:         d.Title,

		RecipientName: d.RecipientName,

		SenderName:    d.SenderName,

		Content:       d.Content,

		IsPublished:   true,

		CreatedAt:     now,

		UpdatedAt:     d.UpdatedAt,

	}

}


