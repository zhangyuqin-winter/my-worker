<template>
	<view class="page">
		<!-- 自定义导航栏 -->
		<view class="custom-navbar">
			<view class="navbar-content">
				<view class="back-btn" @click="goBack">
					<text class="back-icon">←</text>
				</view>
				<view class="navbar-title">情绪识别</view>
				<view class="placeholder"></view>
			</view>
		</view>

		<!-- 相机预览区 -->
		<view class="camera-container">
			<camera 
			    id="myCamera"
			    v-if="!photoPath"
			    class="camera-preview" 
			    :device-position="cameraPosition"
			    flash="off"
			    @error="onCameraError"
			>
				<!-- 人脸识别框 -->
				<view class="face-frame">
					<view class="frame-corner tl"></view>
					<view class="frame-corner tr"></view>
					<view class="frame-corner bl"></view>
					<view class="frame-corner br"></view>
				</view>
				
				<!-- 提示文字 -->
				<view class="camera-tips">
					<text class="tips-text">请将面部置于框内</text>
					<text class="tips-sub">保持光线充足，表情自然</text>
				</view>
			</camera>

			<!-- 拍照后的预览 -->
			<view v-else class="photo-preview">
				<image :src="photoPath" class="preview-image" mode="aspectFit"></image>
				
				<!-- 识别中遮罩 -->
				<view v-if="isAnalyzing" class="analyzing-mask">
					<view class="analyzing-content">
						<view class="loading-spinner"></view>
						<text class="analyzing-text">AI正在分析中...</text>
						<text class="analyzing-sub">{{ analyzingProgress }}%</text>
					</view>
				</view>

				<!-- 识别结果 -->
				<view v-if="emotionResult && !isAnalyzing" class="result-panel">
					<view class="result-header">
						<text class="result-title">识别结果</text>
						<text class="result-confidence">置信度: {{ emotionResult.confidence }}%</text>
					</view>
					
					<view class="result-emotion">
						<text class="emotion-icon-large">{{ emotionResult.icon }}</text>
						<text class="emotion-name">{{ emotionResult.name }}</text>
					</view>

					<view class="result-description">
						<text class="description-text">{{ emotionResult.description }}</text>
					</view>

					<!-- 情绪分布 -->
					<view class="emotion-distribution">
						<text class="distribution-title">情绪分布</text>
						<view 
							v-for="(item, index) in emotionResult.distribution" 
							:key="index"
							class="distribution-item"
						>
							<text class="distribution-label">{{ item.name }}</text>
							<view class="distribution-bar">
								<view 
									class="distribution-fill" 
									:style="{ width: item.value + '%' }"
								></view>
							</view>
							<text class="distribution-value">{{ item.value }}%</text>
						</view>
					</view>

					<!-- 建议 -->
					<view class="suggestion-box">
						<text class="suggestion-title">💡 温馨建议</text>
						<text class="suggestion-text">{{ emotionResult.suggestion }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部操作区 -->
		<view class="bottom-actions">
			<view v-if="!photoPath" class="capture-area">
				<!-- 相册按钮 -->
				<view class="action-btn gallery-btn" @click="chooseFromGallery">
					<text class="btn-icon">🖼️</text>
				</view>

				<!-- 拍照按钮 -->
				<view class="capture-btn" @click="takePhoto">
					<view class="capture-inner"></view>
				</view>

				<!-- 切换摄像头 -->
				<view class="action-btn switch-btn" @click="switchCamera">
					<text class="btn-icon">🔄</text>
				</view>
			</view>

			<!-- 重拍/保存按钮 -->
			<view v-else class="result-actions">
				<button class="action-button retake-btn" @click="retakePhoto">
					<text class="button-icon">🔄</text>
					<text>重新拍摄</text>
				</button>
				<button 
					v-if="emotionResult && !isAnalyzing" 
					class="action-button save-btn" 
					@click="saveResult"
				>
					<text class="button-icon">💾</text>
					<text>保存记录</text>
				</button>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 相机上下文
const cameraContext = ref(null)

// 拍照路径
const photoPath = ref('')

// 是否正在分析
const isAnalyzing = ref(false)

// 分析进度
const analyzingProgress = ref(0)

// 识别结果
const emotionResult = ref(null)

// 摄像头位置
const cameraPosition = ref('front')

// 组件挂载时初始化相机上下文
onMounted(() => {
	// #ifdef APP-PLUS || MP-WEIXIN
	cameraContext.value = uni.createCameraContext('myCamera')
	// #endif
})

// 返回上一页
const goBack = () => {
	uni.navigateBack()
}

// 相机错误处理
const onCameraError = (e) => {
	console.error('相机错误:', e)
	uni.showModal({
		title: '相机权限',
		content: '请允许访问相机权限以使用情绪识别功能',
		confirmText: '去设置',
		success: (res) => {
			if (res.confirm) {
				uni.openSetting()
			}
		}
	})
}

// 拍照
const takePhoto = () => {
	// #ifdef H5
	uni.showToast({
		title: 'H5暂不支持相机拍照，请使用相册',
		icon: 'none',
		duration: 2000
	})
	chooseFromGallery()
	return
	// #endif
	
	// #ifdef APP-PLUS || MP-WEIXIN
	if (!cameraContext.value) {
		cameraContext.value = uni.createCameraContext('myCamera')
	}
	
	cameraContext.value.takePhoto({
		quality: 'high',
		success: (res) => {
			console.log('拍照成功:', res)
			photoPath.value = res.tempImagePath
			// 开始分析
			analyzeEmotion(res.tempImagePath)
		},
		fail: (err) => {
			console.error('拍照失败:', err)
			uni.showToast({
				title: '拍照失败，请重试',
				icon: 'none'
			})
		}
	})
	// #endif
}

// 从相册选择
const chooseFromGallery = () => {
	uni.chooseImage({
		count: 1,
		sourceType: ['album'],
		sizeType: ['compressed'],
		success: (res) => {
			photoPath.value = res.tempFilePaths[0]
			analyzeEmotion(res.tempFilePaths[0])
		},
		fail: (err) => {
			console.error('选择图片失败:', err)
		}
	})
}

// 切换摄像头
const switchCamera = () => {
	cameraPosition.value = cameraPosition.value === 'front' ? 'back' : 'front'
	
	// 重新创建相机上下文
	// #ifdef APP-PLUS || MP-WEIXIN
	setTimeout(() => {
		cameraContext.value = uni.createCameraContext('myCamera')
	}, 100)
	// #endif
	
	uni.showToast({
		title: '已切换摄像头',
		icon: 'none',
		duration: 1000
	})
}

// 重新拍摄
const retakePhoto = () => {
	photoPath.value = ''
	emotionResult.value = null
	isAnalyzing.value = false
	analyzingProgress.value = 0
}

// 模拟情绪分析
const analyzeEmotion = (imagePath) => {
	isAnalyzing.value = true
	analyzingProgress.value = 0
	
	const progressInterval = setInterval(() => {
		analyzingProgress.value += 10
		if (analyzingProgress.value >= 100) {
			clearInterval(progressInterval)
		}
	}, 200)
	
	setTimeout(() => {
		isAnalyzing.value = false
		
		const emotions = [
			{
				name: '开心',
				icon: '😊',
				confidence: 85,
				description: '您当前的情绪状态良好，保持积极乐观的心态有助于身心健康。',
				suggestion: '继续保持愉悦的心情，可以尝试与朋友分享快乐，或做一些自己喜欢的事情。',
				distribution: [
					{ name: '开心', value: 85 },
					{ name: '平静', value: 10 },
					{ name: '惊讶', value: 3 },
					{ name: '其他', value: 2 }
				]
			},
			{
				name: '焦虑',
				icon: '😰',
				confidence: 78,
				description: '检测到您可能处于焦虑状态，建议适当放松和调整。',
				suggestion: '尝试深呼吸练习、冥想或听舒缓的音乐来缓解焦虑情绪。必要时可以寻求专业帮助。',
				distribution: [
					{ name: '焦虑', value: 78 },
					{ name: '担心', value: 15 },
					{ name: '紧张', value: 5 },
					{ name: '其他', value: 2 }
				]
			},
			{
				name: '平静',
				icon: '😌',
				confidence: 92,
				description: '您的情绪非常平和稳定，这是一个很好的状态。',
				suggestion: '保持当前的生活节奏，适当的冥想和运动可以帮助维持这种平和的状态。',
				distribution: [
					{ name: '平静', value: 92 },
					{ name: '放松', value: 6 },
					{ name: '其他', value: 2 }
				]
			}
		]
		
		emotionResult.value = emotions[Math.floor(Math.random() * emotions.length)]
		
		uni.showToast({
			title: '识别完成',
			icon: 'success',
			duration: 1500
		})
	}, 2000)
}

// 保存结果
const saveResult = () => {
	const record = {
		date: new Date().toISOString(),
		emotion: emotionResult.value.name,
		confidence: emotionResult.value.confidence,
		imagePath: photoPath.value
	}
	
	console.log('保存记录:', record)
	
	uni.showToast({
		title: '已保存到情绪日记',
		icon: 'success',
		duration: 2000
	})
	
	setTimeout(() => {
		uni.navigateBack()
	}, 2000)
}
</script>

<style lang="scss" scoped>
.page {
	width: 100vw;
	height: 100vh;
	background: #000;
	display: flex;
	flex-direction: column;
}

/* 自定义导航栏 */
.custom-navbar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 1000;
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(10px);
}

.navbar-content {
	height: 88rpx;
	padding-top: 44px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-left: 32rpx;
	padding-right: 32rpx;
}

.back-btn {
	width: 80rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-icon {
	font-size: 48rpx;
	color: #fff;
	font-weight: 300;
}

.navbar-title {
	font-size: 36rpx;
	color: #fff;
	font-weight: 600;
}

.placeholder {
	width: 80rpx;
}

/* 相机容器 */
.camera-container {
	flex: 1;
	position: relative;
	margin-top: calc(88rpx + 44px);
}

.camera-preview {
	width: 100%;
	height: 100%;
	position: relative;
}

/* 人脸识别框 */
.face-frame {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 500rpx;
	height: 600rpx;
	border: 4rpx solid rgba(102, 126, 234, 0.6);
	border-radius: 40rpx;
}

.frame-corner {
	position: absolute;
	width: 60rpx;
	height: 60rpx;
	border: 6rpx solid #667eea;
}

.frame-corner.tl {
	top: -4rpx;
	left: -4rpx;
	border-right: none;
	border-bottom: none;
	border-radius: 40rpx 0 0 0;
}

.frame-corner.tr {
	top: -4rpx;
	right: -4rpx;
	border-left: none;
	border-bottom: none;
	border-radius: 0 40rpx 0 0;
}

.frame-corner.bl {
	bottom: -4rpx;
	left: -4rpx;
	border-right: none;
	border-top: none;
	border-radius: 0 0 0 40rpx;
}

.frame-corner.br {
	bottom: -4rpx;
	right: -4rpx;
	border-left: none;
	border-top: none;
	border-radius: 0 0 40rpx 0;
}

/* 相机提示 */
.camera-tips {
	position: absolute;
	bottom: 200rpx;
	left: 0;
	right: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
}

.tips-text {
	font-size: 32rpx;
	color: #fff;
	font-weight: 600;
	text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.5);
}

.tips-sub {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
	text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.5);
}

/* 照片预览 */
.photo-preview {
	width: 100%;
	height: 100%;
	position: relative;
	background: #000;
}

.preview-image {
	width: 100%;
	height: 100%;
}

/* 分析中遮罩 */
.analyzing-mask {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.8);
	display: flex;
	align-items: center;
	justify-content: center;
}

.analyzing-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 32rpx;
}

.loading-spinner {
	width: 120rpx;
	height: 120rpx;
	border: 8rpx solid rgba(102, 126, 234, 0.3);
	border-top-color: #667eea;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	to { transform: rotate(360deg); }
}

.analyzing-text {
	font-size: 32rpx;
	color: #fff;
	font-weight: 600;
}

.analyzing-sub {
	font-size: 48rpx;
	color: #667eea;
	font-weight: 700;
}

/* 识别结果面板 */
.result-panel {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background: #fff;
	border-radius: 60rpx 60rpx 0 0;
	padding: 48rpx 40rpx;
	max-height: 70%;
	overflow-y: auto;
}

.result-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 32rpx;
}

.result-title {
	font-size: 36rpx;
	font-weight: 600;
	color: #2c3e50;
}

.result-confidence {
	font-size: 24rpx;
	color: #667eea;
	background: #f0f3ff;
	padding: 8rpx 24rpx;
	border-radius: 20rpx;
}

.result-emotion {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 24rpx;
	margin-bottom: 32rpx;
	padding: 40rpx 0;
	background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
	border-radius: 32rpx;
}

.emotion-icon-large {
	font-size: 120rpx;
}

.emotion-name {
	font-size: 48rpx;
	font-weight: 600;
	color: #667eea;
}

.result-description {
	margin-bottom: 32rpx;
	padding: 32rpx;
	background: #f8f9fa;
	border-radius: 24rpx;
}

.description-text {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
}

/* 情绪分布 */
.emotion-distribution {
	margin-bottom: 32rpx;
}

.distribution-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #2c3e50;
	margin-bottom: 24rpx;
	display: block;
}

.distribution-item {
	display: flex;
	align-items: center;
	gap: 16rpx;
	margin-bottom: 20rpx;
}

.distribution-label {
	font-size: 26rpx;
	color: #666;
	width: 100rpx;
	flex-shrink: 0;
}

.distribution-bar {
	flex: 1;
	height: 16rpx;
	background: #f0f0f0;
	border-radius: 8rpx;
	overflow: hidden;
}

.distribution-fill {
	height: 100%;
	background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
	border-radius: 8rpx;
	transition: width 0.6s ease;
}

.distribution-value {
	font-size: 24rpx;
	color: #667eea;
	font-weight: 600;
	width: 80rpx;
	text-align: right;
	flex-shrink: 0;
}

/* 建议框 */
.suggestion-box {
	background: linear-gradient(135deg, #fff5e6 0%, #ffe6f0 100%);
	border-radius: 24rpx;
	padding: 32rpx;
	border-left: 8rpx solid #667eea;
}

.suggestion-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #2c3e50;
	margin-bottom: 16rpx;
	display: block;
}

.suggestion-text {
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
}

/* 底部操作区 */
.bottom-actions {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 40rpx;
	padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(10px);
}

.capture-area {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 40rpx;
}

.action-btn {
	width: 100rpx;
	height: 100rpx;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	backdrop-filter: blur(10px);
}

.btn-icon {
	font-size: 48rpx;
}

.capture-btn {
	width: 140rpx;
	height: 140rpx;
	background: #fff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.3);
}

.capture-btn:active {
	transform: scale(0.95);
}

.capture-inner {
	width: 110rpx;
	height: 110rpx;
	background: #667eea;
	border-radius: 50%;
}

/* 结果操作按钮 */
.result-actions {
	display: flex;
	gap: 24rpx;
}

.action-button {
	flex: 1;
	height: 96rpx;
	border-radius: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16rpx;
	font-size: 30rpx;
	font-weight: 600;
	border: none;
}

.retake-btn {
	background: rgba(255, 255, 255, 0.2);
	color: #fff;
	backdrop-filter: blur(10px);
}

.save-btn {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
}

.button-icon {
	font-size: 36rpx;
}
</style>
