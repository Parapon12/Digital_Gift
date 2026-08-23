package models



import (

	"encoding/json"

	"time"

)



// DemoContent is a persisted demo/example page editable from admin.

type DemoContent struct {

	DemoSlug      string          `json:"demo_slug"`

	TemplateKey   TemplateKey     `json:"template_key"`

	Title         string          `json:"title"`

	RecipientName string          `json:"recipient_name"`

	SenderName    string          `json:"sender_name"`

	Content       json.RawMessage `json:"content"`

	UpdatedAt     time.Time       `json:"updated_at"`

}



type UpdateDemoRequest struct {

	Title         *string          `json:"title"`

	RecipientName *string          `json:"recipient_name"`

	SenderName    *string          `json:"sender_name"`

	Content       *json.RawMessage `json:"content"`

}



// CatalogDemoSlugs — ตัวอย่างทั้งหมดที่แก้ในแอดมินได้

var CatalogDemoSlugs = []string{

	"love-story",

	"love-quiz",

	"memory-page",

	"birthday",
	"crocodile-blessing",

	"love-letter",

	"love-arrow",

	"memory-story",

}



func IsCatalogDemoSlug(slug string) bool {

	for _, s := range CatalogDemoSlugs {

		if s == slug {

			return true

		}

	}

	return false

}



func TemplateByDemoSlug(slug string) (TemplateInfo, bool) {

	for _, t := range Templates {

		if t.DemoSlug == slug {

			return t, true

		}

	}

	return TemplateInfo{}, false

}


