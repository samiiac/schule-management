export const rolePermissionsMap = {
  ADMIN: [
    "enrollment:read:any",
    "enrollment:create:any",
    "enrollment:update:any",
    "enrollment:delete:any",
    "course:read:any",
    "course:create:any",
    "course:update:any",
    "course:delete:any",
    "department:read:any",
    "department:create:any",
    "department:update:any",
    "department:delete:any",
  ],
  STUDENT: [
    "enrollment:read:own",
    "enrollment:create:own",
    "enrollment:delete:own",
    "course:read:any",
    "department:read:any",
  ],
  INSTRUCTOR: [
    "enrollment:read:taught",
    "enrollment:update:taught",
    "course:read:any",
    "department:read:any",
    
  ],
  PARENT: [
    //  "enrollment:read:child"
    "course:read:any"
  ],
};


export const hasPermissions =  (role,reqPermission)=>{
    return rolePermissionsMap[role].includes(reqPermission);
}

//auth middlewares
//tests
//dockerization
//ci cd workflows