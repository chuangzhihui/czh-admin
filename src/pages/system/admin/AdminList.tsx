import React, { useImperativeHandle, forwardRef, useRef, useState,useEffect } from 'react';
import {Button, Input, theme, App, Form, Row, Col, Space, Tooltip, Modal, TableColumnsType} from 'antd';
import CustomerTable, {CZHTableRef} from "../../../component/CZHTable";
import CustomerSelect from "../../../component/CZHSelect";
import AddAdmin from './AddAdmin';
import CZHTableSearch from "../../../component/CZHTableSearch";
import Text from "../../../component/CZHText";
import {adminListApi, changeAdminStatusApi, delAdminApi} from "../../../api/AdminApi";
import {HttpResponse} from "../../../util/request";
import {AdminListVo} from "../../../types/models/admin/vo";
import FormModal from "../../../component/CZHModal/FormModal";
import {PageDto, PageInfoVo} from "../../../types/models/common";

const Index = (_props: any, ref: any) => {
	const {
		token: { colorPrimary },
	} = theme.useToken();
	const { message, modal } = App.useApp();
	const tableRef: any = useRef<CZHTableRef | null>(null);
	const [search,setSearch]=useState<any>({});
	// 列表
	const columns:TableColumnsType<AdminListVo> = [
		{
			title: 'ID',
			align: 'center',
            sorter:true,
			dataIndex: 'adminId',
			width: 80,
		}, {
			title: '用户昵称',
			align: 'center',
			width: 120,
			dataIndex: 'userName'
		}, {
			title: '角色',
			align: 'center',
			width: 120,
			dataIndex: 'roleName'
		}, {
			title: '上次登录时间',
			align: 'center',
			dataIndex: 'lastLoginTime',
			width: 180,
			render: (time: string) => `${time || '-'}`
		}, {
			title: '上次登录IP',
			align: 'center',
			width: 180,
			dataIndex: 'lastLoginIp',
			render: (ip: string) => `${ip || '-'}`
		}, {
			title: '状态',
			align: 'center',
			width: 120,
			dataIndex: 'status',
			render:(status:number,item:AdminListVo)=>{
				return(
					<Tooltip title={"点击"+(status==0?"解冻":"冻结")+"用户"}>
						<Text onClick={()=>{
							Modal.confirm({
								title:"提示",
								content:"确定要"+(status==0?"解冻":"冻结")+"该用户吗?",
								onOk:()=>{
									return new Promise<void>(resolve => {
                                        changeAdminStatusApi(item.admin_id).then((res) => {
											resolve();
											if (res.code == 1) {
												refresh()
											} else {
												message.error(res.msg, 1.2);
											}
										}).catch((err)=>{
											console.log(err)
											message.error(err.toString(), 1.2);
											resolve()
										})
									})
								}
							})
						}}  className={"cursor"} type={status==0?"error":"primary"}>{status==0?"冻结":"正常"}</Text>
					</Tooltip>
				);
			}
		}, {
			title: '添加时间',
			align: 'center',
			width: 180,
            sorter: true,
			dataIndex: 'atime'
		}, {
			title: '操作',
			dataIndex: 'id',
			width: 150,
			align: 'center',
			render: (id: number, item) => (
				<div className='flexAllCenter pubbtnbox'>
					<p style={{ color: colorPrimary }} onClick={() => {
                        FormModal.open({
                            title:`编辑管理员`,
                            children:<AddAdmin type={"edit"} data={item} onOk={()=>{
                                refresh()
                            }} />,
                            width:360
                        })
					}}>编辑</p>
					<p style={{ color: colorPrimary }} onClick={() => del(item)}>删除</p>
				</div>
			)
		}
	]
	useEffect(() => {
		refresh()
	}, [search])
	useImperativeHandle(ref, () => ({
		refresh,
	}))
	const refresh = () => {
		tableRef.current.onRefresh()
	}

	// 首次进入页面初始化
	const onRefresh = (info: PageDto, callback: (res:HttpResponse<PageInfoVo<AdminListVo>>) => void) => {
        adminListApi({
            page: info.page,
            size: info.size,
            orderBy: '',
            ...search
        }).then(res => {
            callback(res)
        })
	}
	// 删除
	const del = (data:AdminListVo) => {
		modal.confirm({
			title: '警告提示',
			content: '您要删除该项数据吗？删除后将无法恢复！',
			centered: true,
			maskClosable: true,
			onOk: () => {
				return delAdminApi(data.adminId).then(res => {
					if (res.code == 200) {
						refresh()
					} else {
						message.error(res.msg, 1.2);
					}
				})
			}
		})
	}
	return (

		<React.Fragment>
			<CZHTableSearch
				onSearch={(data:any)=>{
					setSearch(data)
				}}
				items={[
					{
						node:<Input
								placeholder='请输入'
								allowClear
							/>,
						label:"用户名",
						name:"name"
					},
					{
						node:<CustomerSelect
								type='allrole'
								placeholder='请选择角色'
							/>,
						label:"角色",
						name:"role_id"
					},
				]}
				buttons={[
					<Button type="primary" onClick={() => {
                        FormModal.open({
                            title:`添加管理员`,
                            children:<AddAdmin type={"add"}  onOk={()=>{
                                refresh()
                            }} />,
                            width:360
                        })
					}}>添加管理员</Button>
				]}
			/>
			<CustomerTable
				ref={tableRef}
				columns={columns}
				onRefresh={onRefresh}
				auto={true}
				scroll={{ x:1010 }}
			/>

		</React.Fragment>
	)
};

export default forwardRef(Index);
