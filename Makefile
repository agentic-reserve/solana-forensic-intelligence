.PHONY: help build up down logs restart clean investigate assets monitor trace track-outflows

help:
	@echo "Blockchain Sleuth - Docker Commands"
	@echo ""
	@echo "  make build         - Build Docker images"
	@echo "  make up            - Start all services"
	@echo "  make down          - Stop all services"
	@echo "  make logs          - View logs"
	@echo "  make restart       - Restart services"
	@echo "  make clean         - Remove containers and images"
	@echo "  make investigate   - Run investigation"
	@echo "  make assets        - Get assets"
	@echo "  make monitor       - View monitor logs"
	@echo "  make trace         - Trace BAD_ACTOR and generate dataset"
	@echo "  make track-outflows - Track scammer outflows and find endpoints"

build:
	docker-compose build

up:
	docker-compose up -d
	@echo "✅ Services started!"
	@echo "📊 API: http://localhost:3000"
	@echo "🔍 Health: http://localhost:3000/health"

down:
	docker-compose down

logs:
	docker-compose logs -f

logs-api:
	docker-compose logs -f blockchain-sleuth

logs-monitor:
	docker-compose logs -f blockchain-monitor

restart:
	docker-compose restart

clean:
	docker-compose down -v --rmi all

investigate:
	docker-compose exec blockchain-sleuth node dist/investigate-helius.js

assets:
	docker-compose exec blockchain-sleuth node dist/scripts/get-assets.js

trace:
	docker-compose exec blockchain-sleuth node dist/scripts/trace-bad-actor.js

track-outflows:
	docker-compose exec blockchain-sleuth node dist/scripts/track-scammer-outflows.js

monitor:
	docker-compose logs -f blockchain-monitor

status:
	docker-compose ps
