import { getPagination } from "../../utils/pagination";

export const courseRepository = {
  create: (input) => {
    return prisma.course.create({
      data: {
        name: input.name,
        totalSeats: input.totalSeats,
        creaditHours: input.creaditHours,
        departmentId: input.departmentId,
        instructorId: input.instructorId,
      },
    });
  },
  list: (input) => {
    const where = {
      ...(input.includeInactive ? {} : { isActive: true }),
      ...(input.search
        ? { name: { contains: input.search, mode: "insensitive" } }
        : {}),
    };

    return prisma.$transaction([
      prisma.course.count({ where }),
      prisma.course.findMany({
        where,
        ...getPagination(input),
        _count: {
          select: {
            enrollments: true,
          },
        },
      }),
    ]);
  },

  getCourseDetails: (id) => {
    return prisma.course.findUnique({
      where: { id },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        instructor: {
          select: {
            user: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
      _count: {
        select: {
          enrollments: true,
        },
      },
    });
  },

  delete: async (id) => {
    const enrolled = await prisma.enrollments.count({
      where: { courseId: id },
    });
    if (enrolled > 0) {
      return prisma.course.update({ where: { id }, data: { isActive: false } });
    }
    return prisma.course.delete({ where: { id } });
  },
  updateCourse: (id, input) => {
    return prisma.course.update({ where: { id }, data: { input } });
  },
  getTotalEnrollments: (id) => {
    return prisma.enrollments.count({ where: { courseId: id } });
  },
  getCourseInfo: (tx,courseId) => {
    return tx.courses.findUnique({
      where: { courseId },
      select: { name: true, totalSeats: true, isActive: true },
    });
  },
   reserveSeat: (tx,courseId,totalSeats) => tx.course.updateMany({
      where: { id: courseId, enrolledCount: { lt: totalSeats } },
      data: { enrolledCount: { increment: 1 } },
    }),
   
};
