<template>
	<view class="menu-section">
		<view 
			v-for="item in items" 
			:key="item.id"
			class="menu-item"
			hover-class="menu-item-hover"
			@tap="$emit('itemClick', item.id)"
		>
			<view :class="['menu-icon', item.iconClass]">
				{{ item.icon }}
			</view>
			<view class="menu-content">
				<view class="menu-title">{{ item.title }}</view>
				<view v-if="item.desc" class="menu-desc">{{ item.desc }}</view>
			</view>
			<view v-if="item.badge" class="menu-badge">{{ item.badge }}</view>
			<view class="menu-arrow">›</view>
		</view>
	</view>
</template>

<script setup>
defineProps({
	items: {
		type: Array,
		required: true
	}
})

defineEmits(['itemClick'])
</script>

<style scoped>
.menu-section {
	background: #fff;
	border-radius: 40rpx;
	overflow: hidden;
	margin-bottom: 32rpx;
	box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 36rpx 40rpx;
	border-bottom: 2rpx solid #f5f5f5;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-item-hover {
	background: #f8f9fa;
}

.menu-icon {
	width: 88rpx;
	height: 88rpx;
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 44rpx;
	margin-right: 32rpx;
	flex-shrink: 0;
}

.icon-purple { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.icon-pink { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.icon-blue { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.icon-green { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.icon-orange { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.icon-teal { background: linear-gradient(135deg, #30cfd0 0%, #330867 100%); }
.icon-red { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); }

.menu-content {
	flex: 1;
	min-width: 0;
}

.menu-title {
	font-size: 32rpx;
	color: #333;
	font-weight: 500;
	margin-bottom: 8rpx;
}

.menu-desc {
	font-size: 24rpx;
	color: #999;
}

.menu-badge {
	background: #ff4757;
	color: #fff;
	font-size: 22rpx;
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
	margin-right: 16rpx;
}

.menu-arrow {
	color: #ccc;
	font-size: 36rpx;
	flex-shrink: 0;
}
</style>
