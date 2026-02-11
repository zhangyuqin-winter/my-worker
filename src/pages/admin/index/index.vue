<template>
  <view class="admin-container">
    <!-- 顶部导航 -->
    <view class="admin-header">
      <view class="header-content">
        <view class="header-left">
          <text class="header-title">GPT+心理智慧云</text>
          <text class="header-subtitle">管理后台</text>
        </view>
        <view class="user-info" @tap="showUserMenu">
          <image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
        </view>
      </view>
    </view>

    <!-- 风险等级统计卡片 -->
    <view class="risk-stats-section">
      <scroll-view scroll-x class="risk-scroll">
        <view class="risk-card low">
          <view class="risk-label">低风险</view>
          <view class="risk-value">{{ statsData.lowRisk }}</view>
        </view>
        <view class="risk-card medium">
          <view class="risk-label">中风险</view>
          <view class="risk-value">{{ statsData.mediumRisk }}</view>
        </view>
        <view class="risk-card high">
          <view class="risk-label">高风险</view>
          <view class="risk-value">{{ statsData.highRisk }}</view>
        </view>
        <view class="risk-card wait">
          <view class="risk-label">待干预</view>
          <view class="risk-value">{{ statsData.waitIntervene }}</view>
        </view>
        <view class="risk-card done">
          <view class="risk-label">已干预</view>
          <view class="risk-value">{{ statsData.intervened }}</view>
        </view>
        <view class="risk-card predict">
          <view class="risk-label">预警数</view>
          <view class="risk-value">{{ statsData.predicted }}</view>
        </view>
      </scroll-view>
    </view>

    <!-- 近7天风险占比 - 饼图 -->
    <view class="chart-section">
      <view class="section-header">
        <text class="section-title">近7天风险占比</text>
        <text class="section-more" @tap="navigateTo('/pages/admin/risk-analysis/risk-analysis')">详情 ›</text>
      </view>
      <view class="chart-container">
        <qiun-data-charts
          type="pie"
                :opts="pieChartOpts"
                :chartData="pieChartData"
                :canvas2d="true"
                canvasId="pieChart"
        />
      </view>
    </view>
   
    <!-- 近7天风险趋势 - 折线图 -->
    <view class="chart-section">
      <view class="section-header">
        <text class="section-title">近7天风险趋势</text>
        <view class="time-tabs">
          <text 
            v-for="(tab, index) in timeTabs" 
            :key="index"
            :class="['time-tab', { active: activeTab === index }]"
            @tap="switchTab(index)"
          >
            {{ tab }}
          </text>
        </view>
      </view>
      <view class="chart-container">
        <qiun-data-charts
          type="line"
                :opts="lineChartOpts"
                :chartData="lineChartData"
                :canvas2d="true"
                canvasId="lineChart"
        />
		</view>
    </view>

    <!-- 采集进度 -->
    <view class="collect-section">
      <view class="section-header">
        <text class="section-title">数据采集进度</text>
        <text class="collect-rate">{{ collectData.collectRate }}%</text>
      </view>
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: collectData.collectRate + '%' }"></view>
      </view>
      <view class="collect-stats">
        <view class="collect-item">
          <text class="collect-label">已采集</text>
          <text class="collect-value success">{{ collectData.collected }}</text>
        </view>
        <view class="collect-item">
          <text class="collect-label">未采集</text>
          <text class="collect-value warning">{{ collectData.notCollected }}</text>
        </view>
      </view>
    </view>

    <!-- 快速入口 -->
    <view class="quick-menu-section">
      <view class="section-title">快速入口</view>
      <view class="quick-menu-grid">
        <view 
          v-for="(item, index) in quickMenuList" 
          :key="index"
          class="quick-menu-item"
          @tap="navigateTo(item.url)"
        >
          <view class="menu-icon-wrapper" :style="{ background: item.color }">
            <text class="menu-icon">{{ item.icon }}</text>
          </view>
          <text class="menu-name">{{ item.name }}</text>
          <view v-if="item.badge" class="menu-badge">{{ item.badge }}</view>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="section-title">管理功能</view>
      <view class="menu-list">
        <view 
          v-for="(item, index) in menuList" 
          :key="index"
          class="menu-item"
          @tap="navigateTo(item.url)"
        >
          <view class="menu-left">
            <view class="menu-icon-box" :style="{ background: item.bgColor }">
              <text class="menu-icon">{{ item.icon }}</text>
            </view>
            <view class="menu-content">
              <text class="menu-title">{{ item.title }}</text>
              <text class="menu-desc">{{ item.desc }}</text>
            </view>
          </view>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-section">
      <button class="logout-btn" @tap="handleLogout">
        <text class="logout-icon">🚪</text>
        <text>退出登录</text>
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive,onMounted, nextTick } from 'vue'
import uCharts from '@qiun/ucharts'

const userInfo = ref({
  avatar: '/static/avatar.png',
  nickname: '管理员'
})

// 统计数据
const statsData = ref({
  lowRisk: 21,
  mediumRisk: 30,
  highRisk: 34,
  waitIntervene: 34,
  intervened: 4,
  predicted: 36
})

// 采集数据
const collectData = ref({
  collected: 32,
  notCollected: 16,
  collectRate: 66.66
})

// 时间选项卡
const timeTabs = ref(['7天', '15天', '30天'])
const activeTab = ref(0)

// 快速入口
const quickMenuList = ref([
  {
    icon: '⚠️',
    name: '风险预警',
    url: '/pages/admin/risk-warning/risk-warning',
    color: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
    badge: 36
  },
  {
    icon: '📊',
    name: '风险分析',
    url: '/pages/admin/risk-analysis/risk-analysis',
    color: 'linear-gradient(135deg, #4E54C8 0%, #8F94FB 100%)'
  },
  {
    icon: '📝',
    name: '采集管理',
    url: '/pages/admin/collect/collect',
    color: 'linear-gradient(135deg, #11998E 0%, #38EF7D 100%)'
  },
  {
    icon: '👥',
    name: '心理档案',
    url: '/pages/admin/archives/archives',
    color: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)'
  },
  {
    icon: '🎯',
    name: '干预管理',
    url: '/pages/admin/intervention/intervention',
    color: 'linear-gradient(135deg, #30CFD0 0%, #330867 100%)',
    badge: 4
  },
  {
    icon: '📈',
    name: '数据大屏',
    url: '/pages/admin/dashboard/dashboard',
    color: 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)'
  }
])

// 功能菜单
const menuList = ref([
  {
    icon: '📋',
    title: '表情数据',
    desc: '查看员工表情采集数据',
    url: '/pages/admin/expression-data/expression-data',
    bgColor: '#E3F2FD'
  },
  {
    icon: '🏢',
    title: '部门管理',
    desc: '组织架构与部门设置',
    url: '/pages/admin/department/department',
    bgColor: '#F3E5F5'
  },
  {
    icon: '📱',
    title: '设备管理',
    desc: '情绪盒子设备管理',
    url: '/pages/admin/device/device',
    bgColor: '#E8F5E9'
  },
  {
    icon: '🔔',
    title: '预警规则',
    desc: '风险预警规则配置',
    url: '/pages/admin/rules/rules',
    bgColor: '#FFF3E0'
  },
  {
    icon: '💬',
    title: '消息推送',
    desc: '系统消息管理',
    url: '/pages/admin/message/message',
    bgColor: '#FCE4EC'
  },
  {
    icon: '⚙️',
    title: '系统设置',
    desc: '系统参数配置',
    url: '/pages/admin/settings/settings',
    bgColor: '#ECEFF1'
  }
])

// 响应式数据
const pieChartData = ref({})
const lineChartData = ref({})

//饼图配置
const pieChartOpts = reactive({
  color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
  padding: [5, 5, 5, 5],
  enableScroll: false,
  extra: {
    pie: {
      activeOpacity: 0.5,
      activeRadius: 10,
      offsetAngle: 0,
      labelWidth: 15,
      border: true,
      borderWidth: 3,
      borderColor: "#FFFFFF",
      linearType: "custom"
    }
  }
})

// 获取饼图数据
const getPieChartData = () => {
  setTimeout(() => {
    let res = {
      series: [{
        data: [
          { "name": "高风险", "value": 50 },
          { "name": "中风险", "value": 30 },
          { "name": "低风险", "value": 20 }
        ]
      }]
    }
    pieChartData.value = JSON.parse(JSON.stringify(res))
  }, 100)
}

// 折线图配置
const lineChartOpts = reactive({
  color: ['#EE6666', '#FAC858', '#5470C6', '#91CC75'],
  padding: [15, 15, 0, 15],
  enableScroll: false,
  legend: {
    show: true
  },
  xAxis: {
    disableGrid: true
  },
  yAxis: {
    gridType: 'dash',
    dashLength: 2
  },
  extra: {
    line: {
      type: 'straight',
      width: 2,
      activeType: "hollow"
    }
  }
})

// 获取折线图数据
const getLineChartData = () => {
  setTimeout(() => {
    let res = {
      categories: ["2018", "2019", "2020", "2021", "2022", "2023"],
      series: [
        {
          name: "成交量A",
          data: [35, 8, 25, 37, 4, 20]
        },
        {
          name: "成交量B",
          data: [70, 40, 65, 100, 44, 68]
        },
        {
          name: "成交量C",
          data: [100, 80, 95, 150, 112, 132]
        }
      ]
    }
    lineChartData.value = JSON.parse(JSON.stringify(res))
  }, 100)
}

onMounted(async() => {
  userInfo.value = uni.getStorageSync('userInfo') || userInfo.value
  checkPermission()
  loadData()
	await nextTick()
	getPieChartData()
	getLineChartData()
})

// 加载数据
const loadData = () => {
  // 确保图表数据已准备好
  console.log('加载数据')
}

// 权限检查
const checkPermission = () => {
  const role = uni.getStorageSync('role')
  if (role !== 'admin') {
    uni.showModal({
      title: '权限不足',
      content: '您没有访问管理后台的权限',
      showCancel: false,
      success: () => {
        uni.reLaunch({
          url: '/pages/login/login'
        })
      }
    })
  }
}


// 切换时间选项卡
const switchTab = (index) => {
  activeTab.value = index
  // 根据选择的时间范围重新加载数据
  getLineChartData()
}

// 显示用户菜单
const showUserMenu = () => {
  uni.showActionSheet({
    itemList: ['个人信息', '修改密码', '退出登录'],
    success: (res) => {
      if (res.tapIndex === 2) {
        handleLogout()
      }
    }
  })
}

// 导航
const navigateTo = (url) => {
  uni.navigateTo({ url })
}

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync('userInfo')
        uni.removeStorageSync('token')
        uni.removeStorageSync('role')
        uni.reLaunch({
          url: '/pages/login/login'
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.admin-container {
  min-height: 100vh;
  background: #F5F7FA;
  padding-bottom: 40rpx;
}

/* 顶部导航 */
.admin-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20rpx 40rpx 40rpx;  
  padding-top: calc(var(--status-bar-height) + 20rpx);  // 动态适配
  border-radius: 0 0 40rpx 40rpx;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  flex: 1;
}

.header-title {
  display: block;
  color: #fff;
  font-size: 36rpx;
  font-weight: 700;
  margin-bottom: 8rpx;
}

.header-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 24rpx;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

/* 风险统计卡片 */
.risk-stats-section {
  margin: 20rpx 40rpx 40rpx;  // 减小负边距
  position: relative;
  z-index: 10;
}

.risk-scroll {
  white-space: nowrap;
}

.risk-card {
  display: inline-block;
  width: 180rpx;
  padding: 32rpx 24rpx;
  margin-right: 20rpx;
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6rpx;
  }
  
  &.low::before {
    background: linear-gradient(90deg, #52C41A 0%, #73D13D 100%);
  }
  
  &.medium::before {
    background: linear-gradient(90deg, #1890FF 0%, #40A9FF 100%);
  }
  
  &.high::before {
    background: linear-gradient(90deg, #FA8C16 0%, #FFA940 100%);
  }
  
  &.wait::before {
    background: linear-gradient(90deg, #F5222D 0%, #FF4D4F 100%);
  }
  
  &.done::before {
    background: linear-gradient(90deg, #722ED1 0%, #9254DE 100%);
  }
  
  &.predict::before {
    background: linear-gradient(90deg, #EB2F96 0%, #F759AB 100%);
  }
}

.risk-label {
  color: #999;
  font-size: 24rpx;
  margin-bottom: 12rpx;
}

.risk-value {
  color: #333;
  font-size: 48rpx;
  font-weight: 700;
}

/* 图表区域 */
.chart-section {
  margin: 0 40rpx 40rpx;
  padding: 32rpx;
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.section-title {
  color: #333;
  font-size: 32rpx;
  font-weight: 600;
}

.section-more {
  color: #667eea;
  font-size: 26rpx;
}

.time-tabs {
  display: flex;
  gap: 16rpx;
}

.time-tab {
  padding: 8rpx 20rpx;
  color: #999;
  font-size: 24rpx;
  border-radius: 8rpx;
  transition: all 0.3s;
  
  &.active {
    color: #fff;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
}

.chart-container {
  width: 100%;
  height: 500rpx;
}

/* 采集进度 */
.collect-section {
  margin: 0 40rpx 40rpx;
  padding: 32rpx;
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.collect-rate {
  color: #52C41A;
  font-size: 32rpx;
  font-weight: 700;
}

.progress-bar {
  height: 16rpx;
  background: #F0F0F0;
  border-radius: 8rpx;
  margin: 24rpx 0;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #52C41A 0%, #73D13D 100%);
  border-radius: 8rpx;
  transition: width 0.3s;
}

.collect-stats {
  display: flex;
  justify-content: space-around;
}

.collect-item {
  text-align: center;
}

.collect-label {
  display: block;
  color: #999;
  font-size: 24rpx;
  margin-bottom: 8rpx;
}

.collect-value {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  
  &.success {
    color: #52C41A;
  }
  
  &.warning {
    color: #FA8C16;
  }
}

/* 快速入口 */
.quick-menu-section {
  margin: 0 40rpx 40rpx;
}

.quick-menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24rpx;
}

.quick-menu-item {
  position: relative;
  padding: 32rpx 24rpx;
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.3s;
  
  &:active {
    transform: scale(0.95);
  }
}

.menu-icon-wrapper {
  width: 88rpx;
  height: 88rpx;
  margin: 0 auto 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20rpx;
}

.menu-icon {
  font-size: 48rpx;
}

.menu-name {
  display: block;
  color: #333;
  font-size: 26rpx;
  font-weight: 500;
}

.menu-badge {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 8rpx;
  background: #FF4D4F;
  color: #fff;
  font-size: 20rpx;
  line-height: 32rpx;
  text-align: center;
  border-radius: 16rpx;
}

/* 功能菜单 */
.menu-section {
  margin: 0 40rpx 40rpx;
}

.menu-list {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1rpx solid #F0F0F0;
  transition: background 0.3s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background: #F8F9FA;
  }
}

.menu-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.menu-icon-box {
  width: 80rpx;
  height: 80rpx;
  margin-right: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
}

.menu-content {
  flex: 1;
}

.menu-title {
  display: block;
  color: #333;
  font-size: 30rpx;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.menu-desc {
  color: #999;
  font-size: 24rpx;
}

.menu-arrow {
  color: #ccc;
  font-size: 48rpx;
  font-weight: 300;
}

/* 退出登录 */
.logout-section {
  margin: 0 40rpx;
}

.logout-btn {
  width: 100%;
  padding: 32rpx;
  background: #fff;
  color: #FF4D4F;
  border: 2rpx solid #FF4D4F;
  border-radius: 20rpx;
  font-size: 32rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  
  &::after {
    border: none;
  }
}

.logout-icon {
  font-size: 36rpx;
}
.charts {
  width: 100%;
  height: 100%;
}
</style>
