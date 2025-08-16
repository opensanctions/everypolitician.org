FROM node:24-slim

LABEL org.opencontainers.image.title="EveryPolitician"
LABEL org.opencontainers.image.source=https://github.com/opensanctions/everypolitician.org

ARG BUILD_DATE=static

# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential \
#     pkg-config \
#     locales \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y --no-install-recommends locales \
    && apt-get upgrade -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Build locale definition
RUN localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8

ENV LANG="en_US.UTF-8"
ENV TZ="UTC"

RUN useradd -u 10000 -s /bin/false app

ENV NODE_ENV=production
ARG NEXT_PUBLIC_API_URL=https://api.opensanctions.org
ARG NEXT_PUBLIC_COOKIE_NAME=ep_site_token
ENV NEXT_TELEMETRY_DISABLED=1

RUN mkdir /app
COPY . /app

WORKDIR /app
RUN npm install --no-fund -g npm && npm install --no-fund --production=false --force

ARG NEXT_PUBLIC_BUILD_TIME=static
RUN echo "${BUILD_TIME}"
RUN --mount=type=secret,id=api_token \
    API_TOKEN="$(cat /run/secrets/api_token)" \
    npm run --prefix /app build

EXPOSE 3000
CMD ["npm", "run", "--prefix", "/app", "start"]
