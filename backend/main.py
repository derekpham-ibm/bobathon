"""
IBM Blue Connect - Backend API
FastAPI application for onboarding platform MVP
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from enum import Enum
import uvicorn

# Initialize FastAPI app
app = FastAPI(
    title="IBM Blue Connect API",
    description="Employee Onboarding Platform API",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# MODELS
# ============================================================================

class UserRole(str, Enum):
    DEVELOPER = "Software Engineer"
    CONSULTANT = "Senior Consultant"
    SALES = "Sales Representative"
    PRODUCT_MANAGER = "Product Manager"
    CORPORATE = "Corporate"

class Department(str, Enum):
    SOFTWARE = "IBM Software"
    CONSULTING = "IBM Consulting"
    SALES = "Sales"
    CORPORATE = "Corporate"
    RESEARCH = "IBM Research"

class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class User(BaseModel):
    id: str
    email: EmailStr
    first_name: str
    last_name: str
    role: UserRole
    department: Department
    start_date: str
    location: str
    manager: str
    avatar_url: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    user: User
    token: str
    message: str

class Task(BaseModel):
    id: str
    title: str
    description: str
    category: str
    status: TaskStatus
    priority: str
    estimated_time: str
    due_date: Optional[str] = None
    completed_date: Optional[str] = None
    dependencies: List[str] = []
    resources: List[str] = []

class TaskProgress(BaseModel):
    total_tasks: int
    completed_tasks: int
    in_progress_tasks: int
    pending_tasks: int
    completion_percentage: int

class Resource(BaseModel):
    id: str
    title: str
    description: str
    category: str
    type: str  # document, video, link, guide
    url: Optional[str] = None
    content: Optional[str] = None
    tags: List[str] = []
    estimated_read_time: Optional[str] = None

class ChatMessage(BaseModel):
    message: str
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    suggestions: List[str] = []
    resources: List[str] = []

# ============================================================================
# MOCK DATA
# ============================================================================

# Mock users database
USERS_DB = {
    "sarah.chen@ibm.com": {
        "id": "user_001",
        "email": "sarah.chen@ibm.com",
        "password": "demo123",
        "first_name": "Sarah",
        "last_name": "Chen",
        "role": UserRole.DEVELOPER,
        "department": Department.SOFTWARE,
        "start_date": "2026-06-15",
        "location": "Austin, TX",
        "manager": "Michael Torres",
        "avatar_url": None
    },
    "marcus.johnson@ibm.com": {
        "id": "user_002",
        "email": "marcus.johnson@ibm.com",
        "password": "demo123",
        "first_name": "Marcus",
        "last_name": "Johnson",
        "role": UserRole.CONSULTANT,
        "department": Department.CONSULTING,
        "start_date": "2026-06-15",
        "location": "New York, NY",
        "manager": "Jennifer Williams",
        "avatar_url": None
    },
    "emily.rodriguez@ibm.com": {
        "id": "user_003",
        "email": "emily.rodriguez@ibm.com",
        "password": "demo123",
        "first_name": "Emily",
        "last_name": "Rodriguez",
        "role": UserRole.SALES,
        "department": Department.SALES,
        "start_date": "2026-06-15",
        "location": "San Francisco, CA",
        "manager": "Robert Anderson",
        "avatar_url": None
    },
    "david.kim@ibm.com": {
        "id": "user_004",
        "email": "david.kim@ibm.com",
        "password": "demo123",
        "first_name": "David",
        "last_name": "Kim",
        "role": UserRole.PRODUCT_MANAGER,
        "department": Department.CORPORATE,
        "start_date": "2026-06-15",
        "location": "Boston, MA",
        "manager": "Lisa Thompson",
        "avatar_url": None
    }
}

# Mock tasks by role
TASKS_BY_ROLE = {
    UserRole.DEVELOPER: [
        {
            "id": "task_dev_001",
            "title": "Request w3 Access",
            "description": "Submit access request for IBM w3 intranet and internal tools. This is your gateway to all IBM internal resources, documentation, and employee services. Contact: IT Service Desk | Definition of Done: w3 credentials received and verified, able to access w3.ibm.com",
            "category": "IBM Access Setup",
            "status": TaskStatus.COMPLETED,
            "priority": "high",
            "estimated_time": "15 minutes",
            "due_date": "2026-06-15",
            "completed_date": "2026-06-15",
            "dependencies": [],
            "resources": ["res_001"]
        },
        {
            "id": "task_dev_002",
            "title": "Complete IBM Security and Compliance Training",
            "description": "Mandatory training covering IBM security policies, data protection, and compliance requirements. Required for all IBM employees before accessing production systems. Contact: Security Training Team | Definition of Done: Training certificate obtained, quiz passed with 100%",
            "category": "IBM Learning",
            "status": TaskStatus.COMPLETED,
            "priority": "high",
            "estimated_time": "2 hours",
            "due_date": "2026-06-17",
            "completed_date": "2026-06-16",
            "dependencies": [],
            "resources": ["res_003"]
        },
        {
            "id": "task_dev_003",
            "title": "Set Up Slack/Teams and Join Required Channels",
            "description": "Join IBM Slack workspace and Microsoft Teams. Add yourself to #engineering, #team-backend, #onboarding, and your project-specific channels. Contact: Team Lead | Definition of Done: Active in all required channels, introduced yourself in #onboarding",
            "category": "Team Integration",
            "status": TaskStatus.IN_PROGRESS,
            "priority": "high",
            "estimated_time": "30 minutes",
            "due_date": "2026-06-20",
            "dependencies": [],
            "resources": ["res_007"]
        },
        {
            "id": "task_dev_004",
            "title": "Review Team Onboarding Guide",
            "description": "Read through your team's onboarding documentation on w3. Covers team structure, workflows, coding standards, and project architecture. Contact: Onboarding Buddy | Definition of Done: Guide reviewed, questions documented for 1:1",
            "category": "Team Integration",
            "status": TaskStatus.PENDING,
            "priority": "high",
            "estimated_time": "1 hour",
            "due_date": "2026-06-22",
            "dependencies": ["task_dev_001"],
            "resources": ["res_004"]
        },
        {
            "id": "task_dev_005",
            "title": "Set Up Local Development Environment",
            "description": "Install and configure required development tools: VS Code, Git, Docker, Node.js, Python, and IBM-specific CLI tools. Follow team setup guide. Contact: DevOps Team | Definition of Done: All tools installed, able to run project locally",
            "category": "Technical Setup",
            "status": TaskStatus.PENDING,
            "priority": "high",
            "estimated_time": "3 hours",
            "due_date": "2026-06-23",
            "dependencies": ["task_dev_004"],
            "resources": ["res_004", "res_005"]
        },
        {
            "id": "task_dev_006",
            "title": "Read Project Architecture Overview",
            "description": "Study the technical architecture documentation for your assigned project. Understand system components, data flows, and integration points. Contact: Tech Lead | Definition of Done: Architecture diagram reviewed, key components identified",
            "category": "Technical Setup",
            "status": TaskStatus.PENDING,
            "priority": "medium",
            "estimated_time": "2 hours",
            "due_date": "2026-06-24",
            "dependencies": ["task_dev_004"],
            "resources": []
        },
        {
            "id": "task_dev_007",
            "title": "Schedule Buddy Check-in",
            "description": "Set up recurring 30-minute check-ins with your assigned onboarding buddy for the first month. Use this time to ask questions and get guidance. Contact: Your Buddy | Definition of Done: First three meetings scheduled in Outlook",
            "category": "Team Integration",
            "status": TaskStatus.PENDING,
            "priority": "medium",
            "estimated_time": "10 minutes",
            "due_date": "2026-06-20",
            "dependencies": [],
            "resources": []
        },
        {
            "id": "task_dev_008",
            "title": "Review First Starter Ticket",
            "description": "Work with your manager to identify and review your first development task. Should be a well-scoped starter issue to help you learn the codebase. Contact: Manager | Definition of Done: Ticket assigned, requirements understood, ready to start",
            "category": "Technical Setup",
            "status": TaskStatus.PENDING,
            "priority": "medium",
            "estimated_time": "1 hour",
            "due_date": "2026-06-25",
            "dependencies": ["task_dev_005", "task_dev_006"],
            "resources": []
        },
        {
            "id": "task_dev_009",
            "title": "Request GitHub Enterprise Access",
            "description": "Submit access request for IBM GitHub Enterprise organization. Required for code contributions and repository access. Contact: IT Service Desk | Definition of Done: GitHub Enterprise access granted, able to clone team repositories",
            "category": "IBM Access Setup",
            "status": TaskStatus.PENDING,
            "priority": "high",
            "estimated_time": "15 minutes",
            "due_date": "2026-06-23",
            "dependencies": ["task_dev_001"],
            "resources": ["res_006"]
        },
        {
            "id": "task_dev_010",
            "title": "Confirm Access to Required Internal Tools",
            "description": "Verify you have access to: Jira, Confluence, IBM Cloud, VPN, Artifactory, and any project-specific tools. Document any missing access. Contact: IT Service Desk | Definition of Done: All tools accessible, access issues escalated",
            "category": "IBM Access Setup",
            "status": TaskStatus.PENDING,
            "priority": "medium",
            "estimated_time": "30 minutes",
            "due_date": "2026-06-24",
            "dependencies": ["task_dev_001"],
            "resources": []
        },
        {
            "id": "task_dev_011",
            "title": "Complete Manager Week-One Check-in",
            "description": "Schedule and complete your first 1:1 with your manager. Discuss expectations, goals, team dynamics, and answer any questions. Contact: Your Manager | Definition of Done: Meeting completed, notes documented, next steps clear",
            "category": "Team Integration",
            "status": TaskStatus.PENDING,
            "priority": "high",
            "estimated_time": "1 hour",
            "due_date": "2026-06-22",
            "dependencies": [],
            "resources": []
        }
    ],
    UserRole.CONSULTANT: [
        {
            "id": "task_con_001",
            "title": "Complete I-9 Verification",
            "description": "Submit required documents for employment verification",
            "category": "HR & Compliance",
            "status": TaskStatus.COMPLETED,
            "priority": "high",
            "estimated_time": "15 minutes",
            "due_date": "2026-06-15",
            "completed_date": "2026-06-15",
            "dependencies": [],
            "resources": ["res_001"]
        },
        {
            "id": "task_con_002",
            "title": "Enroll in Benefits",
            "description": "Select health insurance and other benefits",
            "category": "HR & Compliance",
            "status": TaskStatus.COMPLETED,
            "priority": "high",
            "estimated_time": "30 minutes",
            "due_date": "2026-06-20",
            "completed_date": "2026-06-16",
            "dependencies": [],
            "resources": ["res_009"]
        },
        {
            "id": "task_con_003",
            "title": "Complete IBM Garage Training",
            "description": "Learn IBM's innovation methodology",
            "category": "Training",
            "status": TaskStatus.IN_PROGRESS,
            "priority": "high",
            "estimated_time": "6 hours",
            "due_date": "2026-06-25",
            "dependencies": [],
            "resources": ["res_010"]
        },
        {
            "id": "task_con_004",
            "title": "Set Up Travel Profile",
            "description": "Configure Concur for business travel",
            "category": "Tools & Access",
            "status": TaskStatus.PENDING,
            "priority": "high",
            "estimated_time": "20 minutes",
            "due_date": "2026-06-22",
            "dependencies": [],
            "resources": ["res_011"]
        },
        {
            "id": "task_con_005",
            "title": "Complete Expense System Training",
            "description": "Learn how to submit expense reports",
            "category": "Training",
            "status": TaskStatus.PENDING,
            "priority": "medium",
            "estimated_time": "1 hour",
            "due_date": "2026-06-23",
            "dependencies": ["task_con_004"],
            "resources": ["res_012"]
        },
        {
            "id": "task_con_006",
            "title": "Shadow Client Call",
            "description": "Observe a client engagement (optional)",
            "category": "Team Integration",
            "status": TaskStatus.PENDING,
            "priority": "low",
            "estimated_time": "1 hour",
            "due_date": "2026-06-28",
            "dependencies": [],
            "resources": []
        }
    ]
}

# Mock resources
RESOURCES_DB = [
    {
        "id": "res_001",
        "title": "I-9 Verification Guide",
        "description": "Step-by-step guide for completing I-9 employment verification",
        "category": "HR & Benefits",
        "type": "document",
        "url": "/resources/i9-guide",
        "tags": ["hr", "compliance", "required"],
        "estimated_read_time": "5 min"
    },
    {
        "id": "res_002",
        "title": "Direct Deposit Setup",
        "description": "How to configure direct deposit in Workday",
        "category": "HR & Benefits",
        "type": "guide",
        "url": "/resources/direct-deposit",
        "tags": ["hr", "payroll"],
        "estimated_read_time": "3 min"
    },
    {
        "id": "res_003",
        "title": "Security Awareness Training",
        "description": "Mandatory cybersecurity training module",
        "category": "Training",
        "type": "video",
        "url": "/resources/security-training",
        "tags": ["security", "required", "training"],
        "estimated_read_time": "2 hours"
    },
    {
        "id": "res_004",
        "title": "Developer Environment Setup - macOS",
        "description": "Complete guide for setting up your Mac for development",
        "category": "IT & Tools",
        "type": "guide",
        "url": "/resources/dev-setup-mac",
        "tags": ["development", "setup", "mac"],
        "estimated_read_time": "15 min"
    },
    {
        "id": "res_005",
        "title": "Developer Environment Setup - Windows",
        "description": "Complete guide for setting up your Windows PC for development",
        "category": "IT & Tools",
        "type": "guide",
        "url": "/resources/dev-setup-windows",
        "tags": ["development", "setup", "windows"],
        "estimated_read_time": "15 min"
    },
    {
        "id": "res_006",
        "title": "GitHub Enterprise Access Request",
        "description": "How to request access to IBM's GitHub organization",
        "category": "IT & Tools",
        "type": "document",
        "url": "/resources/github-access",
        "tags": ["development", "github", "access"],
        "estimated_read_time": "5 min"
    },
    {
        "id": "res_007",
        "title": "Slack Best Practices",
        "description": "Guidelines for using Slack at IBM",
        "category": "Communication",
        "type": "guide",
        "url": "/resources/slack-guide",
        "tags": ["communication", "slack"],
        "estimated_read_time": "10 min"
    },
    {
        "id": "res_008",
        "title": "IBM Cloud Fundamentals Course",
        "description": "Introduction to IBM Cloud services and architecture",
        "category": "Training",
        "type": "video",
        "url": "/resources/cloud-fundamentals",
        "tags": ["cloud", "training", "ibm-cloud"],
        "estimated_read_time": "4 hours"
    },
    {
        "id": "res_009",
        "title": "Benefits Enrollment Guide",
        "description": "Overview of IBM benefits and how to enroll",
        "category": "HR & Benefits",
        "type": "document",
        "url": "/resources/benefits-guide",
        "tags": ["hr", "benefits", "health"],
        "estimated_read_time": "20 min"
    },
    {
        "id": "res_010",
        "title": "IBM Garage Method",
        "description": "Learn IBM's approach to innovation and client engagement",
        "category": "Training",
        "type": "video",
        "url": "/resources/garage-method",
        "tags": ["consulting", "methodology", "training"],
        "estimated_read_time": "6 hours"
    },
    {
        "id": "res_011",
        "title": "Concur Travel Setup",
        "description": "Configure your travel profile in Concur",
        "category": "IT & Tools",
        "type": "guide",
        "url": "/resources/concur-setup",
        "tags": ["travel", "expenses", "concur"],
        "estimated_read_time": "10 min"
    },
    {
        "id": "res_012",
        "title": "Expense Reporting Tutorial",
        "description": "How to submit and track expense reports",
        "category": "IT & Tools",
        "type": "video",
        "url": "/resources/expense-tutorial",
        "tags": ["expenses", "training"],
        "estimated_read_time": "1 hour"
    }
]

# Session storage (in-memory for demo)
sessions = {}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_current_user(token: str) -> Optional[User]:
    """Get user from session token"""
    if token in sessions:
        user_data = sessions[token]
        return User(**user_data)
    return None

def calculate_task_progress(tasks: List[Task]) -> TaskProgress:
    """Calculate task completion progress"""
    total = len(tasks)
    completed = sum(1 for t in tasks if t.status == TaskStatus.COMPLETED)
    in_progress = sum(1 for t in tasks if t.status == TaskStatus.IN_PROGRESS)
    pending = sum(1 for t in tasks if t.status == TaskStatus.PENDING)
    percentage = int((completed / total * 100)) if total > 0 else 0
    
    return TaskProgress(
        total_tasks=total,
        completed_tasks=completed,
        in_progress_tasks=in_progress,
        pending_tasks=pending,
        completion_percentage=percentage
    )

# ============================================================================
# API ROUTES
# ============================================================================

@app.get("/")
async def root():
    """API health check"""
    return {
        "message": "IBM Blue Connect API",
        "version": "1.0.0",
        "status": "running"
    }

# Authentication Routes
@app.post("/api/auth/login", response_model=LoginResponse)
async def login(credentials: LoginRequest):
    """Authenticate user and create session"""
    email = credentials.email.lower()
    
    if email not in USERS_DB:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_data = USERS_DB[email]
    if user_data["password"] != credentials.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create session token (simple demo token)
    token = f"token_{user_data['id']}_{datetime.now().timestamp()}"
    
    # Store session
    user_response = {k: v for k, v in user_data.items() if k != "password"}
    sessions[token] = user_response
    
    return LoginResponse(
        user=User(**user_response),
        token=token,
        message="Login successful"
    )

@app.post("/api/auth/logout")
async def logout(token: str):
    """Logout user and destroy session"""
    if token in sessions:
        del sessions[token]
    return {"message": "Logout successful"}

# User Routes
@app.get("/api/users/me", response_model=User)
async def get_current_user_profile(token: str):
    """Get current user profile"""
    user = get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

# Task Routes
@app.get("/api/tasks", response_model=List[Task])
async def get_tasks(token: str):
    """Get user's onboarding tasks"""
    user = get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Get tasks for user's role
    tasks = TASKS_BY_ROLE.get(user.role, [])
    return [Task(**task) for task in tasks]

@app.put("/api/tasks/{task_id}/complete")
async def complete_task(task_id: str, token: str):
    """Mark a task as completed"""
    user = get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Find and update task
    tasks = TASKS_BY_ROLE.get(user.role, [])
    for task in tasks:
        if task["id"] == task_id:
            task["status"] = TaskStatus.COMPLETED
            task["completed_date"] = datetime.now().strftime("%Y-%m-%d")
            return {"message": "Task completed", "task": Task(**task)}
    
    raise HTTPException(status_code=404, detail="Task not found")

@app.get("/api/tasks/progress", response_model=TaskProgress)
async def get_task_progress(token: str):
    """Get task completion progress"""
    user = get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    tasks = TASKS_BY_ROLE.get(user.role, [])
    task_objects = [Task(**task) for task in tasks]
    return calculate_task_progress(task_objects)

# Resource Routes
@app.get("/api/resources", response_model=List[Resource])
async def get_resources(category: Optional[str] = None):
    """Get all resources, optionally filtered by category"""
    resources = RESOURCES_DB
    if category:
        resources = [r for r in resources if r["category"] == category]
    return [Resource(**r) for r in resources]

@app.get("/api/resources/categories")
async def get_resource_categories():
    """Get all resource categories"""
    categories = list(set(r["category"] for r in RESOURCES_DB))
    return {"categories": sorted(categories)}

@app.get("/api/resources/search")
async def search_resources(q: str):
    """Search resources by query"""
    query = q.lower()
    results = [
        Resource(**r) for r in RESOURCES_DB
        if query in r["title"].lower() or query in r["description"].lower() or any(query in tag for tag in r["tags"])
    ]
    return results

# Chat Routes
@app.post("/api/chat/message", response_model=ChatResponse)
async def send_chat_message(message: ChatMessage, token: str):
    """Send message to AI assistant"""
    user = get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Simple rule-based responses (mock Watson)
    query = message.message.lower()
    
    # Response templates
    if "vpn" in query or "remote" in query:
        return ChatResponse(
            response="To set up VPN access:\n\n1. Download the IBM VPN client from the IT portal\n2. Install and launch the application\n3. Enter your w3id credentials\n4. Connect to the 'IBM-Corporate' network\n\nYou should now have secure access to internal resources.",
            suggestions=["How do I reset my VPN password?", "VPN troubleshooting", "Remote work best practices"],
            resources=["res_004", "res_005"]
        )
    elif "benefits" in query or "insurance" in query or "health" in query:
        return ChatResponse(
            response=f"Hi {user.first_name}! IBM offers comprehensive benefits including:\n\n• Health insurance (medical, dental, vision)\n• 401(k) with company match\n• Paid time off and holidays\n• Life and disability insurance\n• Wellness programs\n\nYou can enroll in benefits through Workday within your first 30 days.",
            suggestions=["How do I enroll in benefits?", "What's the 401(k) match?", "PTO policy"],
            resources=["res_009"]
        )
    elif "time off" in query or "pto" in query or "vacation" in query:
        return ChatResponse(
            response="IBM's PTO policy:\n\n• New hires receive 15 days of vacation\n• 10 paid holidays per year\n• Sick leave as needed\n• Request time off through Workday\n• Manager approval required\n\nYour current PTO balance: 15 days available",
            suggestions=["How do I request time off?", "Holiday calendar", "Sick leave policy"],
            resources=[]
        )
    elif "github" in query or "code" in query or "repository" in query:
        return ChatResponse(
            response="To access IBM's GitHub Enterprise:\n\n1. Go to the IT Service Portal\n2. Submit an 'Access Request'\n3. Select 'GitHub Enterprise'\n4. Specify your team/organization\n5. Wait for manager approval (usually 1-2 days)\n\nOnce approved, you'll receive an invitation email.",
            suggestions=["Development environment setup", "Git best practices", "Code review process"],
            resources=["res_006"]
        )
    elif "manager" in query or "1:1" in query or "meeting" in query:
        return ChatResponse(
            response=f"Your manager is {user.manager}. I recommend scheduling a 1:1 meeting within your first week to:\n\n• Discuss expectations and goals\n• Learn about team dynamics\n• Ask questions about your role\n• Set up regular check-ins\n\nYou can schedule meetings through Outlook or Webex.",
            suggestions=["What should I ask in my first 1:1?", "Team structure", "Performance expectations"],
            resources=[]
        )
    elif "training" in query or "learn" in query or "course" in query:
        return ChatResponse(
            response="IBM offers extensive learning resources:\n\n• Your Learning platform (internal courses)\n• IBM Skills Academy (certifications)\n• External platforms (Coursera, Udemy)\n• Lunch & Learn sessions\n• Conference attendance\n\nI recommend starting with IBM Cloud Fundamentals and your role-specific training path.",
            suggestions=["View my learning path", "Available certifications", "Upcoming training sessions"],
            resources=["res_008", "res_010"]
        )
    else:
        return ChatResponse(
            response=f"Hi {user.first_name}! I'm here to help with your onboarding. I can assist with:\n\n• IT setup and access\n• Benefits and HR questions\n• Training and learning resources\n• Team introductions\n• IBM policies and procedures\n\nWhat would you like to know?",
            suggestions=["How do I set up VPN?", "Tell me about benefits", "What training should I complete?"],
            resources=[]
        )

@app.get("/api/chat/history")
async def get_chat_history(token: str):
    """Get chat conversation history"""
    user = get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Mock chat history
    return {
        "messages": [
            {
                "id": "msg_001",
                "sender": "assistant",
                "message": f"Welcome to IBM Blue Connect, {user.first_name}! I'm your AI assistant. How can I help you today?",
                "timestamp": "2026-06-18T10:00:00Z"
            }
        ]
    }

# ============================================================================
# RUN SERVER
# ============================================================================

if __name__ == "__main__":
    print("🚀 Starting IBM Blue Connect API...")
    print("📍 Server running at: http://localhost:8000")
    print("📚 API docs available at: http://localhost:8000/docs")
    print("🔧 Interactive API at: http://localhost:8000/redoc")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")

# Made with Bob
