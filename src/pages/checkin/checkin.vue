<template>
  <view class="calendar-page">
    <!-- 顶部统计卡片 -->
    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-value">{{ monthSignDays }}</text>
        <text class="stat-label">本月签到</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value highlight">{{ continuousDays }}</text>
        <text class="stat-label">连续天数</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-emoji">{{ dominantEmotion }}</text>
        <text class="stat-label">主要情绪</text>
      </view>
    </view>

    <!-- 月份切换 -->
    <view class="month-selector">
      <text class="arrow" @click="prevMonth">◀</text>
      <text class="current-month">{{ currentYear }}年{{ currentMonth }}月</text>
      <text class="arrow" @click="nextMonth">▶</text>
    </view>

    <!-- 日历主体 -->
    <view class="calendar-container">
      <!-- 星期表头 -->
      <view class="week-header">
        <text class="week-day" v-for="day in weekDays" :key="day">{{ day }}</text>
      </view>

      <!-- 日期网格 -->
      <view class="calendar-grid">
        <view 
          class="date-cell" 
          v-for="(date, index) in calendarDates" 
          :key="index"
          :class="{
            'other-month': !date.isCurrentMonth,
            'today': date.isToday,
            'signed': date.signed
          }"
          @click="handleDateClick(date)"
        >
          <text class="date-number">{{ date.day }}</text>
          <text class="emotion-icon" v-if="date.signed">{{ date.emotion }}</text>
          <view class="sign-dot" v-if="date.signed"></view>
        </view>
      </view>
    </view>

    <!-- 最近签到记录 -->
    <view class="recent-records">
      <view class="section-header">
        <text class="section-title">最近签到</text>
        <text class="view-more" @click="goToRecords">
          查看更多
          <text class="arrow-right">›</text>
        </text>
      </view>

      <view class="records-list">
        <view 
          class="record-item" 
          v-for="record in recentRecords" 
          :key="record.date"
          @click="showRecordDetail(record)"
        >
          <view class="record-left">
            <text class="record-emoji">{{ record.emotion }}</text>
            <view class="record-info">
              <text class="record-date">{{ record.dateText }}</text>
              <text class="record-time">{{ record.signTime }}</text>
            </view>
          </view>
          <view class="record-right">
            <view class="emotion-tag" :style="{ background: record.tagColor }">
              {{ record.emotionName }}
            </view>
            <text class="record-score">{{ record.emotionScore }}分</text>
          </view>
        </view>

        <!-- 空状态 -->
        <view class="empty-state" v-if="recentRecords.length === 0">
          <text class="empty-icon">📅</text>
          <text class="empty-text">暂无签到记录</text>
          <text class="empty-hint">开始你的第一次签到吧</text>
        </view>
      </view>
    </view>

    <!-- 底部签到按钮 - 移除 v-if 条件，始终显示 -->
    <view class="sign-button-wrapper">
      <button class="sign-button" @click="handleQuickSign">
        <text class="button-icon">📸</text>
        <text class="button-text">立即签到</text>
      </button>
    </view>

    <!-- 情绪选择弹窗 -->
    <view class="emotion-picker" v-if="showEmotionPicker" @click="showEmotionPicker = false">
      <view class="picker-content" @click.stop>
        <view class="picker-header">
          <text class="picker-title">今天的心情如何？</text>
          <text class="picker-close" @click="showEmotionPicker = false">✕</text>
        </view>
        <view class="emotion-grid">
          <view 
            class="emotion-option" 
            v-for="(config, emoji) in emotionConfig" 
            :key="emoji"
            @click="confirmSign(emoji)"
          >
            <text class="option-emoji">{{ emoji }}</text>
            <text class="option-name">{{ config.name }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 签到详情弹窗 -->
    <view class="detail-modal" v-if="showDetail" @click="showDetail = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-date">{{ selectedDate.fullDate }}</text>
          <text class="close-btn" @click="showDetail = false">✕</text>
        </view>
        <view class="modal-body">
          <view class="emotion-display">
            <text class="big-emoji">{{ selectedDate.emotion }}</text>
            <text class="emotion-name">{{ selectedDate.emotionName }}</text>
          </view>
          <view class="sign-info">
            <view class="info-row">
              <text class="label">签到时间：</text>
              <text class="value">{{ selectedDate.signTime }}</text>
            </view>
            <view class="info-row">
              <text class="label">情绪指数：</text>
              <text class="value">{{ selectedDate.emotionScore }}/100</text>
            </view>
            <view class="info-row" v-if="selectedDate.note">
              <text class="label">备注：</text>
              <text class="value">{{ selectedDate.note }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'

// 数据定义
const currentYear = ref(2024)
const currentMonth = ref(1)
const monthSignDays = ref(15)
const continuousDays = ref(7)
const dominantEmotion = ref('😊')
const todaySigned = ref(false)
const showDetail = ref(false)
const showEmotionPicker = ref(false) // 新增：控制情绪选择器显示
const selectedDate = ref({})

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

// 情绪配置
const emotionConfig = {
  '😊': { name: '开心', color: '#FFE5B4' },
  '😄': { name: '兴奋', color: '#FFD700' },
  '😌': { name: '放松', color: '#B4E5FF' },
  '😐': { name: '平静', color: '#E0E0E0' },
  '😢': { name: '难过', color: '#D4B5FF' },
  '😰': { name: '焦虑', color: '#FFB4B4' },
  '😴': { name: '疲惫', color: '#C8C8C8' }
}

// 模拟签到数据
const signRecords = ref({
  '2024-01-05': { emotion: '😊', emotionName: '开心', signTime: '09:15', emotionScore: 85, note: '今天天气很好' },
  '2024-01-06': { emotion: '😐', emotionName: '平静', signTime: '09:20', emotionScore: 70 },
  '2024-01-07': { emotion: '😢', emotionName: '难过', signTime: '09:30', emotionScore: 45, note: '工作压力大' },
  '2024-01-08': { emotion: '😊', emotionName: '愉悦', signTime: '09:10', emotionScore: 88 },
  '2024-01-09': { emotion: '😄', emotionName: '兴奋', signTime: '09:05', emotionScore: 92, note: '完成了重要项目' },
  '2024-01-10': { emotion: '😊', emotionName: '开心', signTime: '09:18', emotionScore: 86 },
  '2024-01-11': { emotion: '😌', emotionName: '放松', signTime: '09:25', emotionScore: 78 },
  '2024-01-12': { emotion: '😴', emotionName: '疲惫', signTime: '10:30', emotionScore: 55 }
})

// 新增：点击签到按钮
const handleQuickSign = () => {
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  
  // 检查今天是否已签到
  if (signRecords.value[todayStr]) {
    uni.showToast({
      title: '今日已签到！',
      icon: 'none',
      duration: 2000
    })
    return
  }
  
  // 显示情绪选择器
  showEmotionPicker.value = true
}

// 新增：确认签到
const confirmSign = (emoji) => {
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const timeStr = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`
  
  // 添加签到记录
  signRecords.value[todayStr] = {
    emotion: emoji,
    emotionName: emotionConfig[emoji].name,
    signTime: timeStr,
    emotionScore: Math.floor(Math.random() * 30) + 70, // 随机分数 70-100
    note: ''
  }
  
  // 更新统计数据
  monthSignDays.value++
  continuousDays.value++
  todaySigned.value = true
  
  // 关闭选择器
  showEmotionPicker.value = false
  
  // 显示成功提示
  uni.showToast({
    title: '签到成功！',
    icon: 'success',
    duration: 2000
  })
  
  // TODO: 调用后端接口保存签到
  // saveSignRecord(todayStr, signRecords.value[todayStr])
}

// 计算最近7天签到记录
const recentRecords = computed(() => {
  const records = []
  const today = new Date()
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const signData = signRecords.value[dateStr]
    
    if (signData) {
      const weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]
      const isToday = i === 0
      const isYesterday = i === 1
      
      let dateText = `${date.getMonth() + 1}月${date.getDate()}日 ${weekDay}`
      if (isToday) dateText = `今天 ${weekDay}`
      if (isYesterday) dateText = `昨天 ${weekDay}`
      
      records.push({
        date: dateStr,
        dateText,
        ...signData,
        tagColor: emotionConfig[signData.emotion]?.color || '#E0E0E0'
      })
    }
  }
  
  return records
})

// 生成日历数据
const calendarDates = computed(() => {
  const dates = []
  const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value, 0)
  const firstDayWeek = firstDay.getDay()
  const daysInMonth = lastDay.getDate()
  
  // 上月补充日期
  const prevMonthDays = new Date(currentYear.value, currentMonth.value - 1, 0).getDate()
  for (let i = firstDayWeek - 1; i >= 0; i--) {
    dates.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      signed: false
    })
  }
  
  // 当月日期
  const today = new Date()
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    const signData = signRecords.value[dateStr]
    
    dates.push({
      day: i,
      isCurrentMonth: true,
      isToday: today.getFullYear() === currentYear.value && 
               today.getMonth() + 1 === currentMonth.value && 
               today.getDate() === i,
      signed: !!signData,
      emotion: signData?.emotion || '',
      emotionName: signData?.emotionName || '',
      signTime: signData?.signTime || '',
      emotionScore: signData?.emotionScore || 0,
      note: signData?.note || '',
      fullDate: dateStr
    })
  }
  
  // 下月补充日期
  const remainingDays = 42 - dates.length
  for (let i = 1; i <= remainingDays; i++) {
    dates.push({
      day: i,
      isCurrentMonth: false,
      signed: false
    })
  }
  
  return dates
})

// 月份切换
const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentYear.value--
    currentMonth.value = 12
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentYear.value++
    currentMonth.value = 1
  } else {
    currentMonth.value++
  }
}

// 点击日历日期
const handleDateClick = (date) => {
  if (date.signed && date.isCurrentMonth) {
    selectedDate.value = date
    showDetail.value = true
  }
}

// 点击记录列表项
const showRecordDetail = (record) => {
  selectedDate.value = {
    fullDate: record.date,
    emotion: record.emotion,
    emotionName: record.emotionName,
    signTime: record.signTime,
    emotionScore: record.emotionScore,
    note: record.note
  }
  showDetail.value = true
}

// 跳转到完整记录页
const goToRecords = () => {
  uni.navigateTo({
    url: '/pages/records/index'
  })
}

onMounted(() => {
  // 初始化当前日期
  const now = new Date()
  currentYear.value = now.getFullYear()
  currentMonth.value = now.getMonth() + 1
})
</script>

<style lang="scss" scoped>
.calendar-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #fff 100%);
  padding-bottom: 140rpx;
}

// 统计卡片
.stats-card {
  margin: 30rpx;
  padding: 40rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24rpx;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.stat-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #fff;
  
  &.highlight {
    color: #ffd700;
  }
}

.stat-emoji {
  font-size: 56rpx;
}

.stat-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.stat-divider {
  width: 2rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.3);
}

// 月份切换
.month-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 60rpx;
  margin: 0 30rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.arrow {
  font-size: 32rpx;
  color: #667eea;
  padding: 10rpx 20rpx;
  transition: all 0.3s;
  
  &:active {
    opacity: 0.6;
    transform: scale(0.95);
  }
}

.current-month {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

// 日历容器
.calendar-container {
  margin: 30rpx;
  padding: 30rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

// 星期表头
.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.week-day {
  text-align: center;
  font-size: 26rpx;
  color: #999;
  font-weight: 500;
}

// 日期网格
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8rpx;
}

.date-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 12rpx;
  transition: all 0.3s;
  
  &.other-month {
    opacity: 0.3;
    
    .date-number {
      color: #ccc;
    }
  }
  
  &.today {
    background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
    
    .date-number {
      color: #667eea;
      font-weight: bold;
    }
  }
  
  &.signed {
    background: linear-gradient(135deg, #f093fb20 0%, #f5576c20 100%);
    
    &:active {
      transform: scale(0.95);
    }
  }
}

.date-number {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 4rpx;
}

.emotion-icon {
  font-size: 32rpx;
  margin-top: 4rpx;
}

.sign-dot {
  position: absolute;
  bottom: 8rpx;
  width: 8rpx;
  height: 8rpx;
  background: #667eea;
  border-radius: 50%;
}

// 最近签到记录
.recent-records {
  margin: 30rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.view-more {
  font-size: 26rpx;
  color: #667eea;
  display: flex;
  align-items: center;
  gap: 4rpx;
  
  &:active {
    opacity: 0.7;
  }
}

.arrow-right {
  font-size: 32rpx;
  font-weight: bold;
}

// 记录列表
.records-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  transition: all 0.3s;
  
  &:active {
    background: #f0f1f3;
    transform: scale(0.98);
  }
}

.record-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
  flex: 1;
}

.record-emoji {
  font-size: 56rpx;
}

.record-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.record-date {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.record-time {
  font-size: 24rpx;
  color: #999;
}

.record-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12rpx;
}

.emotion-tag {
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: #666;
  font-weight: 500;
}

.record-score {
  font-size: 24rpx;
  color: #667eea;
  font-weight: 600;
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0;
  gap: 16rpx;
}

.empty-icon {
  font-size: 80rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.empty-hint {
  font-size: 24rpx;
  color: #ccc;
}

// 签到按钮
.sign-button-wrapper {
  position: fixed;
  bottom: 40rpx;
  left: 30rpx;
  right: 30rpx;
  z-index: 10;
}

.sign-button {
  width: 100%;
  height: 100rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);
  border: none;
  
  &::after {
    border: none;
  }
  
  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
}

.button-icon {
  font-size: 40rpx;
}

.button-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: 600;
}

// 详情弹窗
.detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 60rpx;
}

.modal-content {
  width: 100%;
  max-width: 600rpx;
  background: #fff;
  border-radius: 32rpx;
  overflow: hidden;
  animation: modalSlideUp 0.3s ease-out;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(100rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.modal-date {
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
}

.close-btn {
  font-size: 40rpx;
  color: #fff;
  padding: 0 10rpx;
}

.modal-body {
  padding: 40rpx;
}

.emotion-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  padding: 40rpx 0;
  border-bottom: 2rpx solid #f0f0f0;
}

.big-emoji {
  font-size: 120rpx;
}

.emotion-name {
  font-size: 32rpx;
  color: #333;
  font-weight: 600;
}

.sign-info {
  padding-top: 30rpx;
}

.info-row {
  display: flex;
  padding: 20rpx 0;
  
  .label {
    font-size: 28rpx;
    color: #666;
    min-width: 160rpx;
  }
  
  .value {
    font-size: 28rpx;
    color: #333;
    flex: 1;
  }
}

// 新增：情绪选择弹窗样式
.emotion-picker {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.picker-content {
  width: 100%;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  padding: 40rpx;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.picker-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.picker-close {
  font-size: 40rpx;
  color: #999;
  padding: 0 10rpx;
}

.emotion-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30rpx;
  padding-bottom: 40rpx;
}

.emotion-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  padding: 30rpx 20rpx;
  background: #f8f9fa;
  border-radius: 20rpx;
  transition: all 0.3s;
  
  &:active {
    background: #e9ecef;
    transform: scale(0.95);
  }
}

.option-emoji {
  font-size: 64rpx;
}

.option-name {
  font-size: 24rpx;
  color: #666;
  font-weight: 500;
}
</style>
