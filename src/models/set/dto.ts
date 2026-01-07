import {AliOssEntity, LocalUploadConfig, QiniuEntity, TosEntity, TxCosEntity} from "./vo";
import {PageDto} from "../common";

export interface SaveLocalDto extends LocalUploadConfig{
    visible:number;
}
export interface SaveQiniuDto extends  QiniuEntity{
    visible:number;
}
/**
 * AliOssDto
 */
export interface AliOssDto  extends AliOssEntity{
    visible: number;
}
export interface TxCosDto extends TxCosEntity{
    visible: number;
}
export interface TosDto extends TosEntity{
    visible: number;
}

/**
 * AddSetting
 */
export interface AddSettingDto {
    /**
     * 是否允许删除这个配置
     */
    canDel?: number;
    title: string;
    /**
     * 1 文本 2数字  3图片  4图文
     */
    type: number;
    value: string;
    [property: string]: any;
}
/**
 * EditSettingDto
 */
export interface EditSettingDto {
    id: number;
    title: string;
    /**
     * 1 文本 2数字  3图片  4图文
     */
    type: number;
    value: string;
    [property: string]: any;
}

/**
 * AddFileDto
 */
export interface AddFileDto {
    /**
     * 文件保存在哪里的 0虚拟文件夹 1七牛 2阿里oss 3腾讯cos 4本地 5火山云
     */
    domain: number;
    /**
     * 图片或者视频高其它为0
     */
    fileHeight?: number;
    /**
     * 文件大小kb
     */
    fileSize?: number;
    /**
     * 图片或者视频宽其它为0
     */
    fileWidth?: number;
    /**
     * 上传到第三方的key
     */
    key: string;
    /**
     * 文件名称
     */
    name: string;
    /**
     * 上级目录ID 顶级目录为0
     */
    pid: number;
    /**
     * 图片的缩略图或者视频的封面图
     */
    thumb?: string;
    /**
     * 文件类型 8文件夹 1图片 2视频 3 Excel 4 word 5 pdf 6 zip 7 未知类型文件
     */
    type: number;
    /**
     * 文件地址
     */
    url: string;
    [property: string]: any;
}

/**
 * GetFileListDto
 */
export interface GetFileListDto extends PageDto{
    name?: string;
    pid?: number;
    /**
     * 查询哪些文件多个逗号隔开
     */
    types?: string;
    [property: string]: any;
}

/**
 * SetAuthConfigDto
 */
export interface SetAuthConfigDto {
    /**
     * 是否开启自动备份 0不开启 1开启
     */
    autoBackup: number;
    /**
     * 备份数据得cron表达式
     */
    bakupDbCron: string;
    /**
     * 连续密码错误次数后冻结账号
     */
    failNum: number;
    /**
     * 清除密码错误记录的时间(秒)
     */
    failNumTime: number;
    /**
     * 密码多少天后必须强制更换
     */
    passMax: number;
    /**
     * 多少天开始提示用户修改密码
     */
    passWran: number;
    /**
     * 密码正则
     */
    pwdReg: string;
    /**
     * 密码正则描述
     */
    pwdRegDesc: string;
    /**
     * 静默多久后登录失效(秒)
     */
    timeOut: number;
    [property: string]: any;
}