import {AddMenuDto, EditMenuDto} from "../models/menu/dto";
import {httpGet, httpPost} from "../util/request";
import {GetMenuListVo, GetMenusByPidVo} from "../models/menu/vo";
import {PageDto, PageInfoVo} from "../models/common";

/**
 * 添加系统菜单
 */
export const addMenuApi=(params:AddMenuDto)=>{
    return httpPost<any>("/admin/menu/addMenu",params);
}
/**
 * 根据pid获取菜单列表
 */
export const getMenusByPidApi=(pid:number)=>{
    return httpGet<GetMenusByPidVo[]>("/admin/menu/getMenusByPid/"+pid,{});
}
/**
 * 编辑菜单
 */
export const editMenuApi=(params:EditMenuDto)=>{
    return httpPost<any>("/admin/menu/editMenu",params);
}
/**
 * 根据菜单ID删除菜单
 */
export const delMenuApi=(id:number)=>{
    return httpGet<any>("/admin/menu/delMenu/"+id);
}
/**
 * 获取菜单列表
 */
export const menuListApi=(params:PageDto)=>{
    return httpPost<PageInfoVo<GetMenuListVo>>("/admin/menu/menuList",params);
}

