# Stage: base image
FROM node:26.4.0-trixie-slim@sha256:a1d9d671994fc2d26e297ac56b4b1522a8bc7fa71c43b14cd1b1fe6c5116f7dc AS base

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
