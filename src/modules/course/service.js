
import { getPaginationMeta } from "../../utils/pagination.js";
import { courseRepository } from "./repository.js";
import { badRequest } from "../../utils/appError.js";

async function validateInstructorInDept(id, departmentId) {
  if (id == null) {
    return;
  }

  const info = await prisma.instructorInfo.findFirst({
    where: { userId: id, departmentId },
    select: {
      userId: true,
    },
  });

  if (!info) {
    throw badRequest("Instructor not found in this department.");
  }
}
export const courseService = {
  create: async (input) => {
    await validateInstructorInDept(input.instructorId, input.departmentId);
    return courseRepository.create(input);
  },
  update: async (id, input) => {
    await validateInstructorInDept(input.instructorId, input.departmentId);
    if (input.totalSeats) {
      const enrolled = await courseRepository.getTotalEnrollments(id);
      if (input.totalSeats < enrolled) {
        throw badRequest("Enrollments already exceed total seats.");
      }
    }

    return courseRepository.updateCourse(id, input);
  },
  list: async (input) => {
    const [count, rows] = await courseRepository.list(input);
    return { data: rows, meta: getPaginationMeta(input, count) };
  },
  listDetails:(id)=>{
  return courseRepository.getCourseDetails(id)
  },
  delete:  (id) => {
    return courseRepository.delete(id);
  },
};
