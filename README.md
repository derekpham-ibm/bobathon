# IBM Blue Connect - Onboarding Platform MVP

A comprehensive employee onboarding platform inspired by Amazon's A to Z, built specifically for IBM's diverse workforce.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git

### Installation

1. **Clone and navigate to the project:**
```bash
cd ibm-blue-connect
```

2. **Start the Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
Backend will run on `http://localhost:8000`

3. **Start the Frontend (in a new terminal):**
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:5173`

4. **Open your browser:**
Navigate to `http://localhost:5173`

## 📋 Features

### ✅ Implemented in MVP
- **Personalized Dashboard** - Role-based welcome screen with progress tracking
- **Task Management** - Interactive onboarding checklist with completion tracking
- **AI Chatbot** - Watson-inspired assistant for answering questions
- **Resource Hub** - Categorized documentation and guides
- **Search Functionality** - Find resources quickly
- **User Profiles** - Role-based customization (Developer, Consultant, Sales, Corporate)
- **Progress Tracking** - Visual indicators of onboarding completion
- **Responsive Design** - Works on desktop, tablet, and mobile

### 🔄 Mock Integrations
- Simulated IBM HR data
- Mock authentication (demo mode)
- Sample content and resources
- Fake task completion workflows

## 🏗️ Architecture

```
ibm-blue-connect/
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Main application pages
│   │   ├── services/        # API integration
│   │   ├── store/           # State management
│   │   └── utils/           # Helper functions
│   └── package.json
│
├── backend/                  # FastAPI application
│   ├── api/                 # API routes
│   ├── models/              # Data models
│   ├── services/            # Business logic
│   ├── data/                # Mock data
│   └── main.py              # Application entry point
│
└── README.md
```

## 🎯 Demo Users

The MVP includes sample users for different roles:

| Email | Password | Role | Department |
|-------|----------|------|------------|
| sarah.chen@ibm.com | demo123 | Software Engineer | IBM Software |
| marcus.johnson@ibm.com | demo123 | Senior Consultant | IBM Consulting |
| emily.rodriguez@ibm.com | demo123 | Sales Representative | Sales |
| david.kim@ibm.com | demo123 | Product Manager | Corporate |

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **FastAPI** - Python web framework
- **Pydantic** - Data validation
- **CORS** - Cross-origin support
- **Uvicorn** - ASGI server

## 📱 Key Pages

1. **Login** (`/`) - Authentication with demo users
2. **Dashboard** (`/dashboard`) - Personalized home screen
3. **Tasks** (`/tasks`) - Onboarding checklist
4. **Resources** (`/resources`) - Documentation hub
5. **Chat** (`/chat`) - AI assistant
6. **Profile** (`/profile`) - User settings

## 🎨 Design System

The MVP uses a simplified version of IBM's design principles:
- IBM Blue color scheme (#0f62fe)
- Clean, professional typography
- Accessible contrast ratios
- Responsive grid system
- Mobile-first approach

## 🔐 Security Note

⚠️ **This is a prototype/MVP for demonstration purposes only.**
- Uses mock authentication (no real security)
- No data encryption
- No production-ready security measures
- Not connected to real IBM systems

For production deployment, implement:
- IBM w3id SSO integration
- OAuth 2.0 / JWT authentication
- HTTPS/TLS encryption
- Role-based access control (RBAC)
- Security audits and compliance

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Tasks
- `GET /api/tasks` - Get user's onboarding tasks
- `PUT /api/tasks/{id}/complete` - Mark task as complete
- `GET /api/tasks/progress` - Get completion progress

### Resources
- `GET /api/resources` - Get all resources
- `GET /api/resources/categories` - Get resource categories
- `GET /api/resources/search?q={query}` - Search resources

### Chat
- `POST /api/chat/message` - Send message to AI assistant
- `GET /api/chat/history` - Get chat history

## 🚧 Future Enhancements

### Phase 2 Features
- Real IBM system integrations (Workday, ServiceNow)
- Advanced AI with Watson Assistant
- Mobile apps (iOS/Android)
- Offline support
- Multi-language support
- Video content
- Calendar integration
- Notifications system

### Phase 3 Features
- Learning pathways
- Peer connections
- Manager dashboard
- Analytics and reporting
- Advanced search with filters
- Document upload
- Custom workflows

## 🤝 Contributing

This is a prototype. For production development:
1. Follow IBM's coding standards
2. Write unit tests (Jest for frontend, pytest for backend)
3. Document all API changes
4. Follow security best practices
5. Get security review before deployment

## 📝 License

Internal IBM project - Not for external distribution

## 🆘 Support

For questions or issues:
- Check the documentation in `/resources`
- Use the AI chatbot for common questions
- Contact: blueconnect-support@ibm.com (mock)

## 🎓 Learning Resources

- [IBM Carbon Design System](https://carbondesignsystem.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [IBM Cloud Documentation](https://cloud.ibm.com/docs)

---

**Version:** 1.0.0-MVP  
**Last Updated:** June 18, 2026  
**Status:** Prototype/Demo