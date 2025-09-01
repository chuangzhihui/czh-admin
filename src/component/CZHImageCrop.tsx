import React, {useState, forwardRef, useImperativeHandle, useEffect, useRef} from 'react';
import {Button, Input, Select, Pagination, Form, App, Checkbox, Tooltip, Image as ANTImage,} from 'antd';
import CZHModal from './CZHModal';
import Title from './CZHTitle'
import Cropper, {CropperProps} from 'react-easy-crop'
import {addFileApi, getUploadTokenApi} from "../api/system/SystemApi";
import {HttpResponse} from "../util/request";
import {customerUpload, CZHFileUploadResult} from "./CZHUpload";

export interface CZHImageCropProps{
    onOk?: (file:any) => void;
    image:string;//图片地址
    aspect:number;//裁剪比例
    onCropSuccess?: (fileUrl:string) => void;
}
const PREFIX = 'CZH';
const CZHImageCrop = (props:CZHImageCropProps, _ref:any) => {
    const cropRef: any = useRef(null);
    const {image} = props;
   const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1);
    const [progress, setProgress] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [imgSource, setImgSource] = useState('');
    // 暴露方法
    useImperativeHandle(_ref, () => ({
        setOpen,
    }))
    useEffect(() => {
        if (image) {
            getImageBolb(image)
        }
    }, [image]);
    const getImageBolb=(imgUrl:string) => {
        fetch(imgUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob(); // 将响应转换为Blob对象
            })
            .then(blob => {
                // 成功获取到Blob对象，可以在这里处理它，例如创建URL或者显示在<img>标签中
                console.log('Blob对象已成功创建:', blob);
                // 例如，创建一个URL来显示图片
                const imageUrl = URL.createObjectURL(blob);
                setImgSource(imageUrl);
            })
            .catch(error => {
                console.error('获取图片时发生错误:', error);
            });
    }
    // 关闭
    const onCancel = () => {
        setOpen(false);
    }
    const onCropComplete=((e:any,e1:any)=>{
        setCroppedAreaPixels(e1);
        console.log(e,e1,"onCropComplete")
    })
    const onOk=async ()=>{
        setLoading(true);
        const file:File=await  getCroppedFile();
        // return;
        //获取图片文件夹
        let arr=image.split("/");
        let dirArr=[];
        for(let i=3;i<arr.length-1;i++){
            dirArr.push(arr[i]);
        }
        console.log(dirArr);
        let dirName=arr.length>0?dirArr.join("/"):"";
        console.log(dirName)
        let houzui = '.' + file.name.split('.')[file.name.split('.').length - 1];
        let key =(dirName!==""? (dirName+"/"):"")+Date.now() + Math.floor(Math.random() * (999999 - 100000) + 100000) + '1' + houzui;
        //获取上传配置
        const res:HttpResponse=await getUploadTokenApi();
        let action="";
        if (res.data.visible === 1) {  // 七牛
            action = 'https://'+res.data.endpoint;
        } else if (res.data.visible === 2) {  //阿里oss
            action = res.data.domain;
        } else if (res.data.visible === 3) {  //腾讯
            action = res.data.path;
        } else if (res.data.visible === 4) {  // 本地服务器
            action =res.data.uploadUrl;
        }
        const data={
            action:action,
            type:1,//图片
            key:key,
            width:croppedAreaPixels.width, // 绘制到Canvas的宽度
            height:croppedAreaPixels.height, // 绘制到Canvas的高度
            uploadType:res.data.visible,
            name:file.name,
            ...res.data
        }
        const row={
            file,data,
            onSuccess:(uploadResult:CZHFileUploadResult)=>{
                console.log(uploadResult,"上传结果")
                uploadResult.domain=data.uploadType;
                uploadFile(uploadResult);
                props.onCropSuccess?.(uploadResult.url)
                setLoading(false);
            },
            onError:(err:string)=>{
                console.error(err)
                setLoading(false);
            },
            onProgress:(progress:number)=>{
                console.log(progress,"上传进度");
            }
        }
        customerUpload(row);
    }
    // 保存文件
    const uploadFile=(res:CZHFileUploadResult)=> {
        let data = {
            domain: res.domain,
            type: res.type,
            name:res.name,
            key:res.key,
            url:res.url,
            pid:0
        }
        let fileType=res.type;
        addFileApi(data).then(res => {

        })
    }
    const getCroppedFile =  () => {
        return new Promise<File>((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
            const { width: cropWidth, height: cropHeight, x: cropX, y: cropY } = croppedAreaPixels;
            canvas.width = cropWidth;
            canvas.height = cropHeight;
            ctx.fillRect(0, 0, cropWidth, cropHeight);
            const imgSource = document.querySelector(`.${PREFIX}-media`) as HTMLImageElement;
            ctx.drawImage(imgSource, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
            try {
                canvas.toBlob((blob) => {
                    if (blob) {
                        // 生成文件名
                        let imgPaths:string[]=props.image.split('/');
                        const originalFileName = imgPaths[imgPaths.length - 1];
                        const fileName = `cropped-${originalFileName}`;

                        // 创建File对象
                        const file = new File([blob], fileName, {
                            type: blob.type || 'image/jpeg',
                            lastModified: Date.now()
                        });
                        resolve(file);
                        console.log('裁剪后的File对象:', file);
                    }
                });
            } catch (error) {
                console.log('无法导出受污染的画布', error);
            }
        })
    }
    return (
        <CZHModal
            open={open}
            title={(
                <Title title='图片裁剪' />
            )}
            width={"60vw"}
            onCancel={onCancel}
        >

           <div style={{height:"60vh",position:'relative'}}>
               {imgSource!="" &&
                   <Cropper
                       ref={cropRef}
                       image={imgSource}
                       onCropComplete={onCropComplete}
                       crop={crop}
                       zoom={zoom}
                       onCropChange={setCrop}
                       onZoomChange={setZoom}
                       aspect={props.aspect}
                       classes={{
                           containerClassName: `${PREFIX}-container`,
                           mediaClassName: `${PREFIX}-media`,
                       }}
                   />
               }
           </div>

            <Button type="primary"  className='marglauto block margt20' onClick={onOk} loading={loading} >

                确定</Button>
        </CZHModal>
    )
}

export default forwardRef(CZHImageCrop);
