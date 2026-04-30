# Stage: base image
FROM node:25.9.0-trixie-slim@sha256:74ab724acf22ae7b0af5cf8a0e762f6c981ba882a459e2abc80a97a7237a92f1 AS base

ENV TZ=Europe/London
RUN ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime && echo "$TZ" > /etc/timezone

RUN addgroup --gid 2000 --system appgroup && \
        adduser --uid 2000 --system appuser --gid 2000

WORKDIR /app

RUN apt-get update && \
        apt-get upgrade -y && \
        apt-get autoremove -y && \
        rm -rf /var/lib/apt/lists/* && \
        npm install -g npm@latest

# Stage: development image
FROM base AS dev

ENV NODE_ENV=development

RUN npm i -g nodemon

COPY ./bin/docker-entrypoint.dev.sh /app/bin/entrypoint.sh

RUN chmod +x /app/bin/entrypoint.sh

ENTRYPOINT [ "/app/bin/entrypoint.sh" ]

# Stage: build assets
FROM base AS build

COPY package.json package-lock.json ./
RUN PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm ci --no-audit

COPY . .
RUN npm run build
RUN npm prune --no-audit --omit=dev

# Stage: copy production assets and dependencies
FROM base

COPY --from=build --chown=appuser:appgroup \
        /app/package.json \
        /app/package-lock.json \
        ./

COPY --from=build --chown=appuser:appgroup \
        /app/dist ./dist

COPY --from=build --chown=appuser:appgroup \
        /app/node_modules ./node_modules

USER 2000

CMD [ "npm", "start" ]
