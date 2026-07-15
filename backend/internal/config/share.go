package config

import (
	"fmt"
	"net"
	"net/url"
	"strings"
)

// ShareOrigin returns a LAN-reachable frontend origin for QR / phone sharing.
// Prefers FRONTEND_URL when it is already a non-localhost host; otherwise detects a private LAN IP.
func (c Config) ShareOrigin() string {
	if origin := nonLocalOrigin(c.FrontendURL); origin != "" {
		return origin
	}
	port := "5173"
	if u, err := url.Parse(c.FrontendURL); err == nil && u.Port() != "" {
		port = u.Port()
	}
	if lan := firstPrivateIPv4(); lan != "" {
		return fmt.Sprintf("http://%s:%s", lan, port)
	}
	return strings.TrimRight(c.FrontendURL, "/")
}

func nonLocalOrigin(raw string) string {
	u, err := url.Parse(strings.TrimSpace(raw))
	if err != nil || u.Scheme == "" || u.Host == "" {
		return ""
	}
	host := u.Hostname()
	if host == "" || host == "localhost" || host == "127.0.0.1" || host == "::1" {
		return ""
	}
	return strings.TrimRight(u.String(), "/")
}

func firstPrivateIPv4() string {
	ifaces, err := net.Interfaces()
	if err != nil {
		return ""
	}
	var fallback string
	for _, iface := range ifaces {
		if iface.Flags&net.FlagUp == 0 || iface.Flags&net.FlagLoopback != 0 {
			continue
		}
		name := strings.ToLower(iface.Name)
		addrs, err := iface.Addrs()
		if err != nil {
			continue
		}
		for _, addr := range addrs {
			ipNet, ok := addr.(*net.IPNet)
			if !ok || ipNet.IP == nil {
				continue
			}
			ip := ipNet.IP.To4()
			if ip == nil || !ip.IsPrivate() {
				continue
			}
			s := ip.String()
			// Prefer typical Wi‑Fi / Ethernet adapter names.
			if strings.Contains(name, "wi-fi") ||
				strings.Contains(name, "wifi") ||
				strings.Contains(name, "wlan") ||
				strings.Contains(name, "ethernet") ||
				strings.Contains(name, "en0") ||
				strings.Contains(name, "en1") {
				return s
			}
			if fallback == "" {
				fallback = s
			}
		}
	}
	return fallback
}
