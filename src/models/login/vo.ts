export interface GetSystemNameVo {
    /**
     * 系统名称
     */
    name: string;
    [property: string]: any;
}
export interface GetVerifyVo {
    /**
     * 图片base64
     */
    img: string;
    /**
     * 图片验证标识
     */
    uuid: string;
    [property: string]: any;
}
export interface AdminLoginVo {
    avatar: string;
    nickname: string;
    token: string;
    [property: string]: any;
}