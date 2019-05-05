import { Router } from 'express';
import * as Mix from '../controllers/mix-controller';

const mixRouter = Router();

mixRouter.get('/', (req, res) => {
  res.json({ message: 'welcome to our mix api!' });
});

mixRouter.route('/:mixID/users')
  .post(Mix.addUser)
  .get(Mix.getUsers);

mixRouter.route('/:mixID/users/:userID')
  .put(Mix.updateUser)
  .get(Mix.getUser)
  .delete(Mix.deleteUser);

  mixRouter.route('/:mixID/tracks')
  .post(Mix.addTrack)
  .get(Mix.getTracks);

mixRouter.route('/:mixID/tracks/:trackID')
  .get(Mix.getTrack)
  .delete(Mix.deleteTrack);

export default mixRouter;
