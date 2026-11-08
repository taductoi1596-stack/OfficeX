FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace configuration
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY package.json ./

# Copy backend package.json
COPY apps/backend/package.json ./apps/backend/

# Install dependencies (only for backend and shared workspaces if any)
RUN pnpm install --filter @officex/backend...

# Copy source code
COPY apps/backend ./apps/backend

# Generate Prisma Client
WORKDIR /app/apps/backend
RUN pnpm db:generate

# Build the application
RUN pnpm build

# --- Production Image ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy necessary files from builder
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/apps/backend/package.json ./apps/backend/
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma

# Install production dependencies only
RUN pnpm install --filter @officex/backend... --prod

# Generate Prisma Client for production
WORKDIR /app/apps/backend
RUN pnpm db:generate

EXPOSE 3000

CMD ["node", "dist/main"]
