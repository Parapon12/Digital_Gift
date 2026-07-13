package payment

import (
	"fmt"
	"regexp"
	"strings"
)

// GeneratePromptPayPayload creates an EMV QR payload for Thai PromptPay.
// idType: "phone" or "national_id"
func GeneratePromptPayPayload(id string, idType string, amount float64) (string, error) {
	id = strings.TrimSpace(id)
	if id == "" {
		return "", fmt.Errorf("promptpay id is required")
	}

	var merchantValue string
	switch idType {
	case "national_id":
		re := regexp.MustCompile(`\D`)
		merchantValue = re.ReplaceAllString(id, "")
		if len(merchantValue) != 13 {
			return "", fmt.Errorf("national id must be 13 digits")
		}
		merchantValue = tlv("00", "A000000677010111") + tlv("02", merchantValue)
	default:
		re := regexp.MustCompile(`\D`)
		digits := re.ReplaceAllString(id, "")
		if strings.HasPrefix(digits, "0") {
			digits = "66" + digits[1:]
		} else if !strings.HasPrefix(digits, "66") {
			digits = "66" + digits
		}
		if len(digits) < 11 || len(digits) > 13 {
			return "", fmt.Errorf("invalid phone number")
		}
		merchantValue = tlv("00", "A000000677010111") + tlv("01", digits)
	}

	payload := tlv("00", "01")
	payload += tlv("01", "12") // dynamic QR with amount
	payload += tlv("29", merchantValue)
	payload += tlv("53", "764") // THB
	payload += tlv("54", fmt.Sprintf("%.2f", amount))
	payload += tlv("58", "TH")

	crcInput := payload + "6304"
	payload += tlv("63", crc16(crcInput))

	return payload, nil
}

func tlv(id, value string) string {
	return id + fmt.Sprintf("%02d", len(value)) + value
}

func crc16(data string) string {
	crc := uint16(0xFFFF)
	for i := 0; i < len(data); i++ {
		crc ^= uint16(data[i]) << 8
		for j := 0; j < 8; j++ {
			if crc&0x8000 != 0 {
				crc = (crc << 1) ^ 0x1021
			} else {
				crc <<= 1
			}
		}
	}
	return fmt.Sprintf("%04X", crc)
}
