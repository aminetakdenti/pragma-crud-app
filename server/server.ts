import express, { json, urlencoded } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import expressAsyncHandler from 'express-async-handler';
import { createPostHandler, listPostHandler } from './handlers/postHandler';
import { initDb } from './dataStore';
import {
  getCurrentUser,
  getUser,
  signInHandler,
  singUpHandler,
  updateCurrentUser,
} from './handlers/userHandler';
import { requestLoggerMiddleware } from './middleware/loggerMiddleware';
import { errHandler } from './middleware/errorMiddlerware';
import { authMiddlerware } from './middleware/authMiddlerware';
import {
  createCommentHandler,
  deleteCommentHandler,
  listCommentHanlder,
} from './handlers/commentHandler';
import { createLikeHandler, deleteLikeHandler, likesPostHandler } from './handlers/likeHandler';

(async () => {
  await initDb();

  dotenv.config();

  const app = express();
  const PORT: number = Number(process.env.PORT) || 3000;

  // midelware before handling the request
  app.use(morgan('dev'));
  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use(requestLoggerMiddleware);

  // public endpoints
  app.get('/healthz', (_, res) => res.send({ status: '✌️' }));
  app.post('/v1/signup', expressAsyncHandler(singUpHandler));
  app.post('/v1/signin', expressAsyncHandler(signInHandler));
  app.get('/v1/getUser/:id', expressAsyncHandler(getUser));

  app.use(authMiddlerware);
  app.get('/v1/getCurrentUser', expressAsyncHandler(getCurrentUser));
  app.post('/v1/updateCurrentUser', expressAsyncHandler(updateCurrentUser));

  // protected endpoints
  // post
  app.get('/v1/posts', expressAsyncHandler(listPostHandler));
  app.post('/v1/posts', expressAsyncHandler(createPostHandler));

  //comment
  app.get('/v1/comments/:postId', expressAsyncHandler(listCommentHanlder));
  app.post('/v1/comments', expressAsyncHandler(createCommentHandler));
  app.delete('/v1/comments/:id', expressAsyncHandler(deleteCommentHandler));

  // like
  app.get('/v1/likes/:postId', expressAsyncHandler(likesPostHandler));
  app.post('/v1/likes', expressAsyncHandler(createLikeHandler));
  app.delete('/v1/likes/:postId', expressAsyncHandler(deleteLikeHandler));

  // midelware after handling the request
  app.use(errHandler);

  app.listen(PORT, () => console.log(`app is running in port ${PORT}`));
})();
