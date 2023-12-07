// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

package server

import (
	"context"
	"crypto/tls"
	"errors"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"

	"github.com/sdavids/sdavids-project-template/internal/config"
	"github.com/sdavids/sdavids-project-template/internal/constants"
	"github.com/sdavids/sdavids-project-template/internal/logger"
	"github.com/sdavids/sdavids-project-template/internal/sysexits"
)

func Run(ctx context.Context, l *slog.Logger, c config.Config) (int, error) {
	ctx, cancel := context.WithCancel(ctx)

	var httpServer *http.Server
	var httpsServer *http.Server

	errorLog := slog.NewLogLogger(l.Handler(), slog.LevelError)

	if c.HTTP.Port != 0 {
		httpContext := context.WithValue(ctx, constants.CtxKeyHandler, "http")
		httpHandler := newServer(httpContext, l, c.HTTP)
		httpServer = &http.Server{
			ErrorLog:     errorLog,
			Addr:         c.HTTP.Addr(),
			ReadTimeout:  c.HTTP.ReadTimeout,
			WriteTimeout: c.HTTP.WriteTimeout,
			IdleTimeout:  c.HTTP.IdleTimeout,
			Handler:      httpHandler,
			BaseContext:  func(_ net.Listener) context.Context { return httpContext },
		}
	}

	if c.HTTPS.Port != 0 {
		httpsContext := context.WithValue(ctx, constants.CtxKeyHandler, "https")
		httpsHandler := newServer(httpsContext, l, c.HTTPS.ServerConfigHTTP)
		httpsServer = &http.Server{
			ErrorLog:     errorLog,
			Addr:         c.HTTPS.Addr(),
			ReadTimeout:  c.HTTPS.ReadTimeout,
			WriteTimeout: c.HTTPS.WriteTimeout,
			IdleTimeout:  c.HTTPS.IdleTimeout,
			Handler:      httpsHandler,
			BaseContext:  func(_ net.Listener) context.Context { return httpsContext },
			TLSConfig: &tls.Config{
				MinVersion: tls.VersionTLS13,
			},
		}
	}

	signalChan := make(chan os.Signal, 1)

	signal.Notify(signalChan, os.Interrupt, syscall.SIGHUP, syscall.SIGQUIT)

	if httpServer != nil {
		go listenHTTP(ctx, l, httpServer, c.HTTP, signalChan)
	}
	if httpsServer != nil {
		go listenHTTPS(ctx, l, httpsServer, c.HTTPS, signalChan)
	}

	sig := <-signalChan

	l.InfoContext(ctx, "shutting down...")

	go osKill(ctx, l, signalChan)

	gracefulCtx, cancelShutdown := context.WithTimeout(context.Background(), c.Service.ShutdownTimeout)
	defer cancelShutdown()

	var servers []*http.Server
	if httpServer != nil {
		servers = append(servers, httpServer)
	}
	if httpsServer != nil {
		servers = append(servers, httpsServer)
	}

	var wg sync.WaitGroup
	wg.Add(len(servers))
	for _, s := range servers {
		go shutdownServer(gracefulCtx, l, s, &wg) //nolint
	}
	wg.Wait()

	if sig == syscall.SIGUSR1 {
		cancel()
		return sysexits.Software, nil
	}

	l.InfoContext(ctx, "shutdown")

	cancel()

	return sysexits.OK, nil
}

func osKill(ctx context.Context, l *slog.Logger, c chan os.Signal) {
	<-c
	l.ErrorContext(ctx, "terminating...")
}

func listenHTTP(ctx context.Context, l *slog.Logger, s *http.Server, c config.ServerConfigHTTP, sc chan os.Signal) {
	l.InfoContext(ctx, fmt.Sprintf("Listen local: http://%v", c.Addr()))
	if err := s.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		l.ErrorContext(ctx, "", slog.Any("error", err))
		sc <- syscall.SIGUSR1
	}
}

func listenHTTPS(ctx context.Context, l *slog.Logger, s *http.Server, c config.ServerConfigHTTPS, sc chan os.Signal) {
	certPath := c.CertPath
	keyPath := c.KeyPath
	l.InfoContext(ctx, fmt.Sprintf("Listen local: https://%v", c.Addr()))
	if err := s.ListenAndServeTLS(certPath.String(), keyPath.String()); err != nil && !errors.Is(err, http.ErrServerClosed) {
		l.ErrorContext(ctx, "", slog.Any("error", err))
		sc <- syscall.SIGUSR1
	}
}

func shutdownServer(ctx context.Context, l *slog.Logger, s *http.Server, wg *sync.WaitGroup) {
	defer wg.Done()
	l.InfoContext(ctx, "shutting down", slog.Any("addr", s.Addr))
	if err := s.Shutdown(ctx); err != nil && !errors.Is(err, http.ErrServerClosed) {
		l.ErrorContext(ctx, "shutdown error", slog.Any("error", err))
	}
}

func newServer(ctx context.Context, l *slog.Logger, c config.ServerConfigHTTP) http.Handler {
	mux := http.NewServeMux()
	addRoutes(l, mux)
	handler := addMiddlewares(ctx, l, mux, c)
	return handler
}

func addMiddlewares(ctx context.Context, l *slog.Logger, m *http.ServeMux, c config.ServerConfigHTTP) http.Handler {
	var h http.Handler = m
	h = http.TimeoutHandler(h, c.HandlerTimeout, "")
	if c.LogRequests {
		h = logger.LogRequestHandler(ctx, l, h)
	}
	return h
}
