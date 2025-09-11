/* eslint-disable no-console */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { NativeConnection, Worker } from '@temporalio/worker';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let worker: Worker | null = null;

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
});

// Graceful shutdown function
function gracefulShutdown(signal: string) {
  console.log(`Received ${signal}. Starting graceful shutdown...`);

  if (worker) {
    try {
      worker.shutdown();
      console.log('Worker shutdown complete.');
      process.exit(0);
    } catch (error) {
      console.error('Error during worker shutdown:', error);
      process.exit(1);
    }
  }
}

// Register signal handlers for graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

async function startup() {
  try {
    const workflowsPath = join(__dirname, 'workflows');
    console.log('Initializing Temporal worker with workflows at path:', workflowsPath);
    const connection = await NativeConnection.connect({
      address: `${process.env.TEMPORAL_SERVER_HOST ?? 'localhost'}:${process.env.TEMPORAL_SERVER_PORT ?? '7233'}`,
    });

    worker = await Worker.create({
      connection,
      taskQueue: 'main',
      workflowsPath,
      activities: {},
    });

    console.log('Starting worker');

    // Start worker
    await worker.run();
  } catch (error) {
    console.error('Startup failed:', error);
    process.exit(1);
  }
}

// Start the worker
void startup();
