package handlers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
)

var allowedUploadExt = map[string]bool{
	".jpg":  true,
	".jpeg": true,
	".png":  true,
	".webp": true,
	".gif":  true,
	".mp3":  true,
	".m4a":  true,
	".aac":  true,
	".wav":  true,
	".ogg":  true,
	".mp4":  true,
	".webm": true,
}

// AdminUpload accepts multipart field "file" and stores it under UploadDir.
func (h *Handler) AdminUpload(w http.ResponseWriter, r *http.Request) {
	maxBytes := h.Cfg.MaxUploadMB() * 1024 * 1024
	r.Body = http.MaxBytesReader(w, r.Body, maxBytes)
	if err := r.ParseMultipartForm(maxBytes); err != nil {
		jsonError(w, http.StatusBadRequest, "ไฟล์ใหญ่เกินไปหรือฟอร์มไม่ถูกต้อง")
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		jsonError(w, http.StatusBadRequest, "ไม่พบไฟล์")
		return
	}
	defer file.Close()

	ext := strings.ToLower(filepath.Ext(header.Filename))
	if !allowedUploadExt[ext] {
		jsonError(w, http.StatusBadRequest, "ชนิดไฟล์ไม่รองรับ (รูป/เสียง/วิดีโอสั้น)")
		return
	}

	if err := os.MkdirAll(h.Cfg.UploadDir, 0o755); err != nil {
		jsonError(w, http.StatusInternalServerError, "สร้างโฟลเดอร์อัปโหลดไม่สำเร็จ")
		return
	}

	name := fmt.Sprintf("%s_%s%s", time.Now().Format("20060102"), uuid.NewString()[:8], ext)
	dest := filepath.Join(h.Cfg.UploadDir, name)
	out, err := os.Create(dest)
	if err != nil {
		jsonError(w, http.StatusInternalServerError, "บันทึกไฟล์ไม่สำเร็จ")
		return
	}
	defer out.Close()

	if _, err := io.Copy(out, file); err != nil {
		_ = os.Remove(dest)
		jsonError(w, http.StatusInternalServerError, "บันทึกไฟล์ไม่สำเร็จ")
		return
	}

	jsonResponse(w, http.StatusCreated, map[string]string{
		"url":  "/uploads/" + name,
		"name": name,
	})
}
