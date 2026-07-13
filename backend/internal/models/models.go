package models

import (
	"time"

	"github.com/google/uuid"
)

type GiftCategory string

const (
	CategoryAnniversary      GiftCategory = "anniversary"
	CategoryBirthday         GiftCategory = "birthday"
	CategorySurprise         GiftCategory = "surprise"
	CategoryGraduation       GiftCategory = "graduation"
	CategoryCongratulations  GiftCategory = "congratulations"
)

type OrderStatus string

const (
	StatusPending    OrderStatus = "pending"
	StatusPaid       OrderStatus = "paid"
	StatusInProgress OrderStatus = "in_progress"
	StatusReview     OrderStatus = "review"
	StatusCompleted  OrderStatus = "completed"
	StatusDelivered  OrderStatus = "delivered"
	StatusCancelled  OrderStatus = "cancelled"
)

type PaymentStatus string

const (
	PaymentUnpaid              PaymentStatus = "unpaid"
	PaymentPendingVerification PaymentStatus = "pending_verification"
	PaymentPaid                PaymentStatus = "paid"
	PaymentRefunded            PaymentStatus = "refunded"
)

type Package struct {
	ID            uuid.UUID `json:"id"`
	Slug          string    `json:"slug"`
	Name          string    `json:"name"`
	NameTH        string    `json:"name_th"`
	Description   string    `json:"description"`
	DescriptionTH string    `json:"description_th"`
	Price         float64   `json:"price"`
	Features      []string  `json:"features"`
	FeaturesTH    []string  `json:"features_th"`
	IsActive      bool      `json:"is_active"`
	SortOrder     int       `json:"sort_order"`
}

type PortfolioItem struct {
	ID          uuid.UUID    `json:"id"`
	Title       string       `json:"title"`
	TitleTH     string       `json:"title_th"`
	Description string       `json:"description"`
	Category    GiftCategory `json:"category"`
	ImageURL    string       `json:"image_url"`
	DemoURL     string       `json:"demo_url,omitempty"`
	IsFeatured  bool         `json:"is_featured"`
	SortOrder   int          `json:"sort_order"`
}

type Order struct {
	ID              uuid.UUID     `json:"id"`
	OrderNumber     string        `json:"order_number"`
	CustomerName    string        `json:"customer_name"`
	CustomerEmail   string        `json:"customer_email"`
	CustomerPhone   string        `json:"customer_phone,omitempty"`
	RecipientName   string        `json:"recipient_name,omitempty"`
	GiftCategory    GiftCategory  `json:"gift_category"`
	PackageID       uuid.UUID     `json:"package_id"`
	PackageName     string        `json:"package_name,omitempty"`
	SpecialDate     *time.Time    `json:"special_date,omitempty"`
	Message         string        `json:"message,omitempty"`
	AdditionalNotes string        `json:"additional_notes,omitempty"`
	MusicURL        string        `json:"music_url,omitempty"`
	VideoURL        string        `json:"video_url,omitempty"`
	Status          OrderStatus   `json:"status"`
	PaymentStatus   PaymentStatus `json:"payment_status"`
	PaymentRef      string        `json:"payment_ref,omitempty"`
	TotalAmount     float64       `json:"total_amount"`
	DeployedURL     string        `json:"deployed_url,omitempty"`
	Files           []OrderFile   `json:"files,omitempty"`
	CreatedAt       time.Time     `json:"created_at"`
	UpdatedAt       time.Time     `json:"updated_at"`
}

type OrderFile struct {
	ID        uuid.UUID `json:"id"`
	OrderID   uuid.UUID `json:"order_id"`
	FileType  string    `json:"file_type"`
	FileName  string    `json:"file_name"`
	FileURL   string    `json:"file_url"`
	FileSize  int64     `json:"file_size,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

type CreateOrderRequest struct {
	CustomerName    string       `json:"customer_name"`
	CustomerEmail   string       `json:"customer_email"`
	CustomerPhone   string       `json:"customer_phone"`
	RecipientName   string       `json:"recipient_name"`
	GiftCategory    GiftCategory `json:"gift_category"`
	PackageID       string       `json:"package_id"`
	SpecialDate     string       `json:"special_date"`
	Message         string       `json:"message"`
	AdditionalNotes string       `json:"additional_notes"`
	MusicURL        string       `json:"music_url"`
	VideoURL        string       `json:"video_url"`
	PaymentRef      string       `json:"payment_ref"`
}

type ContactRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Subject string `json:"subject"`
	Message string `json:"message"`
}

type GiftTypeInfo struct {
	ID          GiftCategory `json:"id"`
	Name        string       `json:"name"`
	NameTH      string       `json:"name_th"`
	Description string       `json:"description"`
	DescriptionTH string     `json:"description_th"`
	Icon        string       `json:"icon"`
}

var GiftTypes = []GiftTypeInfo{
	{CategoryAnniversary, "Anniversary", "วันครบรอบ", "Celebrate your love story", "ฉลองเรื่องราวความรักของคุณ", "heart"},
	{CategoryBirthday, "Birthday", "วันเกิด", "Make their birthday unforgettable", "ทำให้วันเกิดพิเศษยิ่งขึ้น", "cake"},
	{CategorySurprise, "Surprise", "เซอร์ไพรส์", "Create a magical surprise moment", "สร้างช่วงเวลาเซอร์ไพรส์อันมหัศจรรย์", "gift"},
	{CategoryGraduation, "Graduation", "รับปริญญา", "Honor their achievement", "ยกย่องความสำเร็จของพวกเขา", "graduation"},
	{CategoryCongratulations, "Congratulations", "แสดงความยินดี", "Share your joy and blessings", "แบ่งปันความยินดีและพร", "star"},
}

var StatusLabelsTH = map[OrderStatus]string{
	StatusPending:    "รอดำเนินการ",
	StatusPaid:       "ชำระเงินแล้ว",
	StatusInProgress: "กำลังสร้างเว็บไซต์",
	StatusReview:     "ตรวจสอบคุณภาพ",
	StatusCompleted:  "สร้างเสร็จแล้ว",
	StatusDelivered:  "ส่งมอบแล้ว",
	StatusCancelled:  "ยกเลิก",
}
