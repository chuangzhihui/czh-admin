import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react';
import { Button, Pagination, Switch, App, theme } from 'antd';
import Title from '../../../component/CZHTitle';
import CustomerTable, {CZHPageRequestProps} from "../../../component/CZHTable";
import AddMenu from './AddMenu';
import CZHTableSearch from "../../../component/CZHTableSearch";
import {delMenuApi, menuListApi} from "../../../api/system/SystemApi";
import CZHModal from "../../../component/CZHModal";
import Text from "../../../component/CZHText";
import {HttpResponse} from "../../../util/request";  // 添加、编辑菜单

const levelTxt = ['', '一级菜单', '二级菜单', '三级菜单']

const Index = (_props: any, ref: any) => {
	const { message, modal } = App.useApp();
	const {
		token: { colorPrimary, colorWarning, colorError, colorSuccess },
	} = theme.useToken();
	const tableRef: any = useRef(null);
	const [open, setOpen] = useState<boolean>(false);
	const [level, setLevel] = useState<number>(1);
	const [row, setRow] = useState<object>({});
	const [type, setType] = useState<string>('add');
	const colorArr = ['', colorSuccess, colorWarning, colorError];
	useImperativeHandle(ref, () => ({
		refresh,
	}))
	const refresh = () => {
		console.log('菜单管理');
		tableRef.current.onRefresh()
	}
	// 列表
	const columns:any = [

		{
			title: '菜单名称',
			align: 'left',
			width: 200,
			dataIndex: 'name'
		}, {
			title: '前端路由',
			align: 'center',
			width: 120,
			dataIndex: 'path',
			render: (path: string) => `${path || '-'}`
		}, {
			title: '后端路由',
			align: 'center',
			dataIndex: 'route',
			width: 180,
			render: (route: string) => `${route || '-'}`
		}, {
			title: '菜单等级',
			align: 'center',
			width: 180,
			dataIndex: 'level',
			render: (level: number) => {
				return <Text type={"success"} style={{color:colorArr[level]}}>{levelTxt[level]}</Text>
			}
		}, {
			title: '显示状态',
			align: 'center',
			width: 120,
			dataIndex: 'display',
			render:(display: number,item:any) => {
				return(
					<Button className='font12' size='small' type='primary' danger={display !== 1}>{display === 1 ? '显示' : '隐藏'}</Button>
				);
			}
		}, {
			title: '操作',
			dataIndex: 'id',
			width: 250,
			align: 'center',
			render: (id: number, item: any) => (
				<div className='flexAllCenter pubbtnbox'>
					{item.level<3 &&
						<Text onClick={()=>{
							let fid,
								sid;
							if (item.level == 1) {
								fid = item.id;
							} else if (item.level == 2) {
								fid = item.pid;
								sid = item.id;
							}
							setRow({
								fid,
								sid,
							})
							setLevel(parseInt(item.level) + 1);
							setType('add');
							setOpen(true);
						}}>添加子菜单</Text>
					}
					<p style={{ color: colorPrimary }} onClick={() => {
						let fid,
							sid;
						if (item.level == 2) {
							fid = item.pid;
							sid = item.id;
						} else if (item.level == 3) {
							fid = id;
							sid = item.pid;
						}
						setRow({
							...item,
							fid,
							sid,
						})
						setLevel(item.level);
						setType('edit');
						setOpen(true);
					}}>编辑</p>
					<p style={{ color: colorError }} onClick={() => del(item)}>删除</p>
				</div>
			)
		}
	]
	// 首次进入页面初始化
	const onRefresh = (info: CZHPageRequestProps, callback: (res:HttpResponse) => void) => {
		getList(info, callback)
	}
	// 获取列表数据
	const getList = (info: CZHPageRequestProps, callback: (res:HttpResponse) => void) => {
		menuListApi({
			page: info.page,
			size: info.size,
			orderBy: '',
			// ...search
		}).then(res => {
			callback(res)
		})
	}
	// 删除
	const del = (data: any) => {
		modal.confirm({
			title: '警告提示',
			content: '您要删除该项数据吗？删除后将无法恢复！',
			centered: true,
			maskClosable: true,
			onOk: () => {
				return delMenuApi(data.id).then(res => {
					if (res.code == 200) {
						refresh();
					} else {
						message.error(res.msg, 1.2);
					}
				})
			}
		})
	}

	// 关闭弹窗
	const onCancel = () => {
		setOpen(false);
	}
	return (
		<React.Fragment>
			<CZHTableSearch
			buttons={[<Button type="primary" onClick={() => {
				setRow({ pid: 0 });
				setLevel(1);
				setType('add');
				setOpen(true);
			}}>添加菜单</Button>]}
			/>
			<CustomerTable
				ref={tableRef}
				columns={columns}
				onRefresh={onRefresh}
				expandable={{
					childrenColumnName:"child",
					expandedRowClassName:"expandedRowStyle",
					indentSize:30,
				}}
				auto={true}
				scroll={{ x:1010 }}
			/>
			{/* 添加、编辑菜单 */}
			<CZHModal
				open={open}
				width={360}
				title={<Title title={`${type === 'add' ? '添加' : '编辑'}菜单`} />}
				onCancel={onCancel}
			>
				<AddMenu
					type={type}
					level={level}
					data={row}
					onCancel={onCancel}
					onOk={()=>{
						refresh()
						onCancel();
					}}
				/>
			</CZHModal>
		</React.Fragment>
	)
};

export default forwardRef(Index);
