# n8n Docker Setup for Render.com with MCP Integration

This repository contains a Docker setup for running n8n version 1.89.2 on Render.com with MCP client and server capabilities.

## Files Included

- `Dockerfile`: Defines the Docker image for n8n 1.89.2 with MCP support
- `docker-compose.yml`: For local development and testing
- `render.yaml`: Configuration for deploying to Render.com
- `custom-nodes/`: Custom n8n node for MCP integration

## Deployment to Render.com

### Option 1: Using the Blueprint

1. Fork this repository to your GitHub account
2. Go to [Render.com](https://render.com) and create an account if you don't have one
3. Click on "New" and select "Blueprint"
4. Connect your GitHub account and select your forked repository
5. Render will automatically detect the `render.yaml` file and set up the service
6. Click "Apply" to deploy

### Option 2: Manual Setup

1. Go to [Render.com](https://render.com) and create an account if you don't have one
2. Click on "New" and select "Web Service"
3. Connect your GitHub account and select your repository
4. Use the following settings:
   - Environment: Docker
   - Name: n8n (or your preferred name)
   - Region: Choose the closest to your location
   - Branch: main (or your default branch)
   - Plan: Starter (or higher depending on your needs)
5. Under Advanced settings, add the following environment variables:
   - `NODE_ENV`: production
   - `N8N_ENCRYPTION_KEY`: Generate a secure random string
   - `N8N_PORT`: 5678
   - `DATABASE_TYPE`: sqlite
   - `DB_SQLITE_PATH`: /home/node/.n8n/database.sqlite
   - `WEBHOOK_URL`: This will be your Render URL once deployed (update after deployment)
   - `N8N_CUSTOM_EXTENSIONS`: /home/node/custom-nodes
6. Add a disk:
   - Mount Path: /home/node/.n8n
   - Size: 10 GB (or as needed)
7. Click "Create Web Service" to deploy

## Using MCP with n8n

This setup includes a custom node that allows you to run MCP client and server commands directly from n8n workflows.

### MCP Executor Node

Once deployed, you'll see a custom node called "MCP Executor" in your n8n instance. This node allows you to:
- Run MCP client commands
- Start MCP servers
- Execute any npx command

### Example Workflow

1. Create a new workflow in n8n
2. Add an MCP Executor node
3. Configure it with a command like `npx mcp-client` or `npx mcp-server`
4. Set appropriate working directory and timeout values
5. Connect it to triggers or other nodes in your workflow

### Available MCP Commands

You can use any MCP command in the executor node, including:
- `npx mcp-client --help`
- `npx mcp-server start`
- `npx mcp-server --version`

## Accessing n8n

Once deployed, you can access n8n at your Render URL. The first time you visit, you'll need to create an account.

## Persistent Data

Your workflows and credentials will be stored in the mounted volume, ensuring they persist between deployments.

## Important Security Notes

1. Always change the `N8N_ENCRYPTION_KEY` to a secure value
2. Set up proper authentication for your n8n instance
3. Consider setting up environment variables for sensitive credentials
4. Be cautious when executing MCP commands that might expose sensitive information

## Local Development

To run locally:

```bash
docker-compose up -d
```

Then access n8n at http://localhost:5678