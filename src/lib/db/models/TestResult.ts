import mongoose, { Document, Model, Schema } from "mongoose";
import type { MBTIType, MBTIScores, TestAnswer } from "@/types";

export interface ITestResult extends Document {
  userId: mongoose.Types.ObjectId;
  type: MBTIType;
  scores: MBTIScores;
  answers: TestAnswer[];
  completedAt: Date;
  psychologistNotes?: string;
  recommendations?: string;
}

const TestResultSchema = new Schema<ITestResult>(
  {
    userId:             { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type:               { type: String, required: true },
    scores:             {
      E: Number, I: Number,
      S: Number, N: Number,
      T: Number, F: Number,
      J: Number, P: Number,
    },
    answers:            [{ questionId: String, dimension: String, value: Number }],
    completedAt:        { type: Date, default: Date.now },
    psychologistNotes:  { type: String, default: "" },
    recommendations:    { type: String, default: "" },
  },
  { timestamps: true }
);

export const TestResult: Model<ITestResult> =
  (mongoose.models.TestResult as Model<ITestResult>) ||
  mongoose.model<ITestResult>("TestResult", TestResultSchema);
