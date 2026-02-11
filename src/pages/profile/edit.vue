<template>
	<view class="edit-page">
		<view class="edit-header">
			<view class="header-bg"></view>
			<view class="avatar-section">
				<view class="avatar" @tap="chooseAvatar">
					👤
					<view class="avatar-mask">
						<text class="camera-icon">📷</text>
					</view>
				</view>
				<text class="avatar-tip">点击更换头像</text>
			</view>
		</view>

		<view class="form-container">
			<view class="form-section">
				<view class="section-title">基本信息</view>
				
				<view class="form-item">
					<view class="item-label">姓名</view>
					<input 
						class="item-input" 
						v-model="formData.name" 
						placeholder="请输入姓名"
					/>
				</view>

				<view class="form-item">
					<view class="item-label">工号</view>
					<input 
						class="item-input disabled" 
						v-model="formData.employeeId" 
						disabled
					/>
				</view>

				<view class="form-item">
					<view class="item-label">公司</view>
					<input 
						class="item-input" 
						v-model="formData.company" 
						placeholder="请输入公司名称"
					/>
				</view>

				<view class="form-item">
					<view class="item-label">部门</view>
					<input 
						class="item-input" 
						v-model="formData.department" 
						placeholder="请输入部门"
					/>
				</view>

				<view class="form-item">
					<view class="item-label">职位</view>
					<input 
						class="item-input" 
						v-model="formData.position" 
						placeholder="请输入职位"
					/>
				</view>
			</view>

			<view class="form-section">
				<view class="section-title">联系方式</view>
				
				<view class="form-item">
					<view class="item-label">手机号</view>
					<input 
						class="item-input" 
						v-model="formData.phone" 
						type="number"
						placeholder="请输入手机号"
					/>
				</view>

				<view class="form-item">
					<view class="item-label">邮箱</view>
					<input 
						class="item-input" 
						v-model="formData.email" 
						placeholder="请输入邮箱"
					/>
				</view>
			</view>
		</view>

		<view class="bottom-actions">
			<button class="cancel-btn" @tap="handleCancel">取消</button>
			<button class="save-btn" @tap="handleSave">保存</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'  // ← 修改这里

const formData = ref({
	name: '',
	employeeId: '',
	company: '',
	department: '',
	position: '',
	phone: '',
	email: ''
})

// 页面加载时获取传递的数据
onLoad((options) => {
	console.log('接收到的参数:', options) // 添加调试日志
	if (options.data) {
		try {
			const userData = JSON.parse(decodeURIComponent(options.data))
			formData.value = { ...formData.value, ...userData }
			console.log('解析后的数据:', formData.value)
		} catch (e) {
			console.error('解析用户数据失败', e)
			uni.showToast({
				title: '数据加载失败',
				icon: 'none'
			})
		}
	}
})
// 选择头像
const chooseAvatar = () => {
	uni.showActionSheet({
		itemList: ['拍照', '从相册选择'],
		success: (res) => {
			const sourceType = res.tapIndex === 0 ? ['camera'] : ['album']
			uni.chooseImage({
				count: 1,
				sourceType,
				success: (res) => {
					uni.showToast({
						title: '头像已选择',
						icon: 'success'
					})
					// 这里可以上传头像到服务器
				}
			})
		}
	})
}

// 取消编辑
const handleCancel = () => {
	uni.showModal({
		title: '提示',
		content: '确定要放弃修改吗？',
		success: (res) => {
			if (res.confirm) {
				uni.navigateBack()
			}
		}
	})
}

// 保存修改
const handleSave = () => {
	// 表单验证
	if (!formData.value.name) {
		uni.showToast({
			title: '请输入姓名',
			icon: 'none'
		})
		return
	}

	if (!formData.value.company) {
		uni.showToast({
			title: '请输入公司名称',
			icon: 'none'
		})
		return
	}

	// 保存到本地存储
	uni.setStorageSync('userInfo', formData.value)

	uni.showToast({
		title: '保存成功',
		icon: 'success',
		duration: 1500
	})

	setTimeout(() => {
		uni.navigateBack()
	}, 1500)
}
</script>

<style scoped>
.edit-page {
	min-height: 100vh;
	background: #f5f7fa;
}

.edit-header {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 80rpx 0 100rpx;
	position: relative;
	overflow: hidden;
}

.header-bg {
	position: absolute;
	top: -50%;
	right: -20%;
	width: 600rpx;
	height: 600rpx;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 50%;
}

.avatar-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	z-index: 1;
}

.avatar {
	width: 200rpx;
	height: 200rpx;
	border-radius: 50%;
	background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 88rpx;
	border: 8rpx solid rgba(255, 255, 255, 0.3);
	position: relative;
	overflow: hidden;
}

.avatar-mask {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 60rpx;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
}

.camera-icon {
	font-size: 32rpx;
}

.avatar-tip {
	color: #fff;
	font-size: 24rpx;
	margin-top: 24rpx;
	opacity: 0.9;
}

.form-container {
	padding: 40rpx;
	padding-bottom: 200rpx;
}

.form-section {
	background: #fff;
	border-radius: 32rpx;
	padding: 40rpx;
	margin-bottom: 32rpx;
	box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 32rpx;
	padding-left: 24rpx;
	border-left: 8rpx solid #667eea;
}

.form-item {
	display: flex;
	align-items: center;
	padding: 32rpx 0;
	border-bottom: 2rpx solid #f5f5f5;
}

.form-item:last-child {
	border-bottom: none;
}

.item-label {
	width: 160rpx;
	font-size: 28rpx;
	color: #666;
	flex-shrink: 0;
}

.item-input {
	flex: 1;
	font-size: 28rpx;
	color: #333;
	text-align: right;
}

.item-input.disabled {
	color: #999;
}

.bottom-actions {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	gap: 32rpx;
	padding: 32rpx 40rpx;
	padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
	background: #fff;
	box-shadow: 0 -4rpx 24rpx rgba(0, 0, 0, 0.06);
}

.cancel-btn,
.save-btn {
	flex: 1;
	height: 88rpx;
	border-radius: 44rpx;
	font-size: 32rpx;
	line-height: 88rpx;
	border: none;
}

.cancel-btn {
	background: #f5f7fa;
	color: #666;
}

.save-btn {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
}

.cancel-btn::after,
.save-btn::after {
	border: none;
}
</style>
