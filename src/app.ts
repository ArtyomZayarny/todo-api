import express from 'express';
import { todoRouter } from './routes/todoRoutes.ts';

const app = express();

// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello World!');
// });

// Mountaining routing
app.use('/api/v1/todos', todoRouter);

export { app };
