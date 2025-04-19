// MCP Executor Node for n8n
// This node allows executing MCP client and server commands through n8n

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

class McpExecutorNode {
  constructor() {
    this.id = 'mcpExecutor';
    this.name = 'MCP Executor';
    this.description = 'Execute MCP client and server commands';
    this.defaults = {
      name: 'MCP Executor',
    };
    this.inputs = ['main'];
    this.outputs = ['main'];
    this.properties = [
      {
        displayName: 'Command',
        name: 'command',
        type: 'string',
        default: '',
        placeholder: 'npx mcp-server',
        description: 'The MCP command to execute',
      },
      {
        displayName: 'Working Directory',
        name: 'workingDir',
        type: 'string',
        default: '/home/node',
        description: 'Directory to execute the command in',
      },
      {
        displayName: 'Timeout',
        name: 'timeout',
        type: 'number',
        default: 60000,
        description: 'Maximum execution time in milliseconds',
      },
    ];
  }

  async execute(this, items) {
    const returnData = [];
    
    for (let i = 0; i < items.length; i++) {
      const command = this.getNodeParameter('command', i);
      const workingDir = this.getNodeParameter('workingDir', i);
      const timeout = this.getNodeParameter('timeout', i);
      
      try {
        const options = {
          cwd: workingDir,
          timeout,
        };
        
        // Use the custom script to ensure npx works correctly
        const fullCommand = command.startsWith('npx ') 
          ? `run-npx ${command.substring(4)}` 
          : command;
        
        const { stdout, stderr } = await execAsync(fullCommand, options);
        
        returnData.push({
          json: {
            success: true,
            stdout,
            stderr,
            command,
          },
        });
      } catch (error) {
        returnData.push({
          json: {
            success: false,
            error: error.message,
            command,
          },
        });
      }
    }
    
    return [returnData];
  }
}

module.exports = { nodeType: McpExecutorNode };