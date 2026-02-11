<template>
	<view class="page-container">
		<!-- 头部个人信息区 -->
		<ProfileHeader 
			:userInfo="userInfo" 
			:stats="stats"
			@edit="handleEdit"
			@avatarClick="handleAvatarClick"
			@statClick="handleStatClick"
		/>

		<!-- 主内容区 -->
		<view class="main-content">
			<!-- 个人信息 -->
			<MenuList 
				:items="personalMenus" 
				@itemClick="handleMenuClick"
			/>

			<!-- 功能设置 -->
			<MenuList 
				:items="settingMenus" 
				@itemClick="handleMenuClick"
			/>

			<!-- 其他 -->
			<MenuList 
				:items="otherMenus" 
				@itemClick="handleMenuClick"
			/>
		</view>

		<!-- 底部导航占位 -->
		<view class="bottom-placeholder"></view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app' 
import ProfileHeader from './components/ProfileHeader.vue'
import MenuList from './components/MenuList.vue'


// 用户信息
const userInfo = ref({
	name: '张三',
	company: '科技创新有限公司',
	department: '产品研发部',
	position: '高级工程师',
	employeeId: 'EMP20240115',
	phone: '13800138000',
	email: 'zhangsan@example.com'
})

// 页面显示时，从本地存储读取最新数据
onShow(() => {
	const savedInfo = uni.getStorageSync('userInfo')
	if (savedInfo) {
		userInfo.value = { ...userInfo.value, ...savedInfo }
	}
})

// 统计数据
const stats = ref([
	{ value: 128, label: '打卡天数', key: 'checkin' },
	{ value: 85, label: '情绪记录', key: 'emotion' },
	{ value: 92, label: '健康指数', key: 'health' }
])

// 编辑资料
const handleEdit = () => {
	uni.navigateTo({
		url: `/pages/profile/edit?data=${encodeURIComponent(JSON.stringify(userInfo.value))}`
	})
}


// 个人信息菜单
const personalMenus = ref([
	{
		id: 'profile',
		icon: '📋',
		title: '个人档案',
		desc: '工号：EMP20240115',
		iconClass: 'icon-purple'
	},
	{
		id: 'report',
		icon: '📊',
		title: '健康报告',
		desc: '最新报告：2024-01-15',
		iconClass: 'icon-pink',
		badge: 3
	},
	{
		id: 'records',
		icon: '📝',
		title: '我的记录',
		desc: '情绪日记、对话记录',
		iconClass: 'icon-blue'
	}
])

// 功能设置菜单
const settingMenus = ref([
	{
		id: 'reminder',
		icon: '🔔',
		title: '提醒设置',
		desc: '打卡、情绪记录提醒',
		iconClass: 'icon-green'
	},
	{
		id: 'privacy',
		icon: '🔒',
		title: '隐私设置',
		desc: '数据权限、信息保护',
		iconClass: 'icon-orange'
	},
	{
		id: 'security',
		icon: '🛡️',
		title: '账号安全',
		desc: '密码、绑定手机',
		iconClass: 'icon-teal'
	}
])

// 其他菜单
const otherMenus = ref([
	{
		id: 'help',
		icon: '❓',
		title: '帮助与反馈',
		iconClass: 'icon-blue'
	},
	{
		id: 'about',
		icon: 'ℹ️',
		title: '关于我们',
		iconClass: 'icon-purple'
	},
	{
		id: 'logout',
		icon: '🚪',
		title: '退出登录',
		iconClass: 'icon-red'
	}
])


// 点击头像
const handleAvatarClick = () => {
	uni.showActionSheet({
		itemList: ['拍照', '从相册选择'],
		success: (res) => {
			uni.showToast({
				title: res.tapIndex === 0 ? '打开相机' : '打开相册',
				icon: 'none'
			})
		}
	})
}

// 点击统计卡片
const handleStatClick = (key) => {
	const titles = {
		checkin: '查看打卡记录',
		emotion: '查看情绪记录',
		health: '查看健康指数'
	}
	uni.showToast({
		title: titles[key],
		icon: 'none'
	})
}

// 菜单点击
const handleMenuClick = (id) => {
	if (id === 'logout') {
		uni.showModal({
			title: '提示',
			content: '确定要退出登录吗？',
			success: (res) => {
				if (res.confirm) {
					uni.showToast({
						title: '已退出登录',
						icon: 'none'
					})
					// 这里执行退出登录逻辑
					setTimeout(() => {
					  uni.redirectTo({
					    url: '/pages/login/login'
					  })
					}, 2000)
				}
			}
		})
		return
	}

	const titles = {
		profile: '查看个人档案',
		report: '查看健康报告',
		records: '查看我的记录',
		reminder: '提醒设置',
		privacy: '隐私设置',
		security: '账号安全',
		help: '帮助与反馈',
		about: '关于我们'
	}

	uni.showToast({
		title: titles[id],
		icon: 'none'
	})
}
</script>

<style scoped>
.page-container {
	min-height: 100vh;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.main-content {
	background: #f5f7fa;
	border-radius: 30rpx 30rpx 0 0;
	padding: 48rpx 40rpx 200rpx;
	min-height: calc(100vh - 480rpx);
}

.bottom-placeholder {
	height: 140rpx;
}
</style>
