// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"io"
	"log/slog"
	"os"
	"runtime/debug"

	"github.com/sdavids/sdavids-project-template/internal/config"
	"github.com/sdavids/sdavids-project-template/internal/logger"
	"github.com/sdavids/sdavids-project-template/internal/server"
	"github.com/sdavids/sdavids-project-template/internal/sysexits"
)

// go build -ldflags "-X main.Version=$VERSION"
var Version = "(devel)" //nolint

func init() { //nolint
	if info, ok := debug.ReadBuildInfo(); ok && Version == "(devel)" {
		mod := &info.Main
		if mod.Replace != nil {
			mod = mod.Replace
		}
		if mod.Version != "" {
			Version = mod.Version
		}
	}
}

func main() {
	ctx := context.Background()

	log, err := logger.New(
		logger.NewOptions{
			Version:  Version,
			Hostname: os.Hostname,
			Getenv:   os.Getenv,
			Stdout:   os.Stdout,
		})
	if err != nil {
		var e *sysexits.SysExitError
		if errors.As(err, &e) {
			_, _ = fmt.Fprintln(os.Stderr, err)
			os.Exit(e.Code)
		}
	}
	slog.SetDefault(log)

	code, err := run(ctx, runOptions{
		version:   Version,
		logger:    log,
		newConfig: config.New,
		runServer: server.Run,
		args:      os.Args[1:],
		getenv:    os.Getenv,
		unsetenv:  os.Unsetenv,
		stdout:    os.Stdout,
	})
	if code == sysexits.Config || code == sysexits.Usage {
		_, _ = fmt.Fprintln(os.Stderr, err)
	} else if err != nil {
		log.ErrorContext(ctx, "", slog.Any("error", err))
	}
	os.Exit(code)
}

type runOptions struct {
	version   string
	logger    *slog.Logger
	newConfig func(getenv func(string) string, unsetenv func(string) error) (config.Config, error)
	runServer func(context.Context, *slog.Logger, config.Config) (int, error)
	args      []string
	getenv    func(string) string
	unsetenv  func(string) error
	stdout    io.Writer
}

func run(ctx context.Context, opts runOptions) (int, error) {
	fs := flag.NewFlagSet("", flag.ExitOnError)
	var versionFlag = fs.Bool("version", false, "show version and exit")
	if err := fs.Parse(opts.args); err != nil {
		return sysexits.Usage, fmt.Errorf("%v", err)
	}

	if *versionFlag {
		_, _ = fmt.Fprintln(opts.stdout, opts.version)
		return sysexits.OK, nil
	}

	cfg, err := opts.newConfig(opts.getenv, opts.unsetenv)
	if err != nil {
		var e *sysexits.SysExitError
		if errors.As(err, &e) {
			return e.Code, fmt.Errorf("%v", err)
		}
	}

	code, err := opts.runServer(ctx, opts.logger, cfg)
	if err != nil {
		return code, fmt.Errorf("%v", err)
	}

	return sysexits.OK, nil
}
