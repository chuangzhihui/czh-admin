import {pageDtoProps} from "../CommonProps";

export interface editPwdApiProps{
    oldPwd:string;
    password:string;
}
export interface editAvatarApiProps{
    avatar:string;
    username:string;
}
export interface addAdminApiProps{
    userName:string;
    password?:string;
    roleId:number;
}
export interface editAdminApiProps extends addAdminApiProps{
    adminId:number;
}
export interface adminListApiProps extends pageDtoProps{
    /**
     * 用户名
     */
    username?:string;
    /**
     * 角色ID
     */
    roleId?:number;
}
export interface adminLogApiProps extends pageDtoProps{
    /**
     * 管理员ID
     */
    adminId?:number;
    /**
     * 操作地址
     */
    address?:string;
    /**
     * 操作IP
     */
    ip?:string;
    /**
     * 操作描述
     */
    desc?:string;
}