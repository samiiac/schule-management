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
        include: {
          instructors: {
            select: {
              userId: true,
              user: {
                select: {
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
            },
          },
        },
      }),
    ]);
  },
};
