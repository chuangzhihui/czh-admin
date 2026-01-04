import {Button, Modal} from "antd";
import React, {cloneElement, ReactElement, useRef, useState} from "react";
import {createRoot} from "react-dom/client";
import { ConfigProvider } from 'antd';
import locale from 'antd/locale/zh_CN';
import Title from "../CZHTitle";
export interface FormModalProps{
    title:string;//弹窗标题
    width?:number;//弹窗宽度
    children:React.ReactNode;//弹窗内容
    open?:boolean;//是否显示
    onClose?:()=>void;
}
export interface CommonFormProps{
    loading?:(e:boolean)=>void;
    close?:()=>void;
}
const FormModal=(props:FormModalProps)=>{
    const {title="表单弹窗",width=500}=props;
    const [open, setOpen] = useState<boolean>(props.open || false)
    const [loading, setLoading] = useState<boolean>(false)//确认按钮加载状态
    const childRef = useRef<any>(null);
    const Children = cloneElement<any>(props.children as ReactElement, {
        ref: childRef, // 将ref附加到克隆后的子元素上
        loading:(e:boolean)=>{
            setLoading(e)
        },
        close:()=>{
            closeModal();
        }
    });
    const closeModal = () => {
        setOpen(false)
        setTimeout(() => {
            props.onClose?.()
        }, 3000)
    }
    return(
        <Modal
            open={open}
            centered={true}
            maskClosable={false}
            destroyOnHidden={true}
            title={<Title title={title} />}
            footer={<div className={"customerModalFooter"}>
                <Button onClick={closeModal} type={"default"}>取消</Button>
                <Button loading={loading} onClick={()=>{
                    console.log(childRef.current?.form);
                    childRef.current?.form.submit();
                }} type={"primary"}>确定</Button>
            </div>}
            closeIcon={(<p className='iconfont icon-guanbi'></p>)}
            wrapClassName={"customerModal"}
            width={width}
            onCancel={closeModal}
        >
            {Children}
        </Modal>
    );
}
// 创建一个全局容器(div)用于挂载modal
const createContainer = () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    return container;
};
//将modal挂载到div中
FormModal.open = (props: FormModalProps) => {
    // 创建容器
    const container = createContainer();
    const root = createRoot(container);

    // 用于关闭modal的方法
    const close = () => {
        root.unmount();
        container.remove();
    };

    // 渲染组件
    root.render(
        <ConfigProvider locale={locale}>
            <FormModal
                {...props}
                open={true}
                onClose={() => {
                    close();
                    props.onClose?.();
                }}
            />
        </ConfigProvider>
    );

    // 返回关闭方法
    return { close };
}
export default FormModal;
