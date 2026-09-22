import { prisma } from "../../prisma/client";
import { getPagination } from "../../utils/pagination";

export const departmentRepository = {
  create: (name) => {
    return prisma.department.create({
      data: { name },
    });
  },
  list: (input) => {
    const where = {
      ...(input.search
        ? { name: { contains: input.search, mode: "insensitive" } }
        : {}),
    };

    return prisma.$transaction([
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
  },
  update: (id, name) => {
    return prisma.department.update({
      where: { id },
      data: {
        name,
      },
    });
  },
  delete: (id) => {
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
