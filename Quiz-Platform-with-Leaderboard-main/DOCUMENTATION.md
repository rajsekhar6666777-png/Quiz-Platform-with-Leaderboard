# 📘 QuizMaster - Project Documentation & Technical Report

---
QuizMaster
Full-Stack Quiz Platform with Live Leaderboard

Project Documentation

Intern Name      : Gadamanipalli RajaSekhar
Intern ID        : CT-5115
Organization     : CODTECH IT Solutions
Domain           : Full Stack Web Development

Submitted By:
 RajaSekhar

## 📄 Executive Summary

**Project Name**: QuizMaster - Full-Stack Quiz Platform with Live Leaderboard  
**Domain**: Full-Stack Web Development  
**Purpose**: An interactive online assessment platform enabling users to test their technical skills across multiple domains, view instant attempt results, earn achievements, and track real-time global standings on an automated leaderboard.  
**Target Audience**: Students, developers, and tech learners preparing for technical interviews and skill assessments.

---

## 📑 Table of Contents
1. [Project Objectives](#-project-objectives)
2. [System Architecture](#-system-architecture)
3. [Database Design & ER Schema](#-database-design--er-schema)
4. [REST API Specifications](#-rest-api-specifications)
5. [Security & Authentication](#-security--authentication)
6. [Frontend UI/UX Design System](#-frontend-uiux-design-system)
7. [Installation & Deployment Guide](#-installation--deployment-guide)
8. [Testing & Verification](#-testing--verification)
9. [Conclusion](#-conclusion)

---

## 🎯 Project Objectives

1. **User Authentication & Authorization**: Provide secure JWT-based registration, login, session persistence, and Role-Based Access Control (RBAC) for Regular Users and Admins.
2. **Timed Quiz Engine**: Implement a timed assessment interface with automated countdown timers, progress indicators, and client-side question shuffling.
3. **Automated Scoring & Answer Review**: Calculate user scores securely on the server-side to prevent client-side answer tampering, providing detailed feedback on correct vs. wrong answers.
4. **Real-time Leaderboard & Gamification**: Aggregate user attempt metrics, calculate accuracy percentages, calculate rank positions, award dynamic badges, and offer CSV export capabilities.
5. **Admin Portal**: Equip platform administrators with tools to create, edit, delete quizzes, manage question banks, and review system analytics using interactive Chart.js visualizations.
6. **Dark & Light Mode Support**: Provide a toggleable theme system adhering to modern design principles with persistent user selection.

---

## 🏗️ System Architecture

QuizMaster follows a decoupled 3-tier architecture:

```
+-------------------------------------------------------------------+
|                           CLIENT TIER                             |
|    React.js (Vite) | Context API | React Router v6 | Chart.js     |
+-------------------------------------------------------------------+
                                  |
                                  | HTTP / REST (Axios + JWT Bearer)
                                  v
+-------------------------------------------------------------------+
|                           SERVER TIER                             |
|      Node.js + Express.js REST API | Middleware Validation        |
+-------------------------------------------------------------------+
                                  |
                                  | Dual Database Driver
                                  v
+-------------------------------------------------------------------+
|                          DATABASE TIER                            |
|             SQLite3 (quiz_platform.db) / MySQL2                    |
+-------------------------------------------------------------------+
```

---

## 📊 Database Design & ER Schema

The database consists of 5 relational tables:

### 1. `users` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique User ID |
| `name` | VARCHAR(255) | NOT NULL | User's Full Name |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Account Email |
| `password` | VARCHAR(255) | NOT NULL | Bcrypt Hashed Password |
| `role` | VARCHAR(50) | DEFAULT 'user' | Access Role ('user' or 'admin') |
| `avatar` | VARCHAR(100) | DEFAULT '' | Profile Avatar Preset |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account Creation Date |

### 2. `quizzes` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique Quiz ID |
| `title` | VARCHAR(255) | NOT NULL | Quiz Title |
| `description` | TEXT | NULLABLE | Description & Objectives |
| `category` | VARCHAR(100) | NOT NULL | Category (React, JS, SQL, etc.) |
| `difficulty` | VARCHAR(50) | DEFAULT 'Medium' | Difficulty Level |
| `time_limit` | INTEGER | DEFAULT 300 | Duration in Seconds |

### 3. `questions` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique Question ID |
| `quiz_id` | INTEGER | FOREIGN KEY (quizzes.id) | Parent Quiz ID |
| `question` | TEXT | NOT NULL | Question Statement |
| `option1` | TEXT | NOT NULL | Choice Option 1 |
| `option2` | TEXT | NOT NULL | Choice Option 2 |
| `option3` | TEXT | NOT NULL | Choice Option 3 |
| `option4` | TEXT | NOT NULL | Choice Option 4 |
| `correct_option` | INTEGER | NOT NULL | Correct Choice Index (1–4) |
| `marks` | INTEGER | DEFAULT 1 | Marks Awarded |

### 4. `quiz_attempts` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique Attempt ID |
| `user_id` | INTEGER | FOREIGN KEY (users.id) | Student User ID |
| `quiz_id` | INTEGER | FOREIGN KEY (quizzes.id) | Quiz Attempted |
| `score` | INTEGER | NOT NULL | Marks Achieved |
| `correct` | INTEGER | NOT NULL | Count of Correct Answers |
| `wrong` | INTEGER | NOT NULL | Count of Wrong Answers |
| `skipped` | INTEGER | DEFAULT 0 | Count of Skipped Questions |
| `time_taken` | INTEGER | DEFAULT 0 | Completion Time in Seconds |

### 5. `leaderboard` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Entry ID |
| `user_id` | INTEGER | UNIQUE, FOREIGN KEY (users.id) | User Reference |
| `total_score` | INTEGER | DEFAULT 0 | Cumulative Points |
| `total_quizzes` | INTEGER | DEFAULT 0 | Total Completed Quizzes |
| `average_score` | FLOAT | DEFAULT 0.00 | Average Score |
| `rank_position` | INTEGER | DEFAULT 0 | Calculated Rank Position |

---

## 📡 REST API Specifications

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register`: Create new user account.
- `POST /api/auth/login`: Authenticate credentials & return JWT token.
- `GET /api/auth/me`: Get current user profile, achievements, & stats. *(Protected)*
- `PUT /api/auth/profile`: Update user name, email, & profile avatar. *(Protected)*
- `PUT /api/auth/password`: Change account password. *(Protected)*

### Quiz Routes (`/api/quizzes`)
- `GET /api/quizzes`: Fetch all available quizzes with search/filter options.
- `GET /api/quizzes/:id`: Fetch single quiz & randomized questions. *(Protected)*
- `POST /api/quizzes`: Create new quiz. *(Admin Only)*
- `PUT /api/quizzes/:id`: Update quiz parameters. *(Admin Only)*
- `DELETE /api/quizzes/:id`: Delete quiz. *(Admin Only)*

### Question Routes (`/api/questions`)
- `POST /api/questions`: Add question to a quiz. *(Admin Only)*
- `PUT /api/questions/:id`: Update question details. *(Admin Only)*
- `DELETE /api/questions/:id`: Remove question. *(Admin Only)*

### Attempt & Leaderboard Routes (`/api/attempts` & `/api/leaderboard`)
- `POST /api/attempts/submit`: Server-side scoring engine & attempt registration. *(Protected)*
- `GET /api/attempts/my-attempts`: Fetch user's historical attempts. *(Protected)*
- `GET /api/attempts/stats/admin`: Fetch system-wide metrics & chart data. *(Admin Only)*
- `GET /api/leaderboard`: Fetch global leaderboard standings & badge metrics.

---

## 🔐 Security & Authentication

1. **Password Hashing**: User passwords are never stored in plaintext. They are salted and hashed using `bcryptjs` with 10 salt rounds.
2. **Stateless JWT Authorization**: Requests to protected routes require a `Bearer <token>` HTTP Header verified by custom Express middleware (`authMiddleware`).
3. **Role-Based Access Control (RBAC)**: Admin endpoints are secured with `adminMiddleware`, preventing non-admin users from creating/editing quizzes or viewing administrative metrics.
4. **Server-Side Evaluation**: Correct answer keys are stored on the server. Clients submit only selected option indexes, preventing inspection of correct answers via browser Developer Tools.

---

## 💻 Frontend UI/UX Design System

The application features a modern design built with Vanilla CSS variables:

- **Primary Color**: Electric Blue (`#2563EB`)
- **Secondary Color**: Dark Blue (`#1E40AF`)
- **Accent Color**: Amber Gold (`#F59E0B`)
- **Success Color**: Emerald Green (`#22C55E`)
- **Error Color**: Rose Red (`#EF4444`)
- **Theme Support**: Seamless switching between Light Slate (`#F8FAFC`) and Obsidian Dark (`#0F172A`) via `ThemeContext`.

---

## ⚙️ Installation & Deployment Guide

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm or yarn

### Quick Start Commands

```bash
# Clone Repository
git clone https://github.com/your-username/Quizplatform.git
cd Quizplatform

# Install Backend Dependencies & Start Server
cd backend
npm install
npm start

# In a separate terminal, Install Frontend Dependencies & Start App
cd ../frontend
npm install
npm run dev
```

---

## 🧪 Testing & Verification Results

| Test Scenario | Input / Action | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **User Registration** | Valid name, email, & password | Account created, JWT returned, redirected to Dashboard | PASS ✅ |
| **Quiz Execution** | Selecting answers & submitting | Timer stops, attempt stored in DB, score calculated | PASS ✅ |
| **Leaderboard Update** | Submit quiz with high score | Total score & rank position recalculates instantly | PASS ✅ |
| **CSV Export** | Click "Export Leaderboard" | `.csv` file downloads containing current standings | PASS ✅ |
| **Admin Route Security** | Regular user navigating to `/admin` | Denied access & redirected to Dashboard | PASS ✅ |
| **Theme Persistence** | Toggle to Dark Mode & refresh | Page stays in Dark Mode via `localStorage` | PASS ✅ |

---

## 📌 Conclusion

QuizMaster fulfills all requirements of a professional full-stack web development internship project. Its modular architecture, secure authentication, resilient dual database fallback, analytics dashboards, and responsive design demonstrate industry-ready software engineering standards.
