<template>
  <view class="page-container">
    <view class="login-container">
      <!-- Logo区域 -->
      <view class="logo-section">
        <view class="logo">🚀</view>
        <view class="app-name">欢迎回来</view>
        <view class="app-slogan">登录以继续使用</view>
      </view>
      
      <!-- 表单区域 -->
      <view class="form-section">
        <view class="input-group">
          <view class="input-wrapper" :class="{ 'focused': usernameFocused }">
            <text class="input-icon">👤</text>
            <input 
              v-model="formData.username"
              class="input-field"
              type="text"
              placeholder="请输入账号"
              placeholder-class="placeholder"
              @focus="usernameFocused = true"
              @blur="usernameFocused = false"
            />
          </view>
        </view>
        
        <view class="input-group">
          <view class="input-wrapper" :class="{ 'focused': passwordFocused }">
            <text class="input-icon">🔒</text>
            <input 
              v-model="formData.password"
              class="input-field"
              type="password"
              placeholder="请输入密码"
              placeholder-class="placeholder"
              @focus="passwordFocused = true"
              @blur="passwordFocused = false"
            />
          </view>
        </view>
        
        <view class="forgot-password">
          <text class="forgot-link" @tap="handleForgotPassword">忘记密码？</text>
        </view>
        
        <button class="login-btn" @tap="handleLogin" hover-class="login-btn-hover">
          登录
        </button>
        
        <view class="register-section">
          <text class="register-text">还没有账号？</text>
          <text class="register-link" @tap="handleRegister">立即注册</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'

// 表单数据
const formData = reactive({
  username: '',
  password: ''
})

// 输入框聚焦状态
const usernameFocused = ref(false)
const passwordFocused = ref(false)

// 登录处理
const handleLogin = () => {
  // 表单验证
  if (!formData.username) {
    uni.showToast({
      title: '请输入账号',
      icon: 'none',
      duration: 2000
    })
    return
  }
  
  if (!formData.password) {
    uni.showToast({
      title: '请输入密码',
      icon: 'none',
      duration: 2000
    })
    return
  }
  
  // 模拟登录请求
  uni.showLoading({
    title: '登录中...'
  })
  
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: `登录成功！欢迎 ${formData.username}`,
      icon: 'success',
      duration: 2000
    })
    
    // 登录成功后的操作
    // 例如：跳转到首页
    // uni.switchTab({
    //   url: '/pages/index/index'
    // })
  }, 1000)
}

// 忘记密码
const handleForgotPassword = () => {
  uni.showToast({
    title: '忘记密码功能',
    icon: 'none',
    duration: 2000
  })
  
  // 实际项目中跳转到忘记密码页面
  // uni.navigateTo({
  //   url: '/pages/forgot-password/forgot-password'
  // })
}

// 注册
const handleRegister = () => {
  uni.showToast({
    title: '注册功能',
    icon: 'none',
    duration: 2000
  })
  
  // 实际项目中跳转到注册页面
  uni.navigateTo({
    url: '/pages/register/register'
  })
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx;
}

.login-container {
  padding: 120rpx 60rpx 60rpx;
  display: flex;
  flex-direction: column;
}

/* Logo区域 */
.logo-section {
  text-align: center;
  margin-bottom: 100rpx;
}

.logo {
  width: 160rpx;
  height: 160rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 40rpx;
  margin: 0 auto 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80rpx;
  backdrop-filter: blur(20rpx);
}

.app-name {
  color: #fff;
  font-size: 56rpx;
  font-weight: 600;
  margin-bottom: 16rpx;
}

.app-slogan {
  color: rgba(255, 255, 255, 0.8);
  font-size: 28rpx;
}

/* 表单区域 */
.form-section {
  flex: 1;
}

.input-group {
  margin-bottom: 40rpx;
}

.input-wrapper {
  position: relative;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 30rpx;
  backdrop-filter: blur(20rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s;
}

.input-wrapper.focused {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-4rpx);
  box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.1);
}

.input-icon {
  position: absolute;
  left: 36rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 40rpx;
  color: rgba(255, 255, 255, 0.7);
  z-index: 1;
}

.input-field {
  width: 100%;
  padding: 36rpx 36rpx 36rpx 110rpx;
  background: transparent;
  color: #fff;
  font-size: 32rpx;
  border: none;
}

.placeholder {
  color: rgba(255, 255, 255, 0.6);
}

/* 忘记密码 */
.forgot-password {
  text-align: right;
  margin-bottom: 60rpx;
}

.forgot-link {
  color: rgba(255, 255, 255, 0.9);
  font-size: 28rpx;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  padding: 36rpx;
  background: #fff;
  color: #667eea;
  border: none;
  border-radius: 30rpx;
  font-size: 36rpx;
  font-weight: 600;
  box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
}

.login-btn-hover {
  transform: translateY(-4rpx);
  box-shadow: 0 24rpx 60rpx rgba(0, 0, 0, 0.2);
}

.login-btn::after {
  border: none;
}

/* 注册区域 */
.register-section {
  text-align: center;
  margin-top: 60rpx;
  font-size: 28rpx;
}

.register-text {
  color: rgba(255, 255, 255, 0.8);
}

.register-link {
  color: #fff;
  font-weight: 600;
  margin-left: 10rpx;
}
</style>
