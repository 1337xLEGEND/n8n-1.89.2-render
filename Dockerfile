FROM node:18-alpine

# Update and install required packages
RUN apk add --update graphicsmagick tzdata postgresql-client

# Set environment variables
ENV NODE_ENV=production
ENV N8N_VERSION=1.89.2
ENV DATABASE_TYPE=sqlite

# Install n8n and required packages
RUN npm install -g n8n@${N8N_VERSION}

# n8n port
EXPOSE 5678

# Set up the entrypoint
ENTRYPOINT ["n8n"]
CMD ["start"]