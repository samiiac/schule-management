import { getPaginationMeta } from "../../utils/pagination.js";
import { departmentRepository } from "./repository.js";

export const departmentService = {
  create: async (name) => {
    return await departmentRepository.create(name);
  },
  delete: async (id) => {
    return await departmentRepository.delete(id)
  },
  list: async (input) => {
    const [total, rows] = await departmentRepository.list(input);
    return { data: rows, meta: getPaginationMeta(input, total) };
  },
  update:async({id,name})=>{
    return await departmentRepository.update(id,name)
  },
  listDetails:async(id)=>{
    return await departmentRepository.getDepartmentDetails(id)
  }
};
