// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

package constants

import "time"

type key int

const (
	CtxKeyHandler key = iota
)

const (
	DefaultLogLevel = "INFO"

	DefaultServiceName     = "sdavids-project-template"
	DefaultEnvironment     = "development"
	DefaultShutdownTimeout = 60 * time.Second

	DefaultHost = "localhost"
	DefaultPort = 3000

	// https://blog.cloudflare.com/the-complete-guide-to-golang-net-http-timeouts/
	DefaultReadTimeout    = 5 * time.Second
	DefaultWriteTimeout   = 10 * time.Second
	DefaultHandlerTimeout = 9 * time.Second
	DefaultIdleTimeout    = 30 * time.Second
)

func AvailableEnvironments() []string {
	return []string{DefaultEnvironment, "production"}
}
