import {httpGet, httpPost} from "../util/request";
import {GetSettingListVo, GetUploadConfigVo, UploadFiles} from "../models/set/vo";
import {
    AddFileDto,
    AddSettingDto,
    AliOssDto,
    EditSettingDto, GetFileListDto,
    SaveLocalDto,
    SaveQiniuDto, SetAuthConfigDto,
    TosDto,
    TxCosDto
} from "../models/set/dto";
import {PageDto, PageInfoVo} from "../models/common";


/**
 * 获取上传配置
 */
export const getUploadConfigApi=()=>{
    return httpGet<GetUploadConfigVo>("/admin/setting/getUploadConfig",{});
}
/**
 * 保存为本地上传
 */
export const saveLocalApi=(params:SaveLocalDto)=>{
    return httpPost<any>("/admin/setting/saveLocal",params);
}
/**
 * 保存七牛云配置
 */
export const saveQiniuApi=(params:SaveQiniuDto)=>{
    return httpPost<any>("/admin/setting/saveQiniu",params);
}
/**
 * 保存阿里OSS配置
 */
export const saveAliossApi=(params:AliOssDto)=>{
    return httpPost<any>("/admin/setting/saveAlioss",params);
}
/**
 * 保存腾讯COS配置
 */
export const saveTxcosApi=(params:TxCosDto)=>{
    return httpPost<any>("/admin/setting/saveTxcos",params);
}
/**
 * 保存火山云配置
 */
export const saveTosApi=(params:TosDto)=>{
    return httpPost<any>("/admin/setting/saveTos",params);
}
/**
 * 获取火山云上传地址
 */
export const getTosSignUrlApi=(params:any)=>{
    return httpPost<any>("/admin/setting/getTosSignUrl",params);
}
/**
 * 添加系统配置
 */
export const addSettingApi=(params:AddSettingDto)=>{
    return httpPost<any>("/admin/setting/addSetting",params);
}
/**
 * 编辑系统配置
 */
export const editSettingApi=(params:EditSettingDto)=>{
    return httpPost<any>("/admin/setting/editSetting",params);
}
/**
 * 删除系统配置
 */
export const deleteSettingApi=(id:number)=>{
    return httpGet<any>("/admin/setting/delSetting/"+id,{})
}
/**
 * 系统设置列表
 */
export const settingListApi=(params:PageDto)=>{
    return httpPost<PageInfoVo<GetSettingListVo>>("/admin/setting/settingList",params);
}
/**
 * 获取上传token
 */
export const getUploadTokenApi=()=>{
    return httpGet<any>("/admin/setting/getUploadToken",{});
}
/**
 * 添加文件
 */
export const addFileApi=(params:AddFileDto)=>{
    return httpPost<any>("/admin/setting/addFile",params);
}
/**
 * 删除文件
 */
export const delFileApi=(id:number)=>{
    return httpGet<any>("/admin/setting/delFile/"+id,{})
}
/**
 * 获取文件列表
 */
export const getFileListApi=(params:GetFileListDto)=>{
    return httpPost<PageInfoVo<UploadFiles>>("/admin/setting/getFileList",params);
}
/**
 * 保存系统安全配置
 */
export const setAuthConfigApi=(params:SetAuthConfigDto)=>{
    return httpPost<any>("/admin/setting/setAuthConfig",params);
}
