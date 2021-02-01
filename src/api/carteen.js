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
    url: '/api/Canteen/GetPage',
    data,
    method: 'post'
  }) 
}

//查询数据
export const getUserListData=(model)=>{
  const data={ query: model };
  return axios.request({
    url: 'api/Canteen/GetDataList',
    data,
    method: 'post'
  })
}

// 搜索用户
export const searchCardId = (key) => {
	return axios.request({
	  url: 'api/Canteen/SearchCardId/'+key,
	  headers: {Authorization:"Bearer "+token},
	  method: 'post',
	})
}

//上传图片
export const uploadFile = baseUrl +"api/canteen/upload"

//添加
export const add=(model)=>{
  const data=model;
  return axios.request({
    url: 'api/Canteen/Add',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//导入
export const Import=(modelList)=>{
  const data=modelList;
  return axios.request({
    url: 'api/Canteen/Import',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//修改
export const edit=(model)=>{
  const data=model;
  return axios.request({
    url: 'api/Canteen/Edit',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}

//停用
export const remove=(id)=>{
  return axios.request({
    url: 'api/Canteen/Delete/'+id,
    headers: {Authorization:"Bearer "+token},
    method: 'post'
  })
}

//批量删除
export const deleteBatch=(modelList)=>{
  const data=modelList;
  return axios.request({
    url: 'api/Canteen/DeleteBatch',
    headers: {Authorization:"Bearer "+token},
    data,
    method: 'post'
  })
}