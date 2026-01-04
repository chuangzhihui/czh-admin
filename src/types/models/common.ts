export interface PageDto{
    page: number;//当前页
    size: number;//每页展示条数
    orderBy?:string;//排序字段
}
export interface PageInfoVo<T>{
    list: T[];//数据列表
    total: number;//总条数
}
export interface SelectVo {
    label?: string;
    value?: number;
    [property: string]: any;
}