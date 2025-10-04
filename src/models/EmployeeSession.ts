import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEmployee extends Document {
  name: string;
  password: string;
}

const EmployeeSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const Employee: Model<IEmployee> =
  mongoose.models.Employee ||
  mongoose.model<IEmployee>("Employee", EmployeeSchema);

export interface ISession extends Document {
  employeeId: mongoose.Types.ObjectId;
  loginTime: Date;
  logoutTime: Date | null;
}

const SessionSchema: Schema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  loginTime: { type: Date, required: true },
  logoutTime: { type: Date, default: null },
});

export const Session: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);
