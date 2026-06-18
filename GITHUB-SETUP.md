# 🚀 Push IBM Blue Connect to GitHub

Your project is ready to push to GitHub! Follow these steps:

## ✅ Already Done

- ✅ Git repository initialized
- ✅ All files committed
- ✅ Branch renamed to 'main'
- ✅ .gitignore configured

## 📋 Steps to Push to GitHub

### Option 1: Create New Repository on GitHub (Recommended)

1. **Go to GitHub and create a new repository:**
   - Visit: https://github.com/new
   - Repository name: `ibm-blue-connect`
   - Description: `IBM employee onboarding platform inspired by Amazon A to Z`
   - Choose: **Public** or **Private**
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

2. **Push your code:**
   ```bash
   cd ibm-blue-connect
   git remote add origin https://github.com/YOUR_USERNAME/ibm-blue-connect.git
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` with your GitHub username.

### Option 2: Using GitHub CLI (if installed)

```bash
cd ibm-blue-connect
gh repo create ibm-blue-connect --public --source=. --remote=origin --push
```

### Option 3: Using SSH (if configured)

```bash
cd ibm-blue-connect
git remote add origin git@github.com:YOUR_USERNAME/ibm-blue-connect.git
git push -u origin main
```

## 🔐 Authentication

If prompted for credentials:

**HTTPS Method:**
- Username: Your GitHub username
- Password: Use a Personal Access Token (not your password)
  - Create token at: https://github.com/settings/tokens
  - Select scopes: `repo` (full control of private repositories)

**SSH Method:**
- Set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

## 📝 After Pushing

Your repository will include:
- ✅ Complete source code (frontend + backend)
- ✅ Documentation (README, QUICKSTART, PROJECT-SUMMARY)
- ✅ Design document
- ✅ All configuration files

## 🌐 Repository URL

After pushing, your repository will be available at:
```
https://github.com/YOUR_USERNAME/ibm-blue-connect
```

## 📊 Recommended Repository Settings

### Add Topics (for discoverability):
- `onboarding`
- `ibm`
- `react`
- `fastapi`
- `python`
- `typescript`
- `employee-onboarding`
- `mvp`

### Add Description:
```
IBM Blue Connect - A comprehensive employee onboarding platform inspired by Amazon's A to Z, featuring AI-powered assistance, task management, and resource discovery.
```

### Enable GitHub Pages (optional):
You can deploy the frontend to GitHub Pages:
1. Go to Settings → Pages
2. Source: Deploy from a branch
3. Branch: main, folder: /frontend/dist
4. Build and deploy your frontend

## 🔄 Future Updates

To push future changes:
```bash
cd ibm-blue-connect
git add .
git commit -m "Your commit message"
git push
```

## 🤝 Collaboration

To allow others to contribute:
1. Go to Settings → Collaborators
2. Add collaborators by username
3. They can clone with:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ibm-blue-connect.git
   ```

## 📦 Clone on Another Machine

To work on this project from another computer:
```bash
git clone https://github.com/YOUR_USERNAME/ibm-blue-connect.git
cd ibm-blue-connect

# Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 main.py

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

## 🎯 Quick Commands Reference

```bash
# Check status
git status

# View commit history
git log --oneline

# Create a new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Pull latest changes
git pull

# View remote URL
git remote -v
```

## 🆘 Troubleshooting

**Error: "remote origin already exists"**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/ibm-blue-connect.git
```

**Error: "failed to push some refs"**
```bash
git pull origin main --rebase
git push -u origin main
```

**Error: "Permission denied (publickey)"**
- Set up SSH keys or use HTTPS with Personal Access Token

---

**Ready to push!** 🚀

Just create the repository on GitHub and run the push command!