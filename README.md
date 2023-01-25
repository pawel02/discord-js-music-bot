# for development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# for production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
