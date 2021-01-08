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
    url: '/api/AgentInputs/GetPage',
    data,
    method: 'post'
  }) 
}

//查询数据
export const getUserListData=(model)=>{
  const data={ query: model };
  return axios.request({
    url: 'api/AgentInputs/GetDataList',
    data,
    method: 'post'
  })
}

// 搜索用户
export const searchCardId = (key) => {
	return axios.request({
	  url: 'api/AgentInputs/SearchCardId/'+key,
	  headers: {Authorization:"Bearer "+token},
	  method: 'post',
	})
}

//添加
export const add=(model)=>{
  const data=model;
  return axios.request({
    url: 'api/AgentInputs/Add',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//导入
export const Import=(modelList)=>{
  const data=modelList;
  return axios.request({
    url: 'api/AgentInputs/Import',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//修改
export const edit=(model)=>{
  const data=model;
  return axios.request({
    url: 'api/AgentInputs/Edit',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//停用
export const remove=(id)=>{
  return axios.request({
    url: 'api/AgentInputs/Delete/'+id,
    headers: {Authorization:"Bearer "+token},
    method: 'post'
  })
}

//批量删除
export const deleteBatch=(ids)=>{
  return axios.request({
    url: 'api/AgentInputs/DeleteBatch/'+ids,
    headers: {Authorization:"Bearer "+token},
    method: 'post'
  })
}
