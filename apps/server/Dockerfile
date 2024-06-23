FROM node:18-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Add build argument for REDIS_URI
ARG REDIS_URI
# Replace REDIS_URI in .env file
RUN if [ -f .env ]; then sed -i "s|REDIS_URI=.*|REDIS_URI=$REDIS_URI|g" .env; fi

FROM node:18-alpine AS runner
WORKDIR /usr/app
COPY --from=builder /app/build ./build
COPY package.json ./
COPY .env ./.env
RUN cat ./.env
RUN npm install -g pnpm
RUN pnpm install --prod
USER node
ENV NODE_ENV="production"
CMD ["npm", "start"]
