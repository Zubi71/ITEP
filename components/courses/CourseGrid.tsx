"use client";

import Image from "next/image";
import { enrollInCourse } from "@/app/(app)/courses/actions";

type CourseCard = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  priceCents: number;
  currency: string;
  category: string | null;
  badge: string | null;
  rating: number;
  studentsCount: number;
  durationHours: number;
  owned: boolean;
};

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function StarRating({ rating }: { rating: number }) {
  const stars = [0, 1, 2, 3, 4].map((i) => {
    const filled = rating >= i + 1;
    const half = !filled && rating >= i + 0.5;
    return (
      <span
        key={i}
        className="material-symbols-outlined text-[16px]"
        style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
      >
        {half ? "star_half" : "star"}
      </span>
    );
  });
  return (
    <div className="flex items-center gap-xs mb-xs">
      <div className="flex text-warning">{stars}</div>
      <span className="font-label-sm text-label-sm text-on-surface-variant">({rating.toFixed(1)})</span>
    </div>
  );
}

export function CourseGrid({ courses }: { courses: CourseCard[] }) {
  return (
    <div
      className="grid gap-gutter"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}
    >
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col border border-outline-variant/30"
        >
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10" />
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {course.badge && (
              <div className="absolute top-3 left-3 z-20 bg-secondary px-2 py-1 rounded text-white font-label-sm text-[10px] uppercase tracking-wider">
                {course.badge}
              </div>
            )}
          </div>
          <div className="p-md flex-grow flex flex-col">
            <StarRating rating={course.rating} />
            <h3 className="font-headline-md text-body-lg font-bold text-primary mb-sm leading-tight group-hover:text-secondary transition-colors">
              {course.title}
            </h3>
            <div className="flex items-center gap-sm mt-auto pb-md border-b border-outline-variant/20">
              <div className="flex items-center gap-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">group</span>
                <span className="font-label-sm text-label-sm">
                  {course.studentsCount.toLocaleString()} Students
                </span>
              </div>
              <div className="flex items-center gap-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                <span className="font-label-sm text-label-sm">{course.durationHours} Hours</span>
              </div>
            </div>
            <div className="pt-md flex items-center justify-between">
              {course.owned ? (
                <>
                  <span className="inline-flex items-center gap-xs px-2.5 py-1 rounded-full text-xs font-bold bg-success/10 text-success uppercase">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Enrolled
                  </span>
                  <span className="text-on-surface-variant font-label-md text-label-md">Owned</span>
                </>
              ) : (
                <>
                  <span className="font-headline-md text-headline-md font-bold text-primary">
                    {formatPrice(course.priceCents, course.currency)}
                  </span>
                  <form action={enrollInCourse}>
                    <input type="hidden" name="courseId" value={course.id} />
                    <button
                      type="submit"
                      className="bg-surface-container-high text-primary px-4 py-2 rounded-lg font-label-md text-label-md font-bold group-hover:bg-primary group-hover:text-white transition-all"
                    >
                      Enroll Now
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Static placeholder card — not a real, purchasable course this milestone */}
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/30 flex flex-col">
        <div className="relative h-48 overflow-hidden bg-primary-container flex items-center justify-center p-md">
          <div className="text-center">
            <span className="material-symbols-outlined text-on-primary text-[48px] mb-sm block">
              auto_awesome
            </span>
            <p className="font-label-md text-label-md text-on-primary font-bold">Custom Study Plan</p>
            <p className="font-label-sm text-label-sm text-on-primary-container">Coming Soon</p>
          </div>
        </div>
        <div className="p-md flex-grow flex flex-col">
          <h3 className="font-headline-md text-body-lg font-bold text-primary mb-sm leading-tight">
            Personalized AI-Driven iTEP Exam Roadmap
          </h3>
          <div className="flex items-center gap-sm mt-auto pb-md border-b border-outline-variant/20">
            <div className="flex items-center gap-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              <span className="font-label-sm text-label-sm">Limited Access</span>
            </div>
          </div>
          <div className="pt-md flex items-center justify-between">
            <span className="font-headline-md text-headline-md font-bold text-on-surface-variant italic">
              In Development
            </span>
            <button
              type="button"
              disabled
              className="text-secondary font-bold font-label-md text-label-md border-b border-secondary opacity-60 cursor-not-allowed"
            >
              Join Waitlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
