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
    url: '/api/HRInputs/GetPage',
    data,
    method: 'post'
  }) 
}

//查询数据
export const getUserListData=(model)=>{
  const data={ query: model };
  return axios.request({
    url: 'api/HRInputs/GetDataList',
    data,
    method: 'post'
  })
}

//添加
export const add=(model)=>{
  const data=model;
  return axios.request({
    url: 'api/HRInputs/Add',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//导入
export const Import=(modelList)=>{
  const data=modelList;
  return axios.request({
    url: 'api/HRInputs/Import',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//修改
export const edit=(model)=>{
  const data=model;
  return axios.request({
    url: 'api/HRInputs/Edit',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//批量更新
export const UpdateBatch=(modelList)=>{
  const data=modelList;
  return axios.request({
    url: 'api/HRInputs/UpdateBatch',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//停用
export const remove=(id)=>{
  return axios.request({
    url: 'api/HRInputs/Delete/'+id,
    headers: {Authorization:"Bearer "+token},
    method: 'post'
  })
}

//批量删除
export const deleteBatch=(ids)=>{
  return axios.request({
    url: 'api/HRInputs/DeleteBatch/'+ids,
    headers: {Authorization:"Bearer "+token},
    method: 'post'
  })
}
