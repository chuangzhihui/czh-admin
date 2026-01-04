/**
 * AddRoleDto
 */
export interface AddRoleDto {
    describe: string;
    ids: string;
    roleName: string;
    [property: string]: any;
}

export interface EditRoleDto extends AddRoleDto {
    roleId:number;//角色ID
}