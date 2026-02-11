<template>
	<view class="page">
		<!-- 状态栏占位 -->
		<view class="status-bar"></view>
		
		<!-- 头部问候区 -->
		<view class="header-greeting">
			<view class="greeting-text">早安 👋</view>
			<view class="greeting-sub">今天也要保持好心情哦</view>
		</view>
		
		<!-- 主内容区 -->
		<view class="main-content">
			<!-- 打卡卡片 -->
			<view class="checkin-card" @click="goToCheckinCalendar">
				<view class="checkin-title">📅 今日打卡</view>
				<view class="checkin-status">
					<view class="status-info">
						<view class="status-label">连续打卡</view>
						<view class="status-value">7 天</view>
					</view>
					<button class="checkin-btn" @click.stop="handleCheckin">
						{{ checkedIn ? '✓ 已打卡' : '立即打卡' }}
					</button>
				</view>
				<view class="view-detail">点击查看签到记录 ></view>
			</view>
			
			<!-- 情绪采集 -->
			<view class="emotion-section">
				<view class="section-title">今天的心情如何？</view>
				<view class="emotion-grid">
					<view 
						v-for="(emotion, index) in emotions" 
						:key="index"
						class="emotion-item"
						:class="{ active: selectedEmotion === emotion.label }"
						@click="selectEmotion(emotion.label)"
					>
						<view class="emotion-icon">{{ emotion.icon }}</view>
						<view class="emotion-label">{{ emotion.label }}</view>
					</view>
				</view>
			</view>
			
			<!-- 快捷功能区 - 2行4列网格 -->
			<view class="quick-functions">
				<view class="section-title">快捷功能</view>
				<view class="function-grid">
					<view 
						v-for="(func, index) in quickFunctions" 
						:key="index"
						class="function-item"
						@click="navigateToFunction(func.path)"
					>
						<view class="icon-wrapper" :class="func.colorClass">
							<text class="icon-text">{{ func.icon }}</text>
						</view>
						<text class="function-name">{{ func.name }}</text>
					</view>
				</view>
			</view>
			
			<!-- 我的报告卡片 -->
			<view class="report-card" @click="navigateTo('/pages/report/index')">
				<view class="report-header">
					<view class="report-title">📊 我的报告</view>
					<view class="report-arrow">></view>
				</view>
				<view class="report-content">
					<view class="report-item">
						<view class="report-label">最新报告</view>
						<view class="report-value">心理健康评估报告</view>
					</view>
					<view class="report-item">
						<view class="report-label">生成时间</view>
						<view class="report-value">2024-01-15 14:30</view>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script setup>
import { ref } from 'vue'

// 打卡状态
const checkedIn = ref(false)

// 选中的情绪
const selectedEmotion = ref('')

// 当前Tab
const currentTab = ref(0)

// 情绪列表（两行布局）
const emotions = ref([
	{ icon: '😊', label: '开心' },
	{ icon: '😌', label: '平静' },
	{ icon: '😮', label: '惊讶' },
	{ icon: '😨', label: '害怕' },
	{ icon: '😢', label: '伤心' },
	{ icon: '🤢', label: '厌恶' },
	{ icon: '😠', label: '愤怒' }
])

// 快捷功能列表（2行4列）
const quickFunctions = ref([
	{ name: '情绪识别', icon: '😊', colorClass: 'emotion', path: '/pages/emotion/emotion' },
	{ name: '量表测试', icon: '📊', colorClass: 'analysis', path: '/pages/analysis/index' },
	{ name: '音乐疗愈', icon: '🎵', colorClass: 'music', path: '/pages/music/index' },
	{ name: '推荐方案', icon: '🧘', colorClass: 'recommend', path: '/pages/recommend/index' },
])


// 打卡功能
const handleCheckin = () => {
	checkedIn.value = true
	uni.showToast({
		title: '打卡成功！连续打卡 8 天 🎉',
		icon: 'success',
		duration: 2000
	})
	// 震动反馈
	uni.vibrateShort()
}

// 跳转到签到日历页面
const goToCheckinCalendar = () => {
	uni.navigateTo({
		url: '/pages/checkin/checkin'
	})
}

// 选择情绪
const selectEmotion = (emotion) => {
	selectedEmotion.value = emotion
	uni.showToast({
		title: `已记录今日情绪：${emotion}`,
		icon: 'none',
		duration: 1500
	})
}

// 快捷功能导航
const navigateToFunction = (path) => {
	uni.navigateTo({
		url: path
	})
}
</script>


<style lang="scss">
page {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	height: 100vh;
}

.page {
	min-height: 100vh;
	padding-bottom: 140rpx;
}

/* 状态栏占位 */
.status-bar {
	height: 44px;
}

/* 头部问候区 */
.header-greeting {
	padding: 40rpx 40rpx 60rpx;
	color: #fff;
}

.greeting-text {
	font-size: 56rpx;
	font-weight: 600;
	margin-bottom: 16rpx;
}

.greeting-sub {
	font-size: 28rpx;
	opacity: 0.9;
}

/* 主内容区 */
.main-content {
	background: #f5f7fa;
	border-radius: 60rpx 60rpx 0 0;
	padding: 48rpx 40rpx;
	min-height: calc(100vh - 200rpx);
}

/* 打卡卡片 */
.checkin-card {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 40rpx;
	padding: 48rpx;
	margin-bottom: 40rpx;
	box-shadow: 0 16rpx 48rpx rgba(102, 126, 234, 0.3);
	position: relative;
	overflow: hidden;
}

.checkin-card::before {
	content: '';
	position: absolute;
	top: -50%;
	right: -20%;
	width: 400rpx;
	height: 400rpx;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 50%;
}

.checkin-title {
	color: #fff;
	font-size: 36rpx;
	font-weight: 600;
	margin-bottom: 32rpx;
	position: relative;
	z-index: 1;
}

.checkin-status {
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: relative;
	z-index: 1;
	margin-bottom: 24rpx;
}

.status-info {
	color: #fff;
}

.status-label {
	font-size: 26rpx;
	opacity: 0.9;
	margin-bottom: 8rpx;
}

.status-value {
	font-size: 48rpx;
	font-weight: 600;
}

.checkin-btn {
	background: #fff;
	color: #667eea;
	border: none;
	padding: 24rpx 56rpx;
	border-radius: 50rpx;
	font-size: 30rpx;
	font-weight: 600;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.checkin-btn:active {
	transform: scale(0.95);
}

.view-detail {
	color: #fff;
	font-size: 24rpx;
	opacity: 0.8;
	text-align: right;
	position: relative;
	z-index: 1;
}

/* 情绪采集区 */
.emotion-section {
	margin-bottom: 40rpx;
}

.section-title {
	font-size: 36rpx;
	font-weight: 600;
	color: #2c3e50;
	margin-bottom: 32rpx;
	display: flex;
	align-items: center;
}

.section-title::before {
	content: '';
	width: 8rpx;
	height: 36rpx;
	background: #667eea;
	border-radius: 4rpx;
	margin-right: 16rpx;
}

.emotion-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 24rpx;
}

.emotion-item {
	background: #fff;
	border-radius: 32rpx;
	padding: 32rpx 16rpx;
	text-align: center;
	transition: all 0.3s;
	border: 4rpx solid transparent;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.emotion-item:active {
	transform: scale(0.95);
}

.emotion-item.active {
	border-color: #667eea;
	background: #f0f3ff;
}

.emotion-icon {
	font-size: 64rpx;
	margin-bottom: 16rpx;
}

.emotion-label {
	font-size: 24rpx;
	color: #666;
}

/* 快捷功能区 */
.quick-functions {
	margin-bottom: 40rpx;
}

.function-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 24rpx;
	background: #fff;
	border-radius: 32rpx;
	padding: 32rpx 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.function-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
}

.icon-wrapper {
	width: 100rpx;
	height: 100rpx;
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: transform 0.3s;
}

.function-item:active .icon-wrapper {
	transform: scale(0.9);
}

.icon-text {
	font-size: 48rpx;
}

/* 不同功能的渐变色 */
.icon-wrapper.emotion {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.icon-wrapper.chat {
	background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.icon-wrapper.record {
	background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.icon-wrapper.analysis {
	background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.icon-wrapper.music {
	background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.icon-wrapper.meditation {
	background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
}

.icon-wrapper.community {
	background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.icon-wrapper.more {
	background: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%);
}

.function-name {
	font-size: 24rpx;
	color: #666;
	text-align: center;
}

/* 我的报告卡片 */
.report-card {
	background: #fff;
	border-radius: 32rpx;
	padding: 40rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
	margin-bottom: 40rpx;
}

.report-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 32rpx;
}

.report-title {
	font-size: 36rpx;
	font-weight: 600;
	color: #2c3e50;
}

.report-arrow {
	font-size: 32rpx;
	color: #999;
}

.report-content {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.report-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.report-label {
	font-size: 28rpx;
	color: #999;
}

.report-value {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

/* 底部导航 */
.bottom-nav {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 120rpx;
	background: #fff;
	border-top: 1rpx solid #eee;
	display: flex;
	justify-content: space-around;
	align-items: center;
	padding-bottom: 20rpx;
	z-index: 999;
}

.nav-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 16rpx 32rpx;
	transition: all 0.3s;
}

.nav-icon {
	font-size: 48rpx;
	margin-bottom: 8rpx;
	transition: all 0.3s;
}

.nav-label {
	font-size: 22rpx;
	color: #999;
	transition: all 0.3s;
}

.nav-item.active .nav-icon {
	transform: scale(1.1);
}

.nav-item.active .nav-label {
	color: #667eea;
	font-weight: 600;
}
</style>
