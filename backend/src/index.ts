import express from 'express';
import mongoose from 'mongoose';

const app = express();

const PORT = Number(process.env.PORT || 8000);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/octofit_db';

const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${PORT}`;

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'octofit-backend',
    baseUrl,
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`Backend listening at ${baseUrl}`);
      console.log(`MongoDB URI: ${MONGODB_URI}`);
    });
  } catch (error) {
    console.error('Failed to start backend:', error);
    process.exit(1);
  }
}

void startServer();
