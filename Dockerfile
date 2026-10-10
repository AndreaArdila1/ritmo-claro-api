# Imagen base: Node 22 sobre Debian slim
FROM node:22-slim

# Dependencia del sistema usada por Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Dependencias reproducibles y con caché
COPY package*.json ./
RUN npm ci

# Código fuente, sin lo excluido por .dockerignore
COPY . .

# La URL ficticia solo permite cargar prisma.config.ts durante generate.
# No se conecta a una base ni queda como secreto de ejecución.
RUN DATABASE_URL="postgresql://prisma:prisma@localhost:5432/prisma" npx prisma generate && npm run build

EXPOSE 3000

# En ejecución usa DATABASE_URL y PORT inyectadas por el entorno real
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]