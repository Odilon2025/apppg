import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;
const COMMENTS_FILE = path.resolve(__dirname, 'data', 'comments.json');

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

function loadComments(): Comment[] {
  try {
    if (fs.existsSync(COMMENTS_FILE)) {
      const data = fs.readFileSync(COMMENTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading comments:', err);
  }
  return [
    {
      id: 2,
      author: 'Thiago',
      content: 'Muito importante que essas informações verdadeiras sejam apresentadas',
      createdAt: '2026-09-22 10:13:34',
    },
    {
      id: 1,
      author: 'Danilo Costa Leite',
      content: 'Muito bom! Parabéns!',
      createdAt: '2026-09-21 14:06:06',
    },
  ];
}

function saveComments(comments: Comment[]) {
  try {
    const dir = path.dirname(COMMENTS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving comments:', err);
  }
}

let commentsStore: Comment[] = loadComments();

async function startServer() {
  const app = express();
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // API endpoints
  app.get('/api/comments', (_req: Request, res: Response) => {
    res.json({ comments: commentsStore });
  });

  app.post('/api/comments', (req: Request, res: Response) => {
    const { author, content, website } = req.body || {};

    // Honeypot check
    if (website && String(website).trim().length > 0) {
      return res.status(400).json({ error: 'Envio inválido.' });
    }

    const trimmedAuthor = typeof author === 'string' ? author.trim() : '';
    const trimmedContent = typeof content === 'string' ? content.trim() : '';

    if (!trimmedAuthor || !trimmedContent) {
      return res.status(400).json({ error: 'Por favor, preencha o nome e o comentário.' });
    }

    if (trimmedAuthor.length > 60 || trimmedContent.length > 1000) {
      return res.status(400).json({ error: 'O comentário excede o limite máximo de caracteres.' });
    }

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const createdAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const newId = commentsStore.length > 0 ? Math.max(...commentsStore.map((c) => c.id)) + 1 : 1;
    const newComment: Comment = {
      id: newId,
      author: trimmedAuthor,
      content: trimmedContent,
      createdAt,
    };

    commentsStore = [newComment, ...commentsStore];
    saveComments(commentsStore);

    return res.status(201).json({ success: true, comment: newComment });
  });

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});
