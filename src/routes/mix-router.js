import { Router } from 'express';
import * as Mix from '../controllers/mix-controller';

const mixRouter = Router();

mixRouter.route('/')
  .post(Mix.addMix)
  .get(Mix.getMixes);

  mixRouter.route('/:mixID')
  .put(Mix.updateMix)
  .get(Mix.getMix)
  .delete(Mix.deleteMix);

// mixRouter.route('/:mixID/users')
//   .post(Mix.addUser)
//   .get(Mix.getUsers);

// mixRouter.route('/:mixID/users/:userID')
//   .put(Mix.updateUser)
//   .get(Mix.getUser)
//   .delete(Mix.deleteUser);

//   mixRouter.route('/:mixID/tracks')
//   .post(Mix.addTrack)
//   .get(Mix.getTracks);

// mixRouter.route('/:mixID/tracks/:trackID')
//   .get(Mix.getTrack)
//   .delete(Mix.deleteTrack);

export default mixRouter;
