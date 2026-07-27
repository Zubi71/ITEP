import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AddCourseForm } from "@/components/admin/AddCourseForm";

function formatCents(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({ orderBy: { order: "asc" } });

  const completedByCourse = await prisma.purchase.groupBy({
    by: ["courseId"],
    where: { status: "COMPLETED" },
    _count: { _all: true },
    _sum: { amountCents: true },
  });
  const statsByCourse = new Map(
    completedByCourse.map((p) => [p.courseId, { enrollments: p._count._all, revenueCents: p._sum.amountCents ?? 0 }])
  );

  const totalRevenueCents = completedByCourse.reduce((sum, p) => sum + (p._sum.amountCents ?? 0), 0);
  const totalEnrollments = completedByCourse.reduce((sum, p) => sum + p._count._all, 0);

  return (
    <div className="p-margin-desktop flex flex-col gap-lg max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary font-bold">Course Management</h1>
          <p className="text-body-md text-on-surface-variant">
            Manage the course marketplace listings students see on /courses.
          </p>
        </div>
      </div>

      <AddCourseForm />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-body-sm text-on-surface-variant">Total Courses</p>
          <p className="text-3xl font-bold text-primary mt-xs">{courses.length}</p>
        </div>
        <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-body-sm text-on-surface-variant">Total Enrollments</p>
          <p className="text-3xl font-bold text-primary mt-xs">{totalEnrollments}</p>
        </div>
        <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-body-sm text-on-surface-variant">Total Revenue</p>
          <p className="text-3xl font-bold text-primary mt-xs">{formatCents(totalRevenueCents)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Course</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Price</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Enrollments</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Revenue</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {courses.map((c) => {
                const stats = statsByCourse.get(c.id) ?? { enrollments: 0, revenueCents: 0 };
                return (
                  <tr key={c.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-primary">{c.title}</div>
                      <div className="text-body-sm text-on-surface-variant">{c.category ?? "Uncategorized"}</div>
                    </td>
                    <td className="px-4 py-4 font-body-sm">{formatCents(c.priceCents)}</td>
                    <td className="px-4 py-4 font-body-sm">{stats.enrollments}</td>
                    <td className="px-4 py-4 font-body-sm">{formatCents(stats.revenueCents)}</td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/courses/${c.id}`}
                        className="px-3 py-1.5 rounded-lg border border-primary text-primary font-label-sm text-label-sm font-bold hover:bg-surface-container transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                    No courses yet.
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
