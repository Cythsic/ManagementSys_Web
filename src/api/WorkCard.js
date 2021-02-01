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
    url: '/api/WorkIDInfos/GetPage',
    data,
    method: 'post'
  }) 
}

//查询数据
export const getUserListData=(model)=>{
  const data={ query: model };
  return axios.request({
    url: 'api/WorkIDInfos/GetDataList',
    data,
    method: 'post'
  })
}

// 搜索用户
export const searchWorkId = () => {
	return axios.request({
	  url: 'api/WorkIDInfos/SearchWorkId',
	  headers: {Authorization:"Bearer "+token},
	  method: 'get'
	})
}

//添加
export const add=(model)=>{
  const data=model;
  return axios.request({
    url: 'api/WorkIDInfos/Add',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//导入
export const Import=(modelList)=>{
  const data=modelList;
  return axios.request({
    url: 'api/WorkIDInfos/Import',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//修改
export const edit=(model)=>{
  const data=model;
  return axios.request({
    url: 'api/WorkIDInfos/Edit',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//批量更新
export const UpdateBatch=(modelList)=>{
  const data=modelList;
  return axios.request({
    url: 'api/WorkIDInfos/UpdateBatch',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//停用
export const remove=(id)=>{
  return axios.request({
    url: 'api/WorkIDInfos/Delete/'+id,
    headers: {Authorization:"Bearer "+token},
    method: 'post'
  })
}

//批量删除
export const deleteBatch=(modelList)=>{
  const data=modelList;
  return axios.request({
    url: 'api/WorkIDInfos/DeleteBatch',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}