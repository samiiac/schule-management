import { describe, it, expect } from "vitest";
import { calculateGPA } from "../../src/utils/gpa";

const e = (grade, creditHours) => ({ grade, course: { creditHours } });

describe("calculateGPA", () => {
  it("returns the grade points for a single course", () => {
    expect(calculateGPA([e("A", 3)])).toBeCloseTo(3.7);
  });

  it("weights by credit hours", () => {
    expect(calculateGPA([e("A", 3), e("B", 3)])).toBeCloseTo(3.5);
  });

  it("ignores ungraded enrollments", () => {
    expect(calculateGPA([e("A", 3), e(null, 3)])).toBeCloseTo(3.7);
  });

  it("returns null when nothing is graded", () => {
    expect(calculateGPA([e(null, 3)])).toBeNull();
  });

  it("counts F as 0.0 but keeps its credits", () => {
    expect(calculateGPA([e("A", 3), e("F", 3)])).toBeCloseTo(1.85);
  });

  it("skips unknown grades", () => {
    expect(calculateGPA([e("A", 3), e("W", 3)])).toBeCloseTo(3.7);
  });
});
