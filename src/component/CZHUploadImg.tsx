import React, {forwardRef, useEffect, useRef, useState} from "react";
import FileList, { CZHFileItem} from "./CZHFileList";
import {Button, Image, Upload, UploadFile, UploadProps} from "antd";
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
    const [previewImage, setPreviewImage] = useState<string>("");
    const [previewOpen,setPreviewOpen] = useState<boolean>(false);
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
                listType={"picture-card"}
                onPreview={(file:UploadFile)=>{
                    setPreviewOpen(true);
                    setPreviewImage(file.url || "")
                }}

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
            <FileList ref={fileRef} max={max-fileList.length} type={1}  onOk={(data: CZHFileItem[]) => {
                makeFileList(data);
            }} />
            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
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
/**
 * 文件数组转字符串 将所有的图片地址用逗号间隔为字符串
 * @param sources
 * @constructor
 */
export const CZHFileItemToString=(sources:CZHFileItem[]):string=>{
    let result:string[] = [];
    for (let i=0;i<sources.length;i++){
        result.push(sources[i].url)
    }
    return result.join(",");
}
/**
 * 字符串转文件数组-和上面个方法相反
 * @param fileString
 * @constructor
 */
export const StringToCZHFileItem=(fileString:string):CZHFileItem[]=>{
    let result:CZHFileItem[] = [];
    let sources:string[] = fileString.split(",");
    for(let i=0;i<sources.length;i++){
        let names=sources[i].split("/");
        let name=names[names.length-1];
        result.push({
            uid:"serverfile"+i+"-"+Helper.getRandomString(4)+"-"+Helper.getRandomString(4),
            type:1,
            name:name,
            url:sources[i],
            width:0,
            height:0,
            thumb:sources[i]
        })
    }
    return result;
}

