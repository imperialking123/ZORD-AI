import { model, Schema } from "mongoose";

const stateTokenSchema = new Schema(
  {
    token: String,
    stateCategory: {
      type: String,
      enum: ["google", "github"],
    },
    jwt: String,
  },
  { timestamps: true }
);

stateTokenSchema.index({ createdAT: 1 }, { expireAfterSeconds: 300 });

const StateToken = model("state token", stateTokenSchema);

export default StateToken;
