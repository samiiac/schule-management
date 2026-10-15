export function calculateGPA(enrollments) {
  const gradeMap = {
    "A+": 4.0,
    A: 3.7,
    B: 3.3,
    C: 2.3,
    D: 1.0,
    F: 0.0,
  };
  let totalCredit = 0;
  let sumGrade = 0;
  for (let en of enrollments) {
    const g = gradeMap[en.grade];
    if (g == undefined) {
      continue;
    }
    sumGrade += g * en.course.creditHours;
    totalCredit += en.course.creditHours;
  }

  return totalCredit > 0 ? sumGrade / totalCredit : null;
}
