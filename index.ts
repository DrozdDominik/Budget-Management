import express from 'express';
import 'express-async-errors';
import { handleError } from "./utils/error";

const app = express();

app.use(handleError);

app.listen(3000,'127.0.0.1', () => console.log('server is running on port 3000'));
