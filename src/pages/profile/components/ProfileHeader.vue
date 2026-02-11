<template>
	<view class="profile-header">
		<view class="profile-header-bg"></view>
		
		<!-- 个人信息 -->
		<view class="profile-info">
			<view class="avatar" @tap="$emit('avatarClick')">
				👤
			</view>
			<view class="user-info">
				<view class="user-name">{{ userInfo.name }}</view>
				<view class="user-company">🏢 {{ userInfo.company }}</view>
				<view class="user-department">
					📋 {{ userInfo.department }} · {{ userInfo.position }}
				</view>
			</view>
			<button class="edit-btn" @tap="$emit('edit')">编辑</button>
		</view>

		<!-- 统计卡片 -->
		<view class="stats-cards">
			<view 
				v-for="stat in stats" 
				:key="stat.key"
				class="stat-card"
				@tap="$emit('statClick', stat.key)"
			>
				<view class="stat-value">{{ stat.value }}</view>
				<view class="stat-label">{{ stat.label }}</view>
			</view>
		</view>
	</view>
</template>

<script setup>
defineProps({
	userInfo: {
		type: Object,
		required: true
	},
	stats: {
		type: Array,
		required: true
	}
})

defineEmits(['edit', 'avatarClick', 'statClick'])
</script>

<style scoped>
.profile-header {
	padding: 100rpx 48rpx 80rpx;
	color: #fff;
	position: relative;
	overflow: hidden;
}

.profile-header-bg {
	position: absolute;
	top: -50%;
	right: -20%;
	width: 600rpx;
	height: 600rpx;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 50%;
}

.profile-info {
	display: flex;
	align-items: center;
	position: relative;
	z-index: 1;
	margin-bottom: 48rpx;
}

.avatar {
	width: 160rpx;
	height: 160rpx;
	border-radius: 50%;
	background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 72rpx;
	border: 8rpx solid rgba(255, 255, 255, 0.3);
	margin-right: 32rpx;
	flex-shrink: 0;
}

.user-info {
	flex: 1;
	min-width: 0;
}

.user-name {
	font-size: 56rpx;
	font-weight: 600;
	margin-bottom: 16rpx;
}

.user-company {
	font-size: 28rpx;
	opacity: 0.9;
	margin-bottom: 8rpx;
}

.user-department {
	font-size: 26rpx;
	opacity: 0.8;
}

.edit-btn {
	background: rgba(255, 255, 255, 0.2);
	border: 2rpx solid rgba(255, 255, 255, 0.3);
	color: #fff;
	padding: 16rpx 40rpx;
	border-radius: 40rpx;
	font-size: 26rpx;
	line-height: 1;
	flex-shrink: 0;
}

.edit-btn::after {
	border: none;
}

.stats-cards {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 24rpx;
	position: relative;
	z-index: 1;
}

.stat-card {
	background: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(20rpx);
	border-radius: 32rpx;
	padding: 32rpx 24rpx;
	text-align: center;
	border: 2rpx solid rgba(255, 255, 255, 0.3);
}

.stat-value {
	font-size: 48rpx;
	font-weight: 600;
	margin-bottom: 8rpx;
}

.stat-label {
	font-size: 24rpx;
	opacity: 0.9;
}
</style>
