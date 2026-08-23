package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type TemplateKey string

const (
	TemplateLoveAdventure3D TemplateKey = "love_adventure_3d"
	TemplateLoveStory       TemplateKey = "love_story"
	TemplateLoveQuiz        TemplateKey = "love_quiz"
	TemplateLoveLetter      TemplateKey = "love_letter"
	TemplateLoveArrow       TemplateKey = "love_arrow"
	TemplateMemoryStory     TemplateKey = "memory_story"
	TemplateMemoryPage        TemplateKey = "memory_page"
	TemplateBirthday          TemplateKey = "birthday"
	TemplateCrocodileBlessing TemplateKey = "crocodile_blessing"
	TemplateGraduation        TemplateKey = "graduation"
)

type TemplateInfo struct {
	Key         TemplateKey `json:"key"`
	Name        string      `json:"name"`
	NameTH      string      `json:"name_th"`
	Description string      `json:"description"`
	Status      string      `json:"status"` // complete | skeleton
	DemoSlug    string      `json:"demo_slug"`
}

var Templates = []TemplateInfo{
	{TemplateLoveStory, "Love Story", "เรื่องราวความรัก", "กล่องของขวัญ · รหัส · นับวัน · ความทรงจำ · ซองลับ", "complete", "love-story"},
	{TemplateLoveQuiz, "Love Quiz", "ควิซความรัก", "ปุ่มไม่วิ่งหนี · พลุ · แมวถือดอกไม้", "complete", "love-quiz"},
	{TemplateLoveLetter, "Love Letter", "จดหมายรัก", "ซองจดหมาย · เปิดแล้วไปต่อ", "skeleton", "love-letter"},
	{TemplateLoveArrow, "Cupid Arrow", "คupid ยิงลูกศร", "มินิเกมธนู · ใบไม้หัวใจ", "skeleton", "love-arrow"},
	{TemplateMemoryStory, "Memory Story", "เรื่องราวความทรงจำ", "Timeline · Gallery · หัวใจคำว่ารัก", "skeleton", "memory-story"},
	{TemplateMemoryPage, "Memory Page", "หน้ารำลึกความทรงจำ", "scrapbook เลื่อนลงดูรูป แคปชัน และโน้ตลับ", "complete", "memory-page"},
	{TemplateBirthday, "Birthday", "วันเกิด", "ฝนหัวใจ · Happy birthday · สมุดรูป 5 หน้า", "complete", "birthday"},
	{TemplateCrocodileBlessing, "Tiger Blessing", "กราดพุงเสืออวยพร", "แตะพุงเสือ · คำอวยพรถึงคนสำคัญหรือแฟน", "complete", "crocodile-blessing"},
}

func ValidTemplateKey(key string) bool {
	for _, t := range Templates {
		if string(t.Key) == key {
			return true
		}
	}
	// Legacy — hidden from catalog but still render existing gifts
	switch TemplateKey(key) {
	case TemplateBirthday, TemplateGraduation, TemplateKey("proposal"),
		TemplateLoveAdventure3D, TemplateLoveLetter, TemplateLoveArrow, TemplateMemoryStory:
		return true
	default:
		return false
	}
}

type Gift struct {
	ID            uuid.UUID       `json:"id"`
	PublicID      string          `json:"public_id"`
	TemplateKey   TemplateKey     `json:"template_key"`
	Title         string          `json:"title"`
	RecipientName string          `json:"recipient_name"`
	SenderName    string          `json:"sender_name"`
	Content       json.RawMessage `json:"content"`
	IsPublished   bool            `json:"is_published"`
	CreatedAt     time.Time       `json:"created_at"`
	UpdatedAt     time.Time       `json:"updated_at"`
}

type CreateGiftRequest struct {
	TemplateKey   string          `json:"template_key"`
	Title         string          `json:"title"`
	RecipientName string          `json:"recipient_name"`
	SenderName    string          `json:"sender_name"`
	Content       json.RawMessage `json:"content"`
	IsPublished   *bool           `json:"is_published"`
}

type UpdateGiftRequest struct {
	Title         *string          `json:"title"`
	RecipientName *string          `json:"recipient_name"`
	SenderName    *string          `json:"sender_name"`
	Content       *json.RawMessage `json:"content"`
	IsPublished   *bool            `json:"is_published"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
	Email string `json:"email"`
}
