import axios from '@/libs/api.request'
import store from '@/store'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

var token=store.state.user.token;

//分页
export const getPage = ({pageNum ,  pageSize ,  field ,  order,query={}  }) => {
  const data = {
    pageNum:pageNum,
    pageSize:pageSize,
    field:field,
    order:order,
    query:query
  }
  return axios.request({
    url: '/api/MaintainRecord/GetPage',
    data,
    method: 'post'
  }) 
}

//查询数据
export const getUserListData=(model)=>{
  const data={ query: model };
  return axios.request({
    url: 'api/MaintainRecord/GetDataList',
    data,
    method: 'post'
  })
}

//上传图片
export const uploadFile = baseUrl +"api/MaintainRecord/upload"

//添加
export const add=(model)=>{
  const data=model;
  return axios.request({
    url: 'api/MaintainRecord/Add',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//导入
export const Import=(modelList)=>{
  const data=modelList;
  return axios.request({
    url: 'api/MaintainRecord/Import',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//修改
export const edit=(model)=>{
  const data=model;
  return axios.request({
    url: 'api/MaintainRecord/Edit',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//获取维修单
export const getMaintainData=(id)=>{
  return axios.request({
    url: 'api/MaintainRecord/GetMaintainData/' + id,
    headers: {Authorization:"Bearer "+token},
    method: 'post'
  })
}

//接单
export const apply=(id)=>{
  return axios.request({
    url: 'api/MaintainRecord/Apply/' + id,
    headers: {Authorization:"Bearer "+token},
    method: 'post'
  })
}

//撤单
export const reject=(id)=>{
  return axios.request({
    url: 'api/MaintainRecord/Reject/' + id,
    headers: {Authorization:"Bearer "+token},
    method: 'post'
  })
}

//停用
export const remove=(id)=>{
  return axios.request({
    url: 'api/MaintainRecord/Delete/'+id,
    headers: {Authorization:"Bearer "+token},
    method: 'post'
  })
}

//批量删除
export const deleteBatch=(modelList)=>{
  const data=modelList;
  return axios.request({
    url: 'api/MaintainRecord/DeleteBatch',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}