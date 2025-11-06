# 🚀 Getting Started with ESRI App Finder

[![Difficulty](https://img.shields.io/badge/difficulty-beginner-green.svg)](START-HERE.md)
[![Time to Setup](https://img.shields.io/badge/setup%20time-10%20minutes-blue.svg)](START-HERE.md)
[![Prerequisites](https://img.shields.io/badge/prerequisites-Node.js%2020%2B-orange.svg)](https://nodejs.org/)

Welcome! This guide will help you get the ESRI App Finder running on your local machine in **under 10 minutes**. 🎉

---

## ⚡ Quick Start (TL;DR)

```bash
# 1. Clone the repository
git clone https://github.com/msftsean/esri-app-finder-demo.git
cd esri-app-finder-demo

# 2. Install dependencies
cd frontend && npm install
cd ../backend && npm install

# 3. Start the backend (Terminal 1)
cd backend && npm start

# 4. Start the frontend (Terminal 2)
cd frontend && npm run dev

# 5. Open your browser
# Frontend: http://localhost:5175
# Backend:  http://localhost:7071
```

**That's it!** 🎊 You should now see the ESRI App Finder running in your browser.

---

## 📋 Prerequisites

Before you begin, make sure you have these installed:

| Tool | Version | Download Link | Check Version |
|------|---------|---------------|---------------|
| **Node.js** | 20.x or higher | [nodejs.org](https://nodejs.org/) | `node --version` |
| **npm** | 10.x or higher | (included with Node.js) | `npm --version` |
| **Git** | Any recent version | [git-scm.com](https://git-scm.com/) | `git --version` |

### ✅ Verify Your Setup

Open your terminal and run these commands to verify everything is installed:

```bash
node --version    # Should show v20.x.x or higher
npm --version     # Should show 10.x.x or higher
git --version     # Should show git version 2.x.x or higher
```

If any of these commands fail, install the missing tool using the links above.

---

## 📦 Detailed Step-by-Step Guide

### Step 1: Clone the Repository 📥

First, let's get the code onto your machine.

```bash
# Navigate to where you want to store the project
cd ~/projects  # or C:\projects on Windows

# Clone the repository
git clone https://github.com/msftsean/esri-app-finder-demo.git

# Navigate into the project folder
cd esri-app-finder-demo
```

**Expected Result:** You should now have a folder called `esri-app-finder-demo` with all the project files.

```
esri-app-finder-demo/
├── frontend/
├── backend/
├── docs/
├── README.md
└── ...
```

---

### Step 2: Install Frontend Dependencies 🎨

The frontend is built with React, TypeScript, and Vite. Let's install its dependencies.

```bash
# Navigate to the frontend folder
cd frontend

# Install all dependencies (this may take 1-2 minutes)
npm install
```

**What's happening?** npm is downloading and installing:
- React 19.1.1 (UI framework)
- TypeScript 5.9.3 (type safety)
- Vite 7.1.7 (dev server & build tool)
- Tailwind CSS 3.4.18 (styling)
- Zustand 5.0.8 (state management)
- And other dependencies...

**Expected Output:**
```
added 245 packages, and audited 246 packages in 45s

89 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

✅ **Success!** All frontend dependencies are installed.

---

### Step 3: Install Backend Dependencies ⚙️

The backend uses Azure Functions with Node.js. Let's install its dependencies.

```bash
# Navigate to the backend folder (from frontend/)
cd ../backend

# Install all dependencies
npm install
```

**What's happening?** npm is downloading and installing:
- @azure/functions (Azure Functions SDK)
- TypeScript compiler
- And other backend dependencies...

**Expected Output:**
```
added 187 packages, and audited 188 packages in 32s

72 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

✅ **Success!** All backend dependencies are installed.

---

### Step 4: Build the Backend 🔨

Before we can run the backend, we need to compile the TypeScript code to JavaScript.

```bash
# Make sure you're in the backend folder
npm run build
```

**What's happening?** TypeScript is compiling your `.ts` files into `.js` files in the `dist/` folder.

**Expected Output:**
```
> backend@1.0.0 build
> tsc

Successfully compiled TypeScript files!
```

✅ **Success!** Backend code is compiled and ready to run.

---

### Step 5: Start the Backend Server 🖥️

Now let's start the Azure Functions backend server.

```bash
# Start the backend (keep this terminal open)
npm start
```

**What's happening?** The Azure Functions runtime is:
1. Loading your functions from `dist/`
2. Starting an HTTP server on port 7071
3. Registering two API endpoints

**Expected Output:**
```
Azure Functions Core Tools
Core Tools Version:       4.x.xxxx
Function Runtime Version: 4.x.xxxx

Functions:

        chat: [POST] http://localhost:7071/api/chat
        
        livingAtlasSearch: [GET] http://localhost:7071/api/living-atlas/search

For detailed output, run func with --verbose flag.
```

✅ **Success!** Backend is running on **http://localhost:7071**

> ⚠️ **Important:** Keep this terminal window open! If you close it, the backend will stop.

---

### Step 6: Start the Frontend Server 🌐

Open a **NEW terminal window** (keep the backend terminal running) and start the frontend.

```bash
# Navigate to the frontend folder
cd esri-app-finder-demo/frontend

# Start the frontend dev server
npm run dev
```

**What's happening?** Vite is:
1. Starting a development server
2. Trying ports 5173, 5174, then 5175 (if others are in use)
3. Hot-reloading your React app

**Expected Output:**
```
> frontend@0.0.0 dev
> vite

Port 5173 is in use, trying another one...
Port 5174 is in use, trying another one...

  VITE v7.2.0  ready in 3142 ms

  ➜  Local:   http://localhost:5175/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

✅ **Success!** Frontend is running on **http://localhost:5175**

> ⚠️ **Important:** Keep this terminal window open too!

---

### Step 7: Open the Application 🎉

Open your web browser and navigate to:

```
http://localhost:5175
```

**You should see:**
- 🗺️ An interactive ESRI map in the center
- 💬 A chat interface on the left sidebar
- 📊 A data search tab

---

## 🎮 Using the Application

### Try the Chat Interface 💬

1. Click on the **Chat** tab in the left sidebar
2. Type a message like: `"I need to visualize population data"`
3. Press Enter or click **Send**
4. The AI assistant will recommend ESRI apps and datasets

### Search for Datasets 🔍

1. Click on the **Data** tab in the left sidebar
2. Type a search query like: `"census"`
3. Browse the results from ESRI Living Atlas
4. Click on any dataset to add it to your map

### Explore the Map 🗺️

- **Pan:** Click and drag on the map
- **Zoom:** Use the scroll wheel or +/- buttons
- **Layers:** Selected datasets appear as layers on the map

---

## 🛠️ Troubleshooting

### Problem: "Port 7071 is unavailable"

**Solution:** Another process is using that port. Kill it and restart:

```bash
# Windows
taskkill /F /IM func.exe

# Mac/Linux
pkill -f func

# Then restart the backend
cd backend && npm start
```

---

### Problem: "Cannot find module" errors

**Solution:** Dependencies may not be fully installed. Reinstall:

```bash
# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd ../backend
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

### Problem: Frontend shows blank page

**Solution:** Check the browser console for errors:

1. Press `F12` to open Developer Tools
2. Click the **Console** tab
3. Look for red error messages
4. Make sure the backend is running (http://localhost:7071)

---

### Problem: TypeScript compilation errors

**Solution:** Rebuild the backend:

```bash
cd backend
npm run build
```

If errors persist, check that you're using Node.js 20+:

```bash
node --version  # Should be v20.x.x or higher
```

---

## 📂 Project Structure Overview

Here's what's in each folder:

```
esri-app-finder-demo/
│
├── 📁 frontend/                    # React application
│   ├── src/
│   │   ├── components/            # React components
│   │   │   ├── layout/            # Layout components (Header, Sidebar)
│   │   │   ├── chat/              # Chat interface components
│   │   │   ├── map/               # ESRI map component
│   │   │   └── common/            # Reusable components
│   │   ├── lib/                   # Business logic
│   │   │   ├── api/               # API client functions
│   │   │   ├── store/             # Zustand state management
│   │   │   └── utils/             # Helper functions
│   │   ├── config/                # Configuration constants
│   │   └── App.tsx                # Root component
│   └── package.json
│
├── 📁 backend/                     # Azure Functions API
│   ├── src/
│   │   ├── functions/             # Azure Functions
│   │   │   ├── chat.ts            # Chat endpoint
│   │   │   └── livingAtlas.ts     # Dataset search endpoint
│   │   └── index.ts               # Function registration
│   └── package.json
│
├── 📁 .specify/                    # Specifications
│   ├── specs/                     # Detailed specifications
│   │   ├── api-specification.md
│   │   ├── frontend-components.md
│   │   └── error-handling.md
│   └── analysis/                  # Code analysis
│
├── 📁 docs/                        # Documentation
│   └── spec-kit/                  # GitHub Spec Kit docs
│
├── 📄 README.md                    # Project overview
├── 📄 START-HERE.md               # This file!
└── 📄 CHANGELOG.md                # Version history
```

---

## 🚦 What's Working vs. What's Mocked

### ✅ Fully Working
- ✅ Frontend UI (React, TypeScript, Vite)
- ✅ Interactive ESRI map (ArcGIS SDK 4.31)
- ✅ Backend API server (Azure Functions)
- ✅ State management (Zustand)
- ✅ Responsive design

### ⚠️ Currently Mocked (v1.0.0)
- ⚠️ AI chat responses (returns hardcoded recommendations)
- ⚠️ Living Atlas search (returns mock dataset data)
- ⚠️ Azure OpenAI integration (not yet connected)

**Why mocked?** This allows you to explore the app without needing:
- Azure OpenAI API keys
- ESRI developer accounts
- Cloud infrastructure

These integrations are planned for **v1.1.0** (Q1 2026).

---

## 🎯 Next Steps

Now that you have the app running, here's what you can do:

### 1. Explore the Code 👨‍💻
- Check out the components in `frontend/src/components/`
- Review the API endpoints in `backend/src/functions/`
- Read the specifications in `.specify/specs/`

### 2. Read the Documentation 📚
- [API Specification](./.specify/specs/api-specification.md)
- [Frontend Components](./.specify/specs/frontend-components.md)
- [Error Handling](./.specify/specs/error-handling.md)
- [Codebase Analysis](./.specify/analysis/codebase-analysis.md)

### 3. Try Making Changes ✏️
- Modify the chat interface styling
- Add a new component
- Customize the map's initial view

### 4. Contribute 🤝
- Review the [Contributing Guide](./CONTRIBUTING.md)
- Check open issues on GitHub
- Submit a pull request

---

## 🆘 Need Help?

If you're stuck, here are some resources:

- 📖 **Documentation:** Check the `.specify/specs/` folder
- 🐛 **Issues:** [GitHub Issues](https://github.com/msftsean/esri-app-finder-demo/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/msftsean/esri-app-finder-demo/discussions)
- 📧 **Email:** [Create an issue](https://github.com/msftsean/esri-app-finder-demo/issues/new) instead

---

## 🎓 Learning Resources

Want to learn more about the technologies used?

| Technology | Learn More |
|------------|------------|
| **React** | [react.dev](https://react.dev/) |
| **TypeScript** | [typescriptlang.org](https://www.typescriptlang.org/) |
| **Vite** | [vitejs.dev](https://vitejs.dev/) |
| **Azure Functions** | [docs.microsoft.com/azure/azure-functions](https://docs.microsoft.com/azure/azure-functions) |
| **ArcGIS SDK** | [developers.arcgis.com](https://developers.arcgis.com/) |
| **Tailwind CSS** | [tailwindcss.com](https://tailwindcss.com/) |
| **Zustand** | [github.com/pmndrs/zustand](https://github.com/pmndrs/zustand) |

---

## ✅ Checklist

Use this checklist to make sure everything is set up correctly:

- [ ] Node.js 20+ installed
- [ ] npm 10+ installed
- [ ] Git installed
- [ ] Repository cloned
- [ ] Frontend dependencies installed (`cd frontend && npm install`)
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Backend compiled (`cd backend && npm run build`)
- [ ] Backend running on http://localhost:7071
- [ ] Frontend running on http://localhost:5175
- [ ] App opens in browser without errors
- [ ] Can interact with the map
- [ ] Chat interface loads

---

## 🎉 Congratulations!

You've successfully set up the ESRI App Finder on your local machine! 🚀

**What you've accomplished:**
- ✅ Installed all dependencies
- ✅ Built and started the backend
- ✅ Started the frontend dev server
- ✅ Explored the application

**Ready to dive deeper?** Head back to the [README](./README.md) for more details about the project architecture, testing, and deployment.

---

**Happy coding!** 💙 If you found this guide helpful, consider ⭐ starring the repository!

[← Back to README](./README.md) | [View Specifications](./.specify/specs/) | [Report Issue](https://github.com/msftsean/esri-app-finder-demo/issues/new)
