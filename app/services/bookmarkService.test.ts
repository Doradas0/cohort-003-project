import { describe, it, expect, beforeEach, vi } from "vitest";
import { createTestDb, seedBaseData } from "~/test/setup";
import * as schema from "~/db/schema";

let testDb: ReturnType<typeof createTestDb>;
let base: ReturnType<typeof seedBaseData>;
let lesson: { id: number };

vi.mock("~/db", () => ({
  get db() {
    return testDb;
  },
}));

import {
  toggleBookmark,
  isLessonBookmarked,
  getBookmarkedLessonIds,
} from "./bookmarkService";

describe("bookmarkService", () => {
  beforeEach(() => {
    testDb = createTestDb();
    base = seedBaseData(testDb);

    const mod = testDb
      .insert(schema.modules)
      .values({
        courseId: base.course.id,
        title: "Module 1",
        position: 1,
      })
      .returning()
      .get();

    lesson = testDb
      .insert(schema.lessons)
      .values({
        moduleId: mod.id,
        title: "Lesson 1",
        position: 1,
      })
      .returning()
      .get();
  });

  describe("toggleBookmark", () => {
    it("creates a bookmark when none exists", () => {
      const result = toggleBookmark({
        userId: base.user.id,
        lessonId: lesson.id,
      });

      expect(result).toEqual({ bookmarked: true });
      expect(
        isLessonBookmarked({ userId: base.user.id, lessonId: lesson.id })
      ).toBe(true);
    });

    it("removes a bookmark when one exists", () => {
      toggleBookmark({ userId: base.user.id, lessonId: lesson.id });

      const result = toggleBookmark({
        userId: base.user.id,
        lessonId: lesson.id,
      });

      expect(result).toEqual({ bookmarked: false });
      expect(
        isLessonBookmarked({ userId: base.user.id, lessonId: lesson.id })
      ).toBe(false);
    });
  });

  describe("isLessonBookmarked", () => {
    it("returns false when no bookmark exists", () => {
      expect(
        isLessonBookmarked({ userId: base.user.id, lessonId: lesson.id })
      ).toBe(false);
    });

    it("returns true when bookmark exists", () => {
      toggleBookmark({ userId: base.user.id, lessonId: lesson.id });

      expect(
        isLessonBookmarked({ userId: base.user.id, lessonId: lesson.id })
      ).toBe(true);
    });
  });

  describe("getBookmarkedLessonIds", () => {
    it("returns empty array when no bookmarks exist", () => {
      const ids = getBookmarkedLessonIds({
        userId: base.user.id,
        courseId: base.course.id,
      });

      expect(ids).toEqual([]);
    });

    it("returns bookmarked lesson ids for the course", () => {
      toggleBookmark({ userId: base.user.id, lessonId: lesson.id });

      const ids = getBookmarkedLessonIds({
        userId: base.user.id,
        courseId: base.course.id,
      });

      expect(ids).toEqual([lesson.id]);
    });

    it("does not return bookmarks from other courses", () => {
      const otherCourse = testDb
        .insert(schema.courses)
        .values({
          title: "Other Course",
          slug: "other-course",
          description: "Another course",
          instructorId: base.instructor.id,
          categoryId: base.category.id,
          status: schema.CourseStatus.Published,
        })
        .returning()
        .get();

      const otherMod = testDb
        .insert(schema.modules)
        .values({
          courseId: otherCourse.id,
          title: "Other Module",
          position: 1,
        })
        .returning()
        .get();

      const otherLesson = testDb
        .insert(schema.lessons)
        .values({
          moduleId: otherMod.id,
          title: "Other Lesson",
          position: 1,
        })
        .returning()
        .get();

      toggleBookmark({ userId: base.user.id, lessonId: otherLesson.id });

      const ids = getBookmarkedLessonIds({
        userId: base.user.id,
        courseId: base.course.id,
      });

      expect(ids).toEqual([]);
    });

    it("does not return bookmarks from other users", () => {
      const otherUser = testDb
        .insert(schema.users)
        .values({
          name: "Other User",
          email: "other@example.com",
          role: schema.UserRole.Student,
        })
        .returning()
        .get();

      toggleBookmark({ userId: otherUser.id, lessonId: lesson.id });

      const ids = getBookmarkedLessonIds({
        userId: base.user.id,
        courseId: base.course.id,
      });

      expect(ids).toEqual([]);
    });
  });
});
