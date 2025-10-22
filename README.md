# BusMate-OnlineTicketingSystem

BusMate is a web-based intercity bus ticketing system that provides a modern, convenient, and contactless travel booking experience. It allows commuters to search bus routes, select seats in real time, pay securely through GoTyme, GCash, or InstaPay, and receive QR-coded e-tickets for smooth boarding.
The system also includes an admin dashboard for bus operators to manage routes, buses, schedules, and view detailed performance analytics.

---

## Features

- Google OAuth 2.0 login for quick and secure access
- Real-time seat selection and automatic seat assignment
- Online payments via GoTyme, GCash, and InstaPay
- E-ticket generation with QR codes for contactless boarding
- Email and SMS booking notifications
- Booking management (Upcoming, Past, Cancelled)
- Admin dashboard for route, schedule, and bus management
- Sales reports and occupancy analytics

---

## Technology Stack

- **Frontend:** React.js (Web), HTML, CSS, JavaScript
- **Backend:** Spring Boot (Java), Spring Security, Spring Data JPA
- **Mobile:** Kotlin (Android)
- **Database:** H2 (dev), MySQL/PostgreSQL compatible
- **Authentication:** Google OAuth 2.0 (`spring-boot-starter-oauth2-client`)
- **Payment Integration:** GoTyme AP
- **Java Version:** JDK 21
- **Version Control:** Git & GitHub
- **Design & Prototype:** Figma
- **Build Tool:** Maven

---

## Getting Started

### 🔽 Clone the Repository

```bash
git clone https://github.com/moshiverse/BusMate-OnlineTicketingSystem-IT342-G01-Group6.git
cd backend
```

### Prerequisites

- JDK 21 installed
- Maven installed
- IntelliJ IDEA or any IDE with environment variable support
- Google OAuth2 client credentials (Client ID & Secret)
- GitHub OAuth2 client credentials (Client ID & Secret)

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

---

#### Create GitHub OAuth2 Credentials

1. Go to [GitHub Developer Settings → OAuth Apps](https://github.com/settings/developers).
2. Click **New OAuth App**.
3. Fill in the details:
    - **Application name:** `Spring OAuth2 Integration`
    - **Homepage URL:** `http://localhost:8080`
    - **Authorization callback URL:**
      ```
      http://localhost:8080/login/oauth2/code/github
      ```
4. Click **Register Application** → copy your **Client ID** and **Client Secret**.

---

### Add Environment Variables

Add these to your Run Configuration (IntelliJ): Replace the value with your actual client id and client secret

```bash
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GITHUB_CLIENT_ID=<your_github_client_id>
GITHUB_CLIENT_SECRET=<your_github_client_secret>
```

## Running the Application

### 1. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

### 2. Open your browser and go to:
```bash
TBA
```

### H2 Settings:
```bash
spring.h2.console.path=/h2-console
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
```

## Team Members
**Joshua Noel D. Lo - Mobile Developer - joshuanoel.lo@cit.edu**

**John Joseph A. Laborada - Web Developer - johnjoseph.laborada@cit.edu**

**Nathan Xander Lada - Mobile Developer - nathanxander.lada@cit.edu**

**Jose Raphael R. Lawas - Mobile Developer - joseraphael.lawas@cit.edu**
