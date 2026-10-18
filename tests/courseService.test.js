import { describe, it, expect, vi, beforeEach } from "vitest";
import { courseRepository } from "../src/modules/course/repository";
import { courseService } from "../src/modules/course/service";


vi.mock("../src/modules/course/repository");

describe("courseService.update", () => {
  beforeEach(() => vi.clearAllMocks());

  it("throws when totalSeats is less than current enrollments", async () => {
    vi.mocked(courseRepository.getTotalEnrollments).mockResolvedValue(10);

    await expect(
      courseService.update("c1", { totalSeats: 5 })
    ).rejects.toThrow(/exceed/i);
  });

  it("updates when totalSeats is enough", async () => {
    vi.mocked(courseRepository.getTotalEnrollments).mockResolvedValue(5);
    vi.mocked(courseRepository.updateCourse).mockResolvedValue({
      id: "c1", totalSeats: 10,
    });

    const result = await courseService.update("c1", { totalSeats: 10 });

    expect(result).toEqual({ id: "c1", totalSeats: 10 });
    expect(courseRepository.updateCourse).toHaveBeenCalledWith("c1", { totalSeats: 10 });
  });
});