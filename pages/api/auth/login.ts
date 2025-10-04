import type { NextApiRequest, NextApiResponse } from "next/types";
import { dbConnect } from "../../../src/lib/mongodb";
import { Employee, Session } from "../../../src/models/EmployeeSession";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  await dbConnect();
  const { name, password } = req.body;
  const employee = await Employee.findOne({ name, password });
  if (!employee) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  // End any previous open session for this employee (optional, for single session)
  await Session.updateMany(
    { employeeId: employee._id, logoutTime: null },
    { $set: { logoutTime: new Date() } },
  );
  // Create new session
  const loginTime = new Date();
  await Session.create({
    employeeId: employee._id,
    loginTime,
    logoutTime: null,
  });
  res
    .status(200)
    .json({ employeeId: employee._id, name: employee.name, loginTime });
}
