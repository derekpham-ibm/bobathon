# 🚀 Quick Start Guide - IBM Blue Connect

Get the IBM Blue Connect onboarding platform running in 5 minutes!

## Prerequisites

Make sure you have these installed:
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Python 3.11+** - [Download here](https://www.python.org/downloads/)
- **Git** - [Download here](https://git-scm.com/)

## Step 1: Start the Backend (Terminal 1)

```bash
# Navigate to backend directory
cd ibm-blue-connect/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
```

✅ Backend should now be running at `http://localhost:8000`

You should see:
```
🚀 Starting IBM Blue Connect API...
📍 Server running at: http://localhost:8000
📚 API docs available at: http://localhost:8000/docs
```

## Step 2: Start the Frontend (Terminal 2)

Open a **new terminal window** and run:

```bash
# Navigate to frontend directory
cd ibm-blue-connect/frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

✅ Frontend should now be running at `http://localhost:5173`

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 3: Open the Application

1. Open your browser
2. Go to `http://localhost:5173`
3. You should see the IBM Blue Connect login page!

## Step 4: Login with Demo Account

Use any of these demo accounts:

| Email | Password | Role |
|-------|----------|------|
| sarah.chen@ibm.com | demo123 | Software Engineer |
| marcus.johnson@ibm.com | demo123 | Senior Consultant |
| emily.rodriguez@ibm.com | demo123 | Sales Representative |
| david.kim@ibm.com | demo123 | Product Manager |

**Quick Login:** Click on any demo user card on the login page!

## 🎉 You're All Set!

Explore the features:
- **Dashboard** - View your onboarding progress
- **Tasks** - Complete your onboarding checklist
- **Resources** - Browse documentation and guides
- **Chat** - Ask Watson AI assistant questions
- **Profile** - View your profile information

## Troubleshooting

### Backend won't start?

**Error: `ModuleNotFoundError: No module named 'fastapi'`**
```bash
# Make sure virtual environment is activated
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

**Error: `Port 8000 already in use`**
```bash
# Kill the process using port 8000
# macOS/Linux:
lsof -ti:8000 | xargs kill -9
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Frontend won't start?

**Error: `Cannot find module`**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error: `Port 5173 already in use`**
```bash
# The error message will suggest an alternative port
# Or kill the process:
# macOS/Linux:
lsof -ti:5173 | xargs kill -9
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Can't connect to backend?

1. Make sure backend is running on `http://localhost:8000`
2. Check browser console for CORS errors
3. Verify both terminals are running
4. Try refreshing the page

### Login not working?

1. Check backend terminal for errors
2. Make sure you're using the correct credentials
3. Try: `sarah.chen@ibm.com` / `demo123`
4. Check browser console for API errors

## API Documentation

While the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Stopping the Application

**Backend (Terminal 1):**
- Press `Ctrl + C`
- Deactivate virtual environment: `deactivate`

**Frontend (Terminal 2):**
- Press `Ctrl + C`

## Next Steps

- Explore all features in the application
- Check out the full README.md for detailed documentation
- Review the design document: `ibm-onboarding-tool-design.md`
- Customize the code for your needs

## Need Help?

- Check the main README.md
- Review API documentation at http://localhost:8000/docs
- Check browser console for errors
- Check terminal output for error messages

---

**Happy Onboarding! 🎉**