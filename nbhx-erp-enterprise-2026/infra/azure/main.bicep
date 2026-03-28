/* ==========================================
   NBHX ERP Enterprise 2026 - Azure Deployment
   Bicep Template
   ========================================== */

@description('Nombre del entorno')
param environmentName string = 'nbhx-erp'

@description('Ubicación de Azure')
param location string = resourceGroup().location

@description('Nombre de la base de datos PostgreSQL')
param postgresServerName string = '${environmentName}-postgres'

@description('Nombre de la base de datos')
param databaseName string = 'nbhx_erp'

@description('Usuario administrador de PostgreSQL')
param postgresAdminUser string = 'nbhxadmin'

@description('Contraseña administrador de PostgreSQL')
@secure()
param postgresAdminPassword string

@description('Nombre del App Service Plan')
param appServicePlanName string = '${environmentName}-plan'

@description('Nombre del API Gateway App Service')
param apiGatewayAppName string = '${environmentName}-api'

@description('Nombre del Frontend App Service')
param frontendAppName string = '${environmentName}-frontend'

@description('Nombre de la cuenta de almacenamiento')
param storageAccountName string = '${environmentName}storage'

@description('Nombre del Azure Cache for Redis')
param redisCacheName string = '${environmentName}-redis'

@description('SKU del App Service Plan')
param appServicePlanSku string = 'P1v2'

@description('SKU de PostgreSQL')
param postgresSku string = 'GP_Gen5_2'

// ==========================================
// RECURSOS
// ==========================================

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: appServicePlanSku
    tier: 'PremiumV2'
    size: 'P1v2'
    family: 'Pv2'
    capacity: 1
  }
  kind: 'linux'
  properties: {
    reserved: true
    perSiteScaling: false
    targetWorkerCount: 0
    targetWorkerSizeId: 0
  }
}

// PostgreSQL Flexible Server
resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2022-12-01' = {
  name: postgresServerName
  location: location
  sku: {
    name: postgresSku
    tier: 'GeneralPurpose'
  }
  properties: {
    administratorLogin: postgresAdminUser
    administratorLoginPassword: postgresAdminPassword
    version: '14'
    storage: {
      storageSizeGB: 32
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    highAvailability: {
      mode: 'Disabled'
    }
    maintenanceWindow: {
      customWindow: 'Disabled'
      dayOfWeek: 0
      startHour: 0
      startMinute: 0
    }
  }
}

// PostgreSQL Database
resource postgresDatabase 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2022-12-01' = {
  parent: postgresServer
  name: databaseName
  properties: {
    charset: 'UTF8'
    collation: 'en_US.utf8'
  }
}

// Azure Cache for Redis
resource redisCache 'Microsoft.Cache/redis@2022-06-01' = {
  name: redisCacheName
  location: location
  properties: {
    sku: {
      name: 'Basic'
      family: 'C'
      capacity: 0
    }
    enableNonSslPort: false
    minimumTlsVersion: '1.2'
  }
}

// Storage Account
resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    allowBlobPublicAccess: false
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
  }
}

// Blob Service
resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2022-09-01' = {
  parent: storageAccount
  name: 'default'
}

// Containers
resource documentsContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2022-09-01' = {
  parent: blobService
  name: 'documents'
  properties: {
    publicAccess: 'None'
  }
}

resource backupsContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2022-09-01' = {
  parent: blobService
  name: 'backups'
  properties: {
    publicAccess: 'None'
  }
}

// API Gateway App Service
resource apiGatewayApp 'Microsoft.Web/sites@2022-03-01' = {
  name: apiGatewayAppName
  location: location
  kind: 'app,linux'
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      alwaysOn: true
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      http20Enabled: true
      appSettings: [
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'PORT'
          value: '8080'
        }
        {
          name: 'DATABASE_URL'
          value: 'postgresql://${postgresAdminUser}:${postgresAdminPassword}@${postgresServerName}.postgres.database.azure.com:5432/${databaseName}'
        }
        {
          name: 'REDIS_URL'
          value: 'redis://:${redisCache.listKeys().primaryKey}@${redisCacheName}.redis.cache.windows.net:6380'
        }
        {
          name: 'JWT_SECRET'
          value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=jwt-secret)'
        }
      ]
    }
    httpsOnly: true
  }
  dependsOn: [
    postgresDatabase
  ]
}

// Frontend App Service (Static Web App alternative)
resource frontendApp 'Microsoft.Web/sites@2022-03-01' = {
  name: frontendAppName
  location: location
  kind: 'app,linux'
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      alwaysOn: true
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      http20Enabled: true
      appSettings: [
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'NEXT_PUBLIC_API_URL'
          value: 'https://${apiGatewayApp.properties.defaultHostName}'
        }
        {
          name: 'NEXT_PUBLIC_GRAPHQL_URL'
          value: 'https://${apiGatewayApp.properties.defaultHostName}/graphql'
        }
      ]
    }
    httpsOnly: true
  }
}

// Key Vault for secrets
resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: '${environmentName}-kv'
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    accessPolicies: []
    enabledForDeployment: false
    enabledForDiskEncryption: false
    enabledForTemplateDeployment: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
  }
}

// Application Insights
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${environmentName}-appinsights'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Request_Source: 'rest'
    WorkspaceResourceId: logAnalyticsWorkspace.id
  }
}

// Log Analytics Workspace
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: '${environmentName}-logs'
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

// ==========================================
// OUTPUTS
// ==========================================

output apiGatewayUrl string = 'https://${apiGatewayApp.properties.defaultHostName}'
output frontendUrl string = 'https://${frontendApp.properties.defaultHostName}'
output postgresServerFqdn string = postgresServer.properties.fullyQualifiedDomainName
output redisHostName string = redisCache.properties.hostName
output storageAccountName string = storageAccount.name
