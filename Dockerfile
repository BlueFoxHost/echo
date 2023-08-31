FROM node:18.17.1-bookworm-slim
LABEL author="Tweak4141" maintainer="mattt@bluefoxhost.com"
ARG DEBIAN_FRONTEND=noninteractive
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --chown=node:node /src /usr/src/app
USER node
RUN mkdir /home/node/etc/letsencrypt
CMD ["node", "index.js"]
EXPOSE 8080