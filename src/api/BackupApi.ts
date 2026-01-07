import {httpBlob, httpGet, httpPost} from "../util/request";
import {DbBackUpListDto} from "../models/backup/dto";
import {PageInfoVo} from "../models/common";
import {DbBackupVo} from "../models/backup/vo";

/**
 * 备份数据库
 */
export const backUpDbApi=()=>{
    return httpGet<any>("/admin/backup/backUpDb");
}
/**
 * 根据备份记录ID恢复数据库
 */
export const restoreDbApi=(id:number)=>{
    return httpGet<any>("/admin/backup/restoreDb/"+id)
}
/**
 * 获取备份文件列表
 */
export const getBackDbListApi=(params:DbBackUpListDto)=>{
    return httpPost<PageInfoVo<DbBackupVo>>("/admin/backup/getList",params);
}
/**
 * 下载备份
 */
export const downloadApi=(id:number)=>{
    return httpBlob("/admin/backup/download/"+id,{});
}
/**
 * 删除备份
 */
export const removeBackUpFileApi=(id:number)=>{
    return httpGet<any>("/admin/backup/removeBackUpFile/"+id)
}

