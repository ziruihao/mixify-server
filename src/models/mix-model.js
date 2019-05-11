import mongoose, { Schema } from 'mongoose';

const MixSchema = new Schema({
  name: String,
  owner: {},
  collaborators: [{}],
  /**
     * name: String,
     * id: String,
     * token: String
     * topTracks: [{
     *  name: String,
     *  id: String,
     *  uri: String,
     *  popularity: Number,
     *  albumName: String,
     *  artistNames: String.
     * }],
     */
  tracks: [{}],
  /**
     * name: String,
     * id: String,
     * popularity: Number,
     * albumName: String,
     * artistNames: [String],
     * fromUser: Mixed,
     *    name: String,
     *    id: String,
     *    token: String,
     */
  spotifyPlaylistID: String,
}, {
  toJSON: {
    virtuals: true,
  },
});

const MixModel = mongoose.model('Mix', MixSchema);

export default MixModel;