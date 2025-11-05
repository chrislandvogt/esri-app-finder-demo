# Deployment Guide

## Overview
This guide covers deploying the ESRI App Finder & Builder Assistant to Azure using Azure Static Web Apps with integrated Azure Functions.

## Prerequisites

### Required Accounts & Services
- Azure subscription with active credits
- GitHub account with repository access
- Azure OpenAI Service access (requires approval)
- ESRI Developer account for API keys

### Required Tools
- Azure CLI (`az`) - [Install Guide](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- Node.js 20+ LTS
- Git

## Deployment Options

### Option 1: GitHub Actions (Recommended)

This is the easiest and most automated deployment method.

#### Step 1: Create Azure Static Web App

```bash
# Login to Azure
az login

# Set your subscription
az account set --subscription "your-subscription-id"

# Create resource group
az group create \
  --name esri-assistant-rg \
  --location eastus

# Create Static Web App
az staticwebapp create \
  --name esri-app-finder \
  --resource-group esri-assistant-rg \
  --source https://github.com/YOUR_USERNAME/YOUR_REPO \
  --location eastus \
  --branch main \
  --app-location "/frontend" \
  --api-location "/backend" \
  --output-location "dist" \
  --login-with-github
```

#### Step 2: Get Deployment Token

```bash
# Get the deployment token
az staticwebapp secrets list \
  --name esri-app-finder \
  --resource-group esri-assistant-rg \
  --query "properties.apiKey" \
  --output tsv
```

#### Step 3: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Deployment token | From Step 2 above |
| `VITE_ARCGIS_API_KEY` | ESRI API key | [ESRI Developers Dashboard](https://developers.arcgis.com/dashboard) |

#### Step 4: Configure Azure OpenAI

```bash
# Create Azure OpenAI resource
az cognitiveservices account create \
  --name esri-assistant-openai \
  --resource-group esri-assistant-rg \
  --kind OpenAI \
  --sku S0 \
  --location eastus

# Get the endpoint
az cognitiveservices account show \
  --name esri-assistant-openai \
  --resource-group esri-assistant-rg \
  --query "properties.endpoint" \
  --output tsv

# Get the API key
az cognitiveservices account keys list \
  --name esri-assistant-openai \
  --resource-group esri-assistant-rg \
  --query "key1" \
  --output tsv

# Deploy GPT-4 model
az cognitiveservices account deployment create \
  --name esri-assistant-openai \
  --resource-group esri-assistant-rg \
  --deployment-name gpt-4 \
  --model-name gpt-4 \
  --model-version "0613" \
  --model-format OpenAI \
  --sku-capacity 10 \
  --sku-name "Standard"
```

#### Step 5: Configure Application Settings

Add environment variables to your Static Web App:

```bash
# Set backend environment variables
az staticwebapp appsettings set \
  --name esri-app-finder \
  --resource-group esri-assistant-rg \
  --setting-names \
    AZURE_OPENAI_ENDPOINT="<endpoint-from-step-4>" \
    AZURE_OPENAI_API_KEY="<key-from-step-4>" \
    AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4" \
    ESRI_API_KEY="<your-esri-key>"
```

#### Step 6: Deploy

Simply push to your `main` branch:

```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

GitHub Actions will automatically build and deploy your application.

#### Step 7: Verify Deployment

```bash
# Get the URL
az staticwebapp show \
  --name esri-app-finder \
  --resource-group esri-assistant-rg \
  --query "defaultHostname" \
  --output tsv
```

Visit the URL to see your deployed application.

---

### Option 2: Manual Deployment with Azure CLI

If you prefer manual control or want to deploy without GitHub Actions:

#### Build the Application

```bash
# Build frontend
cd frontend
npm install
npm run build

# Build backend
cd ../backend
npm install
npm run build
```

#### Deploy Using SWA CLI

```bash
# Install SWA CLI globally
npm install -g @azure/static-web-apps-cli

# Deploy
swa deploy \
  --app-location ./frontend \
  --output-location ./frontend/dist \
  --api-location ./backend \
  --deployment-token <your-deployment-token>
```

---

## Environment Configuration

### Frontend Environment Variables

Create `frontend/.env.production`:

```bash
VITE_API_BASE_URL=/api
VITE_ARCGIS_API_KEY=your_production_esri_key
VITE_APP_VERSION=1.0.0
```

### Backend Environment Variables

These are configured via Azure Static Web Apps application settings (see Step 5 above).

---

## Custom Domain Setup

### Add Custom Domain

```bash
# Add custom domain
az staticwebapp hostname set \
  --name esri-app-finder \
  --resource-group esri-assistant-rg \
  --hostname www.yourdomain.com
```

### Configure DNS

Add a CNAME record in your DNS provider:

```
Type: CNAME
Name: www
Value: <your-static-web-app>.azurestaticapps.net
TTL: 3600
```

SSL certificates are automatically provisioned by Azure.

---

## Monitoring & Logging

### Enable Application Insights

```bash
# Create Application Insights
az monitor app-insights component create \
  --app esri-assistant-insights \
  --location eastus \
  --resource-group esri-assistant-rg \
  --application-type web

# Get instrumentation key
az monitor app-insights component show \
  --app esri-assistant-insights \
  --resource-group esri-assistant-rg \
  --query "instrumentationKey" \
  --output tsv

# Add to Static Web App settings
az staticwebapp appsettings set \
  --name esri-app-finder \
  --resource-group esri-assistant-rg \
  --setting-names \
    APPLICATIONINSIGHTS_CONNECTION_STRING="<connection-string>"
```

### View Logs

```bash
# Stream logs
az staticwebapp logs show \
  --name esri-app-finder \
  --resource-group esri-assistant-rg \
  --follow
```

Or view in Azure Portal:
1. Navigate to your Static Web App
2. Click on "Application Insights"
3. Explore logs, metrics, and traces

---

## Scaling & Performance

### Configure Scaling

Azure Static Web Apps automatically scales based on demand. For Azure Functions backend:

```bash
# Check current plan
az staticwebapp show \
  --name esri-app-finder \
  --resource-group esri-assistant-rg \
  --query "sku.name"
```

Static Web Apps offers:
- **Free tier**: 100 GB bandwidth/month
- **Standard tier**: Unlimited bandwidth, custom domains, enhanced performance

---

## Rollback Strategy

### Rollback via GitHub

```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

GitHub Actions will automatically deploy the reverted version.

### Rollback Manually

```bash
# List deployments
az staticwebapp environment list \
  --name esri-app-finder \
  --resource-group esri-assistant-rg

# Access previous deployment by its URL
# Static Web Apps keeps previous deployments for quick rollback
```

---

## Cost Estimation

### Azure Static Web Apps
- **Free tier**: $0/month (100 GB bandwidth)
- **Standard tier**: ~$9/month + bandwidth overages

### Azure OpenAI Service (GPT-4)
- **Input tokens**: $0.03 per 1K tokens
- **Output tokens**: $0.06 per 1K tokens
- **Estimated**: $300-500/month for 1000 active users

### Total Estimated Cost
- **Development**: $0-50/month
- **Production** (moderate traffic): $350-600/month

---

## Troubleshooting

### Common Issues

#### 1. Deployment Fails
```bash
# Check GitHub Actions logs
# Go to: GitHub → Actions → View failed workflow

# Or check Azure logs
az staticwebapp logs show \
  --name esri-app-finder \
  --resource-group esri-assistant-rg
```

#### 2. API Functions Not Working
```bash
# Verify API is deployed
curl https://your-app.azurestaticapps.net/api/health

# Check function logs in Azure Portal
```

#### 3. Azure OpenAI Errors
```bash
# Verify deployment exists
az cognitiveservices account deployment list \
  --name esri-assistant-openai \
  --resource-group esri-assistant-rg

# Test API key
curl https://your-resource.openai.azure.com/openai/deployments/gpt-4/chat/completions?api-version=2024-02-15-preview \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_KEY" \
  -d '{"messages":[{"role":"user","content":"test"}]}'
```

---

## Security Best Practices

1. **Rotate Keys Regularly**: Rotate Azure OpenAI and ESRI API keys quarterly
2. **Use Managed Identities**: Where possible, use managed identities instead of API keys
3. **Enable WAF**: Consider Azure Front Door with WAF for production
4. **Monitor Costs**: Set up cost alerts in Azure Portal
5. **Review Logs**: Regularly review Application Insights for anomalies

---

## Next Steps

After deployment:
1. Test all functionality in production
2. Set up monitoring alerts
3. Configure custom domain (optional)
4. Enable Application Insights dashboard
5. Document any production-specific configuration

---

**Document Version**: 1.0  
**Last Updated**: November 5, 2025
