import { message } from "antd";
import 'isomorphic-fetch'
export interface HttpResponse<T>{
    code:number;//状态码 1成功 0失败
    msg:string;//错误信息
    data:T;//数据包
}
type Method="POST" | "GET";

const API_URL=import.meta.env.VITE_API_URL;

export function httpPost<T>(url:string,data:any):Promise<HttpResponse<T>>{
    return httpRequest(url,data,"POST");
}
export function httpGet<T>(url:string,data:any={}):Promise<HttpResponse<T>>{
    return httpRequest(url,data,"GET");
}
export function httpBlob(url:string,data:any):Promise<HttpResponse<any> | Blob>{
    return requestBlob(url,data,"POST");
}
function httpRequest<T>(url:string,data:any,method:Method):Promise<HttpResponse<T>>{
    url=API_URL+url;
    if(method==="GET")
    {
        const query=new URLSearchParams(data);
        if(query.toString())
        {
            url+="?"+query.toString();
        }
    }
    return new Promise<HttpResponse<T>>((resolve)=>{
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json;',
                "Accept": "application/json",
                'token': localStorage.getItem('czhToken') || ""
            },
            body: method==="GET"?undefined:JSON.stringify(data),
        }).then((res) => {
            if (!res.ok) {
                // 服务器异常返回
                throw Error('接口请求异常');
            }
            res.json().then((data:HttpResponse<T>)=>{
                if (data.code === 401) {
                    if (localStorage.getItem('czhToken')) {
                        localStorage.removeItem('czhToken')
                    }
                    message.error(data.msg, 1, () => {
                        window.location.href = ''
                    })
                    return;
                }
                //没有操作权限
                if(data.code==888)
                {
                    message.error(data.msg);
                    data.code=0;
                }
                resolve(data);
            });
        }).catch((error) => {
            console.log(error);
            message.error("请求网络失败!");
            // let result:HttpResponse={
            //     code:0,
            //     msg:error.errMsg,
            //     data:[]
            // }
            // resolve(result)
        });
    })
}

const requestBlob= (url:string,data:any,method:Method) => {
    url=API_URL+url;
    return new Promise<HttpResponse<any> | Blob>((resolve,reject)=>{
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json;',
                "Accept": "application/json",
                'token': localStorage.getItem('czhToken') || ""
            },
            body: JSON.stringify(data),
        }).then((res) => {
            if (!res.ok) {
                // 服务器异常返回
                throw Error('接口请求异常');
            }
            const contentType = res.headers.get('Content-Type');
            if(contentType=="application/json")
            {
                res.json().then((data:HttpResponse<any>)=>{
                    if (data.code === 401) {
                        if (localStorage.getItem('czhToken')) {
                            localStorage.removeItem('czhToken')
                        }
                        message.error(data.msg, 1, () => {
                            window.location.href = ''
                        })
                        return;
                    }
                    //没有操作权限
                    if(data.code === 403)
                    {
                        message.error(data.msg);
                        data.code=0;
                    }
                    resolve(data);
                });
            }else{
                res.blob().then((data:Blob)=>{
                    resolve(data);
                })
            }
        })
            .catch((error) => {
                reject(error);
            });
    })
};