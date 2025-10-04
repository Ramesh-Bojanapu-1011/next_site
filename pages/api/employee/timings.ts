import type { NextApiRequest, NextApiResponse } from "next/types";
import { dbConnect } from "../../../src/lib/mongodb";
import { Session } from "../../../src/models/EmployeeSession";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  await dbConnect();
  const { employeeId } = req.query;
  if (!employeeId) {
    return res.status(400).json({ error: "employeeId required" });
  }
  const timings = await Session.find({ employeeId }).sort({ loginTime: -1 });
  res.status(200).json(timings);
}
