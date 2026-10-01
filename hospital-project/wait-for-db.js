// Waits until the DynamoDB endpoint accepts TCP connections.
// Skipped automatically when AWS_DYNAMODB_ENDPOINT is not set (real AWS).
const net = require("net");

const endpoint = process.env.AWS_DYNAMODB_ENDPOINT;

if (!endpoint) {
  process.exit(0);
}

const url = new URL(endpoint);
const host = url.hostname;
const port = Number(url.port) || (url.protocol === "https:" ? 443 : 80);
const maxAttempts = 60;

function tryConnect(attempt) {
  const socket = net.connect({ host, port }, () => {
    socket.end();
    console.log(`DynamoDB is reachable at ${host}:${port}`);
    process.exit(0);
  });

  socket.on("error", () => {
    socket.destroy();
    if (attempt >= maxAttempts) {
      console.error(`Could not reach DynamoDB at ${host}:${port} after ${maxAttempts} attempts.`);
      process.exit(1);
    }
    console.log(`Waiting for DynamoDB at ${host}:${port} (${attempt}/${maxAttempts})...`);
    setTimeout(() => tryConnect(attempt + 1), 1000);
  });
}

tryConnect(1);
