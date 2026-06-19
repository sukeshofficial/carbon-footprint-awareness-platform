# API Documentation — ACo2 Carbon Coach

All API endpoints are prefixed with `/api/v1`.

## Authentication
### POST `/auth/signup`
Creates a new user profile.
- **Body**: `{ email, password, username, name }`

### POST `/auth/login`
Authenticates user and returns JWT in a secure cookie.
- **Body**: `{ email, password }`

## Carbon Footprint
### POST `/carbon/calculate`
Calculates footprint based on on-boarding data.
- **Body**: `{ transport, home, diet, consumption }`

### GET `/carbon/latest`
Retrieves the most recent footprint estimation for the user.

## What-If Simulator
### GET `/what-if/templates`
Returns available lifestyle simulation templates.

### POST `/what-if/preview`
Simulates impact without saving.
- **Body**: `{ templateId, inputPayload }`

## Recommendations
### GET `/recommendations`
Fetches AI/Rule-based sustainability tips.

### PATCH `/recommendations/:id`
Updates feedback status (`active`, `completed`, `dismissed`).
