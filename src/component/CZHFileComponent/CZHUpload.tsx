import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import {Upload, App, Modal, UploadProps} from 'antd';
import ImgCrop, {ImgCropProps} from 'antd-img-crop';
import COS from 'cos-js-sdk-v5';
import {getTosSignUrlApi, getUploadTokenApi} from "../../api/system/SystemApi";
import {HttpResponse} from "../../util/request";

let key = '';
interface fileReadResponse {
    width:number;
    height:number;
}
export interface CZHFileUploadResult {
    domain:number;//文件保存在哪里的 0虚拟文件夹 1七牛 2阿里oss 3腾讯cos 4本地服务器 5火山云
    type:number;//文件类型 1图片 2视频 3 Excel 4 word 5 pdf 6 zip 7 未知类型文件 8文件夹
    name:string;//文件名
    key:string;//上传到第三方的key或者本地真实路径
    url:string;//文件URL地址
    fileWidth:number;//图片或者视频宽其它为0
    fileHeight:number;//图片或者视频宽其它为0
    fileSize:number;//文件大小kb
    thumb?:string;//缩略图
}
interface CZHUploadProps extends  UploadProps  {
    dir:string;//上传目录 如 admin/file
    onPercent?:(percent:number) => void;//进度回调
    onOk?:(res:CZHFileUploadResult)=>void;
    onError?:(error:string) => void;//上传错误回调

    crop?:boolean;//是否需要裁剪
    cropProps?:ImgCropProps;//裁剪参数

}
export  const customerUpload=async (row:any)=> {
    console.log(row);
    if(row.data.uploadType===3)
    {
        return txUpload(row);
    }
    let action=row.action;
    if(row.data.uploadType===5)
    {
        const tosConfig=await getTosSignUrlApi({key:row.data.key});
        action=tosConfig.data.url;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    const file=row.file;
    xhr.open('POST',action, true);
    if(row.data.uploadType===5)
    {
        xhr.open('PUT',action, true);
        // 设置内容类型头
        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    }
    if(row.data.uploadType===4)
    {
        xhr.setRequestHeader('token', row.data.token);
    }
    for(let key in row.data)
    {
        formData.append(key,row.data[key]);
    }
    formData.append('file',file);
    // 进度事件
    xhr.upload.addEventListener('progress', (e)=> {
        if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            row.onProgress?.({ percentComplete });
        }
    }, false);
    // 上传完成
    xhr.onload = ()=> {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log('上传成功! 状态码: ' + xhr.status)
            let url=row.data.domain+ '/' + row.data.key;
            let thumb="";//文件缩略图
            if(row.data.uploadType===4)
            {
                //上传到本地
                console.log(xhr.responseText,"responseText");
                let response:HttpResponse=JSON.parse(xhr.responseText);
                if(response.code===200)
                {
                    url=response.data.url;
                    //本地上传
                    thumb=response.data.thumb;
                    row.data.key=response.data.key;
                }else{
                    return row.onError?.("上传失败:"+response.msg);
                }
            }

            if(row.data.type===1)
            {
                //图片
               switch(row.data.uploadType){
                   case 1:
                       //七牛云
                       thumb=url+"?imageView2/1/w/160/h/160/q/50";
                       break;
                   case 2:
                       //阿里云
                        thumb=url+"?x-oss-process=image/resize,h_160";
                       break;
                   case 3:
                       //腾讯云
                       thumb=url+"?imageMogr2/w/300/h/200";
                       break;
                   case 5:
                       thumb=url+"?imageMogr2/thumbnail/160x160";
                       break;
               }
               console.log(thumb,"thumb");
            }
            else if(row.data.type===2)
            {
                //视频
               if(row.data.uploadType===1)
               {
                   //七牛云
                   thumb=url+"?vframe/jpg/offset/1";
               }else if(row.data.uploadType===2)
               {
                   //阿里云
                   thumb=url+"?x-oss-process=video/snapshot,t_1,f_jpg";
               }else if(row.data.uploadType===3)
               {
                   //腾讯云
                   thumb=url+"?ci-process=snapshot&time=1&format=jpg";
               }else if(row.data.uploadType===5)
               {
                   //火山云
                    thumb=url+"?x-tos-process=video/snapshot,t_100";
               }
            }
            row.onSuccess?.({
                url,
                thumb,
                ...row.data
            })
        } else {
            console.log('上传失败! 状态码: ' + xhr.status)
            row.onError?.("上传失败")
        }
    };
    // 错误处理
    xhr.onerror = (err)=>{
        console.log(err);
        row.onError("上传失败")
    }
    // 发送文件
    xhr.send(row.data.uploadType===5?file:formData);
}
// 上传到腾讯os
const txUpload=(row:any)=> {
    var cos = new COS({
        getAuthorization: (options, callback) => {
            callback({
                TmpSecretId: row.data.TmpSecretId,
                TmpSecretKey: row.data.TmpSecretKey,
                SecurityToken: row.data.SecurityToken,
                StartTime: row.data.StartTime,
                ExpiredTime: row.data.ExpiredTime,
            });
        }
    });
    cos.putObject({
        Bucket: row.data.Bucket,
        Region: row.data.Region,
        Key: row.data.key,
        StorageClass: 'STANDARD',
        Body: row.file,
        onProgress: (progressData) => {
            row.onProgress({ percentComplete:progressData.percent * 100});
        }
    }, (err, data) => {
        if (err) {
            row.onError("上传失败")
        } else {
            let url=row.data.domain+ '/' + row.data.key;
            let thumb="";
            if(row.data.type===1){
                thumb=url+"?imageMogr2/thumbnail/160x160";
            }else if(row.data.type===2){
                //视频
                thumb=url+"?ci-process=snapshot&time=1&format=jpg";
            }
            row.onSuccess({
                url,
                thumb,
                ...row.data
            })
        }
    });
}
const CZHUpload = (props:CZHUploadProps, _ref:any) => {
    const [action, setAction] = useState('');  // 上传地址
    const [token, setToken] = useState('');  // 上传token
    const [type, setType] = useState(1);  // 上传方式  //1--七牛  2--阿里oss  3--腾讯  4--本地服务器
    const [fileList, setFileList] = useState(props.fileList || []);  // 上传文件
    const [configInfo, setConfig] = useState<any>({});
    const {dir="",crop=false}=props;
    useEffect(() => {
        initToken()
    }, [])
    const initToken=()=> {
        getUploadTokenApi().then(res => {
            if (res.code == 200) {
                let action;
                if (res.data.visible === 1) {  // 七牛
                    action = 'https://'+res.data.endpoint;
                } else if (res.data.visible === 2) {  //阿里oss
                    action = res.data.domain;
                } else if (res.data.visible === 3) {  //腾讯
                    action = res.data.path;
                } else if (res.data.visible === 4) {  // 本地服务器
                    action =res.data.uploadUrl;
                }
                setAction(action);
                setToken(res.data.token);
                setType(res.data.visible);
                setConfig(res.data);
            }
        })
    }
    // 获取上传文件类型
    const getFileType=(file:any):number=> {
        var type = 7, houz = '';
        var nameList = file.name && file.name.split('.');
        houz = nameList[nameList.length - 1];
        if (file.type == 'application/vnd.ms-excel' || file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || houz == 'xls' || houz == 'xlsx') {
            type = 3
        } else if (file.type == 'application/zip' || file.type == 'application/rar' || houz == 'rar' || houz == 'rar4') {
            type = 6;
        } else if (file.type == 'application/pdf') {
            type = 5;
        } else if (houz == 'doc' || houz == 'docx') {
            type = 4;
        } else if (file.type == 'video/mp4' || houz == 'avi' || houz == 'flv' || file.type == 'audio/mpeg' || houz == 'mp3') {
            type = 2;
        } else if (houz == 'jpg' || houz == 'jpeg' || houz == 'png' || houz == 'gif') {
            type = 1;
        }
        return type;
    }
    const readFile=(file:any)=> {
        return new Promise<fileReadResponse>((resolve:(res:fileReadResponse)=>void, reject:(reason:string)=>void) => {
            var reader = new FileReader();
            reader.onload = (event:any) => {
                const img:any= new Image();
                img.onload = (e:any) => {
                    resolve({
                        width:img.width,
                        height:img.height
                    });
                };

                img.onerror = (e:any) => {
                    resolve({
                        width:0,
                        height:0
                    });
                };
                // 将读取的文件数据设置为图片源
                img.src = event.target.result;
            };

            reader.onerror = () => {
                resolve({
                    width:0,
                    height:0
                });
            };

            // 读取文件内容
            reader.readAsDataURL(file);
        })

    }
    const readVideo=(file:any)=> {
        return new Promise<fileReadResponse>((resolve:(res:fileReadResponse)=>void, reject) => {
            const video = document.createElement('video');

            video.addEventListener('loadedmetadata', () => {
                // 获取宽高后释放URL对象
                URL.revokeObjectURL(video.src);
                resolve({
                    width: video.videoWidth,
                    height: video.videoHeight
                });
            });

            video.addEventListener('error', (err) => {
                URL.revokeObjectURL(video.src);
                resolve({
                    width: 0,
                    height:0
                });
            });

            // 创建本地文件的临时URL
            video.src = URL.createObjectURL(file);
            video.preload = 'metadata';
        });
    }
    const renderUpload=()=>{
        return(
            <Upload
                showUploadList={false}  //是否展示文件列表
                action={action}
                fileList={fileList}
                data={async (file) => {
                    let filetype = getFileType(file);
                    let width:number=0
                    let height:number=0;
                    if(filetype===1 || filetype===2)
                    {
                        let fileInfo:fileReadResponse={width:0,height:0};
                        if(filetype===1)
                        {
                            fileInfo=await readFile(file);
                        }else if(filetype===2)
                        {
                            fileInfo=await readVideo(file);
                        }
                        console.log(fileInfo);
                        width=fileInfo.width;
                        height=fileInfo.height;
                    }

                    let houzui = '.' + file.name.split('.')[file.name.split('.').length - 1];
                    key =(dir!==""? (dir+"/"):"")+Date.now() + Math.floor(Math.random() * (999999 - 100000) + 100000) + '1' + houzui;
                    let data:any = {};
                    data.name=file.name;
                    data.dir=props.dir || "";
                    data.key=key;
                    data.width=width;
                    data.height=height;
                    data.type=filetype;
                    data.uploadType=type;//上传方式
                    data.domain=configInfo.domain;
                    if (type === 1 || type===4) {  // 七牛和本地
                        data.token = token;
                    } else if (type === 2) {  // 阿里oss
                        data.policy=configInfo.policy;
                        data.OSSAccessKeyId=configInfo.OSSAccessKeyId;
                        data.signature=configInfo.signature;
                    }else if(type === 3) {
                        data.TmpSecretId=configInfo.TmpSecretId;
                        data.TmpSecretKey=configInfo.TmpSecretKey;
                        data.SecurityToken=configInfo.SecurityToken;
                        data.StartTime=configInfo.StartTime;
                        data.ExpiredTime=configInfo.ExpiredTime;
                        data.Bucket=configInfo.Bucket;
                        data.Region=configInfo.Region;
                    }

                    return data
                }}
                onChange={async (e) => {
                    console.log("onchange",e)
                    setFileList(e.fileList);
                    // 上传中
                    if (e.file.status == 'uploading') {
                        console.log('uploading',e);
                        props.onPercent?.(Number(e.file.percent))
                    }
                    //上传失败
                    if(e.file.status==="error") {
                        props.onError?.(e.file.error);
                    }
                    // 上传完成
                    if (e.file.status == 'done') {
                        console.log('done',e.file);
                        props.onOk?.({
                            domain:type,
                            type:e.file.response.type,
                            name:e.file.response.name,
                            key:e.file.response.key,
                            url:e.file.response.url,
                            fileWidth:e.file.response.width,
                            fileHeight:e.file.response.height,
                            fileSize:Number((Number(e.file.size) / 1024).toFixed(0)),
                            thumb:e.file.response.thumb
                        })
                        initToken();
                    }
                    return true;
                }}
                customRequest={customerUpload}
                {...props}
            ></Upload>
        );
    }
    return (
        <>
            {crop?
                <ImgCrop {...props.cropProps}>
                    {renderUpload()}
                </ImgCrop>
                :
                <>
                    {renderUpload()}
                </>
            }
        </>

    )
}
export default forwardRef(CZHUpload);
