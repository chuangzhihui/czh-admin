import React, {forwardRef, useEffect, useRef, useState} from "react";
import FileList, { CZHFileItem} from "./CZHFileList";
import {Button, Upload, UploadFile, UploadProps} from "antd";
import Helper from "../util/Helper";
import AddImg from "../static/img.png"

interface CZHUploadImgProps {
    value?: CZHFileItem[];//图片集
    max?:number;//最大上传数量
    onChange?: (value: CZHFileItem[]) => void;//change回调
}
const CZHUploadImg= (props:CZHUploadImgProps) => {
    const fileRef: any = useRef(null);
    const {max=1}=props;
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const triggerChange = (files:CZHFileItem[]) => {
        props.onChange?.(files);
    };
    useEffect(() => {
        setFileList(CZHFileItemToUploadFile(props.value || []))
    }, [props.value]);
    const makeFileList=(files:CZHFileItem[])=>{
        var arr:CZHFileItem[]=[];
        var fileList:CZHFileItem[]=props.value || [];
        for(var i=0;i<fileList.length;i++)
        {
            arr.push(fileList[i])
        }
        files=arr.concat(files);
        triggerChange(files)
    }
    const onFileRemove=(uid:string)=>{
        let values:CZHFileItem[]=JSON.parse(JSON.stringify(props.value || []));
        let newVals:CZHFileItem[]=[];
        for(var i=0;i<values.length;i++)
        {
            if(values[i].uid != uid)
            {
                newVals.push(values[i]);
            }
        }
        triggerChange(newVals);
    }
    return (
        <React.Fragment>
            <Upload
                fileList={fileList}
                listType={"text"}
                onRemove={(file:UploadFile) => {
                    console.log(file);
                    onFileRemove(file.uid)
                }}
            >
                {max>fileList.length &&
                    <img alt='' onClick={(e)=>{
                        fileRef.current.refresh();
                        e.stopPropagation()
                    }} src={AddImg} className="addImgBtn cursor" />
                }
            </Upload>

            {/* 文件库 */}
            <FileList ref={fileRef} max={max-fileList.length} type={2}  onOk={(data: CZHFileItem[]) => {
                makeFileList(data);
            }} />
        </React.Fragment>
    )
}
export default forwardRef(CZHUploadImg);
/**
 * CZHFileItem转UploadFile
 */
export const CZHFileItemToUploadFile=(sources:CZHFileItem[]):UploadFile[] => {
    let result:UploadFile[] = [];
    for(let i=0;i<sources.length;i++){
        let item:CZHFileItem = sources[i];
        result.push({
            uid:item.uid,
            name:item.name,
            status:"done",
            url:item.url,
            thumbUrl:item.thumb
        })
    }
    return result;
}
export const UploadFileToCZHFileItem=(sources:UploadFile[]):CZHFileItem[] =>{
    let result:CZHFileItem[] = [];
    for(let i=0;i<sources.length;i++){
        let item:UploadFile=sources[i];
        // type: number;//文件类型1图片 2视频 3Excel 4word 5pdf 6zip 7未知文件
        // name:string;//文件名称
        // width:number;//文件宽度
        // height:number;//文件高度
        // url:string;//文件地址
        // thumb?:string;//缩略图
        // result.push({
        //     type:item.type==="video"?2:1,
        //     name:item.name,
        //     wi
        // })
    }
    return result;
}
