# Logging Middleware Engine

This directory contains the decoupled telemetry tracking utility for the application. It acts as an interceptor to stream events directly to the centralized verification service.

## Integration Schema

The middleware accepts structured log objects mapped to the following standard taxonomy:

| Parameter | Type | Allowed Values |
| :--- | :--- | :--- |
| **level** | String | `info`, `warn`, `error` |
| **component** | String | `ui`, `api`, `state` |
| **message** | String | Custom log details |

## Environment Requirements

Ensure the following system environmental variable parameters are defined in your host configuration shell:
- `VITE_API_URL`: The destination evaluation target microservice endpoint path.
- `VITE_AUTH_TOKEN`: Valid Bearer JSON Web Token credential context.