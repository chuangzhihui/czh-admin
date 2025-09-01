export interface pageDtoProps{
    /**
     * 当前页码
     */
    page:number;
    /**
     * 每页显示条数
     */
    size:number;
    /**
     * 排序
     */
    orderBy?:string;
}