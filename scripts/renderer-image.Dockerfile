ARG STUDIO_IMAGE
FROM ${STUDIO_IMAGE}
WORKDIR /app/renderer
ENV APP_PRODUCT=""
CMD ["node", "server.js"]
