import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import {Button, Input, Select, Image, Pagination, Form, App, Checkbox, Tooltip,} from 'antd';
import CZHModal from './CZHModal';
import Title from './CZHTitle'
import CZHUpload, {CZHFileUploadResult} from "./CZHUpload";
import {addFileApi, delFileApi, getFileListApi} from "../api/system/SystemApi";
import VideThumb from "../static/shipin.png"
import ExcelThumb from "../static/excel.png"
import WordThumb from "../static/word.png"
import PDFThumb from "../static/PDF.png"
import ZIPThumb from "../static/ysb.png"
import OtherThumb from "../static/other.png"
import DirThumb from "../static/wjj.png"
import {ImgCropProps} from "antd-img-crop";
import Helper from "../util/Helper";
const fileType = [
    { value: 1, label: '图片' },
    { value: 2, label: '视频文件' },
    { value: 3, label: 'Execl文件' },
    { value: 4, label: 'Word文件' },
    { value: 5, label: 'PDF文件' },
    { value: 6, label: '压缩文件' },
    { value: 7, label: '未知类型文件' },
];

// 渲染列表
function GetItems(props:any) {
    let item = props.item;
    const [thumbnailUrl, setThumbnailUrl] = useState<any>(null);
    const openFile=(url:string) => {
        window.open(url);
    }
    useEffect(() => {
        if(item.domain===4 && item.type===2)
        {
            generateThumbnail()
        }
    }, []);
    const generateThumbnail = async () => {
        try {
            // 创建视频元素
            const video = document.createElement('video');
            video.src = item.url;
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
            canvas.width = item.fileWidth;
            canvas.height = item.fileHeight;
            const ctx = canvas.getContext('2d');

            // 绘制视频帧到Canvas
            ctx?.drawImage(video, 0, 0, item.fileWidth, item.fileHeight);

            // 将Canvas内容转换为图片URL
            const thumbnail = canvas.toDataURL('image/jpeg');
            setThumbnailUrl(thumbnail);
            console.log("获取封面图成功",thumbnail);
        } catch (err) {
            console.error('Failed to generate thumbnail:', err);

        }
    };
    return (
        <React.Fragment>
            {/* 图片 */}
            {item.type == 1 &&  <Image
                src={item.thumb}
                width={80}
                height={80}
                preview={{
                    src: item.url,
                }}
            />}
            {/* 视频 */}
            {item.type == 2 &&  <Image
                src={item.domain===4?thumbnailUrl:item.thumb}
                width={80}
                height={80}
                placeholder={true}
                preview={{
                    destroyOnHidden: true,
                    imageRender: () => (
                        <video
                            muted
                            width="80%"
                            height={"80%"}
                            controls
                            src={item.url}
                        />
                    ),
                    toolbarRender: () => null,
                }}
            />}
            {/* excel文件 */}
            {item.type == 3 && <img className='wj cursor' onClick={()=>{openFile(item.url)}} alt='' src={ExcelThumb} />}
            {/* word文件 */}
            {item.type == 4 && <img className='wj cursor' alt='' onClick={()=>{openFile(item.url)}} src={WordThumb} />}
            {/* pdf文件 */}
            {item.type == 5 && <img className='wj cursor' alt='' onClick={()=>{openFile(item.url)}} src={PDFThumb} />}
            {/* 压缩包文件 */}
            {item.type == 6 && <img className='wj cursor' alt='' onClick={()=>{openFile(item.url)}} src={ZIPThumb} />}
            {/* 未知文件 */}
            {item.type == 7 && <img className='wj cursor' alt='' onClick={()=>{openFile(item.url)}} src={OtherThumb} />}
            {/* 虚拟文件夹 */}
            {item.type == 8 && <img className='wj' alt='' src={DirThumb} title='双击打开文件夹' />}
        </React.Fragment>
    )
}
export interface CZHFileItem{
    uid:string;//文件ID
    type: number;//文件类型1图片 2视频 3Excel 4word 5pdf 6zip 7未知文件
    name:string;//文件名称
    width:number;//文件宽度
    height:number;//文件高度
    url:string;//文件地址
    thumb?:string;//缩略图
}
export interface fileListProps {
    type?:number;//文件类型 1图片 2视频 3Excel 4word 5pdf 6zip 7未知文件
    max?:number;//最大数量
    onOk?: (files:CZHFileItem[]) => void;
    crop?:boolean;//上传是否需要裁剪
    cropProps?:ImgCropProps;//裁剪参数
}
const CZHFileList = (props:fileListProps, _ref:any) => {
    const { message, modal } = App.useApp();
    const [open, setOpen] = useState(false);
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pid, setPid] = useState(0);
    const [type, setType] = useState(props.type || undefined);
    const [name, setName] = useState('');
    const [fileName, setFileName] = useState([{ id: 0, name: '根目录' }])
    const [createVisible, setCreateVisible] = useState<boolean>(false);
    const [percent, setPercent] = useState(0);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState<Number[]>([]);
    const [dir,setDir] = useState<string>("admin");
    const {max=1} = props;
    useEffect(() => {
        getList()
    }, [page, type, name, pid])
    // 暴露方法
    useImperativeHandle(_ref, () => ({
        setOpen,
        refresh,
    }))
    const refresh = () => {
        setOpen(true);
        setPid(0);
        setPage(1);
        setValue([])
        setFileName([{ id: 0, name: '根目录' }]);
    }
    useEffect(()=>{
        let dirName="admin";
        for(var i=1;i<fileName.length;i++)
        {
            dirName+=fileName[i].name
        }
        setDir(dirName)
        console.log("fileName",fileName,dirName)
    },[fileName])
    // 获取文件列表
    const getList = () => {
        let obj = {
            page,
            size: 24,
            orderBy: '',
            pid,
            name,
            type: type || '',
        }
        getFileListApi(obj).then(res => {
            if (res.code === 200) {
                setList(res.data.list);
                setTotal(res.data.total);
            }
        })
    }
    // 关闭文件库
    const onCancel = () => {
        setOpen(false);
    }
    // 双击打开文件夹
    const openFolder = (data:any, index = -1) => {
        setPid(data.id);
        setPage(1);
        if (index > -1) {
            if (index != fileName.length - 1) {
                let newArr = fileName.slice(0, (index + 1));
                setFileName(newArr)
            }
        } else {
            if (data.type === 8) {
                setFileName([...fileName, { id: data.id, name: `/${data.name}` }]);
            }
        }
    }
    // 关闭新增文件夹弹窗
    const onClose = () => {
        setCreateVisible(false);
    }
    // 创建文件夹
    const onFinish = (data:any) => {
        setLoading(true);
        uploadFile({
            domain: 0,
            type: 8,
            name: data.name,
            key: '',
            url:"",
            fileWidth:0,
            fileHeight:0,
            fileSize:0
        })
    }
    // 确认选中文件
    const onOk = () => {
        if (value.length === 0) {
           return;
        }
        let files: CZHFileItem[] = [];
        for (let i = 0; i < value.length; i++) {
            let item:any = findListItemById(Number(value[i]));
            files.push({
                uid:"uuid-"+Helper.getRandomString(4)+"-"+item.id,
                type:item.type,
                url:item.url,
                width:item.fileWidth,
                height:item.fileHeight,
                thumb:item.thumb,
                name:item.name,
            });
        }
        props.onOk?.(files);
        onCancel();
    }
    const findListItemById = (id:number) => {
        for (let i = 0; i < list.length; i++) {
            let item:any = list[i];
            if(item.id === id) {
                return list[i];
            }
        }
        return null;
    }
    // 删除
    const del = (data:any) => {
        modal.confirm({
            title: '警告提示',
            content: '您要删除该项数据吗？删除后将无法恢复！',
            centered: true,
            maskClosable: true,
            onOk: () => {
                return new Promise<void>((resolve)=>{
                    delFileApi(data.id).then(res => {
                        resolve();
                        if (res.code == 200) {
                            getList();
                        } else {
                            message.error(res.msg, 1.2);
                        }
                    })
                })
            }
        })
    }
    // 保存文件
    const uploadFile=(res:CZHFileUploadResult)=> {
        let data = {
            domain: res.domain,
            type: res.type,
            name:res.name,
            key:res.key,
            url:res.url,
            pid,
            fileWidth:res.fileWidth,
            fileHeight:res.fileHeight,
            fileSize:res.fileSize,
            thumb:res.thumb
        }
        let fileType=res.type;
        addFileApi(data).then(res => {
            if (res.code == 200) {
                getList();
                message.success('成功！', 1.2);
                if (fileType === 8) {
                    setLoading(false);
                    setCreateVisible(false);
                }
            } else {
                message.error(res.msg, 1.2);
            }
        })
    }
    const onChange = (e:any) => {
        if(e.length>max)
        {
            e.splice(0,1);
        }
        setValue(e)
    }
    return (
        <React.Fragment>
            <CZHModal
                open={open}
                title={(
                    <div className='flexCenter'>
                        <Title title='文件库:' />
                        {fileName.map((item, index) => (
                            <span className={`color9 ${index < fileName.length - 1 ? ' cursor' : ''}`} key={String(item.id)} onClick={() => openFolder(item, index)}>{item.name}</span>
                        ))}
                    </div>
                )}
                width={824}
                onCancel={onCancel}
            >
                <div className='flwp'>
                    <Input
                        className='marginr12'
                        placeholder='请输入文件名称'
                        style={{ width: 200 }}
                        allowClear
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                    <Select
                        placeholder='请选择文件类型'
                        options={fileType}
                        className='marginr12'
                        value={type}
                        style={{ width: 140 }}
                        allowClear={props.type ? false : true}
                        disabled={props.type ? true : false}
                        onChange={(type) => {
                            setType(type);
                            setPage(1);
                        }}
                    />
                    <CZHUpload
                        dir={dir}
                        cropProps={props.cropProps}
                        crop={props.crop}
                        multiple={!props.crop}
                        accept={
                            props.type==1?"image/*":(
                                props.type==2?"video/*":(
                                    props.type==3?".xls,.xlsx":(
                                        props.type==4?".doc,.docx":(
                                            props.type==5?".pdf":(
                                                props.type==6?".zip,.rar":"image/*,video/*,.xls,.xlsx,.doc,.docx,.pdf"
                                            )
                                        )
                                    )
                                )
                            )
                        }

                        onPercent={(num) => {
                            setPercent(num);
                            if (num >= 100) {
                                setPercent(0);
                            }
                        }}
                        onError={(e) => {
                            message.error(e);
                        }}
                        onOk={(res:CZHFileUploadResult) => {
                            uploadFile(res)
                        }}
                    >
                        <Button className='marginr12' type='primary'>上传文件</Button>
                        {percent > 0 && <span className='jdttt' style={{ width: percent }} onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }}></span>}
                    </CZHUpload>
                    <Button type='primary' danger onClick={() => setCreateVisible(true)}>创建文件夹</Button>
                </div>
                {/* 列表 */}
                <div className='flwp uploadlist'>
                    <Checkbox.Group value={value} onChange={onChange}>
                    {list.map((item:any, index) => (
                        <div
                            className='item'
                            key={String(index)}
                            onDoubleClick={() => openFolder(item)}

                        >
                            <div className='kk' style={{ border: (item.type == 8 || item.type == 1) ? '0' : '' }}>
                                <GetItems item={item} />
                                {/* 是否选中 */}
                                {/*{isChecked(item) && <div className='mask'>*/}
                                {/*    <span className='iconfont icon-xuanze'></span>*/}
                                {/*</div>}*/}
                                {/* 删除 */}
                                <span className='iconfont icon-cuowu closeIcon' onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    // this.del(item)
                                    del(item)
                                }}></span>
                            </div>
                            <p className={"line1 cursor"}>
                                {item.type===8?
                                    <>{item.name}</>
                                :
                                    <Tooltip title={item.name}>
                                        <Checkbox disabled={props.type!=null && item.type!=props.type} value={item.id}>{item.name}</Checkbox>
                                    </Tooltip>
                                }
                            </p>
                        </div>
                    ))}
                    </Checkbox.Group>
                </div>
                {/* 页码 */}
                {total > 0 && <Pagination
                    current={page}
                    pageSize={24}
                    total={total}
                    showTotal={(total, range) => {
                        return `共${total}条记录，本页展示${range[0]}-${range[1]}条记录`
                    }}
                    showSizeChanger={false}
                    onChange={(page) => {
                        setPage(page)
                    }}
                />}
                <Button type="primary" disabled={value.length===0} className='marglauto block margt20' onClick={onOk}>确定</Button>
            </CZHModal>
            {/* 创建文件夹 */}
            <CZHModal
                width={360}
                open={createVisible}
                title={(<Title title='创建文件夹' />)}
                onCancel={onClose}
            >
                <Form
                    onFinish={onFinish}
                >
                    <Form.Item label='文件夹名称' name='name'>
                        <Input autoComplete='off' placeholder='请输入文件夹名称' />
                    </Form.Item>
                    <Button loading={loading} type="primary" htmlType='submit' className='marglauto block margt20'>确定</Button>
                </Form>
            </CZHModal>
        </React.Fragment>
    )
}

export default forwardRef(CZHFileList);
