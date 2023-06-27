'use strict';
// 获取数据库的引用
const db = uniCloud.database()

exports.main = async (event, context) => {

	const list = await db.collection('list')
	
	.get()
	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: list.data
	}
};
