
export interface GetLoginInfoVo {
    /**
     * 头像
     */
    avatar: string;
    /**
     * 修改密码提示
     */
    changePwdTip: string;
    /**
     * 修改密码提示 0不提示 1警告提示 2强制修改
     */
    changePwdType: number;
    /**
     * 权限菜单
     */
    menus: AuthMenuVo[];
    /**
     * 系统名称
     */
    name: string;
    /**
     * 昵称
     */
    username: string;
    [property: string]: any;
}
export interface AuthMenuVo {
    child?: AuthMenuVo[];
    icon?: string;
    id?: number;
    path?: string;
    title?: string;
    [property: string]: any;
}
export interface AuthConfig {
    /**
     * 上次编辑时间
     */
    atime?: string;
    /**
     * 是否开启自动备份
     */
    autoBackup?: number;
    /**
     * 备份数据得cron表达式
     */
    bakupDbCron?: string;
    /**
     * 连续密码错误次数后冻结账号
     */
    failNum?: number;
    /**
     * 清楚密码错误记录的时间(秒)
     */
    failNumTime?: number;
    id?: number;
    /**
     * 密码多少天后必须强制更换
     */
    passMax?: number;
    /**
     * 多少天开始提示用户修改密码
     */
    passWran?: number;
    /**
     * 密码正则
     */
    pwdReg?: string;
    /**
     * 密码正则描述
     */
    pwdRegDesc?: string;
    /**
     * 静默多久后登录失效(秒)
     */
    timeOut?: number;
    [property: string]: any;
}

export interface AdminListVo {
    adminId: number;
    atime: string;
    /**
     * 上次修改密码的时间
     */
    lastChangePwdTime: string;
    lastLoginIp: string;
    lastLoginTime: string;
    /**
     * 上次登录失败的IP
     */
    lastTryLoginIp: string;
    /**
     * 上次登录失败的时间
     */
    lastTryLoginTime: string;
    roleId: number;
    roleName: string;
    /**
     * 是否冻结
     */
    status: number;
    userName: string;//用户名
    [property: string]: any;
}

export interface AdminActionLog {
    /**
     * 返回值
     */
    bake: string;
    /**
     * 操作时间
     */
    createTime: string;
    id: string;
    /**
     * 操作ip
     */
    ip: string;
    /**
     * 操作地址
     */
    method: string;
    /**
     * 操作名称
     */
    operation: string;
    /**
     * 请求数据
     */
    params: string;
    /**
     * 用户id
     */
    userID: number;
    /**
     * 操作用户
     */
    userName: string;
    [property: string]: any;
}