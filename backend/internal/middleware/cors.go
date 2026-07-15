package middleware

import (
	"net"
	"net/http"
	"net/url"

	"github.com/go-chi/cors"
)

func CORS(frontendURL string) func(http.Handler) http.Handler {
	allowed := map[string]bool{
		frontendURL:            true,
		"http://localhost:5173": true,
		"http://localhost:3000": true,
		"http://127.0.0.1:5173": true,
	}

	return cors.Handler(cors.Options{
		AllowOriginFunc: func(_ *http.Request, origin string) bool {
			if allowed[origin] {
				return true
			}
			return isPrivateHTTPOrigin(origin)
		},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	})
}

func isPrivateHTTPOrigin(origin string) bool {
	u, err := url.Parse(origin)
	if err != nil {
		return false
	}
	if u.Scheme != "http" && u.Scheme != "https" {
		return false
	}
	host := u.Hostname()
	if host == "localhost" {
		return true
	}
	ip := net.ParseIP(host)
	if ip == nil {
		return false
	}
	return ip.IsLoopback() || ip.IsPrivate()
}
