package config

import (
	"os"
	"strconv"
)

type Config struct {
	Port           string
	DatabaseURL    string
	UploadDir      string
	FrontendURL    string
	AdminEmail     string
	AdminPassword  string
	JWTSecret      string
	LINEURL        string
}

func Load() Config {
	return Config{
		Port:          getEnv("PORT", "8080"),
		DatabaseURL:   getEnv("DATABASE_URL", "postgres://giftlove:giftlove@localhost:5432/giftlove?sslmode=disable"),
		UploadDir:     getEnv("UPLOAD_DIR", "./uploads"),
		FrontendURL:   getEnv("FRONTEND_URL", "http://localhost:5173"),
		AdminEmail:    getEnv("ADMIN_EMAIL", "admin@giftlove.studio"),
		AdminPassword: getEnv("ADMIN_PASSWORD", "giftlove-admin"),
		JWTSecret:     getEnv("JWT_SECRET", "giftlove-dev-jwt-secret-change-me"),
		LINEURL:       getEnv("LINE_URL", "https://line.me/ti/p/@giftlove"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func (c Config) MaxUploadMB() int64 {
	mb, err := strconv.ParseInt(getEnv("MAX_UPLOAD_MB", "50"), 10, 64)
	if err != nil {
		return 50
	}
	return mb
}
