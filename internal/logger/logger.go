// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

package logger

import (
	"cmp"
	"context"
	"fmt"
	"io"
	"log/slog"
	"slices"
	"strings"
	"time"

	"sdavids.de/sdavids-project-template/internal/constants"
	"sdavids.de/sdavids-project-template/internal/sysexits"
)

type contextAwareHandler struct {
	slog.Handler
}

func (h contextAwareHandler) Handle(ctx context.Context, r slog.Record) error {
	if handler, ok := ctx.Value(constants.CtxKeyHandler).(string); ok {
		r.AddAttrs(slog.String("handler", handler))
	}
	return h.Handler.Handle(ctx, r) //nolint
}

type NewOptions struct {
	Version  string
	Hostname func() (string, error)
	Getenv   func(string) string
	Stdout   io.Writer
}

func New(opts NewOptions) (*slog.Logger, error) {
	logLevelS := cmp.Or(opts.Getenv("LOG_LEVEL"), constants.DefaultLogLevel)
	var level slog.Level
	err := level.UnmarshalText([]byte(logLevelS))
	if err != nil {
		return nil, &sysexits.SysExitError{
			Code:    sysexits.Config,
			Message: fmt.Sprintf("invalid value %q for LOG_LEVEL", logLevelS),
		}
	}
	logLevel := &slog.LevelVar{} // TODO expose
	logLevel.Set(level)

	env := cmp.Or(opts.Getenv("SERVICE_ENV"), constants.DefaultEnvironment)
	envL := strings.ToLower(env)
	if !slices.Contains(constants.AvailableEnvironments(), envL) {
		return nil, &sysexits.SysExitError{
			Code:    sysexits.Usage,
			Message: fmt.Sprintf("invalid value %q for SERVICE_ENV: must be one of %v", env, strings.Join(constants.AvailableEnvironments(), ",")),
		}
	}
	env = envL

	name := cmp.Or(opts.Getenv("SERVICE_NAME"), constants.DefaultServiceName)

	node := opts.Getenv("SERVICE_NODE")
	if node == "" {
		var err error
		node, err = opts.Hostname()
		if err != nil {
			return nil, &sysexits.SysExitError{
				Code:    sysexits.Config,
				Message: "cannot determine host name",
			}
		}
	}

	replaceAttr := func(_ []string, a slog.Attr) slog.Attr {
		if a.Key == "time" {
			a.Value = slog.AnyValue(time.Now().UTC())
		}
		return a
	}

	handlerOpts := &slog.HandlerOptions{
		Level:       logLevel,
		ReplaceAttr: replaceAttr,
	}

	defaultAttrs := []slog.Attr{
		slog.Group("service",
			slog.String("name", name),
			slog.String("node", node),
			slog.String("env", env),
			slog.String("version", opts.Version),
		),
	}

	var handler slog.Handler = slog.NewJSONHandler(opts.Stdout, handlerOpts)
	if env == "development" {
		handlerOpts.AddSource = true
		handler = slog.NewTextHandler(opts.Stdout, handlerOpts)
	}
	handler = &contextAwareHandler{handler.WithAttrs(defaultAttrs)}

	return slog.New(handler), nil
}
