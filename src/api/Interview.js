import axios from '@/libs/api.request'
import store from '@/store'

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
    url: '/api/Interview/GetPage',
    data,
    method: 'post'
  }) 
}

//查询数据
export const getUserListData=(model)=>{
  const data={ query: model };
  return axios.request({
    url: 'api/Interview/GetDataList',
    data,
    method: 'post'
  })
}

//添加
export const add=(model)=>{
  const data=model;
  return axios.request({
    url: 'api/Interview/Add',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//导入
export const Import=(modelList)=>{
  const data=modelList;
  return axios.request({
    url: 'api/Interview/Import',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//修改
export const edit=(model)=>{
  const data=model;
  return axios.request({
    url: 'api/Interview/Edit',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//停用
export const remove=(id)=>{
  return axios.request({
    url: 'api/Interview/Delete/'+id,
    headers: {Authorization:"Bearer "+token},
    method: 'post'
  })
}

//更新状态
export const updateStaus=(model)=>{
  const data=model;
  console.log("data:" + model);
  return axios.request({
    url: 'api/Interview/UpdateStatus',
    headers: {Authorization:"Bearer "+token},
	data,
    method: 'post'
  })
}


//批量删除
export const deleteBatch=(modelList)=>{
  const data=modelList;
  return axios.request({
    url: 'api/Interview/DeleteBatch',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//批量更新
export const UpdateBatch=(modelList)=>{
  const data=modelList;
  return axios.request({
    url: 'api/Interview/UpdateBatch',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}