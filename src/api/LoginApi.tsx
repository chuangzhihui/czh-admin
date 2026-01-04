

import {httpGet, httpPost} from "../util/request";
import {LoginDto} from "../types/models/login/dto";
import {AdminLoginVo, GetSystemNameVo, GetVerifyVo} from "../types/models/login/vo";

export const LoginApi=(params:LoginDto)=>{
    return httpPost<AdminLoginVo>("/admin/login/login",params)
}
export const getSystemNameApi=()=>{
    return httpGet<GetSystemNameVo>("/admin/login/getSystemName",{});
}
export const getCaptchaApi=()=>{
    return httpGet<GetVerifyVo>("/admin/login/getCaptcha",{});
}