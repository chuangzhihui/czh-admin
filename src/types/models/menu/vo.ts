export interface GetMenusByPidVo {
    id: number;
    name: string;
    [property: string]: any;
}
export interface GetMenuListVo {
    child: GetMenuListVo[];
    display: number;
    icon: string;
    id: number;
    level: number;
    name: string;
    open: boolean;
    path?: string;
    pid: number;
    route?: string;
    sort: number;
    [property: string]: any;
}