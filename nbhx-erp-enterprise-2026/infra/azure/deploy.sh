#!/bin/bash
# ==========================================
# NBHX ERP Enterprise 2026 - Azure Deployment Script
# ==========================================

set -e

# Configuration
RESOURCE_GROUP="nbhx-erp-rg"
LOCATION="eastus"
ENVIRONMENT_NAME="nbhx-erp"
POSTGRES_ADMIN_PASSWORD="$(openssl rand -base64 32)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  NBHX ERP Enterprise 2026 - Azure Deploy  ${NC}"
echo -e "${GREEN}============================================${NC}"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}Error: Azure CLI is not installed${NC}"
    echo "Please install Azure CLI: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if user is logged in
echo -e "${YELLOW}Checking Azure login status...${NC}"
az account show &> /dev/null || {
    echo -e "${YELLOW}Please login to Azure:${NC}"
    az login
}

# Create resource group
echo -e "${YELLOW}Creating resource group: $RESOURCE_GROUP${NC}"
az group create \
    --name "$RESOURCE_GROUP" \
    --location "$LOCATION" \
    --tags \
        Environment=Production \
        Project=NBHX-ERP \
        Version=2026.1.0

# Deploy Bicep template
echo -e "${YELLOW}Deploying NBHX ERP infrastructure...${NC}"
az deployment group create \
    --resource-group "$RESOURCE_GROUP" \
    --template-file main.bicep \
    --parameters \
        environmentName="$ENVIRONMENT_NAME" \
        location="$LOCATION" \
        postgresAdminPassword="$POSTGRES_ADMIN_PASSWORD"

# Get deployment outputs
echo -e "${YELLOW}Getting deployment outputs...${NC}"
API_GATEWAY_URL=$(az deployment group show \
    --resource-group "$RESOURCE_GROUP" \
    --name main \
    --query properties.outputs.apiGatewayUrl.value \
    --output tsv)

FRONTEND_URL=$(az deployment group show \
    --resource-group "$RESOURCE_GROUP" \
    --name main \
    --query properties.outputs.frontendUrl.value \
    --output tsv)

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  Deployment Completed Successfully!        ${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${YELLOW}URLs:${NC}"
echo -e "  API Gateway: ${GREEN}$API_GATEWAY_URL${NC}"
echo -e "  Frontend:    ${GREEN}$FRONTEND_URL${NC}"
echo ""
echo -e "${YELLOW}PostgreSQL Password:${NC} ${GREEN}$POSTGRES_ADMIN_PASSWORD${NC}"
echo ""
echo -e "${YELLOW}Resource Group:${NC} $RESOURCE_GROUP"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Deploy your application code to the App Services"
echo "  2. Configure custom domains and SSL certificates"
echo "  3. Set up monitoring and alerts in Azure Portal"
echo ""
