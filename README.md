[README.md](https://github.com/user-attachments/files/26322230/README.md)
# NBHX ERP Enterprise 2026

## 🏭 Sistema ERP de Clase Mundial para Manufactura

**Versión:** 2026.1.0  
**Stack:** Node.js + NestJS | React + Next.js + Tailwind | PostgreSQL + Redis | Docker

---

## ⚠️ IMPORTANTE - Antes de empezar

### Problema común: Archivos grandes en Git

**NO subas `node_modules` a GitHub.** El error que recibiste ocurre porque el directorio `node_modules` fue incluido en el commit.

**Solución:**
```bash
# 1. Eliminar node_modules de git (si ya fue comiteado)
git rm -r --cached node_modules

# 2. Asegurarse de que .gitignore esté presente (ya está incluido)

# 3. Hacer commit de los cambios
git add .gitignore
git commit -m "Remove node_modules and add .gitignore"

# 4. Subir a GitHub
git push origin main
```

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Docker 20.10+
- Docker Compose 2.0+
- Git

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd nbhx-erp-enterprise-2026
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

### 3. Iniciar con Docker Compose

```bash
# Opción A: Usando Make (recomendado)
make dev

# Opción B: Directamente con Docker
docker-compose up -d
```

### 4. Acceder a la aplicación

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| Frontend | http://localhost:3000 | admin@nbhx.com / Nbhx2026! |
| API | http://localhost:4000 | - |
| GraphQL | http://localhost:4000/graphql | - |
| pgAdmin | http://localhost:5050 | admin@nbhx.com / admin2026 |

---

## 📁 Estructura del Proyecto

```
nbhx-erp-enterprise-2026/
├── 📁 backend/
│   └── 📁 api-gateway/          # API Gateway (NestJS)
│       ├── 📁 src/
│       ├── Dockerfile
│       └── package.json
├── 📁 frontend/                 # Frontend (Next.js 14)
│   ├── 📁 app/
│   ├── 📁 components/
│   ├── 📁 lib/
│   ├── Dockerfile
│   └── package.json
├── 📁 database/
│   └── 📁 init/                 # Scripts SQL
├── 📁 infra/                    # Infraestructura
│   ├── 📁 nginx/
│   ├── 📁 azure/
│   └── 📁 kubernetes/
├── docker-compose.yml
├── Makefile
└── .env.example
```

---

## 🧩 Módulos del Sistema

| Módulo | Descripción | Estado |
|--------|-------------|--------|
| 🔧 Producción | MRP, MPS, OEE, Shop Floor | ✅ |
| 📦 Inventarios | Stock realtime, FIFO/LIFO | ✅ |
| 🧪 Calidad ISO | NCR, CAPA, Auditorías | ✅ |
| 🧾 Ingeniería | BOMs, Routings, ECN | ✅ |
| 👷 RRHH | Asistencia, Evaluaciones | ✅ |
| 💰 Finanzas | Costeo, Reportes | ✅ |
| 📊 BI/Analytics | Dashboards, KPIs | ✅ |
| ⚙️ Admin Panel | No-Code Builder | ✅ |

---

## 🛠️ Comandos útiles (Makefile)

```bash
# Ver todos los comandos disponibles
make help

# Iniciar entorno de desarrollo
make dev

# Ver logs
make logs
make logs-api
make logs-frontend

# Detener servicios
make stop

# Reiniciar servicios
make restart

# Limpiar todo (contenedores, volúmenes, imágenes)
make clean

# Backup de base de datos
make backup

# Acceder a PostgreSQL
make psql
```

---

## 🔧 Desarrollo Local (sin Docker)

### Backend

```bash
cd backend/api-gateway
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Seguridad

- **Autenticación:** OAuth 2.0 + JWT + MFA
- **Autorización:** RBAC con permisos granulares
- **Encriptación:** AES-256
- **Protección:** SQL Injection, XSS, CSRF

---

## ☁️ Despliegue

### Azure

```bash
make azure-deploy
```

### Kubernetes

```bash
make k8s-deploy
```

---

## 🐛 Solución de Problemas

### Error: "node_modules" excede el límite de 100MB

```bash
# Eliminar node_modules de git
git rm -r --cached node_modules
git rm -r --cached */node_modules
git rm -r --cached **/node_modules

# Verificar que .gitignore existe
cat .gitignore

# Commit y push
git add .
git commit -m "Remove node_modules"
git push origin main
```

### Error: "Cannot find module"

```bash
# Reinstalar dependencias
make clean
make install
make dev
```

### Error: Puerto ya en uso

```bash
# Verificar qué proceso usa el puerto
lsof -i :3000
lsof -i :4000

# Matar el proceso o cambiar el puerto en .env
```

---

## 📚 Documentación

- [Arquitectura](./docs/ARCHITECTURE.md)
- [Changelog](./CHANGELOG.md)
- [Resumen del Proyecto](./PROJECT_SUMMARY.md)

---

## 📄 Licencia

Propietario - NBHX Group 2026

---

## 🤝 Soporte

Para reportar problemas o solicitar características, por favor abre un issue en el repositorio.
