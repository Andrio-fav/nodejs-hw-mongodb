import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,   
    versionKey: false,
  },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.userId = obj._id;
  delete obj._id;
  delete obj.password;
  return obj;
};

const User = model('users', userSchema);
export default User;