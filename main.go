// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

package main

import (
	"flag"
	"fmt"
	"io"
	"log/slog"
	"os"
	"runtime/debug"
)

const (
	ExitOK    = 0
	ExitUsage = 64
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
	code, err := run(os.Args[1:], os.Stdout)
	if code == ExitUsage {
		_, _ = fmt.Fprintln(os.Stderr, err)
	} else if err != nil {
		slog.Error("", slog.Any("error", err))
	}
	os.Exit(code)
}

func run(args []string, stdout io.Writer) (int, error) {
	fs := flag.NewFlagSet("", flag.ExitOnError)
	var versionFlag = fs.Bool("version", false, "show version and exit")
	if err := fs.Parse(args); err != nil {
		return ExitUsage, fmt.Errorf("%v", err)
	}

	if *versionFlag {
		_, _ = fmt.Fprintln(stdout, Version)
		return ExitOK, nil
	}

	slog.Info("sdavids-project-template")

	return ExitOK, nil
}
