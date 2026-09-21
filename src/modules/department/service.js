import { getPaginationMeta } from "../../utils/pagination";
import { departmentRepository } from "./repository";

export const departmentService = {
  create: async (name) => {
    return await departmentRepository.create(name);
  },
  delete: async (id) => {},
  list: async (input) => {
    cosnt[(total, rows)] = await departmentRepository.list(input);
    return { data: rows, meta: getPaginationMeta(input, total) };
  },
};
