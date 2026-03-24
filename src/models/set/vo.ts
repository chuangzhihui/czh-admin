import {getUploadTokenApi} from "../../api/SystemApi";

/**
 * GetUploadConfigVo
 */
export interface GetUploadConfigVo {
    alioss: AliOssEntity;//阿里OSS配置
    local: LocalUploadConfig;//本地配置
    qiniu: QiniuEntity;//七牛云配置
    tos: TosEntity;//火山云配置
    txcos: TxCosEntity;//腾讯云COS配置
    visible: number;//当前选中项 0未选用 1七牛 2阿里 3腾讯 4本地 5 火山云tos
    [property: string]: any;
}
/**
 * AliOssEntity
 */
export interface AliOssEntity {
    ak?: string;
    bucket?: string;
    domain?: string;
    endpoint?: string;
    sk?: string;
    [property: string]: any;
}

/**
 * LocalUploadConfig
 */
export interface LocalUploadConfig {
    /**
     * 访问域名
     */
    domain?: string;
    /**
     * 上传地址
     */
    host?: string;
    /**
     * 上传文件的基础目录 不要以斜线结尾
     */
    path?: string;
    [property: string]: any;
}

/**
 * QiniuEntity
 */
export interface QiniuEntity {
    /**
     * 七牛云AccessKey
     */
    accessKey?: string;
    /**
     * 空间名称
     */
    bucket?: string;
    /**
     * 自定义域名
     */
    domain?: string;
    /**
     * 节点地址
     */
    endpoint?: string;
    /**
     * 七牛云SecretKey
     */
    secretKey?: string;
    [property: string]: any;
}

/**
 * TosEntity
 */
export interface TosEntity {
    accessKey?: string;
    /**
     * 空间名称
     */
    bucket?: string;
    /**
     * 自定义域名
     */
    domain?: string;
    /**
     * 节点
     */
    endpoint?: string;
    /**
     * 地域
     */
    region?: string;
    secretKey?: string;
    [property: string]: any;
}

/**
 * TxCosEntity
 */
export interface TxCosEntity {
    ak?: string;
    bucket?: string;
    bucketName?: string;
    domain?: string;
    sk?: string;
    [property: string]: any;
}
export interface GetSettingListVo {
    canDel: number;
    id: number;
    title: string;
    type: number;
    value: string;
    [property: string]: any;
}
export interface GetUploadTokenVo{
    token: string;//上传token
    host:string;//上传地址
    type:number;//上传类型 1七牛 2阿里云 3腾讯云 4本地 5火山云
}
/**
 * 文件库(UploadFiles)表实体类
 *
 * UploadFiles
 */
export interface UploadFiles {
    atime: string;
    /**
     * 文件保存在哪里的 0虚拟文件夹 1七牛 2阿里oss 3腾讯cos
     */
    domain: number;
    /**
     * 图片或者视频高其它为0
     */
    fileHeight: number;
    /**
     * 文件大小kb
     */
    fileSize: number;
    /**
     * 图片或者视频宽其它为0
     */
    fileWidth: number;
    id: number;
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
     * 文件类型  1图片 2视频 3 Excel 4 word 5 pdf 6 zip 7 未知类型文件 8文件夹
     */
    type: number;
    /**
     * 文件地址
     */
    url: string;
    [property: string]: any;
}
