// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

package server

import (
	"log/slog"
	"net/http"
)

func addRoutes(l *slog.Logger, m *http.ServeMux) {
	m.Handle("GET /", handleIndex(l))
}

func handleIndex(l *slog.Logger) http.Handler {
	return http.HandlerFunc(
		func(w http.ResponseWriter, _ *http.Request) {
			_, err := w.Write([]byte("<!doctype html><title>Test</title><h1>Test</h1>"))
			if err != nil {
				l.Error("handle response", slog.Any("error", err))
			}
		},
	)
}
