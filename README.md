# BusMate-OnlineTicketingSystem

BusMate is a modern intercity bus ticketing system designed to make travel booking faster, safer, and more convenient.
It enables commuters to search routes, select seats in real time, pay securely, and receive QR-coded e-tickets for smooth, contactless boarding.
The system also provides an admin dashboard for operators to manage routes, schedules, buses, and view analytics.

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

| Layer                   | Technology                                                     |
| ----------------------- | -------------------------------------------------------------- |
| **Frontend (Web)**      | React.js *(planned)*, Material UI (MUI), HTML, CSS, JavaScript |
| **Backend (Web)**       | Spring Boot (Java), Spring Security, Spring Data JPA           |
| **Mobile App**          | Kotlin (Android) *(for commuter app prototype)*                |
| **Database**            | MySQL (via MySQL Workbench)                                    |
| **Authentication**      | Google OAuth 2.0 (`spring-boot-starter-oauth2-client`)         |
| **Payment Integration** | QRph                         |
| **Design & Prototype**  | [Figma](https://www.figma.com/design/KuaOmc1hwzMqk76t4VsAvc/BusMate-OnlineTicketingSystem-IT342-G01-Group6?node-id=0-1&p=f&t=Ec10NE3HR3etOZOT-0) |
| **Build Tool**          | Maven                                                          |
| **Version Control**     | Git & GitHub                                                   |
| **Java Version**        | JDK 21                                                         |

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
- MySQL Workbench (for database setup)
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

---

### Add Environment Variables

Add these to your Run Configuration (IntelliJ): Replace the value with your actual client id and client secret

```bash
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
```

## Running the Application

### 1. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

### 2. Open your browser and go to:
```bash
http://localhost:8080/
```

### Database:
```bash
(Optional) Run MySQL Workbench and ensure your DB connection is active.
spring.datasource.url=jdbc:mysql://localhost:3306/busmate_db
spring.datasource.username=<your_username>
spring.datasource.password=<your_password>
spring.jpa.hibernate.ddl-auto=update
```

### Development Notes:
```bash
The frontend (React.js) implementation is still in progress. Planned stack includes:
Material UI for components
Axios for API calls
React Router for navigation
The mobile app (Kotlin) will focus on commuter-side booking and QR scanning.
Future updates will include:
QRPh / GoTyme payment integration
Role-based access (Super Admin, Admin, User)
Super Admin transfer and audit logs
```

## Team Members
**Joshua Noel D. Lo - Mobile Developer - joshuanoel.lo@cit.edu**

**John Joseph A. Laborada - Backend Developer - johnjoseph.laborada@cit.edu**

**Nathan Xander Lada - Mobile Developer - nathanxander.lada@cit.edu**

**Jose Raphael R. Lawas - Web Developer - joseraphael.lawas@cit.edu**
