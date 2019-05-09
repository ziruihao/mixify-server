import mongoose, { Schema } from 'mongoose';

const MixSchema = new Schema({
  name: String,
  collaboratorTokens: ['Mixed'],
  /**
     * token: String,
     */
  tracks: ['Mixed'],
  /**
     * name: String,
     * id: String,
     * popularity: Number,
     * albumName: String,
     * artists: [String],
     * fromUser: Mixed,
     *    name: String,
     *    id: String,
     *    token: String,
     */
}, {
  toJSON: {
    virtuals: true,
  },
});

const MixModel = mongoose.model('Mix', MixSchema);

export default MixModel;