// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

package sysexits

const (
	OK       = 0
	Config   = 78
	Software = 70
	Usage    = 64
)

type SysExitError struct {
	Code    int
	Message string
}

func (e SysExitError) Error() string { return e.Message }
