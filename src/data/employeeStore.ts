// Simple in-memory data store for demo purposes
export interface Employee {
  id: number;
  name: string;
  password: string;
}

export interface Session {
  employeeId: number;
  loginTime: Date;
  logoutTime: Date | null;
}

export const employees: Employee[] = [
  { id: 1, name: "Alice", password: "password1" },
  { id: 2, name: "Bob", password: "password2" },
];

export const sessions: Session[] = [];

export function findEmployee(
  name: string,
  password: string,
): Employee | undefined {
  return employees.find((e) => e.name === name && e.password === password);
}

export function loginEmployee(employeeId: number): Date {
  const now = new Date();
  sessions.push({ employeeId, loginTime: now, logoutTime: null });
  return now;
}

export function logoutEmployee(employeeId: number): Date | null {
  const now = new Date();
  const session = sessions.find(
    (s) => s.employeeId === employeeId && s.logoutTime === null,
  );
  if (session) {
    session.logoutTime = now;
    return now;
  }
  return null;
}

export function getActiveEmployees(): {
  employeeId: number;
  loginTime: Date;
  name: string;
}[] {
  return sessions
    .filter((s) => s.logoutTime === null)
    .map((s) => ({
      employeeId: s.employeeId,
      loginTime: s.loginTime,
      name: employees.find((e) => e.id === s.employeeId)?.name || "Unknown",
    }));
}

export function getEmployeeTimings(employeeId: number): Session[] {
  return sessions.filter((s) => s.employeeId === employeeId);
}
