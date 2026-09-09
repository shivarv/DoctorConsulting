# Frontend: Vite dev server.
FROM node:22-alpine

WORKDIR /app

# npm ci needs both files and honours the lockfile exactly.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 5173

# --host is required: without it Vite binds to localhost inside the container
# and nothing outside can reach it.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
