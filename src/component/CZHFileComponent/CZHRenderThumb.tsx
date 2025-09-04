import React, {forwardRef, useEffect, useRef, useState} from "react";
import { EyeOutlined ,PlayCircleOutlined,DeleteOutlined} from '@ant-design/icons';
import {CZHFileItem} from "./CZHFileList";
import ExcelThumb from "../../static/excel.png"
import WordThumb from "../../static/word.png"
import PDFThumb from "../../static/PDF.png"
import ZIPThumb from "../../static/ysb.png"
import OtherThumb from "../../static/other.png"
import DirThumb from "../../static/wjj.png"
import "./CZHFile.scss"
import {Image} from "antd";
interface CZHRenderThumbProps{
    file:CZHFileItem;
    onDel:()=>void;//点击删除的回调
    onOpenDir?:()=>void;//点击打开目录回调
    width?:number;//宽
    height?:number;//高
}

const CZHRenderThumb = (props: CZHRenderThumbProps) => {
    const [thumbnailUrl, setThumbnailUrl] = useState<any>(null);
    const [imgOpen,setImgOpen] = useState<boolean>(false);
    const [videoOpen,setVideoOpen] = useState<boolean>(false);
    const {file,width=102,height=102}=props;
    useEffect(() => {
        if(file.type===2 && !file.thumb && !thumbnailUrl)
        {
            generateThumbnail()
        }
    }, [file]);
    useEffect(()=>{
        console.log(thumbnailUrl,"thumbnailUrl");
    },[thumbnailUrl]);
    const generateThumbnail = async () => {
        try {
            // 创建视频元素
            const video = document.createElement('video');
            video.src = file.url;
            video.crossOrigin = 'anonymous'; // 处理跨域
            video.preload = 'metadata';

            // 等待视频元数据加载完成
            await new Promise((resolve, reject) => {
                video.onloadedmetadata = resolve;
                video.onerror = reject;
            });

            // 快速定位到第一帧
            video.currentTime = 0.1; // 有时0秒可能是黑屏，用0.1秒更可靠

            // 等待视频帧加载完成
            await new Promise((resolve) => {
                video.onseeked = resolve;
            });

            // 使用Canvas绘制视频帧
            const canvas = document.createElement('canvas');
            canvas.width = file.width;
            canvas.height = file.height;
            const ctx = canvas.getContext('2d');

            // 绘制视频帧到Canvas
            ctx?.drawImage(video, 0, 0, file.width, file.height);

            // 将Canvas内容转换为图片URL
            const thumbnail = canvas.toDataURL('image/jpeg');
            setThumbnailUrl(thumbnail);
            console.log("获取封面图成功",thumbnail);
        } catch (err) {
            console.error('Failed to generate thumbnail:', err);

        }
    };
    return(
        <div onClick={()=>{
            if(file.type===1) {
                setImgOpen(true);
            }else if(file.type===2) {
                setVideoOpen(true);
            }else if(file.type===8){

            }else {
                window.open(file.url);
            }
        }} className={"prevContainer"} style={{width:width,height:height}} >
            {props.file.type===1 && <img className={"prevImg"} src={props.file.thumb || props.file.url} />}
            {props.file.type===2 && <img className={"prevImg"} src={props.file.thumb || thumbnailUrl} />}
            {props.file.type===3 && <img className={"prevImg"} src={ExcelThumb} />}
            {props.file.type===4 && <img className={"prevImg"} src={WordThumb} />}
            {props.file.type===5 && <img className={"prevImg"} src={PDFThumb} />}
            {props.file.type===6 && <img className={"prevImg"} src={ZIPThumb} />}
            {props.file.type===7 && <img className={"prevImg"} src={OtherThumb} />}
            {props.file.type===8 && <img className={"prevImg"} src={DirThumb} />}
            <div className={"maskView"}>
                {file.type===2 ?  <PlayCircleOutlined style={{color:"#fff",fontSize:18}}  />
                    : <>
                    {file.type!=8 && <EyeOutlined style={{color:"#fff",fontSize:18,lineHeight:24}}  />}
                    </>
                }
                <DeleteOutlined onClick={(e)=>{
                    e.preventDefault()
                    e.stopPropagation()
                    props.onDel();
                }} style={{color:"#fff",fontSize:18,lineHeight:24}} />
            </div>
            <Image
                wrapperStyle={{ display: 'none' }}
                preview={{
                    visible: imgOpen,
                    onVisibleChange: (visible) => setImgOpen(visible)
                }}
                src={file.url}
            />
            <Image
                wrapperStyle={{ display: 'none' }}
                preview={{
                    visible: videoOpen,
                    onVisibleChange: (visible) => setVideoOpen(visible),
                    imageRender: () => (
                        <video
                            muted
                            width="80%"
                            height={"80%"}
                            controls
                            src={file.url}
                        />
                    ),
                }}
            />
        </div>
    );
}
export default forwardRef(CZHRenderThumb);
