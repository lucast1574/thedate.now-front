FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/the-date/package.json ./apps/the-date/package.json
COPY apps/save-the-date/package.json ./apps/save-the-date/package.json
RUN npm ci
COPY . .
RUN npm run build --workspace=@thedate/save-the-date
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build /app/apps/save-the-date/.next/standalone ./
COPY --from=build /app/apps/save-the-date/.next/static ./apps/save-the-date/.next/static
COPY --from=build /app/public ./apps/save-the-date/public
USER node
EXPOSE 3000
CMD ["node", "apps/save-the-date/server.js"]
