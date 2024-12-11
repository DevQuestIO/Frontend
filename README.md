# DevQuest.IO - Frontend Microservice

## Overview
This frontend microservice is part of the DevQuest - Coding Progress Tracker, providing a NextJs based user interface for tracking and visualizing coding activities and progress, with Keycloak SSO integration.

## Features
- Real-time coding activity tracking
- Interactive progress visualization
- Keycloak Single Sign-On (SSO) authentication
- Multi-language support
- Responsive design for desktop and mobile devices

## Tech Stack
- NextJs 15
- TypeScript
- Tailwind CSS
- Keycloak React
- Recharts for data visualization
- Axios for API communication

## Prerequisites
- Node.js (v18.0.0 or later)
- npm (v8.0.0 or later)
- Docker (optional, for containerized deployment)
- Keycloak Server (7.0.0 or later)

## Getting Started

### Installation
1. Clone the repository:
```bash
git clone git@github.com:DevQuestIO/Frontend.git
cd devquest-frontend
```

2. Install dependencies:
```bash
npm install
```

### Keycloak Configuration

#### Keycloak Setup
1. Create a new realm in Keycloak
2. Create a new client with the following settings:
   - Client Type: OpenID Connect
   - Client ID: devquest-frontend
   - Valid Redirect URIs: 
     - `http://localhost:3000/*`
     - `https://yourdomain.com/*`
   - Web Origins: `+`

#### Environment Configuration
Create a `.env` file in the project root with the following variables:
```
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3001/api

# Keycloak Configuration
REACT_APP_KEYCLOAK_URL=http://localhost:8080
REACT_APP_KEYCLOAK_REALM=your-realm
REACT_APP_KEYCLOAK_CLIENT_ID=devquest-frontend
```

### Running the Application

#### Development Mode
```bash
npm start
```
The application will run on `http://localhost:3000`

#### Production Build
```bash
npm run build
```

### Docker Deployment
1. Build the Docker image:
```bash
docker build -t frontend .
```

2. Run the container:
```bash
docker run -p 3000:3000 frontend
```

## Project Structure
```
.
├── Dockerfile
├── README.md
├── docker-compose.yml
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   └── vercel.svg
├── src/
│   ├── components/
│   │   └── loginButton.tsx
│   ├── db/
│   ├── lib/
│   │   └── api.ts
│   ├── pages/
│   ├── prisma/
│   ├── scripts/
│   ├── services/
│   ├── styles/
│   ├── types/
│   └── utils/
└── components.json
```

## Environment Variables
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for backend API
- `NEXT_PUBLIC_KEYCLOAK_URL`: Keycloak server URL
- `NEXT_PUBLIC_KEYCLOAK_REALM`: Keycloak realm name
- `NEXT_PUBLIC_KEYCLOAK_CLIENT_ID`: Keycloak client ID

## Authentication Flows
- **Login**: Redirects to Keycloak login page
- **Logout**: Provides Keycloak logout functionality
- **Token Management**: Automatic token refresh and validation

## Troubleshooting
- Ensure Keycloak server is running
- Verify environment variables
- Check network connectivity
- Validate realm and client configurations

## License
Distributed under the MIT License. See `LICENSE` for more information.