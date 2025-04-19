FROM node:18-alpine

# Update and install required packages
RUN apk add --update graphicsmagick tzdata postgresql-client git python3 make g++

# Set environment variables
ENV NODE_ENV=production
ENV N8N_VERSION=1.89.2
ENV DATABASE_TYPE=sqlite
ENV PATH=$PATH:/usr/local/bin
ENV N8N_CUSTOM_EXTENSIONS="/home/node/custom-nodes"

# Install n8n and required packages
RUN npm install -g n8n@${N8N_VERSION}

# Ensure npx is available (should be included with Node.js)
RUN npm install -g npm@latest

# Create necessary directories
RUN mkdir -p /home/node/scripts /home/node/custom-nodes

# Create script for running npx commands via n8n
RUN echo '#!/bin/sh\nnpx $@' > /usr/local/bin/run-npx \
    && chmod +x /usr/local/bin/run-npx

# Copy custom node files
COPY custom-nodes/ /home/node/custom-nodes/

# Install MCP dependencies
RUN cd /home/node && npm init -y && \
    npm install --save mcp-client mcp-server

# Install custom node
RUN cd /home/node/custom-nodes && npm link

# n8n port
EXPOSE 5678

# Set up the entrypoint
ENTRYPOINT ["n8n"]
CMD ["start"]