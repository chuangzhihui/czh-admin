export interface Role {
    atime: string;
    describe: string;
    ids: string;
    roleId: number;
    roleName: string;
    [property: string]: any;
}
export interface AddRoleGetMenusVo {
    child?: AddRoleGetMenusVo[];
    id: number;
    name: string;
    [property: string]: any;
}
