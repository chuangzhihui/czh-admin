import {PageDto} from "../common";

/**
 * DbBackUpListDto
 */
export interface DbBackUpListDto extends PageDto{
    adminId?: number;
    etime?: string;
    stime?: string;
    [property: string]: any;
}