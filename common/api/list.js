//添加
import $http from '../http.js'


export const get_list = (data) => {
	return $http({
		url:'get_list',
		data
	})
}



