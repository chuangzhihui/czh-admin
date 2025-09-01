import React, {forwardRef, useEffect, useState} from 'react';
import { Button, Form, Input, App } from 'antd';
import CustomerSelect from "../../../component/CZHSelect";
import Helper from "../../../util/Helper";
import {addAdminApi, editAdminApi, getPwdRuleApi} from "../../../api/admin/AdminApi";
import CZHUploadImg from "../../../component/CZHUploadImg";
const Index = (_props: any, ref: any) => {
    const { message } = App.useApp();
    const [pwdReg,setPwdReg]=useState<string>("");
    const [pwdRegTip,setPwdRegTip]=useState<string>("");
    useEffect(()=>{
        //获取密码正则表达式
        getPwdRuleApi().then((res:any) => {
            if (res.code === 200) {
                setPwdReg(res.data.pwdReg)
                setPwdRegTip(res.data.pwdRegDesc)
            } else {
                message.error(res.msg, 1.2)
            }
        })
    },[])
    const onFinish = (data: any) => {
        let api:any=addAdminApi;
        if (_props.type === 'edit') {
            data.adminId = _props.data.adminId;
            api=editAdminApi;

        }
        api(data).then((res:any) => {
            if (res.code == 200) {
                message.success(res.msg, 1.2);
                _props.onOk && _props.onOk();
            } else {
                message.error(res.msg, 1.2)
            }
        })

    }
    return (
        <Form
            onFinish={onFinish}
            autoComplete='off'
           layout="vertical"
            initialValues={{
                userName: _props.data.userName,
                roleId: _props.data.roleId,
            }}
        >
            <Form.Item label='用户昵称' name='userName' rules={[{ required: true, message: '请设置5-12位用户昵称' }]}>
                <Input autoComplete={"off"} placeholder='请设置5-12位用户昵称' />
            </Form.Item>
            <Form.Item extra={pwdRegTip} label='登录密码' name='password'  rules={[{ required: _props.type==="add", message: '请输入登录密码' },( { getFieldValue }) => ({
                validator(_, value) {
                    // var myreg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
                    if(_props.type==="add" && !value){
                        return Promise.reject(new Error(pwdRegTip));
                    }
                    if (!value || Helper.regCheck(pwdReg,value)) {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error(pwdRegTip));
                }
            })]}>
                <Input.Password autoComplete={"off"} placeholder='请输入登录密码' />
            </Form.Item>
            <Form.Item label='角色' name='roleId' rules={[{ required: true, message: '请选择角色' }]}>
                <CustomerSelect type='allrole' />
            </Form.Item>
            <Form.Item label='选择图片' name='imgs' rules={[{ required: true, message: '请选择图片' }]}>
                <CZHUploadImg max={2} />
            </Form.Item>
            <Button type='primary' htmlType='submit' className='marglauto block margt20'>确定</Button>
        </Form>
    )
};

export default forwardRef(Index);
