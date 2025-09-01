import Request from "../../util/request";

/**
 * 获取系统角色下拉列表
 */
export const getRoleSelectListApi=()=>{
    return Request.POST("/admin/common/getRoleSelectList",{});
}
/**
 * 获取所有管理员下拉
 */
export const getAdminSelectListApi=()=>{
    return Request.POST("/admin/common/getAdminSelectList",{});
}