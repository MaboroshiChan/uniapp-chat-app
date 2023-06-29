<template>
	<view class="container">

		<view class="row"
			style="background: linear-gradient(to right,#b1f3f9,#96ec78) ;padding: 60rpx 20rpx 10rpx;color: #fff;">
			<view class="row" style="width: 150rpx;background-color: #fff;border-radius: 40rpx;justify-content: center;"
				@click="toggle('left')">
				<image style="width: 50rpx;height: 50rpx;padding: 5rpx 0;" src="/static/1.png" mode="aspectFill">
				</image>
				<!-- <view class="" style="margin-left: 20rpx;font-size: 32rpx;">
					{{userlist.name}}
				</view> -->
			</view>
			<view class="" style="width: 500rpx;text-align: center;font-size: 36rpx;font-weight: 600;">
				智能聊天回复器
			</view>
			<view class="" style="width: 150rpx;font-size: 60rpx;text-align: right;">
				<!-- <text @click="topage('/pages/add/add')">+</text> -->
			</view>
		</view>



		<view>
			<!-- 普通弹窗 -->
			<uni-popup ref="popup" background-color="#fff" @change="change">
				<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
					<!-- <view class="row"
						style="height: 300rpx;background-color: cornflowerblue;width: 100%;justify-content: center;">
						<image style="width: 150rpx;height: 150rpx;border-radius: 75rpx;border: 1rpx #96ec78 solid;"
							:src="userlist.portrait" mode=""></image>
					</view> -->
					<view class="" style="padding: 20rpx;">
						<view class="row" style="justify-content: center;margin: 40rpx 0;">
							<view class="row" style="background-color: #96ec78;width: 200rpx;justify-content: center;
							font-size: 32rpx;padding: 10rpx;border-radius: 10rpx;color: #fff;" @click="to_add">
								创建对话
							</view>
						</view>
						<view class="row box-btn" v-for="(item, index) in tablist">
							<view class="" @click="to_change(index)">
								<image style="width: 40rpx;height: 40rpx;margin-right: 20rpx;" src="../../static/3.png"
									mode=""></image>
							</view>
							<view class="" style="width: 340rpx;font-size: 28rpx;" @click="to_select(item.room)">
								{{ item.value }}
								<!-- <input  type="text" v-model="item.value" > -->
							</view>
							<view class="" @click="to_delete(index)">
								<image style="width: 40rpx;height: 40rpx;" src="../../static/2.png" mode=""></image>
							</view>
						</view>

					</view>


					<view class="" style="padding: 20rpx;">
						<view class="row"
							style="width: 300rpx;justify-content: space-between;font-size: 32rpx;margin-top: 20rpx;font-weight: 600;">
						</view>
						<view class="row"
							style="width: 300rpx;justify-content: space-between;font-size: 28rpx;margin-top: 20rpx;">
							<view class="">
								关于我的
							</view>
						</view>
					</view>


				</view>
			</uni-popup>
		</view>
		<view>
			<!-- 输入框示例 -->
			<uni-popup ref="inputDialog" type="dialog">
				<uni-popup-dialog ref="inputClose" mode="input" title="输入修改后的名字" value="" placeholder="请输入内容"
					@confirm="dialogInputConfirm"></uni-popup-dialog>
			</uni-popup>
		</view>

		<view class="">

			<scroll-view scroll-y="true" class="scroll-box"
				:style="{ 'height': (windowObj.windowHeight - windowObj.statusBarHeight - 96 + 'px') }"
				:scroll-top="scrollHeight">
				<view class="scroll-view">
					<view class="news-box" v-show="room == item.room" v-for="(item, index) in list" :key="index">

						<image class="avatar" :class="[item.isMe ? 'is-me' : 'avatar-right']" :src="item.avatar"
							mode="aspectFill" @longpress="to_delete_message(index)" v-if="item.target != 'prompt-box'"></image>

						<view class="message-box" style="position: relative;"
							:class="item.target == 'prompt-box' ? 'is-prompt' : { 'is-me': item.isMe }">

							<view class="message" :class="item.target">

								<view class="content-box">
									{{ item.content || '' }}<span class="cursor" v-if="item.isResponse && item.isResponding"></span>
								</view>

								<view class=""
									style="display: flex;justify-content: flex-end;align-items: center;color: #555" v-if="item.target!= 'prompt-box'">
									<view class="" style="display: flex;justify-content: flex-start;align-items: center;"
										@click="to_copy(item.content)">
										<image style="width: 30rpx;margin-right: 10rpx;" src="../../static/0/1.png"
											mode="widthFix"></image>
										<text class="">
											复制
										</text>
									</view>
									<view class=""
										style="display: flex;justify-content: flex-start;align-items: center;margin: 0 20rpx;"
										@click="to_delete_message(index)">
										<image style="width: 30rpx;margin-right: 10rpx;" src="../../static/0/2.png"
											mode="widthFix"></image>
										<text class="">
											删除
										</text>
									</view>
									<view class="" style="display: flex;justify-content: flex-start;align-items: center;"
										@click="to_regenerate()" v-if="item.target == 'red' && item.isResponse">
										<image style="width: 30rpx;margin-right: 10rpx;" src="../../static/0/3.png"
											mode="widthFix"></image>
										<text class="">
											重新生成
										</text>
									</view>
								</view>
							</view>

						</view>
					</view>
					<view style="display: flex;justify-content: center;align-items: center;" class="prompt"
						@tap="add_prompt()">
						点击输入提示语
					</view>
				</view>
			</scroll-view>

			<view class="base-btn">
				<view class="base-con unify-flex">
					<!-- <view class="send-image iconfont icon-icon" @tap="tapTo(1)"></view> -->
					<view class="send-input1" @tap="send_left(1, false)">{{(inputValue == '') ? '生成回复' : '发送'}}</view>

					<input class="input-text" type="text" :value="inputValue" placeholder="输入聊天记录" @input="getInput">

					<view :class="promptMode ? 'send-input-prompt' : 'send-input'"
						@tap="promptMode ? send_prompt() : send_right(1)">发送</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import currentDate from '@/common/util/currentDate.js';

export default {
	data() {
		return {
			type: 'center',
			value: '',
			xiugai: '',
			inputValue: '',
			list: [],
			image: '',
			scrollHeight: 0,
			now: '',
			tablist: [{
				room: 1535789553696,
				value: '新聊天'
			}],
			room: 0,
			promptMode: false,


			wendata: 'This is for a test purpose, you can change it to any value',
			wen: ''
		}
	},
	computed: {
		windowObj() {
			let obj;
			uni.getSystemInfo({
				success: res => {
					obj = res;
				}
			})
			return obj
		}
	},
	mounted() {
		this.initChatLog();

	},
	onLoad() {

	},
	methods: {
		// 获取后端数据流显示
		stream_read() {
			//ping test
			uni.request({
				url: "http://127.0.0.1:8000/ping",
				timeout: 15000,
				method: "GET",
				success: (res) => {
					
					var wenlen = 0;
					this.inputValue = '';
					//回复
					//修改做后一个message
					let lastMessageIndex = this.list.length - 1;
					//this.list[lastMessageIndex].isResponding = true;
					
					const msg = res.data.text;
					
					this.timer = setInterval(() => {
						//取到wendata的第wenlen位
						this.inputValue = msg.substr(0, wenlen);
						this.list[lastMessageIndex].content = this.inputValue;
						//wenlen大于wendata的长度，停止计时器
						if (wenlen < msg.length) {
							wenlen++;
						} else {
							clearInterval(this.timer);
							this.inputValue = '';
							this.list[lastMessageIndex].isResponding = false;
						}
					}, 50);
				},
				fail: (err)=>{
					console.error(err);
					console.log("请求失败");
				}
			});
			
			//声明一个变量，用来监听要分割的长度
		},

		to_select(room) {
			this.room = room
			console.log('选择', this.room);
			this.$refs.popup.close()
		},
		to_delete(index) {
			let that = this
			uni.showModal({
				title: '注意',
				content: '请问是否删除',
				success: function (res) {
					if (res.confirm) {
						console.log('用户点击确定');
						that.tablist.splice(index, 1)
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});


		},
		to_copy(value) {
			//提示模板
			uni.setClipboardData({
				data: value, //要被复制的内容
				success: () => { //复制成功的回调函数
					uni.showToast({ //提示
						title: '复制成功'
					})
				}
			});
		},
		to_regenerate() {

			uni.showModal({
				content: "请问是否重新生成",
				confirmText: '重新生成',
				success: () => {

					uni.showLoading({
						title: '生成中'
					})
				}
			});


		},

		to_add() {
			this.tablist.push({
				room: Date.now(),
				value: '请编辑名字'
			})
		},

		to_change(index) {
			this.xiugai = index
			this.$refs.inputDialog.open()
		},

		dialogInputConfirm(val) {
			uni.showLoading({
				title: '修改中'
			})
			setTimeout(() => {
				uni.hideLoading()
				console.log(val)
				this.value = val
				this.tablist[this.xiugai].value = val
				// 关闭窗口后，恢复默认内容
				this.$refs.inputDialog.close()
			}, 1000)
		},


		change(e) {
			console.log('当前模式：' + e.type + ',状态：' + e.show);
		},
		toggle(type) {
			this.type = type
			// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
			this.$refs.popup.open(type)
		},
		to_delete_message(index) {
			let that = this
			uni.showModal({
				title: '注意',
				content: '请问是否删除',
				success: function (res) {
					if (res.confirm) {
						that.list.splice(index, that.list.length);
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},

		tapTo(state) {
			switch (state) {
				case 1:
					this.image =
						'https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2021%2F0826%2F6def4faej00qygdfw009kd200u001hcg00u001hc.jpg&thumbnail=660x2147483647&quality=80&type=jpg'; // 上传的图片路径
					this.send_right(2)
					break
				case 2:
					this.send_right(1)
					break
				case 3:
					let images = [];
					this.list.forEach((item, index) => {
						if (item.type === 2) {
							images.push(item.content)
						}
					})

					uni.previewImage({
						urls: images,
						css: 'background-position: center;background-size:contain;'
					});
					break
				default:
					break
			}
		},


		getInput(e) {
			this.inputValue = e.detail.value;
		},

		send_right(type) {
			this.now = currentDate.getDate()
			console.log(this.now)
			var message = {
				type: "say",
				message_type: type,
				fromid: 1,
				toid: 2,
				content: type !== 2 ? this.inputValue : this.image,
				fromname: '自己的用户名',
				toname: '对方的用户名',
				isMe: true,
				target: "blue",
				isResponding: false,
				room: this.room,
				avatar: 'https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2021%2F0826%2F6def4faej00qygdfw009kd200u001hcg00u001hc.jpg&thumbnail=660x2147483647&quality=80&type=jpg' // 自己的头像
			};
			this.list = this.list.concat([message])
			this.inputValue = "";
			this.setScrollTop();
		},
		send_left(type, isResponse) {
			var message = {
				type: 1,
				message_type: type,
				fromid: 1,
				toid: 2,
				content: this.inputValue,
				fromname: '自己的用户名',
				toname: '对方的用户名',
				isMe: false,
				target: "red",
				isResponse: isResponse,
				room: this.room,
				avatar: '/static/logo.png'
			};
			this.list = this.list.concat([message]);
			if(this.inputValue == ""){
				console.log("Call LLM");
				message.isResponse = true;
				message.isResponding = true;
				this.stream_read();
			}
			this.inputValue = "";
			this.setScrollTop();
		},
		initChatLog() {
			setTimeout(() => {
				this.list = []
			}, 500)

		},

		setScrollTop() {
			this.$nextTick(() => {
				let scrollView = uni.createSelectorQuery().select('.scroll-view');
				scrollView.fields({
					size: true
				}, data => {
					let height = data.height;
					this.scrollHeight = height;
				}).exec();
			});
		},

		add_prompt() {
			// change the function of button.
			this.promptMode = !(this.promptMode);
		},

		send_prompt(type) {
			var message = {
				type: 1,
				message_type: type,
				fromid: 1,
				toid: 3,
				content: this.inputValue,
				fromname: '自己的用户名',
				toname: '对方的用户名',
				isMe: false,
				target: "prompt-box",
				isResponse: false,
				isResponding: false,
				room: this.room,	
			};
			this.list = this.list.concat([message])
			this.inputValue = "";
			this.setScrollTop();
			// ...
			this.promptMode = false;
		},
	}
}
</script>
<style lang="scss">
@mixin flex {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
}

@mixin height {
	/* #ifndef APP-NVUE */
	height: 100%;
	/* #endif */
	/* #ifdef APP-NVUE */
	flex: 1;
	/* #endif */
}

.row {
	display: flex;
	justify-items: center;
	align-items: center;
}

.box {
	@include flex;
}

.box-btn {
	border-bottom: 1rpx #f5f5f5 solid;
	// width: 340rpx;
	justify-content: space-between;
	font-size: 28rpx;
	margin-top: 20rpx;
}


.popup-content {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: space-between;
	background-color: #fff;
	width: 480rpx;
}

.column {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	background-color: #fff;
}


.popup-height {
	height: 100vh;
	// width: 200px;
	// background-color: #FFB967;
}

.text {
	font-size: 12px;
	color: #333;
}

@import url("/static/iconfont.css");

.base-btn {
	position: fixed;
	width: 100%;
	height: 120rpx;
	bottom: var(--window-bottom);
	left: 0;
	justify-content: space-between;
	background-color: #FFFFFF;
	border-top: 1rpx #f5f5f5 solid;
}

.row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-direction: row;
}

.base-con {
	margin-top: 7.5px;
	display: flex;
	height: inherit;
	align-items: center;
	justify-content: space-between;

}

.send-image {
	width: 35px;
	line-height: 35px;
	background-color: #FFB967;
	border-radius: 50%;
	text-align: center;
	color: #FFFFFF;
	font-size: 30rpx;
}

.input-text {
	width: 50%;
	height: 35px;
	background-color: #F2F2F2;
	border-radius: 8px;
	padding: 0 15px;
}

.red {
	background-color: skyblue;
}

.prompt-box {
	margin: auto;
	background-color: #FFB967;
}

.prompt {
	word-wrap: break-word;
	position: relative;
	background-color: lightsteelblue;
	border-radius: 10px;
	opacity: 50%;
	background-size: 300px;
	width: 150px;
	height: 30px;
	text-align: center;
	top: 30px;
	margin: auto;
}

.send-input1 {
	width: 18%;
	line-height: 35px;
	text-align: center;
	background-color: skyblue;
	border-radius: 8px;
	color: #FFFFFF;
}

.blue {
	background-color: lightpink;
}

.send-input {
	width: 18%;
	line-height: 35px;
	text-align: center;
	background-color: lightpink;
	border-radius: 8px;
	color: #FFFFFF;
}

.send-input-prompt {
	width: 18%;
	line-height: 35px;
	text-align: center;
	background-color: #FFB967;
	border-radius: 8px;
	color: #333;
}

.scroll-view,
.base-con {
	margin: 0 15px;
}

.avatar {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	float: left;
	margin-top: 20px;
}

.avatar-right {
	margin-right: 10px;
}

.message-box {
	max-width: 76%;
	display: block;
	word-wrap: break-word;
	/* 控制消息框换行 */
}

.message {
	max-width: 380rpx;
	font-size: 24rpx;
	// background-color: #E6E6E6;
	padding: 15px;
	float: left;
	border-radius: 8px;
	overflow: hidden;
	word-break: break-all;
	white-space: pre-wrap;
	margin-top: 20px;
}

.message-image {
	width: 80px;
	height: 130px;
	padding: 15px 0;
	border-radius: 8px;
	overflow: hidden;
}

.news-box::after {
	content: "";
	display: block;
	clear: both;
}

.news-box:last-child .message {
	margin-bottom: 20px;
}

.is-me {
	float: right;
	margin-left: 10px;
}

.is-prompt {
	margin: auto;
	text-align: center;
	display: flex;
	align-items: center;
	// background-color: blue;
}
.cursor {
	display: inline-block;
	width: 5px;
	height: 15px;
	background-color: #000;
  }
</style>