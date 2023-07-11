<template>
	<view class="container">

		<view class="row"
			style="background: linear-gradient(to right,#b1f3f9,#96ec78) ;padding: 60rpx 20rpx 10rpx;color: #fff;position: fixed;z-index: 2;width: 100%;">
			<view class="row" style="width: 150rpx;background-color: #fff;border-radius: 40rpx;justify-content: center;"
				@click="toggle('left')">
				<image style="width: 50rpx;height: 50rpx;padding: 5rpx 0;" src="/static/1.png" mode="aspectFill">
				</image>
				<!-- <view class="" style="margin-left: 20rpx;font-size: 32rpx;">
					{{userlist.name}}
				</view> -->
			</view>
			<view class="" style="width: 500rpx;text-align: center;font-size: 36rpx;font-weight: 600;">
				{{ chat_name }}
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
				
				:scroll-top="scrollHeight">
				<view class="scroll-view">
					<view class="news-box" v-show="room === item.room" v-for="(item, index) in messages" :key="index">

						<image class="avatar" :class="[item.target === 'blue' ? 'is-me' : 'avatar-right']" :src="item.avatar"
							mode="aspectFill" @longpress="to_delete_message(index)" v-if="item.target != 'prompt-box'"></image>

						<view class="message-box" style="position: relative;"
							:class="item.target === 'prompt-box' ? 'is-prompt' : { 'is-me': item.target === 'blue' }" @click="to_copy(item.content)">

							<view class="message" :class="item.target">

								<view class="content-box">
									{{ item.content || item.cached_msg[0] || '' }}<span class="cursor" v-if="item.isResponse && item.isResponding"></span>
								</view>

								<view class=""
									style="display: flex;justify-content: flex-end;align-items: center;color: #555" v-if="item.target!='prompt-box'">
									<view class="switch" style="display: flex;justify-content: flex-start;align-items: center;"
										@click.stop="to_up(item)" v-if="item.target === 'red' && item.isResponse">
										<image style="width: 30rpx;margin-right: 10rpx;" src="../../static/1/3.png"
											mode="widthFix"></image>
										<text class="">
											上一个
										</text>
									</view>
									<view class=""
										style="display: flex;justify-content: flex-start;align-items: center;margin: 0 20rpx;"
										@click.stop="to_delete_message(index)">
										<image style="width: 30rpx;margin-right: 10rpx;" src="../../static/0/2.png"
											mode="widthFix"></image>
									</view>
									<view class="switch" style="display: flex;justify-content: flex-start;align-items: center;"
										@click.stop="to_down(item)" v-if="item.target === 'red' && item.isResponse">
										<image style="width: 30rpx;margin-right: 10rpx;" src="../../static/1/4.png"
											mode="widthFix"></image>
										<text class="">
											下一个
										</text>
									</view>
								</view>
								<view class=""
									style="display: flex;justify-content: space-around;align-items: center;color: #555;width: 200rpx;margin: 20rpx auto 0;" 
									v-if="item.target === 'red' && item.isResponse">
									<view class="" style="display: flex;justify-content: flex-start;align-items: center;margin-right: 40rpx;"
										@click.stop="to_zan(item.content)">
										<image style="width: 30rpx;margin-right: 10rpx;" src="../../static/1/1.png"
											mode="widthFix"></image>
									</view>
									
									<view class="" style="display: flex;justify-content: flex-start;align-items: center;margin-right: 20rpx;"
										@click.stop="to_cai(item.content)">
										<image style="width: 30rpx;margin-right: 10rpx;" src="../../static/1/2.png"
											mode="widthFix"></image>
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
					<view class="send-input1" @tap="send_left(false)">{{(inputValue === '') ? '生成回复' : '发送'}}</view>

					<input class="input-text" type="text" :value="inputValue" placeholder="输入聊天记录" @input="getInput">

					<view :class="promptMode ? 'send-input-prompt' : 'send-input'"
						@tap="promptMode ? send_prompt() : send_right()">发送</view>
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
			chat_name: '新聊天',
			value: '',
			xiugai: '',
			inputValue: '',
			all_messages: [
				{
					content: "你好嘛",
					isMe: true,
					target: "blue",
					room: 1535789553697,
					avatar: 'https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2021%2F0826%2F6def4faej00qygdfw009kd200u001hcg00u001hc.jpg&thumbnail=660x2147483647&quality=80&type=jpg', // 自己的头像,
				},
				{
					content: "你是谁嘛",
					isMe: true,
					target: "blue",
					room: 1535789553697,
					avatar: 'https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2021%2F0826%2F6def4faej00qygdfw009kd200u001hcg00u001hc.jpg&thumbnail=660x2147483647&quality=80&type=jpg', // 自己的头像,
				},
				{
					content: "",
					isMe: false,
					target: "red",
					isResponse: true,
					room: 1535789553697,
					avatar: '/static/logo.png',
					up_or_down: null,
					cached_msg: [
						"你很好吗?",
						"这是什么呢",
						"好奇怪呢",
						"我也很好奇",
						"你好嘛你好嘛你好嘛你好嘛你好嘛你好嘛你好嘛你好嘛你好嘛"
					],
					current_msg_index: 0
				}
			],
			messages: [],
			image: '',
			scrollHeight: 0,
			now: '',
			tablist: [{
				room: 1535789553696,
				value: '新聊天'
			},{
				room: 1535789553697,
				value: '演示1'
			}],
			promptMode: false,
			room: 0,
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
		this.room = this.tablist[0].room
		this.messages = this.all_messages.filter(item => item.room === this.room);
		this.setScrollTop();
		uni.connectSocket({
			url: 'ws://127.0.0.1:9000',
			data: {
				'usr_id': '1234567890'
			},
			header: {
				'content-type': 'application/json'
			}
		});
		
		uni.onSocketMessage(res=>{
			console.log(`received data ${res.data}`);
			console.log("connected sucessfully");
		});
	},
	onLoad() {

	},
	
	methods: {
		
		// 获取后端数据流显示
		stream_read(){
			uni.onSocketOpen(res => {
				uni.sendSocketMessage({
					data: "",
					
				})
			});
		},
		
		//常规请求
		request_read() {
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
					let lastMessageIndex = this.messages.length - 1;
					//this.list[lastMessageIndex].isResponding = true;
					const msg = res.data.text;
					//this.cache_msg(msg, res, 5);
					this.timer = setInterval(() => {
						//取到wendata的第wenlen位
						this.inputValue = msg.substr(0, wenlen);
						this.messages[lastMessageIndex].content = this.inputValue;
						//wenlen大于wendata的长度，停止计时器
						if (wenlen < msg.length) {
							++wenlen;
						} else {
							clearInterval(this.timer);
							this.inputValue = '';
							this.messages[lastMessageIndex].isResponding = false;
							console.log(`messages: ${this.messages}`);
						}
					}, 50);
				},
				fail: (err) => {
					console.error(err);
					console.log("请求失败");
				}
			});
			//声明一个变量，用来监听要分割的长度
			
		},
		
		cache_msg(messge, res, n) {
			for(let i = 0; i < n; ++i){
				message.cached_msg.push(res.data.more_msg[i])
			}
		},
		
		to_select(room) {
			this.room = room;
			console.log('选择', this.room);
			this.messages = this.all_messages.filter(item => item.room === room);
			this.chat_name = this.tablist.find(item => item.room === room).value
			this.setScrollTop();
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
		//上一个，下一个
		to_up(item){
			//item.current_msg_index;
			if(item.current_msg_index === 0){
				return;
			}
			
			item.content = item.cached_msg[--item.current_msg_index];
			uni.showToast({
				title: '上一个',
				icon:'none'
			})
		},
		
		to_down(item){
			if(item.current_msg_index === item.cached_msg.length - 1){
				return;
			}
			
			item.content = item.cached_msg[++item.current_msg_index];
			uni.showToast({
				title: '下一个',
				icon:'none'
			})
		},
		
		to_zan(value){
			uni.showToast()
			uni.showToast({
				title: '谢谢反馈',
				icon: 'none'
			})
		},
		to_cai(value){
			uni.showToast({
				title: '谢谢反馈',
				icon: 'none'
			})
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
			});

			setTimeout(() => {
				uni.hideLoading()
				console.log(val)
				this.value = val
				this.tablist[this.xiugai].value = val
				// 关闭窗口后，恢复默认内容
				this.$refs.inputDialog.close()
			}, 1000);
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
						that.messages.splice(index, that.messages.length);
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},

		getInput(e) {
			this.inputValue = e.detail.value;
		},

		send_right() {
			this.now = currentDate.getDate()
			console.log(this.now)
			var message = {
				content: this.inputValue,
				target: "blue",
				room: this.room,
				avatar: 'https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2021%2F0826%2F6def4faej00qygdfw009kd200u001hcg00u001hc.jpg&thumbnail=660x2147483647&quality=80&type=jpg', // 自己的头像,
			};
			this.all_messages = this.all_messages.concat([message]);
			this.messages = this.all_messages.filter(item => item.room === this.room);
			this.inputValue = "";
			this.setScrollTop();
		},
		send_left(isResponse) {
			// TODO: In response mode, display content in cached_msg.
			var message = {
				content: this.inputValue,
				target: "red",
				isResponse: isResponse,
				room: this.room,
				avatar: '/static/logo.png',
				up_or_down: null,
				cached_msg: [],
				current_msg_index: 0
			};
			this.all_messages = this.all_messages.concat([message]);
			this.messages = this.all_messages.filter(item => item.room === this.room);
			if(this.inputValue === ""){
				console.log("Call LLM");
				message.isResponse = true;
				message.isResponding = true;
				this.request_read();
			}
			this.inputValue = "";
			this.setScrollTop();
		},

		send_prompt() {
			var message = {
				content: this.inputValue,
				target: "prompt-box",
				isResponse: false,
				isResponding: false,
				room: this.room,	
			};
			this.all_messages = this.all_messages.concat([message]);
			this.messages = this.all_messages.filter(item => item.room === this.room);

			this.inputValue = "";
			this.setScrollTop();
			// ...
			this.promptMode = false;
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
		}
		
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
	padding: 20rpx 0;
	// height: 120rpx;
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


.scroll-box{
	height: 100vh;
	// background-color: #FFB967;
	padding: 120rpx 0 130rpx;
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