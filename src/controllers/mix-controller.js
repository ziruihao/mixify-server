import Mix from '../models/mix-model';
// import Track from '../models/track-model';
// import User from '../models/user-model';

/**
 * Creates a mix.
 * @param {*} req
 * @param {*} res
 */
export const createMix = (req, res) => {
  const mix = new Mix();
  mix.name = req.body.name;
  mix.collaboratorTokens = req.body.collaboratorTokens;
  mix.tracks = req.body.tracks;
  mix.save().then((result) => {
    res.json(result);
  }).catch((error) => {
    res.status(500).json({ error });
  });
};

/**
 * Returns all mixes.
 * @param {*} req
 * @param {*} res
 */
export const getMixes = (req, res) => {
  Mix.find().then((result) => {
    res.json(result);
  }).catch((error) => {
    res.status(404).json({ error });
  });
};

/**
 * Returns a mix.
 * @param {*} req
 * @param {*} res
 */
export const getMix = (req, res) => {
  Mix.findById(req.params.mixID).then((result) => {
    res.json(result);
  }).catch((error) => {
    res.status(404).json({ error });
  });
};

/**
 * Deletes a mix.
 * @param {*} req
 * @param {*} res
 */
export const deleteMix = (req, res) => {
  Mix.remove({ _id: req.params.mixID }).then((result) => {
    res.json(result);
  }).catch((error) => {
    res.status(500).json({ error });
  });
};

/**
 * Updates a mix.
 * @param {*} req
 * @param {*} res
 */
export const updateMix = (req, res) => {
  Mix.findById(req.params.mixID).then((mix) => {
    mix.name = (req.body.name === null ? mix.name : req.body.name);
    mix.collaboratorTokens = (req.body.collaboratorTokens === null ? mix.collaboratorTokens : req.body.collaboratorTokens);
    mix.tracks = (req.body.tracks === null ? mix.tracks : req.body.tracks);
    mix.save().then((result) => {
      res.json(result);
    }).catch((error) => {
      res.status(500).json({ error });
    });
  }).catch((error) => {
    res.status(404).json({ error });
  });
};


// /**
//  * Adds a collaborator to the mix.
//  * @param {*} req
//  * @param {*} res
//  */
// export const addUser = (req, res) => {
//   const user = req.body.user;
//   Mix.findById(req.params.mixID).then(mix => {
//     mix.users.push(user);
//     mix.save().then((result) => {
//       res.json(result);
//     }).catch(error => {
//       res.status(500).json({error});
//     });
//   }).catch(error => {
//       res.status(404).json({error});
//   })
// };

// /**
//  * Updates a collaborator to the mix.
//  * @param {*} req
//  * @param {*} res
//  */
// export const updateUser = (req, res) => {
//   const user = req.body.user;
//   Mix.findById(req.params.mixID).then(mix => {
//     mix.users.find(user => user.id === req.params.userID)
//     mix.save().then((result) => {
//       res.json(result);
//     }).catch(error => {
//       res.status(500).json({error});
//     });
//   }).catch(error => {
//       res.status(404).json({error});
//   })
// };

// /**
//  * Deletes a collaborator to the mix.
//  * @param {*} req
//  * @param {*} res
//  */
// export const deleteUser = (req, res) => {
//   Mix.findById(req.params.mixID).then(mix => {
//     mix.users = mix.users.filter(user => !(user.id === req.params.userID));
//     mix.save().then((result) => {
//       res.json(result);
//     }).catch(error => {
//       res.status(500).json({error});
//     });
//   }).catch(error => {
//       res.status(404).json({error});
//   })
// };

// /**
//  * Adds a track to the mix.
//  * @param {*} req
//  * @param {*} res
//  */
// export const addTrack = (req, res) => {
//   // const track = new Track();
//   // track = req.body.track;
//   // track.save();
//   const track = req.body.track;
//   Mix.findById(req.params.mixID).then(mix => {
//     mix.tracks.push(track);
//     mix.save().then((result) => {
//       res.json(result);
//     }).catch(error => {
//       res.status(500).json({error});
//     });
//   }).catch(error => {
//       res.status(404).json({error});
//   })
// };

// export const getTrack = (req, res) => {
//   Mix.findById(req.params.mixID).then(mix => {
//     const track = mix.tracks.find(track => track.id === req.params.trackID);
//     res.json(track);
//   }).catch(error => {
//     res.status(404).json({error});
//   });
// }

// /**
//  * Deletes a track to the mix.
//  * @param {*} req
//  * @param {*} res
//  */
// export const deleteTrack = (req, res) => {
//   Mix.findById(req.params.mixID).then(mix => {
//     mix.tracks = mix.tracks.filter(track => !(track.id === req.params.trackID));
//     mix.save().then((result) => {
//       res.json(result);
//     }).catch(error => {
//       res.status(500).json({error});
//     });
//   }).catch(error => {
//       res.status(404).json({error});
//   })
// };

// /**
//  * Returns all tracks.
//  * @param {*} req
//  * @param {*} res
//  */
// export const getTracks = (req, res) => {
//   Mix.findById(req.params.mixID).then(mix => {
//     res.json(mix.tracks);
//   }).catch((error) => {
//     res.status(404).json({ error });
//   });
// };