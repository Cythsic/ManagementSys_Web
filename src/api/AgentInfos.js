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
    url: '/api/AgentInfos/GetPage',
    data,
    method: 'post'
  }) 
}

// 搜索字典
export const getAgentInfosByDeptCode = (key) => {
	return axios.request({
	  url: 'api/AgentInfos/getAgentInfosByDeptCode/'+key,
	  headers: {Authorization:"Bearer "+token},
	  method: 'post',
	})
}

//添加
export const add=(model)=>{
  const data=model;
  return axios.request({
    url: 'api/AgentInfos/Add',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//导入
export const Import=(modelList)=>{
  const data=modelList;
  return axios.request({
    url: 'api/AgentInfos/Import',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//修改
export const edit=(model)=>{
  const data=model;
  return axios.request({
    url: 'api/AgentInfos/Edit',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//停用
export const remove=(id)=>{
  return axios.request({
    url: 'api/AgentInfos/Delete/'+id,
    headers: {Authorization:"Bearer "+token},
    method: 'post'
  })
}

//批量删除
export const deleteBatch=(modelList)=>{
  const data=modelList;
  return axios.request({
    url: 'api/AgentInfos/DeleteBatch',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}