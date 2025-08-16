import { model, Schema } from 'mongoose';

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users', 
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, 
    versionKey: false,
  },
);

sessionSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.sessionId = obj._id;
  delete obj._id;
  return obj;
};

const Session = model('sessions', sessionSchema);
export default Session;