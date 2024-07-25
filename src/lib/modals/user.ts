import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  userName: { type: String, required: true },
});

const User = models.User || model("User", UserSchema);

export default User;
