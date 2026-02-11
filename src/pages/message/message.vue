<template>
	<view class="mobile-container">
		<!-- 顶部导航 -->
		<view class="top-nav">
			<view class="nav-title">📬 信息中心</view>
			<view class="nav-subtitle">及时查看重要通知与提醒</view>
		</view>

		<!-- 标签切换栏 -->
		<view class="tab-bar">
			<view 
				v-for="tab in tabs" 
				:key="tab.type"
				class="tab-item" 
				:class="{ active: activeTab === tab.type }"
				@click="switchTab(tab.type)"
			>
				{{ tab.label }}
				<view v-if="tab.badge" class="badge">{{ tab.badge }}</view>
			</view>
		</view>

		<!-- 消息列表 -->
		<view class="message-list">
			<view 
				v-for="(message, index) in filteredMessages" 
				:key="index"
				class="message-card" 
				:class="message.type"
				@click="handleCardClick(message)"
			>
				<view class="message-header">
					<view class="message-icon">{{ message.icon }}</view>
					<view class="message-info">
						<view class="message-title">
							<view v-if="message.unread" class="unread-dot"></view>
							{{ message.title }}
						</view>
						<view class="message-time">{{ message.time }}</view>
					</view>
				</view>
				<view class="message-content">{{ message.content }}</view>
				<view class="message-footer">
					<view class="message-tag" :class="message.tagClass">{{ message.tag }}</view>
					<view class="message-action">{{ message.action }} →</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script setup>
import { ref, computed } from 'vue';

// 标签数据
const tabs = ref([
	{ type: 'all', label: '全部', badge: 5 },
	{ type: 'questionnaire', label: '测评问卷', badge: 2 },
	{ type: 'intervention', label: '干预方案', badge: 0 },
	{ type: 'warning', label: '风险提醒', badge: 0 }
]);

// 当前激活的标签
const activeTab = ref('all');

// 消息数据
const messages = ref([
	{
		type: 'warning',
		category: 'warning',
		icon: '⚠️',
		title: '心理风险提醒',
		time: '2分钟前',
		content: '根据您近期的情绪数据分析，检测到您的焦虑指数持续偏高，建议及时关注并采取相应措施。',
		tag: '紧急',
		tagClass: 'tag-urgent',
		action: '查看详情',
		unread: true
	},
	{
		type: 'questionnaire',
		category: 'questionnaire',
		icon: '📋',
		title: '新的测评问卷',
		time: '30分钟前',
		content: '【抑郁自评量表(SDS)】已为您推送，完成测评可获得专业的心理健康分析报告。',
		tag: '待完成',
		tagClass: 'tag-normal',
		action: '立即填写',
		unread: true
	},
	{
		type: 'result',
		category: 'result',
		icon: '📊',
		title: '问卷分析结果',
		time: '2小时前',
		content: '您的【焦虑自评量表(SAS)】已完成分析，综合得分52分，处于轻度焦虑状态，建议查看详细报告。',
		tag: '已完成',
		tagClass: 'tag-completed',
		action: '查看报告',
		unread: false
	},
	{
		type: 'intervention',
		category: 'intervention',
		icon: '💚',
		title: '心理干预方案推送',
		time: '昨天 18:30',
		content: '根据您的心理状态，为您定制了【认知行为疗法(CBT)】干预方案，包含7天练习计划。',
		tag: '推荐',
		tagClass: 'tag-normal',
		action: '开始练习',
		unread: false
	},
	{
		type: 'questionnaire',
		category: 'questionnaire',
		icon: '📋',
		title: '每周心理健康评估',
		time: '2024-01-14 09:00',
		content: '本周的心理健康评估问卷已开放，建议您在安静的环境下完成，预计耗时5-8分钟。',
		tag: '已完成',
		tagClass: 'tag-completed',
		action: '查看记录',
		unread: false
	}
]);

// 计算过滤后的消息列表
const filteredMessages = computed(() => {
	if (activeTab.value === 'all') {
		return messages.value;
	}
	return messages.value.filter(msg => msg.category === activeTab.value);
});

// 切换标签
const switchTab = (type) => {
	activeTab.value = type;
};

// 处理消息卡片点击
const handleCardClick = (message) => {
	const typeMap = {
		'questionnaire': '测评问卷',
		'intervention': '干预方案',
		'warning': '风险提醒',
		'result': '分析结果'
	};
	
	uni.showToast({
		title: `点击了：${typeMap[message.type]}`,
		icon: 'none',
		duration: 2000
	});
	
	// 实际应用中可以使用 uni.navigateTo 跳转到详情页
	// uni.navigateTo({
	//   url: `/pages/detail/detail?type=${message.type}`
	// });
};

</script>

<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

page {
	background: #f5f7fa;
	padding-bottom: 0;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* 移动端容器 */
.mobile-container {
	background: #fff;
	min-height: 100vh;
	position: relative;
}

/* 顶部导航栏 */
.top-nav {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 44px 20px 20px;
	color: #fff;
}

.nav-title {
	font-size: 28px;
	font-weight: 600;
	margin-bottom: 8px;
}

.nav-subtitle {
	font-size: 14px;
	opacity: 0.9;
}

/* 标签切换 */
.tab-bar {
	display: flex;
	background: #fff;
	padding: 16px 20px 0;
	border-bottom: 1px solid #f0f0f0;
	position: sticky;
	top: 0;
	z-index: 10;
}

.tab-item {
	padding: 12px 16px;
	font-size: 15px;
	color: #666;
	position: relative;
	transition: all 0.3s;
	margin-right: 8px;
}

.tab-item.active {
	color: #667eea;
	font-weight: 600;
}

.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 3px;
	background: #667eea;
	border-radius: 2px;
}

.badge {
	position: absolute;
	top: 8px;
	right: 0;
	background: #ff4d4f;
	color: #fff;
	font-size: 10px;
	padding: 2px 6px;
	border-radius: 10px;
	min-width: 16px;
	text-align: center;
}

/* 消息列表 */
.message-list {
	padding: 12px 20px;
}

.message-card {
	background: #fff;
	border-radius: 16px;
	padding: 16px;
	margin-bottom: 12px;
	box-shadow: 0 2px 12px rgba(0,0,0,0.06);
	border-left: 4px solid;
	transition: all 0.3s;
}

.message-card:active {
	transform: scale(0.98);
}

.message-card.questionnaire {
	border-left-color: #667eea;
}

.message-card.intervention {
	border-left-color: #52c41a;
}

.message-card.warning {
	border-left-color: #ff4d4f;
}

.message-card.result {
	border-left-color: #faad14;
}

.message-header {
	display: flex;
	align-items: center;
	margin-bottom: 12px;
}

.message-icon {
	width: 40px;
	height: 40px;
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20px;
	margin-right: 12px;
}

.questionnaire .message-icon {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.intervention .message-icon {
	background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
}

.warning .message-icon {
	background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
}

.result .message-icon {
	background: linear-gradient(135deg, #faad14 0%, #ffc53d 100%);
}

.message-info {
	flex: 1;
}

.message-title {
	font-size: 16px;
	font-weight: 600;
	color: #333;
	margin-bottom: 4px;
	display: flex;
	align-items: center;
}

.message-time {
	font-size: 12px;
	color: #999;
}

.message-content {
	font-size: 14px;
	color: #666;
	line-height: 1.6;
	margin-bottom: 12px;
}

.message-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.message-tag {
	display: inline-block;
	padding: 4px 12px;
	border-radius: 12px;
	font-size: 12px;
	font-weight: 500;
}

.tag-urgent {
	background: #fff1f0;
	color: #ff4d4f;
}

.tag-normal {
	background: #f0f5ff;
	color: #667eea;
}

.tag-completed {
	background: #f6ffed;
	color: #52c41a;
}

.message-action {
	color: #667eea;
	font-size: 13px;
	font-weight: 500;
}

.unread-dot {
	width: 8px;
	height: 8px;
	background: #ff4d4f;
	border-radius: 50%;
	display: inline-block;
	margin-right: 6px;
}


.nav-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 8px 16px;
}

.nav-icon {
	font-size: 24px;
	margin-bottom: 4px;
}

.nav-label {
	font-size: 11px;
	color: #999;
}

.nav-item.active .nav-label {
	color: #667eea;
	font-weight: 600;
}
</style>
