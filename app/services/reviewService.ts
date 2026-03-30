import { eq, and, sql, inArray } from "drizzle-orm";
import { db } from "~/db";
import { reviews } from "~/db/schema";

// ─── Review Service ───
// Handles course star ratings: lookup, upsert, and average calculations.
// Uses positional parameters (project convention).

export function getReview(userId: number, courseId: number) {
  return db
    .select()
    .from(reviews)
    .where(and(eq(reviews.userId, userId), eq(reviews.courseId, courseId)))
    .get();
}

export function upsertReview(
  userId: number,
  courseId: number,
  rating: number
) {
  const existing = getReview(userId, courseId);
  if (existing) {
    return db
      .update(reviews)
      .set({ rating, updatedAt: new Date().toISOString() })
      .where(
        and(eq(reviews.userId, userId), eq(reviews.courseId, courseId))
      )
      .returning()
      .get();
  }
  return db
    .insert(reviews)
    .values({ userId, courseId, rating })
    .returning()
    .get();
}

export function getAverageRating(courseId: number) {
  const result = db
    .select({
      avg: sql<number>`avg(${reviews.rating})`,
      count: sql<number>`count(*)`,
    })
    .from(reviews)
    .where(eq(reviews.courseId, courseId))
    .get();

  return {
    average: result?.avg ? Math.round(result.avg * 10) / 10 : null,
    count: result?.count ?? 0,
  };
}

export function getAverageRatingsForCourses(courseIds: number[]) {
  const map = new Map<number, { average: number | null; count: number }>();
  if (courseIds.length === 0) return map;

  const results = db
    .select({
      courseId: reviews.courseId,
      avg: sql<number>`avg(${reviews.rating})`,
      count: sql<number>`count(*)`,
    })
    .from(reviews)
    .where(inArray(reviews.courseId, courseIds))
    .groupBy(reviews.courseId)
    .all();

  for (const row of results) {
    map.set(row.courseId, {
      average: row.avg ? Math.round(row.avg * 10) / 10 : null,
      count: row.count,
    });
  }
  return map;
}
