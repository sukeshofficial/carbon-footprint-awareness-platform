# Security Architecture & AI Resilience

This document outlines the security controls and architectural patterns that protect the Carbon Coach AI platform.

## 1. Zero-Trust Input Validation
Every input entering the system (Auth, Carbon Data, Onboarding) is validated via **Shared Zod Schemas**.
- **Location**: `shared/schemas/`
- **Constraint**: `min(0)` on all numeric footprint data to prevent spoofing.

## 2. AI Resiliency (Deterministic Fallback)
To ensure system stability if the AI service (Gemini/OpenAI) is unavailable, we implement a **Rule-Based Fallback Engine**.
- **Engine**: `server/src/domain/rules/fallbackEngine.js`
- **Mechanism**: If AI fails or times out, the system injects deterministic sustainability insights based on user categories.

## 3. Rate Limiting & Protection
- **API Protection**: `express-rate-limit` is applied globally.
- **AI Route Hardening**: Expensive AI routes are limited to 10 requests/minute to prevent cost spikes and DDoS.
- **Headers**: `helmet` is configured with strict security policies.

## 4. Auth & Data Privacy
- **JWT**: Stateless authentication with HTTP-only cookies.
- **Sanitization**: Automatic removal of private fields (passwords, internals) via Mongoose `toJSON` transforms.
