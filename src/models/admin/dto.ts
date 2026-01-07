import {PageDto} from "../common";

export interface EditPwdDto {
    oldPwd: string;//旧密码
    password: string;//新密码
    [property: string]: any;
}
export interface EditAvatarDto {
    /**
     * 头像 头像和用户名不能同时为空
     */
    avatar?: string;
    /**
     * 用户名 头像和用户名不能同时为空
     */
    username?: string;
    [property: string]: any;
}
/**
 * AddAdminDto
 */
export interface AddAdminDto {
    password: string;
    roleId: number;
    userName: string;
    [property: string]: any;
}

/**
 * EditAdminDto
 */
export interface EditAdminDto {
    adminId: number;
    password?: string;
    roleId: number;
    userName: string;
    [property: string]: any;
}
/**
 * AdminListDto
 */
export interface AdminListDto extends PageDto {
    /**
     * 昵称
     */
    name?: string;
    /**
     * 角色ID
     */
    roleId?: number;
    [property: string]: any;
}

/**
 * AdminLogDto
 */
export interface AdminLogDto extends PageDto{
    /**
     * 操作地址
     */
    address?: string;
    /**
     * 管理员ID
     */
    adminId?: number;
    /**
     * 操作内容描述
     */
    desc?: string;
    /**
     * 操作结束时间-与开始时间成对出现
     */
    etime?: string;
    /**
     * 操作ID
     */
    ip?: string;
    /**
     * 操作开始时间
     */
    stime?: string;
    [property: string]: any;
}