import { Schema, model, models } from "mongoose";

export type TransactionDocument = Document & {
  createdAt: Date;
  paymentId: string;
  amount: number;
  plan?: string;
  credits?: number;
  buyer: Schema.Types.ObjectId;
};

const TransactionSchema = new Schema<TransactionDocument>({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  paymentId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  plan: {
    type: String,
  },
  credits: {
    type: Number,
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Transaction =
  models?.Transaction || model("Transaction", TransactionSchema);

export default Transaction;
