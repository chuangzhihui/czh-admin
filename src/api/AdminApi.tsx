import {httpGet, httpPost} from "../util/request";
import {AdminActionLog, AdminListVo, AuthConfig, GetLoginInfoVo} from "../types/models/admin/vo";
import {
    AddAdminDto,
    AdminListDto,
    AdminLogDto,
    EditAdminDto,
    EditAvatarDto,
    EditPwdDto
} from "../types/models/admin/dto";
import {PageInfoVo} from "../types/models/common";


/**
 * 获取登录信息
 */
export const getLoginInfoApi=()=>{
    return httpPost<GetLoginInfoVo>("/admin/admin/getLoginInfo",{});
}
/**
 * 退出登录
 */
export const logoutApi=()=>{
    return httpPost<any>("/admin/admin/loginOut",{});
}
/**
 * 获取密码规则
 */
export const getPwdRuleApi=()=>{
    return httpPost<AuthConfig>("/admin/admin/getPwdRule",{});
}
/**
 * 修改密码
 */
export const editPwdApi=(params:EditPwdDto)=>{
    return httpPost<any>("/admin/admin/editPwd",params);
}
/**
 * 修改头像和昵称
 */
export const editAvatarApi=(params:EditAvatarDto)=>{
    return httpPost<any>("/admin/admin/editAvatar",params);
}
/**
 * 添加管理员
 */
export const addAdminApi=(params:AddAdminDto)=>{
    return httpPost<any>("/admin/admin/addAdmin",params);
}
/**
 * 修改管理员
 * @param params
 */
export const editAdminApi=(params:EditAdminDto)=>{
    return httpPost<any>("/admin/admin/editAdmin",params);
}
/**
 * 删除管理员
 */
export const delAdminApi=(AdminId:number)=>{
    return httpGet<any>("/admin/admin/delAdmin/"+AdminId,{});
}
/**
 * 管理员列表
 */
export const adminListApi=(params:AdminListDto)=>{
    return httpPost<PageInfoVo<AdminListVo>>("/admin/admin/adminList",params);
}
/**
 * 冻结解冻管理员
 */
export const changeAdminStatusApi=(adminId:number)=>{
    return httpGet<any>("/admin/admin/changeAdminStatus/"+adminId,{});
}
/**
 * 管理员操作日志
 */
export const adminLogApi=(params:AdminLogDto)=>{
    return httpPost<PageInfoVo<AdminActionLog>>("/admin/admin/adminLog",params);
}
