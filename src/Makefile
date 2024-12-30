.PHONY: start-db update-db-dev

# Starts postgres dev db.
start-db:
	docker run -d -e POSTGRES_DB=mydb -e POSTGRES_PASSWORD=testpass123 -e POSTGRES_USER=postgres -p "5432:5432" postgres -c log_statement=all

# Updates db to reflect schema.prisma. Warning: This command does NOT generate
# migrations. Only use for quick prototyping. 
prisma-push:
	bunx prisma db push

# Start prisma studio
start-prisma-studio:
	bunx prisma studio
