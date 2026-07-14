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
	TemplateMemoryPage      TemplateKey = "memory_page"
	TemplateBirthday        TemplateKey = "birthday"
	TemplateGraduation      TemplateKey = "graduation"
	TemplateProposal        TemplateKey = "proposal"
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
	{TemplateLoveAdventure3D, "3D Love Adventure", "ผจญภัยความรัก 3D", "เดินในฉาก 3D + ความทรงจำ + แมว + ข้อความ", "complete", "love-adventure"},
	{TemplateLoveStory, "Love Story", "เรื่องราวความรัก", "กล่องของขวัญ · รหัส · นับวัน · ความทรงจำ · ซองลับ", "complete", "love-story"},
	{TemplateLoveQuiz, "Love Quiz", "ควิซความรัก", "ปุ่มไม่วิ่งหนี · พลุ · แมวถือดอกไม้", "complete", "love-quiz"},
	{TemplateMemoryPage, "Memory Page", "หน้ารำลึกความทรงจำ", "scrapbook เลื่อนลงดูรูป แคปชัน และโน้ตลับ", "complete", "memory-page"},
	{TemplateBirthday, "Birthday", "วันเกิด", "โครง 3D + ข้อความ", "skeleton", "birthday"},
	{TemplateGraduation, "Graduation", "รับปริญญา", "โครง 3D + ข้อความ", "skeleton", "graduation"},
	{TemplateProposal, "Proposal", "ขอแต่งงาน", "โครง 3D + ข้อความ", "skeleton", "proposal"},
}

func ValidTemplateKey(key string) bool {
	for _, t := range Templates {
		if string(t.Key) == key {
			return true
		}
	}
	return false
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
