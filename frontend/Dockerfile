FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY tsconfig*.json ./
COPY index.html ./
COPY eslint.config.js ./

# Install dependencies
RUN npm install

# Copy source
COPY src ./src
COPY public ./public

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]