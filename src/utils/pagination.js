import z from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(70).default(20),
});

export function getPagination(input) {
  return {
    take: input.limit,
    skip: (input.page - 1) * input.limit,
  };
}

export function getPaginationMeta(input, total) {
  return {
    page: input.page,
    limit: input.limit,
    total,
    remainingPages: Math.ceil(total / input.limit),
  };
}
