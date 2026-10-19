import {prisma} from "../../prisma/client.js";
import { getPagination } from "../../utils/pagination.js";

export const departmentRepository = {
  create: (name) => {
    return prisma.department.create({
      data: { name },
    });
  },
  list: async(input) => {
    const where = {
      ...(input.includeInActive ? {} : { isActive: true }),
      ...(input.search
        ? { name: { contains: input.search, mode: "insensitive" } }
        : {}),
    };

    const [total,rows] = await prisma.$transaction([
      prisma.department.count({ where }),
      prisma.department.findMany({
        where,
        ...getPagination(input),
        _count: {
          select: {
            instructors: true,
            courses: true,
            students: true,
          },
        },
      }),
    ]);
    return [total,rows]
  },
  update: (id, name) => {
    return prisma.department.update({
      where: { id },
      data: {
        name,
      },
    });
  },
  delete: async (id) => {
    const [instructors, students, courses] = await prisma.$transaction([
      prisma.instructorInfo.count({ where: { departmentId: id } }),
      prisma.studentInfo.count({ where: { departmentId: id } }),
      prisma.course.count({ where: { departmentId: id } }),
    ]);

    if (instructors > 0 || students > 0 || courses > 0) {
      return prisma.department.update({
        where: { id },
        data: {
          isActive: false,
        },
      });
    }
    return prisma.department.delete({ where: { id } });
  },
  getDepartmentDetails: (id) => {
    return prisma.department.findUnique({
      where: { id },
      include: {
        instructors: {
          select: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        courses: {
          select: {
            id: true,
            name: true,
            totalSeats: true,
            creditHours: true,
          },
        },
        students: {
          select: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });
  },
};
