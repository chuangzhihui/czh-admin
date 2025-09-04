import React, {forwardRef, useEffect, useRef, useState} from "react";
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import CZHFileList, {CZHFileItem} from "./CZHFileComponent/CZHFileList";

export interface  CZHUeditorProps {
    value?:string;//富文本内容
    onChange?: (value:string) => void;
    placeholder?:string;
}
const CZHUeditor= (props:CZHUeditorProps) => {
    const fileRef = useRef<any>(null);
    // editor 实例
    const [editor, setEditor] = useState<IDomEditor | null>(null) // TS 语法S 语法
    // 编辑器内容
    const [html, setHtml] = useState(props.value || "")
    const {placeholder="请输入内容"}=props;

    // 监听value变化，更新编辑器内容
    useEffect(() => {
        if (props.value !== undefined && props.value !== html) {
            setHtml(props.value || "");
        }
    }, [props.value]);

    // 工具栏配置
    const toolbarConfig: Partial<IToolbarConfig> = {} // TS 语法

    // 编辑器配置
    const editorConfig:any = {
        placeholder,
        MENU_CONF:[]
    }
    editorConfig.MENU_CONF['uploadImage'] = {
        // 自定义选择图片
        customBrowseAndUpload(insertFn: any) {
            CZHFileList.open({
                onOk:(files:CZHFileItem[])=>{
                    let file:CZHFileItem = files[0];
                    console.log("选择回调",file,insertFn);
                    insertFn(file.url,file.name,file.type);
                },
                open:true,
                max:10,
                types:[1]
            })
        },
    }
    editorConfig.MENU_CONF['uploadVideo'] = {
        // 自定义选择视频
        customBrowseAndUpload(insertFn: any) {
            CZHFileList.open({
                onOk:(files:CZHFileItem[])=>{
                    let file:CZHFileItem = files[0];
                    console.log("选择回调",file,insertFn);
                    insertFn(file.url,file.thumb);
                },
                open:true,
                max:10,
                types:[2]
            })
        },
    }
    // 及时销毁 editor ，重要！
    useEffect(() => {
        return () => {
            if (editor == null) return
            editor.destroy()
            setEditor(null)
        }
    }, [editor])

    return (
        <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
            <Toolbar
                editor={editor}
                defaultConfig={toolbarConfig}
                mode="default"
                style={{ borderBottom: '1px solid #ccc' }}
            />
            <Editor
                defaultConfig={editorConfig}
                value={html}
                onCreated={setEditor}
                onChange={(editor) => {
                    const newHtml = editor.getHtml();
                    setHtml(newHtml);
                    props.onChange?.(editor.getHtml())
                }}
                mode="default"
                style={{ height: '300px', overflowY: 'hidden' }}
            />
        </div>
    )
}
export default CZHUeditor;
