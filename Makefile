# Makefile

.PHONY: help dev stop restart clean logs logs-api logs-frontend psql backup install azure-deploy k8s-deploy

help:
	@echo "Available commands:"
	@echo "  dev           - Start development environment"
	@echo "  stop          - Stop all running services"
	@echo "  restart       - Restart services"
	@echo "  clean         - Clean the environment"
	@echo "  logs          - Show logs"
	@echo "  logs-api      - Show API logs"
	@echo "  logs-frontend  - Show frontend logs"
	@echo "  psql          - Access PostgreSQL"
	@echo "  backup        - Backup data"
	@echo "  install       - Install dependencies"
	@echo "  azure-deploy  - Deploy to Azure"
	@echo "  k8s-deploy    - Deploy to Kubernetes"

dev:
	# Command to start the development environment

stop:
	# Command to stop all running services

restart:
	# Command to restart services

clean:
	# Command to clean the environment

logs:
	# Command to show logs

logs-api:
	# Command to show API logs

logs-frontend:
	# Command to show frontend logs

psql:
	# Command to access PostgreSQL

backup:
	# Command to backup data

install:
	# Command to install dependencies

azure-deploy:
	# Command to deploy to Azure

k8s-deploy:
	# Command to deploy to Kubernetes