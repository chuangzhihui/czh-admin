export interface DbBackupVo {
    /**
     * 备份人
     */
    adminId: number;
    adminName: string;
    /**
     * 备份时间
     */
    atime: string;
    /**
     * 备份文件名称
     */
    fileName: string;
    /**
     * 备份文件完整路径
     */
    filePath: string;
    /**
     * 文件大小
     */
    fileSize: number;
    id: number;
    [property: string]: any;
}
