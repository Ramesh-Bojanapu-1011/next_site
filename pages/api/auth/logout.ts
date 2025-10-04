import type { NextApiRequest, NextApiResponse } from "next/types";
import { dbConnect } from "../../../src/lib/mongodb";
import { Session } from "../../../src/models/EmployeeSession";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  await dbConnect();
  const { employeeId } = req.body;
  if (!employeeId) {
    return res.status(400).json({ error: "employeeId required" });
  }
  const session = await Session.findOne({ employeeId, logoutTime: null });
  if (!session) {
    return res.status(400).json({ error: "No active session found" });
  }
  session.logoutTime = new Date();
  await session.save();
  res.status(200).json({ employeeId, logoutTime: session.logoutTime });
}
