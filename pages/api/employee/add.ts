import type { NextApiRequest, NextApiResponse } from "next/types";
import { dbConnect } from "../../../src/lib/mongodb";
import { Employee } from "../../../src/models/EmployeeSession";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect();
  if (req.method === "POST") {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ error: "Name and password are required" });
    }
    try {
      const existing = await Employee.findOne({ name });
      if (existing) {
        return res.status(409).json({ error: "Employee already exists" });
      }
      const employee = await Employee.create({ name, password });
      return res.status(201).json({ id: employee._id, name: employee.name });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create employee" });
    }
  } else if (req.method === "GET") {
    // List all employees (for admin/demo)
    const employees = await Employee.find({}, { name: 1 });
    return res.status(200).json(employees);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
