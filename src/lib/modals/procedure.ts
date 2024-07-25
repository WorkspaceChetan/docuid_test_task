import { Schema, model, models } from "mongoose";
import User from "./user";
import Category from "./category";

const ProcedureSchema = new Schema({
  title: { type: String, required: true },
  priority: { type: Number },
  user: { type: Schema.Types.ObjectId, ref: User.modelName },
  category: [{ type: Schema.Types.ObjectId, ref: Category.modelName }],
  column: { type: String },
  dueDate: { type: Date },
  createAt: { type: Date, default: Date.now },
});

const Procedure = models.Procedure || model("Procedure", ProcedureSchema);

export default Procedure;
