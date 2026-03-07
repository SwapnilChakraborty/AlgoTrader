# Use multi-stage builds for a smaller production image
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Install only production dependencies
RUN npm ci

# Builder stage for Next.js app
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma Client & Build Next.js
RUN npx prisma generate
RUN npm run build

# Stage for Next.js Web Application
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]

# Stage for Backend DB Worker
FROM node:18-alpine AS worker
WORKDIR /app
ENV NODE_ENV production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
# Compile the typescript worker file (assuming ts-node or transpiled)
CMD ["npx", "ts-node", "src/worker.ts"]
