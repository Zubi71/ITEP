import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCourse } from "../actions";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    notFound();
  }

  const boundUpdate = updateCourse.bind(null, course.id);

  return (
    <div className="p-margin-desktop flex flex-col gap-lg max-w-3xl mx-auto w-full">
      <div>
        <Link href="/admin/courses" className="font-label-sm text-label-sm text-primary hover:underline">
          ← Back to Course Management
        </Link>
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold mt-xs">Edit Course</h1>
      </div>

      <form action={boundUpdate} className="bg-white rounded-xl border border-outline-variant/30 shadow-sm p-lg flex flex-col gap-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">Title</label>
            <input name="title" defaultValue={course.title} required className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md" />
          </div>
          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">Category</label>
            <input name="category" defaultValue={course.category ?? ""} className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md" />
          </div>
        </div>

        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">Description</label>
          <textarea name="description" defaultValue={course.description} required rows={3} className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md" />
        </div>

        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">Thumbnail Image URL</label>
          <input name="thumbnailUrl" defaultValue={course.thumbnailUrl} required className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-sm">
          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">Price ($)</label>
            <input name="priceDollars" type="number" min={0} step={0.01} defaultValue={(course.priceCents / 100).toFixed(2)} required className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md" />
          </div>
          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">Hours</label>
            <input name="durationHours" type="number" min={0} defaultValue={course.durationHours} required className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md" />
          </div>
          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">Rating</label>
            <input name="rating" type="number" min={0} max={5} step={0.1} defaultValue={course.rating} className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md" />
          </div>
          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">Students Shown</label>
            <input name="studentsCount" type="number" min={0} defaultValue={course.studentsCount} className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md" />
          </div>
        </div>

        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">Badge (optional)</label>
          <input name="badge" defaultValue={course.badge ?? ""} placeholder="e.g. Most Popular" className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md" />
        </div>

        <div className="flex items-center gap-sm pt-sm">
          <button type="submit" className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-all">
            Save Changes
          </button>
          <Link href="/admin/courses" className="px-6 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant font-label-md text-label-md">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
