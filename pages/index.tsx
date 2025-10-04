import { ModeToggle } from "@/components/theme/ModeToggle";
import Head from "next/head";
import { useState, useEffect } from "react";

type Employee = {
  employeeId: number;
  name: string;
  loginTime: string;
};
type ActiveEmployee = {
  employeeId: number;
  name: string;
  loginTime: string;
};

export default function Home() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [activeEmployees, setActiveEmployees] = useState<ActiveEmployee[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  // Fetch active employees
  const fetchActive = async () => {
    const res = await fetch("/api/employee/active");
    if (res.ok) {
      setActiveEmployees(await res.json());
    }
  };

  useEffect(() => {
    fetchActive();
    const interval = setInterval(fetchActive, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });
    if (res.ok) {
      const data = await res.json();
      setEmployee(data);
      setName("");
      setPassword("");
      fetchActive();
    } else {
      const err = await res.json();
      setError(err.error || "Login failed");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    if (!employee) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId: employee.employeeId }),
    });
    if (res.ok) {
      setEmployee(null);
      fetchActive();
    } else {
      const err = await res.json();
      setError(err.error || "Logout failed");
    }
    setLoading(false);
  };

  // Register new employee
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");
    if (!registerName || !registerPassword) {
      setRegisterError("Name and password are required");
      return;
    }
    const res = await fetch("/api/employee/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: registerName, password: registerPassword }),
    });
    if (res.ok) {
      setRegisterSuccess("Employee created! You can now log in.");
      setRegisterName("");
      setRegisterPassword("");
    } else {
      const err = await res.json();
      setRegisterError(err.error || "Failed to create employee");
    }
  };

  return (
    <>
      <Head>
        <title>Employee Management System</title>
        <meta
          name="description"
          content="Employee login/logout and active timings"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col items-center justify-center bg-white caret-transparent dark:bg-black py-2">
        <ModeToggle />
        <h1 className="text-2xl font-bold mt-4 mb-2 text-black dark:text-white">
          Employee Management System
        </h1>

        {employee ? (
          <div className="mb-6 flex flex-col items-center">
            <p className="text-lg text-green-700 dark:text-green-400">
              Welcome, {employee.name}!
            </p>
            <button
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>
        ) : (
          <>
            <form
              onSubmit={handleLogin}
              className="mb-4 flex flex-col items-center"
            >
              <input
                className="mb-2 px-3 py-2 border rounded w-64"
                type="text"
                placeholder="Employee Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                className="mb-2 px-3 py-2 border rounded w-64"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              {error && <p className="text-red-600 mt-2">{error}</p>}
            </form>
            <button
              className="mb-4 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
              onClick={() => setShowRegister((v) => !v)}
            >
              {showRegister ? "Hide Register" : "Register New Employee"}
            </button>
            {showRegister && (
              <form
                onSubmit={handleRegister}
                className="mb-6 flex flex-col items-center border border-gray-300 dark:border-gray-700 rounded p-4 w-80 bg-white dark:bg-gray-900"
              >
                <input
                  className="mb-2 px-3 py-2 border rounded w-full"
                  type="text"
                  placeholder="New Employee Name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />
                <input
                  className="mb-2 px-3 py-2 border rounded w-full"
                  type="password"
                  placeholder="New Password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
                  type="submit"
                >
                  Register
                </button>
                {registerError && (
                  <p className="text-red-600 mt-2">{registerError}</p>
                )}
                {registerSuccess && (
                  <p className="text-green-600 mt-2">{registerSuccess}</p>
                )}
              </form>
            )}
          </>
        )}

        <div className="w-full max-w-md bg-gray-100 dark:bg-gray-800 rounded p-4">
          <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">
            Active Employees
          </h2>
          {activeEmployees.length === 0 ? (
            <p className="text-gray-500">No employees are currently active.</p>
          ) : (
            <ul>
              {activeEmployees.map((emp) => (
                <li
                  key={emp.employeeId}
                  className="mb-1 text-black dark:text-white"
                >
                  {emp.name} (Logged in at{" "}
                  {new Date(emp.loginTime).toLocaleTimeString()})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
