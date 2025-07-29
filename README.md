# 🎤 Voice-Enabled Staff Utility App

A comprehensive **React + FastAPI + MongoDB** application designed specifically for educational institution staff to manage academic and administrative tasks efficiently with AI-powered voice-to-template conversion.

![Staff Utility App Dashboard](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

## ✨ **Key Features**

### 🎯 **Core Functionality**
- **📊 Dynamic Dashboard** - Real-time overview with personalized metrics and quick access to daily tasks
- **🎤 Voice Input Center** - Record, transcribe, and manage voice notes with pause/resume controls
- **📋 Smart Template Forms** - Pre-built institutional templates (Lesson Plans, Progress Reports, Meeting Minutes)
- **📅 Schedule Management** - Weekly class scheduling with substitution handling and status tracking
- **📊 Attendance Tracker** - Mark attendance, generate reports, and manage student analytics
- **👤 Staff Profile Management** - Editable professional profiles with service statistics

### 🤖 **AI-Powered Features**
- **✨ SmartVoiceToTemplateConverter** - The crown jewel! Speak naturally and watch AI:
  - Transcribe your voice in real-time
  - Intelligently detect the appropriate template
  - Auto-fill all form fields with extracted information
  - Provide editing capabilities before submission

## 🏗️ **Architecture**

### **Frontend (React)**
- Modern functional components with hooks
- Responsive mobile-first design using Tailwind CSS
- Beautiful glassmorphism UI with smooth animations
- React Router for seamless navigation
- localStorage for offline data persistence

### **Backend (FastAPI)**
- RESTful API with comprehensive CRUD operations
- Async/await MongoDB integration
- Automatic API documentation with Swagger
- Activity logging and analytics
- Modular service architecture

### **Database (MongoDB)**
- Document-based storage for flexible data models
- Collections for staff, schedules, attendance, templates, and more
- Efficient querying and aggregation pipelines

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 16+ and Yarn
- Python 3.8+ and pip
- MongoDB running locally or connection string

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Santhosh-p653/voice-enabled-staff-utility.git
   cd voice-enabled-staff-utility
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   
   # Create .env file with your MongoDB connection
   echo "MONGO_URL=mongodb://localhost:27017" > .env
   echo "DB_NAME=staff_utility_app" >> .env
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   yarn install
   
   # Create .env file with backend URL
   echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env
   ```

4. **Run the Application**
   ```bash
   # Start backend (from backend directory)
   uvicorn server:app --host 0.0.0.0 --port 8001 --reload
   
   # Start frontend (from frontend directory)
   yarn start
   ```

5. **Access the App**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8001
   - API Documentation: http://localhost:8001/docs

## 📱 **Features Overview**

### Dashboard
Beautiful, responsive dashboard with real-time metrics and quick access to daily tasks.

### AI Voice-to-Template Converter
The standout feature - speak naturally and watch AI automatically detect and fill institutional templates.

### Schedule Management
Comprehensive weekly schedule view with substitution handling and status tracking.

### Attendance Tracking
Intuitive attendance marking with analytics and export capabilities.

## 🔧 **API Endpoints**

### **Staff Management**
- `GET /api/staff` - Get all staff profiles
- `POST /api/staff` - Create new staff profile
- `PUT /api/staff/{id}` - Update staff profile

### **Schedule Management**
- `GET /api/schedule/staff/{id}` - Get staff schedules
- `POST /api/schedule` - Create new schedule
- `PATCH /api/schedule/{id}/status` - Update schedule status

### **Voice & Templates**
- `POST /api/voice/process-template` - Process voice to template
- `GET /api/templates` - Get all templates
- `POST /api/templates/submissions` - Submit form

### **Dashboard**
- `GET /api/dashboard/staff/{id}` - Get comprehensive dashboard data

## 🛠️ **Technology Stack**

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React 19, Tailwind CSS | Modern, responsive UI |
| **Backend** | FastAPI, Python | High-performance API |
| **Database** | MongoDB | Flexible document storage |
| **Routing** | React Router | SPA navigation |
| **HTTP Client** | Axios | API communication |

## 🏫 **Built For Education**

This application is specifically designed for educational institutions to streamline staff workflows and improve efficiency through modern technology and AI-powered automation.

---

**⭐ If you find this project helpful, please star the repository!**

Made with ❤️ for educators and educational institutions.
