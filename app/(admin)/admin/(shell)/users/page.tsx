import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRoleStatusControls } from "@/components/admin/UserRoleStatusControls";
import { AddUserForm } from "@/components/admin/AddUserForm";

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: "bg-success/10 text-success",
  INACTIVE: "bg-error/10 text-error",
  PENDING: "bg-warning/10 text-warning",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; status?: string; q?: string }>;
}) {
  const { role, status, q } = await searchParams;
  const session = await auth();

  const where = {
    ...(role ? { role: role as "STUDENT" | "TEACHER" | "ADMIN" } : {}),
    ...(status ? { status: status as "ACTIVE" | "INACTIVE" | "PENDING" } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [users, totalUsers, activeUsers, studentCount, pendingCount] = await Promise.all([
    prisma.user.findMany({ where, orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.user.count(),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { status: "PENDING" } }),
  ]);

  const studentRatio = totalUsers > 0 ? (studentCount / totalUsers) * 100 : 0;

  return (
    <div className="p-margin-desktop flex flex-col gap-lg max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary font-bold">User Management</h1>
          <p className="text-body-md text-on-surface-variant">
            Manage and monitor student and staff access across the institution.
          </p>
        </div>
        <AddUserForm />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-body-sm text-on-surface-variant">Total Users</p>
          <p className="text-3xl font-bold text-primary mt-xs">{totalUsers}</p>
        </div>
        <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-body-sm text-on-surface-variant">Active Accounts</p>
          <p className="text-3xl font-bold text-primary mt-xs">{activeUsers}</p>
        </div>
        <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-body-sm text-on-surface-variant">Student Ratio</p>
          <p className="text-3xl font-bold text-primary mt-xs">{studentRatio.toFixed(0)}%</p>
        </div>
        <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-body-sm text-on-surface-variant">Pending Signups</p>
          <p className="text-3xl font-bold text-primary mt-xs">{pendingCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <form
          method="GET"
          className="p-md border-b border-outline-variant/30 flex flex-wrap items-center gap-sm"
        >
          <select name="role" defaultValue={role ?? ""} className="px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md">
            <option value="">All Roles</option>
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
            <option value="ADMIN">Admin</option>
          </select>
          <select name="status" defaultValue={status ?? ""} className="px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md">
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending</option>
          </select>
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search by name or email..."
            className="flex-1 min-w-[16rem] px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-surface-container-high rounded-lg font-label-md text-label-md font-bold"
          >
            Filter
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Name</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Joined</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Role / Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold">
                        {(u.name ?? u.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-primary">{u.name ?? "—"}</div>
                        <div className="text-body-sm text-on-surface-variant">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-body-sm text-on-surface-variant">
                    {u.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    <span
                      className={`ml-sm inline-block whitespace-nowrap px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${STATUS_BADGE[u.status]}`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <UserRoleStatusControls
                      userId={u.id}
                      userLabel={u.name ?? u.email}
                      role={u.role}
                      status={u.status}
                      isSelf={u.id === session?.user.id}
                    />
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-on-surface-variant">
                    No users match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
