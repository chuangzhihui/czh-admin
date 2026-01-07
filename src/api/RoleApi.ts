import {PageDto, PageInfoVo} from "../models/common";
import {httpGet, httpPost} from "../util/request";
import {AddRoleGetMenusVo, Role} from "../models/role/vo";
import {AddRoleDto, EditRoleDto} from "../models/role/dto";

/**
 * 角色列表
 */
export const roleListApi=(params:PageDto)=>{
    return httpPost<PageInfoVo<Role>>("/admin/role/roleList",params);
}
/**
 * 新增角色获取所有的菜单
 */
export const addRoleGetMenusApi=()=>{
    return httpGet<AddRoleGetMenusVo[]>("/admin/role/addRoleGetMenus");
}
/**
 * 新增角色
 */
export const addRoleApi=(params:AddRoleDto)=>{
    return httpPost<any>("/admin/role/addRole",params);
}
/**
 * 编辑角色
 */
export const editRoleApi=(params:EditRoleDto)=>{
    return httpPost<any>("/admin/role/editRole",params);
}
/**
 * 删除角色
 */
export const delRoleApi=(id:number)=>{
    return httpGet<any>("/admin/role/delRole/"+id)
}