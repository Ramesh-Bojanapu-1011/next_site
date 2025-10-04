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
  const activeSessions = await Session.find({ logoutTime: null }).populate(
    "employeeId",
  );
  const active = activeSessions.map((s) => {
    const emp = s.employeeId as unknown as { _id: string; name: string };
    return {
      employeeId: emp._id,
      name: emp.name,
      loginTime: s.loginTime,
    };
  });
  res.status(200).json(active);
}
