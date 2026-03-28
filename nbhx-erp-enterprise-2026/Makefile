# ==========================================
# NBHX ERP Enterprise 2026 - Makefile
# ==========================================

.PHONY: help install dev build start stop clean test deploy azure k8s

# Default target
help:
	@echo "NBHX ERP Enterprise 2026 - Comandos disponibles:"
	@echo ""
	@echo "  make install          - Instalar dependencias de todos los módulos"
	@echo "  make dev              - Iniciar entorno de desarrollo con Docker Compose"
	@echo "  make dev-local        - Iniciar servicios de infraestructura (DB, Redis)"
	@echo "  make build            - Construir imágenes Docker"
	@echo "  make start            - Iniciar todos los servicios"
	@echo "  make stop             - Detener todos los servicios"
	@echo "  make restart          - Reiniciar todos los servicios"
	@echo "  make logs             - Ver logs de todos los servicios"
	@echo "  make clean            - Limpiar contenedores, volúmenes e imágenes"
	@echo "  make test             - Ejecutar pruebas"
	@echo "  make test-e2e         - Ejecutar pruebas end-to-end"
	@echo "  make db-migrate       - Ejecutar migraciones de base de datos"
	@echo "  make db-seed          - Cargar datos de prueba"
	@echo "  make db-reset         - Reiniciar base de datos"
	@echo "  make azure-deploy     - Desplegar en Azure"
	@echo "  make k8s-deploy       - Desplegar en Kubernetes"
	@echo "  make k8s-delete       - Eliminar despliegue de Kubernetes"
	@echo "  make backup           - Crear backup de base de datos"
	@echo "  make restore          - Restaurar backup de base de datos"
	@echo ""

# Installation
install:
	@echo "Instalando dependencias del backend..."
	@cd backend/api-gateway && npm install
	@echo "Instalando dependencias del frontend..."
	@cd frontend && npm install

# Development
dev:
	@echo "Iniciando entorno de desarrollo..."
	@docker-compose up -d
	@echo "Esperando servicios..."
	@sleep 10
	@echo "✅ Servicios iniciados:"
	@echo "   - Frontend: http://localhost:3000"
	@echo "   - API Gateway: http://localhost:4000"
	@echo "   - GraphQL: http://localhost:4000/graphql"
	@echo "   - pgAdmin: http://localhost:5050"

dev-local:
	@echo "Iniciando servicios de infraestructura..."
	@docker-compose up -d postgres redis pgadmin
	@echo "Esperando base de datos..."
	@sleep 5
	@echo "✅ Infraestructura lista"

# Build
build:
	@echo "Construyendo imágenes Docker..."
	@docker-compose build --parallel
	@echo "✅ Imágenes construidas"

# Start/Stop/Restart
start:
	@docker-compose start
	@echo "✅ Servicios iniciados"

stop:
	@docker-compose stop
	@echo "✅ Servicios detenidos"

restart: stop start

# Logs
logs:
	@docker-compose logs -f --tail=100

logs-api:
	@docker-compose logs -f api-gateway

logs-frontend:
	@docker-compose logs -f frontend

# Clean
clean:
	@echo "Limpiando contenedores, volúmenes e imágenes..."
	@docker-compose down -v --rmi all --remove-orphans
	@docker system prune -f
	@echo "✅ Limpieza completada"

# Testing
test:
	@echo "Ejecutando pruebas unitarias..."
	@cd backend/api-gateway && npm test

test-e2e:
	@echo "Ejecutando pruebas end-to-end..."
	@cd backend/api-gateway && npm run test:e2e

# Database
db-migrate:
	@echo "Ejecutando migraciones..."
	@docker-compose exec postgres psql -U nbhx_admin -d nbhx_erp -f /docker-entrypoint-initdb.d/01-schema.sql

db-seed:
	@echo "Cargando datos de prueba..."
	@docker-compose exec postgres psql -U nbhx_admin -d nbhx_erp -f /docker-entrypoint-initdb.d/02-demo-data.sql

db-reset:
	@echo "Reiniciando base de datos..."
	@docker-compose down postgres
	@docker volume rm nbhx-erp-enterprise-2026_postgres_data
	@docker-compose up -d postgres
	@sleep 5
	@make db-migrate
	@make db-seed

# Azure Deployment
azure-deploy:
	@echo "Desplegando en Azure..."
	@cd infra/azure && bash deploy.sh

# Kubernetes Deployment
k8s-deploy:
	@echo "Desplegando en Kubernetes..."
	@kubectl apply -f infra/kubernetes/namespace.yaml
	@kubectl apply -f infra/kubernetes/configmap.yaml
	@kubectl apply -f infra/kubernetes/secret.yaml
	@kubectl apply -f infra/kubernetes/
	@echo "✅ Despliegue completado"

k8s-delete:
	@echo "Eliminando despliegue de Kubernetes..."
	@kubectl delete namespace nbhx-erp
	@echo "✅ Despliegue eliminado"

k8s-status:
	@kubectl get all -n nbhx-erp

# Backup & Restore
backup:
	@echo "Creando backup de base de datos..."
	@docker-compose exec postgres pg_dump -U nbhx_admin nbhx_erp > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Backup creado"

restore:
	@echo "Restaurando backup..."
	@docker-compose exec -T postgres psql -U nbhx_admin nbhx_erp < $(file)
	@echo "✅ Backup restaurado"

# Utilities
psql:
	@docker-compose exec postgres psql -U nbhx_admin -d nbhx_erp

redis-cli:
	@docker-compose exec redis redis-cli

shell-api:
	@docker-compose exec api-gateway sh

shell-frontend:
	@docker-compose exec frontend sh

# Health check
health:
	@curl -s http://localhost:4000/health | jq .

# Generate documentation
docs:
	@echo "Generando documentación..."
	@cd docs && ./generate-docs.sh
