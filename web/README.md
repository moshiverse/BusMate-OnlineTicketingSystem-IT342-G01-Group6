# BusMate-OnlineTicketingSystem

BusMate is a modern intercity bus ticketing system designed to make travel booking faster, safer, and more convenient.

It enables commuters to search routes, select seats in real time, pay securely, and receive QR-coded e-tickets for smooth, contactless boarding.

The system also provides an admin dashboard for operators to manage routes, schedules, buses, and view analytics.

---

## Features

- Google OAuth 2.0 login for quick and secure access
- Real-time seat selection and automatic seat assignment *(planned for next sprint)*
- Online payments via **GoTyme** (QRPh-compliant)
- E-ticket generation with QR codes for contactless boarding
- Email and SMS booking notifications
- Booking management (Upcoming, Past, Cancelled)
- Admin dashboard for route, schedule, and bus management
- Sales reports and occupancy analytics

---

## Technology Stack

| Layer                   | Technology                                                     |
| ----------------------- | -------------------------------------------------------------- |
| **Frontend (Web)**      | React.js *(planned upgrade to Material UI)*, HTML, CSS, Vite   |
| **Backend (Web)**       | Spring Boot (Java), Spring Security, Spring Data JPA           |
| **Mobile App**          | Kotlin (Android) *(commuter app prototype)*                    |
| **Database**            | H2 (dev) via H2 Console (MySQL via Workbench in production)    |
| **Authentication**      | Google OAuth 2.0 (`spring-boot-starter-oauth2-client`)         |
| **Payment Integration** | GoTyme (QRPh)                                                  |
| **Design & Prototype**  | Figma                                                          |
| **Build Tool**          | Maven                                                          |
| **Version Control**     | Git & GitHub                                                   |
| **Java Version**        | JDK 21                                                         |

---

## Getting Started

### 🔽 Clone the Repository

```bash
git clone https://github.com/moshiverse/BusMate-OnlineTicketingSystem-IT342-G01-Group6.git
cd BusMate-OnlineTicketingSystem-IT342-G01-Group6
```

---

### Prerequisites

- JDK 21 installed
- Maven installed
- Node.js 20+ (for the React client)
- MySQL 8.x running locally (create a schema named `busmate_db`)
- IntelliJ IDEA or any IDE with environment variable support
- Google OAuth2 client credentials (Client ID & Secret)

---

### Setup

#### Create Google Cloud OAuth2 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Log in with your Google account (use your school Gmail if required).
3. At the top, click **“Select a project” → “New Project”**
   - Project name: `oauth2-login`
   - Leave organization blank (if not required).
   - Click **Create**, then **Select Project**.
4. In the left sidebar, go to **APIs & Services → OAuth consent screen**
   - Choose **External**
   - Fill in:
     - App name: `CIT OAuth2 Login`
     - User support email: your Gmail
     - Developer contact email: your Gmail
   - Click **Save and Continue** (you can skip Scopes).
5. Go to **Credentials → Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: `Spring OAuth2 Localhost`
   - Authorized redirect URIs:
     ```
     http://localhost:8080/login/oauth2/code/google
     ```
6. Click **Create** → copy your **Client ID** and **Client Secret**.

#### Add Environment Variables

Add these to your Run Configuration (IntelliJ) or shell environment:

```bash
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
```

---

## Running the Application

### Backend (Spring Boot + MySQL)

```bash
cd backend
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`.

> **Database bootstrap**
>
> ```sql
> CREATE DATABASE busmate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> ```
>
> Default credentials (edit `backend/src/main/resources/application.properties` if needed):
> ```
> spring.datasource.url=jdbc:mysql://localhost:3306/busmate_db?useSSL=false&serverTimezone=UTC
> spring.datasource.username=root
> spring.datasource.password=#Admin_12345
> ```

### Frontend (React + Vite)

In a separate terminal:

```bash
npm install
npm run dev
```

Set `VITE_API_URL=http://localhost:8080/api` in a `.env` file if you need to point the client at a different backend host.

---

## Development Notes

- Material UI adoption, seat-selection canvas, and role-based dashboards are planned improvements.
- Payment processing is scoped to **GoTyme** QRPh rails for this milestone.
- Role-based access (Super Admin, Admin, User), GoTyme webhook handling, and audit logs are on the upcoming roadmap.
- Mobile commuter app prototype (Kotlin) will reuse the same REST API once the authentication layer is finalized.

---

## Scripts & Testing

| Command                        | Description                           |
| ------------------------------ | ------------------------------------- |
| `cd backend && mvn test`       | Run Spring Boot unit/integration tests (H2 profile)|
| `cd backend && mvn spring-boot:run` | Start backend API                |
| `npm run dev`                  | Start Vite dev server                 |
| `npm run build`                | Production build for React frontend   |

---

Happy hacking! 🙌

