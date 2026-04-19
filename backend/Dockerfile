FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source
COPY src ./src
COPY index.js ./

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 3001

CMD ["node", "index.js"]