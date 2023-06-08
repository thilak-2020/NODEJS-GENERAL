const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const express = require('express');

if (cluster.isMaster) {
  // Create a worker for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Restart the worker if it crashes
    cluster.fork();
  });
} else {
  // Worker process
  const app = express();

  // Define your routes and middleware
  app.get('/', (req, res) => {
    res.send('Hello, world!');
  });

  // Start the server
  const port = 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port} (Worker ${cluster.worker.id})`);
  });
}
