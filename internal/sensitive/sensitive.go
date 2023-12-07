// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

package sensitive

import (
	"fmt"
	"log/slog"
)

const secretMarker = "[REDACTED]"

type String string

func (s String) String() string {
	return string(s)
}

func (s String) Format(f fmt.State, _ rune) {
	_, _ = f.Write([]byte(secretMarker))
}

func (s String) MarshalText() ([]byte, error) {
	return []byte(secretMarker), nil
}

func (s String) LogValue() slog.Value {
	return slog.StringValue(secretMarker)
}
