import Request from "../../util/request";
import {LoginApiProps} from "./LoginApiProps";

export const LoginApi=(params:LoginApiProps)=>{
    return Request.POST("/admin/login/login",params);
}
export const getSystemNameApi=()=>{
    return Request.GET("/admin/login/getSystemName");
}
export const getCaptchaApi=()=>{
    return Request.GET("/admin/login/getCaptcha");
}