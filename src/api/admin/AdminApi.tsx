import Request from "../../util/request";
import {
    addAdminApiProps,
    adminListApiProps,
    adminLogApiProps,
    editAdminApiProps,
    editPwdApiProps
} from "./AdminApiProps";

/**
 * 获取登录信息
 */
export const getLoginInfoApi=()=>{
    return Request.POST("/admin/admin/getLoginInfo",{});
}
/**
 * 退出登录
 */
export const logoutApi=()=>{
    return Request.POST("/admin/admin/loginOut",{});
}
/**
 * 获取密码规则
 */
export const getPwdRuleApi=()=>{
    return Request.POST("/admin/admin/getPwdRule",{});
}
/**
 * 修改密码
 */
export const editPwdApi=(params:editPwdApiProps)=>{
    return Request.POST("/admin/admin/editPwd",params);
}
/**
 * 修改头像和昵称
 */
export const editAvatarApi=(params:editPwdApiProps)=>{
    return Request.POST("/admin/admin/editAvatar",params);
}
/**
 * 添加管理员
 */
export const addAdminApi=(params:addAdminApiProps)=>{
    return Request.POST("/admin/admin/addAdmin",params);
}
/**
 * 修改管理员
 * @param params
 */
export const editAdminApi=(params:editAdminApiProps)=>{
    return Request.POST("/admin/admin/editAdmin",params);
}
/**
 * 删除管理员
 */
export const delAdminApi=(AdminId:number)=>{
    return Request.GET("/admin/admin/delAdmin/"+AdminId);
}
/**
 * 管理员列表
 */
export const adminListApi=(params:adminListApiProps)=>{
    return Request.POST("/admin/admin/adminList",params);
}
/**
 * 冻结解冻管理员
 */
export const changeAdminStatusApi=(adminId:number)=>{
    return Request.GET("/admin/admin/changeAdminStatus/"+adminId);
}
/**
 * 管理员操作日志
 */
export const adminLogApi=(params:adminLogApiProps)=>{
    return Request.POST("/admin/admin/adminLog",params);
}
