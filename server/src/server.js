require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const app = require('./app');
const { connectDatabase } = require('./config/db');
const port = Number(process.env.PORT) || 5000;
let server;
async function start() {
  await connectDatabase();
  server = app.listen(port, () => console.log(`StyleHaven API running at http://localhost:${port}`));
}
async function shutdown(signal) {
  console.log(`${signal} received. Closing StyleHaven server...`);
  if (server) await new Promise((resolve) => server.close(resolve));
  await mongoose.connection.close();
  process.exit(0);
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (error) => { console.error(error); shutdown('unhandledRejection'); });
start().catch((error) => { console.error('Server failed to start:', error.message); process.exit(1); });
