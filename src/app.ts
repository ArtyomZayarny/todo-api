import express from 'express';
import { todoRouter } from './routes/todoRoutes.ts';

const app = express();

// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello World!');
// });
// Body parser, reading data from body
app.use(express.json());
// Mountaining routing
app.use('/api/v1/todos', todoRouter);

export { app };
