# NBHX ERP Enterprise 2026 - Arquitectura

## 🏗️ Visión General

El NBHX ERP Enterprise 2026 está diseñado con una arquitectura de microservicios moderna, escalable y resiliente, optimizada para entornos de manufactura.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Web App   │  │ Mobile App  │  │   Kiosks    │  │   Tablets   │        │
│  │  (Next.js)  │  │  (PWA)      │  │  (React)    │  │  (React)    │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
└─────────┼────────────────┼────────────────┼────────────────┼────────────────┘
          │                │                │                │
          └────────────────┴────────────────┴────────────────┘
                                     │
                              ┌──────┴──────┐
                              │   Nginx     │
                              │   (LB/WAF)  │
                              └──────┬──────┘
                                     │
┌────────────────────────────────────┼─────────────────────────────────────────┐
│                         API GATEWAY LAYER                                    │
│  ┌─────────────────────────────────┴─────────────────────────────────────┐   │
│  │                    API Gateway (NestJS)                                │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │    REST     │  │  GraphQL    │  │   gRPC      │  │  WebSocket  │  │   │
│  │  │    API      │  │  Gateway    │  │  Services   │  │   Gateway   │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          │                          │                          │
┌─────────┴──────────┐  ┌───────────┴───────────┐  ┌───────────┴───────────┐
│  MICROSERVICES      │  │   MICROSERVICES       │  │   MICROSERVICES       │
│  (Core Business)    │  │   (Support)           │  │   (Analytics)         │
│                     │  │                       │  │                       │
│ ┌───────────────┐   │  │ ┌───────────────┐     │  │ ┌───────────────┐     │
│ │  Production   │   │  │ │     Auth      │     │  │ │      BI       │     │
│ │   Service     │   │  │ │   Service     │     │  │ │   Service     │     │
│ └───────────────┘   │  │ └───────────────┘     │  │ └───────────────┘     │
│ ┌───────────────┐   │  │ ┌───────────────┐     │  │ ┌───────────────┐     │
│ │  Inventory    │   │  │ │ Notification  │     │  │ │      AI       │     │
│ │   Service     │   │  │ │   Service     │     │  │ │   Service     │     │
│ └───────────────┘   │  │ └───────────────┘     │  │ └───────────────┘     │
│ ┌───────────────┐   │  │ ┌───────────────┐     │  │                       │
│ │   Quality     │   │  │ │    Admin      │     │  │                       │
│ │   Service     │   │  │ │   Service     │     │  │                       │
│ └───────────────┘   │  │ └───────────────┘     │  │                       │
│ ┌───────────────┐   │  │                       │  │                       │
│ │  Engineering  │   │  │                       │  │                       │
│ │   Service     │   │  │                       │  │                       │
│ └───────────────┘   │  │                       │  │                       │
│ ┌───────────────┐   │  │                       │  │                       │
│ │      HR       │   │  │                       │  │                       │
│ │   Service     │   │  │                       │  │                       │
│ └───────────────┘   │  │                       │  │                       │
│ ┌───────────────┐   │  │                       │  │                       │
│ │    Finance    │   │  │                       │  │                       │
│ │   Service     │   │  │                       │  │                       │
│ └───────────────┘   │  │                       │  │                       │
└─────────────────────┘  └───────────────────────┘  └───────────────────────┘
          │                          │                          │
          └──────────────────────────┼──────────────────────────┘
                                     │
┌────────────────────────────────────┼─────────────────────────────────────────┐
│                         DATA LAYER                                           │
│  ┌─────────────────────────────────┴─────────────────────────────────────┐   │
│  │                                                                       │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │ PostgreSQL  │  │    Redis    │  │  (Azure)    │  │  (Azure)    │  │   │
│  │  │  (Primary)  │  │   (Cache)   │  │    Blob     │  │    Queue    │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  │                                                                       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🧩 Microservicios

### Core de Negocio

| Servicio | Descripción | Puerto | Tecnología |
|----------|-------------|--------|------------|
| **Production Service** | MRP, MPS, OEE, Shop Floor | 4002 | NestJS + TypeScript |
| **Inventory Service** | Control de inventarios, trazabilidad | 4003 | NestJS + TypeScript |
| **Quality Service** | ISO 9001, NCR, CAPA, Auditorías | 4004 | NestJS + TypeScript |
| **Engineering Service** | BOMs, Routings, ECN | 4005 | NestJS + TypeScript |
| **HR Service** | Asistencia, capacitación, evaluaciones | 4006 | NestJS + TypeScript |
| **Finance Service** | Costos, reportes financieros | 4007 | NestJS + TypeScript |

### Soporte

| Servicio | Descripción | Puerto | Tecnología |
|----------|-------------|--------|------------|
| **Auth Service** | OAuth 2.0, JWT, MFA, RBAC | 4001 | NestJS + Passport |
| **Notification Service** | Email, SMS, Push notifications | - | NestJS + Bull |
| **Admin Service** | No-Code builder, workflows | 4009 | NestJS + BPMN |

### Analytics & AI

| Servicio | Descripción | Puerto | Tecnología |
|----------|-------------|--------|------------|
| **BI Service** | Dashboards, KPIs, reportes | 4008 | NestJS + Apache Superset |
| **AI Service** | ML, predicciones, chatbot | 4010 | Python + TensorFlow |

## 📊 Modelo de Datos

### Entidades Principales

```
┌─────────────────────────────────────────────────────────────────┐
│                        COMPANIES                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │    Users    │  │   Roles     │  │  Sessions   │             │
│  └──────┬──────┘  └──────┬──────┘  └─────────────┘             │
│         │                │                                      │
│         └────────────────┘                                      │
│                    │                                            │
│  ┌─────────────────┴─────────────────────────────────────────┐  │
│  │                    PRODUCTS                                │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │  │
│  │  │    BOMs     │  │  Routings   │  │  Inventory  │       │  │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘       │  │
│  │         │                │                │               │  │
│  │         └────────────────┴────────────────┘               │  │
│  │                            │                              │  │
│  │  ┌─────────────────────────┴───────────────────────────┐  │  │
│  │  │              WORK ORDERS                             │  │  │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │  │
│  │  │  │Operations   │  │Production   │  │    OEE      │  │  │  │
│  │  │  │             │  │Transactions │  │    Data     │  │  │  │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔒 Seguridad

### Autenticación y Autorización

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                           │
│                                                                  │
│  Client ──► API Gateway ──► Auth Service ──► JWT Token          │
│                              │                                   │
│                              ▼                                   │
│                    ┌─────────────────┐                          │
│                    │  OAuth 2.0      │                          │
│                    │  + MFA (TOTP)   │                          │
│                    └─────────────────┘                          │
│                              │                                   │
│                              ▼                                   │
│                    ┌─────────────────┐                          │
│                    │  RBAC / ABAC    │                          │
│                    │  Permissions    │                          │
│                    └─────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

### Medidas de Seguridad

- **Encriptación**: AES-256 para datos en reposo, TLS 1.3 en tránsito
- **Protección**: SQL Injection, XSS, CSRF, Rate Limiting
- **Auditoría**: Logs completos de todas las operaciones
- **Cumplimiento**: ISO 27001, SOC 2

## 🚀 Escalabilidad

### Horizontal Pod Autoscaling (HPA)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-gateway
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          averageUtilization: 70
```

### Database Scaling

- **Read Replicas**: Para consultas de BI y reportes
- **Connection Pooling**: PgBouncer
- **Sharding**: Por company_id para multi-tenancy

## 📈 Monitoreo

### Stack de Observabilidad

| Componente | Herramienta |
|------------|-------------|
| Métricas | Prometheus + Grafana |
| Logs | ELK Stack / Azure Monitor |
| Tracing | Jaeger / Azure Application Insights |
| Alertas | PagerDuty + Slack |

## 🔄 CI/CD Pipeline

```
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│  Code   │──►│  Build  │──►│  Test   │──►│  Deploy │──►│ Monitor │
│ Commit  │   │  & Lint │   │  & Scan │   │  to Env │   │  & Alert│
└─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘
     │             │             │             │             │
     ▼             ▼             ▼             ▼             ▼
  GitHub      GitHub        SonarQube     Azure/K8s    Prometheus
  Actions     Actions       + Jest        Helm Charts  + Grafana
```

## 📋 Requisitos del Sistema

### Mínimos

- **CPU**: 4 cores
- **RAM**: 8 GB
- **Storage**: 100 GB SSD
- **Network**: 100 Mbps

### Recomendados (Producción)

- **CPU**: 16+ cores
- **RAM**: 32+ GB
- **Storage**: 500 GB+ NVMe SSD
- **Network**: 1 Gbps

## 🔧 Configuración de Desarrollo

```bash
# Clonar repositorio
git clone https://github.com/nbhx/erp-enterprise-2026.git
cd nbhx-erp-enterprise-2026

# Configurar entorno
cp .env.example .env

# Iniciar servicios
make dev

# Acceder a:
# - Frontend: http://localhost:3000
# - API: http://localhost:4000
# - GraphQL: http://localhost:4000/graphql
```

## 📚 Documentación Adicional

- [API Documentation](./API.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [User Manual](./USER_MANUAL.md)
- [Security Guide](./SECURITY.md)
