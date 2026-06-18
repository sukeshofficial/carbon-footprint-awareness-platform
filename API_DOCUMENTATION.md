# ACo2 - Backend API Documentation

This document provides a comprehensive overview of the REST API endpoints available in the ACo2 Carbon Footprint Awareness Platform.

---

## Base URL
`http://localhost:5000/api/v1`

---

## Authentication Layer
Most endpoints require a valid JWT Access Token passed in the `Authorization` header.

**Format:** `Authorization: Bearer <access_token>`

---

## 1. Authentication (`/auth`)
Handles user identity, session management, and OAuth.

| Endpoint | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `/signup` | POST | No | Create a new user account. |
| `/login` | POST | No | Authenticate user and receive access token. |
| `/verify-email/:token` | GET | No | Verify user email using a token. |
| `/refresh` | POST | No | Refresh access token using HTTP-only cookie. |
| `/logout` | POST | No | Clear current user session. |
| `/logout-all` | POST | Yes | Log out from all devices/sessions. |
| `/me` | GET | Yes | Retrieve current user profile. |
| `/me` | PATCH | Yes | Update current user profile details. |
| `/forgot-password` | POST | No | Request a password reset link. |
| `/reset-password/:token` | POST | No | Set a new password using a token. |
| `/google` | GET | No | Initiate Google OAuth flow. |
| `/google/callback` | GET | No | Google OAuth callback handler. |

---

## 2. User Profile (`/profile`)
Manages sustainability-specific profile data.

| Endpoint | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `/me` | POST | Yes | Initialize a new sustainability profile. |
| `/me` | GET | Yes | Retrieve current sustainability profile. |
| `/me` | PUT | Yes | Replace full profile data. |
| `/me/preferences` | PATCH | Yes | Partially update profile preferences. |

---

## 3. Onboarding & Transitions (`/onboarding`)
Guided data collection flow.

| Endpoint | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `/questions` | GET | Yes | Fetch all onboarding question steps. |
| `/responses/me` | GET | Yes | Get the user's current onboarding progress. |
| `/responses/step/:stepKey` | PATCH | Yes | Update response for a specific step. |
| `/responses/step/:stepKey/skip`| PATCH | Yes | Skip a specific onboarding step. |
| `/complete` | POST | Yes | Finalize onboarding and trigger initial baseline. |

---

## 4. Carbon Estimation (`/carbon-estimation`)
Core estimation engine and results.

| Endpoint | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `/me` | GET | Yes | Get the latest carbon estimation baseline. |
| `/me/insights` | GET | Yes | Get cached AI coaching insights. |
| `/me/insights/stream`| GET | Yes | Stream real-time AI coaching insights (SSE). |
| `/recalculate` | POST | Yes | Force a fresh recalculation of the baseline. |
| `/history` | GET | Yes | Retrieve historical estimation data points. |

---

## 5. Carbon Explanations (`/explanations`)
Interprets drivers and category impacts.

| Endpoint | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `/me` | GET | Yes | Get plain-language explanations for category impacts. |

---

## 6. What-If Scenarios (`/what-if`)
Interactive lifestyle simulation tool.

| Endpoint | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `/scenarios` | GET | Yes | List all available "What-If" templates. |
| `/scenarios` | POST | Yes | Save a personalized scenario to user profile. |
| `/scenarios/preview` | POST | Yes | Calculate impact for a scenario without saving. |
| `/scenarios/me` | GET | Yes | List all saved user scenarios. |
| `/scenarios/:id` | GET | Yes | Retrieve details of a specific saved scenario. |

---

## 7. Feedback & Support (`/feedback`)
General platform feedback.

| Endpoint | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `/` | POST | No | Submit general user feedback or bug reports. |

---

## 9. Recommendations (`/recommendations`)
Personalized reduction strategies.

| Endpoint | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `/` | GET | Yes | Fetch prioritized recommendations. |
| `/refresh` | POST | Yes | Force a refresh of the recommendation list. |
| `/:id/status` | PATCH | Yes | Update recommendation status (`active`, `completed`, `dismissed`). |
| `/history` | GET | Yes | View history of recommendation feedback. |

---

## 8. Health & Infrastructure (`/health`)
System monitoring.

| Endpoint | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `/` | GET | No | check server and database connectivity status. |

---

## Error Responses
Standardized error format across all endpoints.

**Validation Errors:**
The API uses **Zod** for strict schema validation. If validation fails, the server returns a `400 Bad Request` with details in the `error` field.

```json
{
  "status": "error",
  "message": "Validation failed",
  "error": { ... } 
}
```
