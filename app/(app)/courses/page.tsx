import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CourseGrid } from "@/components/courses/CourseGrid";

export default async function CoursesPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [courses, completedPurchases] = await Promise.all([
    prisma.course.findMany({ orderBy: { order: "asc" } }),
    prisma.purchase.findMany({ where: { userId, status: "COMPLETED" } }),
  ]);

  const ownedCourseIds = new Set(completedPurchases.map((p) => p.courseId));

  const courseCards = courses.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    thumbnailUrl: course.thumbnailUrl,
    priceCents: course.priceCents,
    currency: course.currency,
    category: course.category,
    badge: course.badge,
    rating: course.rating,
    studentsCount: course.studentsCount,
    durationHours: course.durationHours,
    owned: ownedCourseIds.has(course.id),
  }));

  return (
    <div className="p-margin-desktop flex flex-col gap-lg max-w-[1200px] mx-auto w-full">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-xs">
            Professional Excellence
          </p>
          <h2 className="font-display-lg text-display-lg text-primary mb-xs">Premium Courses</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[32rem]">
            Master the iTEP exam with our curriculum developed by leading linguistic experts and academic
            examiners.
          </p>
        </div>
      </header>

      <CourseGrid courses={courseCards} />

      {/* Static promo banner — not a real, purchasable bundle this milestone */}
      <section className="bg-primary-container rounded-3xl p-lg overflow-hidden relative">
        <div className="relative z-10 grid md:grid-cols-2 gap-lg items-center">
          <div>
            <h2 className="font-display-lg text-white mb-md">
              Achieve your target score faster with iTEP Pro.
            </h2>
            <ul className="space-y-sm mb-lg">
              <li className="flex items-center gap-sm text-primary-fixed">
                <span className="material-symbols-outlined bg-primary-fixed/20 p-1 rounded-full text-[20px]">
                  check
                </span>
                <span className="font-body-md text-body-md">
                  Unlimited mock examinations with real-time feedback
                </span>
              </li>
              <li className="flex items-center gap-sm text-primary-fixed">
                <span className="material-symbols-outlined bg-primary-fixed/20 p-1 rounded-full text-[20px]">
                  check
                </span>
                <span className="font-body-md text-body-md">
                  One-on-one session with certified iTEP examiners
                </span>
              </li>
              <li className="flex items-center gap-sm text-primary-fixed">
                <span className="material-symbols-outlined bg-primary-fixed/20 p-1 rounded-full text-[20px]">
                  check
                </span>
                <span className="font-body-md text-body-md">
                  Comprehensive grammar and vocabulary database
                </span>
              </li>
            </ul>
            <button
              type="button"
              disabled
              title="Coming soon"
              className="bg-secondary text-on-primary px-8 py-4 rounded-xl font-bold font-label-md text-label-md opacity-60 cursor-not-allowed"
            >
              Upgrade to Pro Bundle — $299
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
