# ESRI App Finder & Builder Assistant

A conversational AI chat tool that guides non-technical business users and policy makers to discover the right ESRI configurable application, create web maps, and search Living Atlas content.

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

Frontend: http://localhost:5173  
Backend: http://localhost:3000

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
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **ArcGIS Maps SDK** - Map rendering
- **React Query** - Server state management
- **Zustand** - Client state management

#### Backend
- **Azure Functions** - Serverless compute
- **Node.js 20** - Runtime
- **TypeScript** - Type safety
- **Azure OpenAI** - AI/Chat (GPT-4)
- **ArcGIS REST API** - ESRI integration

#### Infrastructure
- **Azure Static Web Apps** - Frontend hosting
- **Azure Functions** - Backend API
- **Azure OpenAI Service** - AI capabilities
- **Azure Monitor** - Logging & monitoring

## 📚 Documentation

Comprehensive documentation is available in the `/docs/spec-kit/` directory:

- [Product Requirements](./docs/spec-kit/product-requirements.md)
- [Technical Specification](./docs/spec-kit/technical-specification.md)
- [API Contracts](./docs/spec-kit/api-contracts.md)
- [Component Architecture](./docs/spec-kit/component-architecture.md)
- [Architecture Decision Records](./docs/spec-kit/adrs/)
- [Deployment Guide](./docs/spec-kit/deployment-guide.md)

## 🔑 Key Features

### v1.0 (Current)
- ✅ Conversational AI chat interface
- ✅ App recommendation engine (12 ESRI apps)
- ✅ Web map creation tool
- ✅ Living Atlas dataset search
- ✅ App preview & launch

### Future Versions
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

[License TBD]

## 🆘 Support

For issues and questions:
- Review documentation in `/docs/spec-kit/`
- Check [API Contracts](./docs/spec-kit/api-contracts.md)
- Review [Technical Specification](./docs/spec-kit/technical-specification.md)

## 🎯 Success Metrics

- Time to first recommendation: <2 minutes
- Completion rate: Users who launch configured app
- User satisfaction: Target 4.5/5

---

Built with ❤️ for non-technical users who need powerful geospatial apps
