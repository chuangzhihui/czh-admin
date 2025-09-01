import React, { createRef, useEffect, useState, lazy, Suspense } from 'react';
import {Layout, Menu, Dropdown, Tabs, App, theme, Modal} from 'antd';
import CustomModal from '../component/CZHModal';
import Title from '../component/CZHTitle';
import {Components} from "./Route";
import {useLocation, useNavigate} from 'react-router-dom'
// 子页面
import EditPwd from './system/EditPwd';  //修改密码
import UserInfo from './system/UserInfo';  //个人信息
import SetColor from './system/SetColor';  //主题配色
// loading页
import Loading from './Loading';
import Page404 from "./Page404";
import {getLoginInfoApi, logoutApi} from "../api/admin/AdminApi";
const { Header, Content, Sider } = Layout;
let rootSubmenuKeys:any[] = [];
let tabRef:any[] = [];
const list = (path:string, id:number,label:string) => {
    var MyComponentt = Components[path];
    console.log(Components);
    if(!MyComponentt){
        MyComponentt=Page404;
    }
    console.log(id)
    tabRef[id] = createRef();
    return(
        <Suspense fallback={<Loading />}>
            <div className="container bgbai ">
                <Title title={label} />
                <MyComponentt ref={tabRef[id]} />
            </div>
        </Suspense>
    );
}

const Index = (props:any) => {
    const {
        token: { colorPrimary }
    } = theme.useToken();
    const { message } = App.useApp();
    const [collapsed, setCollapsed] = useState(false);  // 左侧导航是否展开/收起
    const [collapsedWidth,setCollapsedWith]=useState(0);
    const [auto,setAuto]=useState(false);//是否响应式
    const [openKeys, setOpenKeys] = useState(['']);// 只展开当前菜单
    const [selectedKeys, setSelectedKeys] = useState<any[]>(['']);  // 当前选中菜单
    const [menu, setMenu] = useState<any[]>([]);  // 左侧导航数据
    const [tabs, setTabs] = useState<any[]>([]);  // 右侧顶部打开的页面
    const [activeKey, setActiveKey] = useState('');  // 当前选中的tab页
    const [path, setPath] = useState('');  // 当前tab展示的内容页
    const [pwdVisible, setPwdVisible] = useState(false);  // 修改密码弹出层
    const [infoVisible, setInfoVisible] = useState(false);  // 修改个人信息弹出层
    const [themeVisible, setThemeVisible] = useState(false);  // 主题弹出层
    const [info, setInfo] = useState({ avatar: '../static/default.png', username: '', systemName: '鸿鹄科技管理后台' })
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');
    const [sysName, setSysName] = useState('鸿鹄科技管理后台');
    const [changePwdType,setChangePwdType]=useState(0);//修改密码的级别 0不提示 1警告 2强制
    // 右侧顶部目录
    const items = [
        {
            key: '1',
            label: (
                <p onClick={() => setPwdVisible(true)}>修改密码</p>
            )
        }, {
            key: '2',
            label: (
                <p onClick={() => setInfoVisible(true)}>个人信息</p>
            )
        }, {
            key: '3',
            label: (
                <p onClick={() => {
                   loginOut();
                }}>退出登录</p>
            )
        }]
    const navigate = useNavigate()
    const location = useLocation();
    useEffect(() => {
        if (path) {
            navigate(path, {replace: true})

        }
    }, [path])
    useEffect(() => {
        getData();
        setTimeout(() => {
            window.delDom?.()
        }, 2000);
    }, [])
    //安全退出
    const loginOut=()=>{
       logoutApi();
        localStorage.removeItem('czhToken')
        message.success('再见', () => {
            window.location.href = '';
        })
    }
    // 获取左边导航等数据
    const getData = () => {
        getLoginInfoApi().then(res => {
            if (res.code === 200) {
                setSysName(res.data.name)
                setUsername(res.data.username)
                setAvatar(res.data.avatar)
                setInfo(
                    {
                        avatar: res.data.avatar,
                        username: res.data.username,
                        systemName: res.data.name }
                )
                setChangePwdType(res.data.changePwdType);
                if(res.data.changePwdType>0)
                {
                    console.log("这里来了")
                    Modal.confirm({
                        title:"警告",
                        content:res.data.changePwdTip,
                        cancelText:"稍后再说",
                        okText:"立即修改",
                        cancelButtonProps:{disabled:res.data.changePwdType==2},
                        onOk:()=>{
                            setPwdVisible(true)
                        }
                    })
                }

                let menus =makeMenus(res.data.menus);
                setMenu(menus);
            }
        })
    }
    const makeMenus=(sources:any,level=1)=>{
        let datas=[];
        for (let i=0; i<sources.length; i++){
            let source = sources[i];
            let menu:any={
                key:String(source.id),
                label:source.title,
                path:source.path,
                icon:level===1?<p className={`iconfont ${source.icon}`}></p>:null,
                children:source.child?.length>0?makeMenus(source.child,level+1):null
            }
            datas.push(menu);

        }
        return datas;
    }
    //监听menus 变化
    useEffect(()=>{
        if(menu.length>0){
            //获取当前url
            let pathArr = location.pathname.split('/');
            let pathName=pathArr.length===3?pathArr[2]:"";

            let menuInfo:any={};
            let sources=menu;
            if(pathName!=="")
            {
                sources=initMenuByPath(JSON.parse(JSON.stringify(menu)),pathName)
            }
            menuInfo=initMenuLabel(sources);
            console.log(menuInfo,"menuInfo",menu);
            setOpenKeys(menuInfo.ekeys);
            setSelectedKeys(menuInfo.keys)
            setTabs([
                menuInfo.tab
            ])
            setActiveKey(menuInfo.tab.key)
            setPath(menuInfo.path)
        }
    },[menu])
    const initMenuByPath=(sources:any,path:any)=>{
        let allDatas=[];
        for (let i=0; i<sources.length; i++){
            let source = sources[i];
            let obj=null;
            if(source.path===path)
            {
               obj=source;
            }else{
                if(source.children&&source.children.length>0)
                {
                    let subDatas=initMenuByPath(source.children,path);
                    if(subDatas.length>0)
                    {
                        obj=source;
                        obj.children=subDatas;
                    }
                }
            }
            if(obj!=null)
            {
                allDatas.push(obj);
            }
        }
        return allDatas;
    }
    const initMenuLabel=(sources:any,keys:any[]=[],ekeys:any[]=[])=>{
        let item=sources[0];
        keys.unshift(item.key);
        if(item.children?.length>0){
            ekeys.push(item.key);
            return initMenuLabel(item.children,keys,ekeys);
        }
        return {
            keys,ekeys,tab:{
                label: item.label, key: item.key, path: item.path, closable: false,
                children:list(item.path,item.key,item.label)
            }
        };
    }
    // 左边导航点击
    const onClick = (e:any) => {
        let row = menu.find(item => item.key == e.key);
        if (!row) {  // 没找到一级
            bsd:
                for (let i in menu) {
                    let child:any = menu[i].children;
                    if (child) {
                        let index = child.findIndex((d:any) => d.key == e.key);

                        if (index > -1) {
                            console.log(child[index])
                            // 设置选中tab
                            setActiveKey(String(child[index].key))
                            // 调用tab变化
                            add({ label: child[index].label, key: String(child[index].key), path: child[index].path });
                            // 设置内容页
                            setPath(child[index].path);
                            break bsd
                        }
                    }
                }
        } else {  // 以及存在且path不为空
            console.log(row,e)
            // 设置选择的tab
            setActiveKey(String(row.key))
            // 调用tab变化
            add({ label: row.label, key: String(row.key), path: row.path });
            // 设置内容页
            setPath(row.path);
        }
        // 设置选择的menu
        setSelectedKeys(e.keyPath)
    };
    // 左边导航展开
    const onOpenChange = (keys:any[]) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) == -1);
        if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) == -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };
    // 右边顶部tab新增或删除
    const onEdit = (targetKey:any, action:any) => {
        if (action == 'remove') {
            remove(targetKey);
        }
    };
    // 右边顶部tab删除
    const remove = (targetKey:any) => {
        const targetIndex = tabs.findIndex((pane) => pane.key == targetKey);
        const newPanes = tabs.filter((pane) => pane.key != targetKey);
        if (newPanes.length && targetKey == activeKey) {
            const { key, path } = newPanes[targetIndex == newPanes.length ? targetIndex - 1 : targetIndex];
            changeKeys(key);
            // 设置选中的tab
            setActiveKey(key);
            // 设置内容页
            setPath(path)
        }
        setTabs(newPanes);
    };
    // 右边顶部tab新增
    const add = (data:any) => {
        let index = tabs.findIndex(item => item.key == data.key);
        if (index > -1) {

        } else {
            setTabs([...tabs, { label: data.label, key: data.key, path: data.path, closable: true,
                children:list(data.path,data.key,data.label),
                p: data.p,
                s: data.s
            }])
        }
    }
    // 右边顶部tab切换
    const onChange = (key:any) => {
        changeKeys(key);
        let index = tabs.findIndex(item => item.key == key);
        if (index > -1) {
            setPath(tabs[index].path);  // 设置内容页
        }
        setActiveKey(key);  // 设置选中tab
    };
    // 右边顶部刷新按钮点击事件
    const refresh = () => {
        console.log("refresh",tabRef,selectedKeys,openKeys);
        tabRef[selectedKeys[0]].current && tabRef[selectedKeys[0]].current.refresh()
    }
    // 设置左边导航展开栏和选中项
    const changeKeys = (key:any) => {
        let keyPath = [];
        let index = menu.find(item => item.key == key);
        // 判断当前tab是否是一级 一级存在
        if (index) {
            setSelectedKeys([key]);  // 设置选中的menu
            setOpenKeys([key])  // 设置打开的menu
            return
        }
        // 一级不存在
        bsd:
            for (let i in menu) {
                let child = menu[i].children;
                if (child) {
                    let row = child.find((item:any) => item.key == key);
                    if (row) {
                        keyPath = [row.key, menu[i].key]
                        setSelectedKeys(keyPath);  // 设置选中的menu
                        setOpenKeys([menu[i].key])  // 设置打开的menu
                        break bsd
                    }
                }
            }
    }
    // 关闭弹出层
    const onCancel = () => {
        setPwdVisible(false);
        setInfoVisible(false);
        setThemeVisible(false);
    }
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                width={240}
                breakpoint="lg"
                collapsedWidth={collapsedWidth}
                className='leftMenu'
                theme='light'
                onBreakpoint={(broken) => {
                    console.log(broken);
                    setAuto(broken);
                    setCollapsed(broken)
                }}
                trigger={null}
                collapsible
                collapsed={collapsed}
            >
                <div className='logo'>
                    <p style={{ background: colorPrimary }}>{sysName != "" ? sysName.substring(0, 2) : ""}</p>
                    <h1>{sysName}</h1>
                </div>
                <Menu
                    mode='inline'
                    openKeys={openKeys}
                    selectedKeys={selectedKeys}
                    items={menu}
                    onClick={onClick}
                    onOpenChange={onOpenChange}
                    className='menus'
                />
            </Sider>
            <Layout className="site-layout">
                <Header className='headtop' style={{ padding: 0, background: '#fff', height: 90 }}>
                    <div className='flexCenter margl24' style={{ lineHeight: '54px' }}>
                        <p className={`cursor iconfont ${auto?(collapsedWidth==0 ? 'icon-zhankai' : 'icon-shouqi'):(collapsed ? 'icon-zhankai' : 'icon-shouqi')}`} onClick={() => {
                            // setCollapsed(!collapsed)
                            console.log(auto)
                            if(auto)
                            {
                                setCollapsedWith(collapsedWidth==0?60:0)
                            }else{
                                setCollapsed(!collapsed)
                            }

                        }}></p>
                        <p className={`cursor iconfont icon-shuaxin margl24`} onClick={refresh}></p>
                        <div className='zhut flexCenter' onClick={() => setThemeVisible(true)}>
                            <p className='iconfont icon-zhuti'></p>
                            <p>主题</p>
                        </div>
                        <img alt='' src={avatar!=""?avatar:'../static/default.png'} className='avatar' />
                        <Dropdown placement='bottom' menu={{ items }} arrow>
                            <div className='flexCenter cursor' style={{ height: 24, }}>
                                <p>{username}</p>
                                <span className='iconfont icon-jiantou-shang'></span>
                            </div>
                        </Dropdown>
                    </div>
                </Header>
                <Content style={{ padding: 5 ,overflowY:"scroll",overflowX:"hidden"}} >
                    <Tabs
                        className='asdTabs'
                        items={tabs}
                        type="editable-card"
                        hideAdd
                        activeKey={activeKey}
                        onEdit={onEdit}
                        onChange={onChange}
                    />

                </Content>
            </Layout>
            {/* 修改密码 */}
            <CustomModal
                open={pwdVisible}
                title={(<Title title='修改密码' />)}
                width={360}
                onCancel={onCancel}
                closable={changePwdType<2}
                maskClosable={changePwdType<2}
            >
                <EditPwd />
            </CustomModal>
            {/* 修改个人信息 */}
            <CustomModal
                open={infoVisible}
                title={(<Title title='个人信息' />)}
                width={360}
                onCancel={onCancel}
            >
                <UserInfo data={info} onOk={() => {
                    onCancel();
                    getData()
                }} />
            </CustomModal>
            {/* 主题配色 */}
            <CustomModal
                open={themeVisible}
                title={(<Title title='主题配色' />)}
                width={1172}
                onCancel={onCancel}
            >
                <SetColor onCancel={onCancel} />
            </CustomModal>
        </Layout>
    )
};


export default Index;
