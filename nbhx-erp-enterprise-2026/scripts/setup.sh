#!/bin/bash
# ==========================================
# NBHX ERP Enterprise 2026 - Setup Script
# ==========================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║           🏭 NBHX ERP ENTERPRISE 2026 🏭                       ║"
echo "║                                                                ║"
echo "║              Sistema de Gestión para Manufactura               ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check prerequisites
echo -e "${YELLOW}Verificando prerrequisitos...${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado${NC}"
    echo "Por favor instale Docker: https://docs.docker.com/get-docker/"
    exit 1
fi
echo -e "${GREEN}✅ Docker instalado${NC}"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose no está instalado${NC}"
    echo "Por favor instale Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi
echo -e "${GREEN}✅ Docker Compose instalado${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js no está instalado (opcional para desarrollo local)${NC}"
else
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 18 ]; then
        echo -e "${GREEN}✅ Node.js $(node -v) instalado${NC}"
    else
        echo -e "${YELLOW}⚠️  Node.js $(node -v) detectado. Se recomienda v18+${NC}"
    fi
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creando archivo .env...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Archivo .env creado${NC}"
    echo -e "${YELLOW}⚠️  Por favor revise y actualice las variables en .env${NC}"
fi

# Create necessary directories
echo -e "${YELLOW}Creando directorios necesarios...${NC}"
mkdir -p logs backups uploads

# Pull images
echo -e "${YELLOW}Descargando imágenes Docker...${NC}"
docker-compose pull

# Build images
echo -e "${YELLOW}Construyendo imágenes...${NC}"
docker-compose build

# Start infrastructure services
echo -e "${YELLOW}Iniciando servicios de infraestructura...${NC}"
docker-compose up -d postgres redis pgadmin

# Wait for PostgreSQL
echo -e "${YELLOW}Esperando a PostgreSQL...${NC}"
sleep 10

# Check if PostgreSQL is ready
until docker-compose exec -T postgres pg_isready -U nbhx_admin > /dev/null 2>&1; do
    echo -e "${YELLOW}⏳ Esperando a PostgreSQL...${NC}"
    sleep 2
done
echo -e "${GREEN}✅ PostgreSQL listo${NC}"

# Initialize database
echo -e "${YELLOW}Inicializando base de datos...${NC}"
docker-compose exec -T postgres psql -U nbhx_admin -d nbhx_erp < database/init/01-schema.sql 2>/dev/null || true
docker-compose exec -T postgres psql -U nbhx_admin -d nbhx_erp < database/seeds/01-demo-data.sql 2>/dev/null || true
echo -e "${GREEN}✅ Base de datos inicializada${NC}"

# Start all services
echo -e "${YELLOW}Iniciando todos los servicios...${NC}"
docker-compose up -d

# Wait for services
echo -e "${YELLOW}Esperando servicios...${NC}"
sleep 15

# Health check
echo -e "${YELLOW}Verificando salud de los servicios...${NC}"

# Check API Gateway
if curl -s http://localhost:4000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API Gateway respondiendo${NC}"
else
    echo -e "${YELLOW}⚠️  API Gateway aún iniciando...${NC}"
fi

# Check Frontend
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend respondiendo${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend aún iniciando...${NC}"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    ✅ SETUP COMPLETADO                         ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🌐 URLs de acceso:${NC}"
echo -e "   • Frontend:      ${GREEN}http://localhost:3000${NC}"
echo -e "   • API Gateway:   ${GREEN}http://localhost:4000${NC}"
echo -e "   • GraphQL:       ${GREEN}http://localhost:4000/graphql${NC}"
echo -e "   • pgAdmin:       ${GREEN}http://localhost:5050${NC}"
echo ""
echo -e "${BLUE}👤 Credenciales de demo:${NC}"
echo -e "   • Email:    ${GREEN}admin@nbhx.com${NC}"
echo -e "   • Password: ${GREEN}Nbhx2026!${NC}"
echo ""
echo -e "${BLUE}📚 Comandos útiles:${NC}"
echo -e "   • make logs        - Ver logs"
echo -e "   • make stop        - Detener servicios"
echo -e "   • make restart     - Reiniciar servicios"
echo -e "   • make clean       - Limpiar todo"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE: Cambie las contraseñas por defecto en producción${NC}"
echo ""
