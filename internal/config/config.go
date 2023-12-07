// SPDX-FileCopyrightText: © 2025 Sebastian Davids <sdavids@gmx.de>
// SPDX-License-Identifier: Apache-2.0

package config

import (
	"cmp"
	"errors"
	"fmt"
	"net"
	"os"
	"slices"
	"strconv"
	"strings"
	"time"

	"github.com/sdavids/sdavids-project-template/internal/constants"
	"github.com/sdavids/sdavids-project-template/internal/sensitive"
	"github.com/sdavids/sdavids-project-template/internal/sysexits"
)

type Config struct {
	Service ServiceConfig     `json:"service"`
	HTTP    ServerConfigHTTP  `json:"http"`
	HTTPS   ServerConfigHTTPS `json:"https"`
}

type ServiceConfig struct {
	Name            string        `json:"name"`
	Node            string        `json:"node"`
	Environment     string        `json:"environment"`
	ShutdownTimeout time.Duration `json:"shutdownTimeout"`
}

type ServerConfig struct {
	Host string `json:"host"`
	Port int    `json:"port"`
}

type ServerConfigHTTP struct {
	ServerConfig
	LogRequests    bool          `json:"logRequests"`
	ReadTimeout    time.Duration `json:"readTimeout"`
	WriteTimeout   time.Duration `json:"writeTimeout"`
	HandlerTimeout time.Duration `json:"handlerTimeout"`
	IdleTimeout    time.Duration `json:"idleTimeout"`
}

type ServerConfigHTTPS struct {
	ServerConfigHTTP
	CertPath sensitive.String `json:"certPath"`
	KeyPath  sensitive.String `json:"keyPath"`
}

func (c ServerConfig) Addr() string { return net.JoinHostPort(c.Host, strconv.Itoa(c.Port)) }

func New(getenv func(string) string, unsetenv func(string) error) (Config, error) {
	env := cmp.Or(getenv("SERVICE_ENV"), constants.DefaultEnvironment)
	envL := strings.ToLower(env)
	if !slices.Contains(constants.AvailableEnvironments(), envL) {
		return Config{}, &sysexits.SysExitError{
			Code:    sysexits.Usage,
			Message: fmt.Sprintf("invalid value %q for SERVICE_ENV: must be one of %v", env, strings.Join(constants.AvailableEnvironments(), ",")),
		}
	}
	env = envL

	name := cmp.Or(getenv("SERVICE_NAME"), constants.DefaultServiceName)

	node := getenv("SERVICE_NODE")
	if node == "" {
		var err error
		node, err = os.Hostname()
		if err != nil {
			return Config{}, &sysexits.SysExitError{
				Code:    sysexits.Config,
				Message: "cannot determine host name",
			}
		}
	}

	logRequests := false
	logRequestsS := getenv("LOG_REQUESTS")
	if logRequestsS != "" {
		var err error
		logRequests, err = strconv.ParseBool(logRequestsS)
		if err != nil {
			return Config{}, &sysexits.SysExitError{
				Code:    sysexits.Usage,
				Message: fmt.Sprintf("invalid value %q for LOG_REQUESTS", logRequestsS),
			}
		}
	}

	host := cmp.Or(getenv("HOST"), constants.DefaultHost)

	var httpPort int
	httpPortS := getenv("HTTP_PORT")
	if httpPortS != "" {
		var err error
		httpPort, err = strconv.Atoi(httpPortS)
		if err != nil {
			return Config{}, &sysexits.SysExitError{
				Code:    sysexits.Usage,
				Message: fmt.Sprintf("invalid value %q for HTTP_PORT: parse error", httpPortS),
			}
		}
		if !isValidPort(httpPort) {
			return Config{}, &sysexits.SysExitError{
				Code:    sysexits.Usage,
				Message: fmt.Sprintf("invalid value %d for HTTP_PORT: must be between 1 and 65535", httpPort),
			}
		}
	}

	var httpsPort int
	httpsPortS := getenv("HTTPS_PORT")
	if httpsPortS != "" {
		var err error
		httpsPort, err = strconv.Atoi(httpsPortS)
		if err != nil {
			return Config{}, &sysexits.SysExitError{
				Code:    sysexits.Usage,
				Message: fmt.Sprintf("invalid value %q for HTTPS_PORT: parse error", httpsPortS),
			}
		}
		if !isValidPort(httpsPort) {
			return Config{}, &sysexits.SysExitError{
				Code:    sysexits.Usage,
				Message: fmt.Sprintf("invalid value %d for HTTPS_PORT: must be between 1 and 65535", httpsPort),
			}
		}
	}

	certPath := getenv("CERT_PATH")
	_ = unsetenv("CERT_PATH")
	if certPath != "" {
		if _, err := os.Stat(certPath); err != nil {
			var pathErr *os.PathError
			if errors.As(err, &pathErr) {
				return Config{}, &sysexits.SysExitError{
					Code:    sysexits.Usage,
					Message: fmt.Sprintf("invalid value %q for CERT_PATH: %v", certPath, pathErr.Err),
				}
			}
		}
	}

	keyPath := getenv("KEY_PATH")
	_ = unsetenv("KEY_PATH")
	if keyPath != "" {
		if _, err := os.Stat(keyPath); err != nil {
			var pathErr *os.PathError
			if errors.As(err, &pathErr) {
				return Config{}, &sysexits.SysExitError{
					Code:    sysexits.Usage,
					Message: fmt.Sprintf("invalid value %q for KEY_PATH: %v", keyPath, pathErr.Err),
				}
			}
		}
	}

	if httpsPort == 0 || certPath == "" || keyPath == "" {
		httpsPort = 0
		certPath = ""
		keyPath = ""
	}

	if httpPort == 0 && httpsPort == 0 {
		httpPort = constants.DefaultPort
	}

	if httpPort == httpsPort {
		return Config{}, &sysexits.SysExitError{
			Code:    sysexits.Usage,
			Message: fmt.Sprintf("HTTP_PORT %d equal to HTTPS_PORT %d", httpPort, httpsPort),
		}
	}

	return Config{
		Service: ServiceConfig{
			Name:            name,
			Node:            node,
			Environment:     env,
			ShutdownTimeout: constants.DefaultShutdownTimeout,
		},
		HTTP: ServerConfigHTTP{
			ServerConfig: ServerConfig{
				Host: host,
				Port: httpPort,
			},
			LogRequests:    logRequests,
			ReadTimeout:    constants.DefaultReadTimeout,
			WriteTimeout:   constants.DefaultWriteTimeout,
			HandlerTimeout: constants.DefaultHandlerTimeout,
			IdleTimeout:    constants.DefaultIdleTimeout,
		},
		HTTPS: ServerConfigHTTPS{
			ServerConfigHTTP: ServerConfigHTTP{
				ServerConfig: ServerConfig{
					Host: host,
					Port: httpsPort,
				},
				LogRequests:    logRequests,
				ReadTimeout:    constants.DefaultReadTimeout,
				WriteTimeout:   constants.DefaultWriteTimeout,
				HandlerTimeout: constants.DefaultHandlerTimeout,
				IdleTimeout:    constants.DefaultIdleTimeout,
			},
			CertPath: sensitive.String(certPath),
			KeyPath:  sensitive.String(keyPath),
		},
	}, nil
}

func isValidPort(p int) bool {
	return p > 0 && p < 65536
}
