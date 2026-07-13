package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"

	"github.com/giftlove/backend/internal/config"
	"github.com/giftlove/backend/internal/database"
	"github.com/giftlove/backend/internal/handlers"
	mw "github.com/giftlove/backend/internal/middleware"
)

func main() {
	_ = godotenv.Load()

	cfg := config.Load()
	ctx := context.Background()

	pool, err := database.Connect(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("database connection failed: %v", err)
	}
	defer pool.Close()

	migrationsDir := filepath.Join("migrations")
	if _, err := os.Stat(migrationsDir); os.IsNotExist(err) {
		migrationsDir = filepath.Join("backend", "migrations")
	}
	if err := database.RunMigrations(ctx, pool, migrationsDir); err != nil {
		log.Fatalf("migration failed: %v", err)
	}

	h := handlers.New(pool, cfg)

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(mw.CORS(cfg.FrontendURL))

	r.Get("/health", h.Health)
	r.Get("/api/site", h.SiteConfig)
	r.Get("/api/templates", h.ListTemplates)
	r.Get("/api/gifts/{publicID}", h.GetGiftPublic)
	r.Get("/api/demos/{slug}", h.GetDemo)

	r.Post("/api/admin/login", h.AdminLogin)

	r.Route("/api/admin", func(ar chi.Router) {
		ar.Use(mw.JWTAuth(cfg.JWTSecret))
		ar.Get("/gifts", h.AdminListGifts)
		ar.Post("/gifts", h.AdminCreateGift)
		ar.Get("/gifts/{id}", h.AdminGetGift)
		ar.Put("/gifts/{id}", h.AdminUpdateGift)
		ar.Delete("/gifts/{id}", h.AdminDeleteGift)
	})

	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      r,
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 60 * time.Second,
	}

	go func() {
		log.Printf("GiftLove API running on port %s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server failed: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	_ = srv.Shutdown(shutdownCtx)
	log.Println("server stopped")
}
