import Request from "../../util/request";

/**
 * 获取上传配置
 */
export const getUploadConfigApi=()=>{
    return Request.GET("/admin/setting/getUploadConfig");
}
/**
 * 保存为本地上传
 */
export const saveLocalApi=(params:any)=>{
    return Request.POST("/admin/setting/saveLocal",params);
}
/**
 * 保存七牛云配置
 */
export const saveQiniuApi=(params:any)=>{
    return Request.POST("/admin/setting/saveQiniu",params);
}
/**
 * 保存阿里OSS配置
 */
export const saveAliossApi=(params:any)=>{
    return Request.POST("/admin/setting/saveAlioss",params);
}
/**
 * 保存腾讯COS配置
 */
export const saveTxcosApi=(params:any)=>{
    return Request.POST("/admin/setting/saveTxcos",params);
}
/**
 * 保存火山云配置
 */
export const saveTosApi=(params:any)=>{
    return Request.POST("/admin/setting/saveTos",params);
}
/**
 * 获取火山云上传地址
 */
export const getTosSignUrlApi=(params:any)=>{
    return Request.POST("/admin/setting/getTosSignUrl",params);
}
/**
 * 添加系统配置
 */
export const addSettingApi=(params:any)=>{
    return Request.POST("/admin/setting/addSetting",params);
}
/**
 * 编辑系统配置
 */
export const editSettingApi=(params:any)=>{
    return Request.POST("/admin/setting/editSetting",params);
}
/**
 * 删除系统配置
 */
export const deleteSettingApi=(id:number)=>{
    return Request.GET("/admin/setting/delSetting/"+id)
}
/**
 * 系统设置列表
 */
export const settingListApi=(params:any)=>{
    return Request.POST("/admin/setting/settingList",params);
}
/**
 * 获取上传token
 */
export const getUploadTokenApi=()=>{
    return Request.GET("/admin/setting/getUploadToken");
}
/**
 * 添加文件
 */
export const addFileApi=(params:any)=>{
    return Request.POST("/admin/setting/addFile",params);
}
/**
 * 删除文件
 */
export const delFileApi=(id:number)=>{
    return Request.GET("/admin/setting/delFile/"+id)
}
/**
 * 获取文件列表
 */
export const getFileListApi=(params:any)=>{
    return Request.POST("/admin/setting/getFileList",params);
}
/**
 * 保存系统安全配置
 */
export const setAuthConfigApi=(params:any)=>{
    return Request.POST("/admin/setting/setAuthConfig",params);
}
/**
 * 添加系统菜单
 */
export const addMenuApi=(params:any)=>{
    return Request.POST("/admin/menu/addMenu",params);
}
/**
 * 根据pid获取菜单列表
 */
export const getMenusByPidApi=(pid:number)=>{
    return Request.GET("/admin/menu/getMenusByPid/"+pid);
}
/**
 * 编辑菜单
 */
export const editMenuApi=(params:any)=>{
    return Request.POST("/admin/menu/editMenu",params);
}
/**
 * 根据菜单ID删除菜单
 */
export const delMenuApi=(id:number)=>{
    return Request.GET("/admin/menu/delMenu/"+id);
}
/**
 * 获取菜单列表
 */
export const menuListApi=(params:any)=>{
    return Request.POST("/admin/menu/menuList",params);
}

/**
 * 备份数据库
 */
export const backUpDbApi=()=>{
    return Request.GET("/admin/backup/backUpDb");
}
/**
 * 根据备份记录ID恢复数据库
 */
export const restoreDbApi=(id:number)=>{
    return Request.GET("/admin/backup/restoreDb/"+id)
}
/**
 * 获取备份文件列表
 */
export const getBackDbListApi=(params:any)=>{
    return Request.POST("/admin/backup/getList",params);
}
/**
 * 下载备份
 */
export const downloadApi=(id:number)=>{
    return Request.DowanLoad("/admin/backup/download/"+id,{});
}
/**
 * 删除备份
 */
export const removeBackUpFileApi=(id:number)=>{
    return Request.GET("/admin/backup/removeBackUpFile/"+id)
}

/**
 * 角色列表
 */
export const roleListApi=(params:any)=>{
    return Request.POST("/admin/role/roleList",params);
}
/**
 * 新增角色获取所有的菜单
 */
export const addRoleGetMenusApi=()=>{
    return Request.GET("/admin/role/addRoleGetMenus");
}
/**
 * 新增角色
 */
export const addRoleApi=(params:any)=>{
    return Request.POST("/admin/role/addRole",params);
}
/**
 * 编辑角色
 */
export const editRoleApi=(params:any)=>{
    return Request.POST("/admin/role/editRole",params);
}
/**
 * 删除角色
 */
export const delRoleApi=(id:number)=>{
    return Request.GET("/admin/role/delRole/"+id)
}