// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

package constants

import "time"

const DefaultServiceName = "sdavids-project-template"

const DefaultEnvironment = "development"

func AvailableEnvironments() []string {
	return []string{DefaultEnvironment, "production"}
}

const DefaultLogLevel = "INFO"

type key int

const (
	CtxKeyHandler key = iota
)

const (
	DefaultHost            = "localhost"
	DefaultPort            = 3000
	DefaultShutdownTimeout = 60 * time.Second
)

// https://blog.cloudflare.com/the-complete-guide-to-golang-net-http-timeouts/
const (
	DefaultReadTimeout    = 5 * time.Second
	DefaultWriteTimeout   = 10 * time.Second
	DefaultHandlerTimeout = 9 * time.Second
	DefaultIdleTimeout    = 30 * time.Second
)
