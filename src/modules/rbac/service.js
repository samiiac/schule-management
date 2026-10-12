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
    "deparment:read:any",
    "deparment:create:any",
  ],
  STUDENT: [
    "enrollment:read:own",
    "enrollment:create:own",
    "enrollment:delete:own",
    "course:read:any",
    "deparment:read:any",
  ],
  INSTRUCTOR: [
    "enrollment:read:taught",
    "enrollment:update:taught",
    "course:read:any",
    "deparment:read:any",
    
  ],
  PARENT: [
    //  "enrollment:read:child"
    "course:read:any"
  ],
};


export const hasPermissions =  (role,reqPermission)=>{
    return rolePermissionsMap[role].includes(reqPermission);
}