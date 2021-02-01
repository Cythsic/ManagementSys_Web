import axios from '@/libs/api.request'
import store from '@/store'

var token=store.state.user.token;

// 获取全部字典
export const getAllDictList=(model)=>{
  const data={ query: model };
  return axios.request({
    url: 'api/dicttype/getAllDictList',
    data,
    method: 'post'
  })
}

// 添加字典
export const addDict = (model) => {
    const data=model;
	return axios.request({
	  url: 'api/dicttype/add/',
	  headers: {Authorization:"Bearer "+token},
	  data,
	  method: 'post',
	})
}
// 编辑字典
export const editDict = (model) => {
	const data=model;
	return axios.request({
	  url: 'api/dicttype/edit/',
	  headers: {Authorization:"Bearer "+token},
	  data,
	  method: 'post',
	})
}
// 删除字典
export const deleteDict = (id) => {
	return axios.request({
	  url: 'api/dicttype/delete/' + id,
	  headers: {Authorization:"Bearer "+token},
	  method: 'post',
	})
}
// 搜索字典
export const searchDict = (key) => {
	return axios.request({
	  url: 'api/dicttype/searchDict/'+key,
	  headers: {Authorization:"Bearer "+token},
	  method: 'post',
	})
}

// 获取全部字典数据
export const getAllDictDataList = (model) => {	
  const data={ query: model };
	return axios.request({
	  url: 'api/dictmanage/GetDataList/',
	  headers: {Authorization:"Bearer "+token},
	  data,
	  method: 'post',
	})
}

// 查找字典数据
export const searchDictData = (key) => {	
	return axios.request({
	  url: 'api/dictmanage/searchDictData/' + key,
	  headers: {Authorization:"Bearer "+token},
	  method: 'post',
	})
}

// 添加字典数据
export const addDictData = (params) => {
	const data=params;
	return axios.request({
	  url: 'api/dictmanage/add/',
	  headers: {Authorization:"Bearer "+token},
	  data,
	  method: 'post',
	})
}
// 编辑字典数据
export const editDictData = (params) => {
	const data=params;
	return axios.request({
	  url: 'api/dictmanage/edit/',
	  headers: {Authorization:"Bearer "+token},
	  data,
	  method: 'post',
	})
}
// 删除字典数据
export const deleteData = (ids) => {
	return axios.request({
	  url: 'api/dictmanage/delete/' +ids,
	  headers: {Authorization:"Bearer "+token},
	  method: 'post',
	})
}
// 通过类型获取字典数据
export const getDictDataByType = (type) => {
	return axios.request({
	  url: 'api/dictmanage/GetDictDataByType/' +type,
	  headers: {Authorization:"Bearer "+token},
	  method: 'post',
	})
}