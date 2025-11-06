# ESRI App Finder & Builder Assistant

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/msftsean/esri-app-finder-demo)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/msftsean/esri-app-finder-demo/actions)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.1.1-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6.svg)](https://www.typescriptlang.org/)
[![Azure Functions](https://img.shields.io/badge/Azure%20Functions-v4-0062AD.svg)](https://azure.microsoft.com/en-us/services/functions/)
[![ArcGIS](https://img.shields.io/badge/ArcGIS%20SDK-4.31-007ac2.svg)](https://developers.arcgis.com/)

**Version 1.0.0** | [Changelog](./CHANGELOG.md) | [Roadmap](./docs/spec-kit/ROADMAP.md) | **[🚀 Start Here](./START-HERE.md)**

A conversational AI chat tool that guides non-technical business users and policy makers to discover the right ESRI configurable application, create web maps, and search Living Atlas content.

---

## 👋 New Here?

**Want to try this app locally?** Check out our step-by-step guide:

### **[📖 Getting Started Guide →](./START-HERE.md)**

The guide includes:
- ⚡ 10-minute quick start
- 📋 Prerequisites checklist
- 🔧 Detailed setup instructions
- 🛠️ Troubleshooting tips
- 🎯 Next steps for contributors

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ LTS
- npm or yarn
- Azure subscription (for deployment)
- ESRI Developer account
- Azure OpenAI access

### Installation

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Environment Setup

#### Frontend (.env)
```bash
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your values
```

#### Backend (.env)
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your values
```

### Development

```bash
# Terminal 1: Start frontend dev server
cd frontend
npm run dev

# Terminal 2: Start backend dev server
cd backend
npm run dev
```

Frontend: http://localhost:5175  
Backend: http://localhost:7071

> **Note:** Frontend runs on port 5175 (not 5173) due to port conflicts. Backend Azure Functions use default port 7071.

## 📁 Project Structure

```
/
├── docs/
│   └── spec-kit/              # GitHub Spec Kit documentation
│       ├── adrs/              # Architecture Decision Records
│       ├── product-requirements.md
│       ├── technical-specification.md
│       ├── api-contracts.md
│       └── deployment-guide.md
├── frontend/                  # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API clients
│   │   ├── store/             # Zustand state management
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Utility functions
│   └── package.json
├── backend/                   # Node.js + Azure Functions
│   ├── src/
│   │   ├── functions/         # Azure Functions
│   │   ├── services/          # Business logic
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Utility functions
│   └── package.json
└── README.md
```

## 🏗️ Architecture

### Technology Stack

#### Frontend
- **React 19.1.1** - UI framework (latest edge release)
- **TypeScript 5.9.3** - Type safety
- **Vite 7.1.7** - Build tool
- **Tailwind CSS 3.4.18** - Styling
- **ArcGIS Maps SDK 4.31** - Map rendering
- **Zustand 5.0.8** - State management

#### Backend
- **Azure Functions v4** - Serverless compute
- **Node.js 20** - Runtime
- **TypeScript 5.9.3** - Type safety
- **Azure OpenAI** - AI/Chat (GPT-4) *[mocked in v1.0]*
- **ArcGIS REST API** - ESRI integration *[mocked in v1.0]*

#### Infrastructure
- **Azure Static Web Apps** - Frontend hosting
- **Azure Functions** - Backend API
- **Azure OpenAI Service** - AI capabilities
- **Azure Monitor** - Logging & monitoring

## 📚 Documentation

Comprehensive documentation is available in the `.specify/` and `/docs/spec-kit/` directories:

### Specifications
- [API Specification](./.specify/specs/api-specification.md) - Complete REST API contract
- [Frontend Components](./.specify/specs/frontend-components.md) - React architecture
- [Error Handling](./.specify/specs/error-handling.md) - Graceful degradation patterns

### Analysis
- [Codebase Analysis](./.specify/analysis/codebase-analysis.md) - Implementation status (75% complete)
- [Specification Plan](./.specify/analysis/specification-plan.md) - Development roadmap

### Constitutional Framework
- [Constitution](./.specify/memory/constitution.md) - 9 articles guiding development

### GitHub Spec Kit
- [Product Requirements](./docs/spec-kit/product-requirements.md)
- [Technical Specification](./docs/spec-kit/technical-specification.md)
- [API Contracts](./docs/spec-kit/api-contracts.md)
- [Component Architecture](./docs/spec-kit/component-architecture.md)
- [Architecture Decision Records](./docs/spec-kit/adrs/)
- [Deployment Guide](./docs/spec-kit/deployment-guide.md)

## 🔑 Key Features

### v1.0.0 (Current - November 2025)
- ✅ Conversational AI chat interface
- ✅ App recommendation engine (12 ESRI apps)
- ✅ Interactive ESRI map with dynamic layers
- ✅ Living Atlas dataset search
- ✅ App preview & configuration
- ✅ Real-time streaming chat responses
- ✅ Responsive design (desktop & mobile)

### v1.1.0 (Planned - Q1 2026)
- 🔲 Error handling & graceful degradation
- 🔲 Accessibility (WCAG 2.1 AA)
- 🔲 Testing coverage (80%+)
- 🔲 Azure OpenAI integration (production)
- 🔲 ESRI Living Atlas API (production)

### v2.0.0 (Future)
- 🔲 User accounts (ArcGIS Online SSO)
- 🔲 Save/export configurations
- 🔲 Collaboration features
- 🔲 Embeddable widget

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm run test
npm run test:coverage

# Backend tests
cd backend
npm run test
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 🚢 Deployment

### Via GitHub Actions (Recommended)

```bash
# Push to main branch triggers automatic deployment
git push origin main
```

### Manual Deployment

```bash
# Deploy to Azure Static Web Apps
npm run deploy
```

See [Deployment Guide](./docs/spec-kit/deployment-guide.md) for detailed instructions.

## 🔐 Environment Variables

### Frontend
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API URL | Yes |
| `VITE_ARCGIS_API_KEY` | ESRI API key | Yes |

### Backend
| Variable | Description | Required |
|----------|-------------|----------|
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI endpoint | Yes |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI API key | Yes |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | Model deployment name | Yes |
| `ESRI_API_KEY` | ESRI API key | Yes |

## 🤝 Contributing

1. Review [Architecture Decision Records](./docs/spec-kit/adrs/)
2. Follow [Component Architecture](./docs/spec-kit/component-architecture.md) patterns
3. Update documentation for major changes
4. Create ADRs for architectural decisions

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## 🆘 Support

For issues and questions:
- Review documentation in `/docs/spec-kit/`
- Check [API Contracts](./docs/spec-kit/api-contracts.md)
- Review [Technical Specification](./docs/spec-kit/technical-specification.md)

## 🎯 Project Status

| Category | Status | Coverage |
|----------|--------|----------|
| **Implementation** | 🟡 In Progress | 75% complete |
| **Constitutional Compliance** | 🔴 3 violations | 6/9 articles passing |
| **Specifications** | 🟢 Phase 1 Complete | 3/10 specs delivered |
| **Testing** | 🔴 Minimal | <20% coverage |
| **Documentation** | 🟢 Comprehensive | API, Frontend, Error specs |
| **Deployment** | 🔴 Not Started | Local dev only |

### Critical Priorities
1. ⚠️ **Error Handling** - Implement graceful degradation (Article VII)
2. ⚠️ **Accessibility** - WCAG 2.1 AA compliance (Article VIII)
3. ⚠️ **Testing** - Achieve 80% coverage (Article IX)

## 🎯 Success Metrics

- Time to first recommendation: <2 minutes
- Completion rate: Users who launch configured app
- User satisfaction: Target 4.5/5

---

**Version 1.0.0** | Built with ❤️ for non-technical users who need powerful geospatial apps | [GitHub Repository](https://github.com/msftsean/esri-app-finder-demo)
