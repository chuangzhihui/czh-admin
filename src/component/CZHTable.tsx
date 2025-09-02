import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {message, Select, SelectProps, Table, TableProps} from 'antd';
import req, {HttpResponse} from '../util/request';
import {getAdminSelectListApi, getRoleSelectListApi} from "../api/common/CommonApi";
import Helper from "../util/Helper";
export interface CZHPageRequestProps{
    page:number;
    size:number;
    orderBy:string;
}
export interface CustomerTableProps extends TableProps{
    data?:any[],
    total?:number;
    page?:number;
    pageSize?:number;
    auto?:boolean;//是否自动加载数据
    onRefresh:(pageRequest:CZHPageRequestProps,callBack:(res:HttpResponse)=>void) => void;

}
const CZHTable=(props:CustomerTableProps, ref:any)=>{
    const [loading,setLoading]=useState<boolean>(false);
    const [pageSize,setPageSize]=useState<number>(props.pageSize||10);//每页展示条数
    const [orderBy,setOrderBy]=useState<string>("");//排序
    const [page,setPage]=useState<number>(props.page||1);//页码
    const[total,setTotal]=useState<number>(props.total||0);//数据总长度-包含未加载的
    const [data,setData]=useState<any[]>(props.data || []);//数据
    const [isInit,setIsInit]=useState<boolean>(true);
    const [auto,setAuto]=useState<boolean>(props.auto || false);
    useEffect(() => {
        if(isInit){
            if(auto){
                getList();
            }
        }else{
            getList();
        }

    }, [page,pageSize,orderBy]);
    //重载当前页数据
    const getList=()=> {
        setIsInit(false);
        setLoading(true);
        console.log("请求数据:page:{}",page)
        props.onRefresh({page,size:pageSize,orderBy},(res:HttpResponse)=>{
            setLoading(false);
            if(res.code===200)
            {
                setTotal(res.data.total);
                setData(initData(res.data.list, res.data.total))
            }else{
                message.error(res.msg)
            }
        });
    }
    const initData=(arry:any[], total:number,pkey=""):any[]=> {
        let arryNew:any[] = []
        arry.map((item, index) => {
            console.log(index, total, pageSize, page, orderBy);
            let key = Helper.getNum(index, total, pageSize, page, orderBy)

            if(pkey!="")
            {
                key=pkey+"-"+key
            }
            if(item.child && item.child.length > 0)
            {
                item.child =initData(item.child, item.child.length,key)
            }
            arryNew.push(Object.assign({}, item, { key: key }))
        })
        return arryNew
    }
    const onRefresh=(refreshPage:number)=>{
        if(!refreshPage){
            refreshPage=1;
        }
        if(refreshPage===page)
        {
            getList();
        }else{
            setPage(refreshPage);
        }

    }
    useImperativeHandle(ref,()=>({
       onRefresh
    }))
    return(
        <Table
            className='pubList margl24 margr24'
            loading={loading}
            pagination={{
                position: ["bottomLeft"],
                pageSize,
                current:page,
                total:total,
                showSizeChanger: true,

                showTotal: (total:number, range:[number, number]):string => {
                    var num:number = range[0],
                        num1:number = range[1]
                    let numStr:string = num < 10 ? ('0' + num) : String(num);
                    let numStr1:string = num1 < 10 ? ('0' + num1) : String(num1);
                    return `共${total}条记录，本页展示${numStr}-${numStr1}条记录`
                }
            }}
            dataSource={data}
            onChange={(page, filters, sorter:any) => {
                var orderByStr:string = "";
                if (sorter.order) {
                    if (sorter.order === "ascend") {
                        orderByStr = "asc";
                    } else if (sorter.order === "descend") {
                        orderByStr = "desc";
                    }
                }
                setOrderBy(orderByStr);
                setPage(page.current || 1);
                setPageSize(page.pageSize || 10)
            }}
            scroll={{x:1000 }}
            {...props}
        />
    );
}

export default forwardRef(CZHTable);
