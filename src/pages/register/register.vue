<template>
  <view class="page-container">
    <view class="register-container">
      <!-- 装饰性背景 -->
      <view class="bg-decoration"></view>
      <view class="bg-decoration"></view>
      
      <!-- 顶部返回按钮 -->
      <view class="header">
        <view class="back-btn" @tap="handleBack" hover-class="back-btn-hover">
          <text>←</text>
        </view>
      </view>

      <!-- Logo区域 -->
      <view class="logo-section">
        <view class="logo">🎯</view>
        <view class="page-title">创建账号</view>
        <view class="page-subtitle">加入我们，开启精彩旅程</view>
      </view>

      <!-- 表单区域 -->
      <view class="form-section">
        <!-- 账号输入 -->
        <view class="input-group">
          <text class="input-label">账号</text>
          <view class="input-wrapper" :class="{ 'focused': usernameFocused }">
            <text class="input-icon">👤</text>
            <input 
              v-model="formData.username"
              class="input-field"
              type="text"
              placeholder="请输入账号（6-16位字符）"
              placeholder-class="placeholder"
              maxlength="16"
              @focus="usernameFocused = true"
              @blur="usernameFocused = false"
            />
          </view>
        </view>

        <!-- 密码输入 -->
        <view class="input-group">
          <text class="input-label">密码</text>
          <view class="input-wrapper" :class="{ 'focused': passwordFocused }">
            <text class="input-icon">🔒</text>
            <input 
              v-model="formData.password"
              class="input-field"
              type="password"
              placeholder="请输入密码（6-20位字符）"
              placeholder-class="placeholder"
              maxlength="20"
              @focus="passwordFocused = true"
              @blur="passwordFocused = false"
            />
          </view>
        </view>

        <!-- 确认密码 -->
        <view class="input-group">
          <text class="input-label">确认密码</text>
          <view class="input-wrapper" :class="{ 'focused': confirmPasswordFocused }">
            <text class="input-icon">🔐</text>
            <input 
              v-model="formData.confirmPassword"
              class="input-field"
              type="password"
              placeholder="请再次输入密码"
              placeholder-class="placeholder"
              maxlength="20"
              @focus="confirmPasswordFocused = true"
              @blur="confirmPasswordFocused = false"
            />
          </view>
        </view>

        <!-- 验证码 -->
        <view class="input-group">
          <text class="input-label">验证码</text>
          <view class="code-input-wrapper">
            <view class="input-wrapper" :class="{ 'focused': codeFocused }">
              <text class="input-icon">✉️</text>
              <input 
                v-model="formData.code"
                class="input-field"
                type="text"
                placeholder="请输入验证码"
                placeholder-class="placeholder"
                maxlength="6"
                @focus="codeFocused = true"
                @blur="codeFocused = false"
              />
            </view>
            <button 
              class="code-btn" 
              :class="{ 'disabled': codeDisabled }"
              @tap="sendCode"
              hover-class="code-btn-hover"
            >
              {{ codeText }}
            </button>
          </view>
        </view>

        <!-- 协议勾选 -->
        <view class="agreement-section">
          <view class="checkbox-wrapper" @tap="toggleAgreement">
            <view class="checkbox-custom" :class="{ 'checked': formData.agreement }">
              <text v-if="formData.agreement" class="check-icon">✓</text>
            </view>
          </view>
          <view class="agreement-text">
            <text>我已阅读并同意</text>
            <text class="agreement-link" @tap.stop="showAgreement('user')">《用户协议》</text>
            <text>和</text>
            <text class="agreement-link" @tap.stop="showAgreement('privacy')">《隐私政策》</text>
          </view>
        </view>

        <!-- 注册按钮 -->
        <button 
          class="register-btn" 
          @tap="handleRegister"
          hover-class="register-btn-hover"
        >
          立即注册
        </button>

        <!-- 登录链接 -->
        <view class="login-section">
          <text class="login-text">已有账号？</text>
          <text class="login-link" @tap="goToLogin">立即登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// 表单数据
const formData = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  code: '',
  agreement: false
})

// 输入框聚焦状态
const usernameFocused = ref(false)
const passwordFocused = ref(false)
const confirmPasswordFocused = ref(false)
const codeFocused = ref(false)

// 验证码相关
const countdown = ref(60)
const codeDisabled = ref(false)
const codeText = computed(() => {
  return codeDisabled.value ? `${countdown.value}秒后重试` : '获取验证码'
})

let timer = null

// 返回上一页
const handleBack = () => {
  uni.navigateBack({
    delta: 1
  })
}

// 发送验证码
const sendCode = () => {
  // 验证账号
  if (!formData.username) {
    uni.showToast({
      title: '请先输入账号',
      icon: 'none',
      duration: 2000
    })
    return
  }

  if (formData.username.length < 6) {
    uni.showToast({
      title: '账号长度不能少于6位',
      icon: 'none',
      duration: 2000
    })
    return
  }

  if (codeDisabled.value) {
    return
  }

  // 模拟发送验证码
  uni.showToast({
    title: '验证码已发送',
    icon: 'success',
    duration: 2000
  })

  codeDisabled.value = true
  countdown.value = 60

  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      codeDisabled.value = false
      countdown.value = 60
    }
  }, 1000)
}

// 切换协议勾选
const toggleAgreement = () => {
  formData.agreement = !formData.agreement
}

// 查看协议
const showAgreement = (type) => {
  const text = type === 'user' ? '用户协议' : '隐私政策'
  uni.showModal({
    title: text,
    content: `这里是${text}的内容...`,
    showCancel: false,
    confirmText: '我知道了'
  })
}

// 跳转登录
const goToLogin = () => {
  uni.navigateBack({
    delta: 1
  })
  // 或者使用 redirectTo
  // uni.redirectTo({
  //   url: '/pages/login/login'
  // })
}

// 表单验证
const validateForm = () => {
  // 验证账号
  if (!formData.username) {
    return { valid: false, message: '请输入账号' }
  }
  
  if (formData.username.length < 6 || formData.username.length > 16) {
    return { valid: false, message: '账号长度应为6-16位字符' }
  }

  // 验证账号格式（字母、数字、下划线）
  const usernameReg = /^[a-zA-Z0-9_]{6,16}$/
  if (!usernameReg.test(formData.username)) {
    return { valid: false, message: '账号只能包含字母、数字和下划线' }
  }

  // 验证密码
  if (!formData.password) {
    return { valid: false, message: '请输入密码' }
  }

  if (formData.password.length < 6 || formData.password.length > 20) {
    return { valid: false, message: '密码长度应为6-20位字符' }
  }

  // 验证密码一致性
  if (formData.password !== formData.confirmPassword) {
    return { valid: false, message: '两次输入的密码不一致' }
  }

  // 验证验证码
  if (!formData.code) {
    return { valid: false, message: '请输入验证码' }
  }

  if (formData.code.length !== 6) {
    return { valid: false, message: '请输入6位验证码' }
  }

  // 验证协议
  if (!formData.agreement) {
    return { valid: false, message: '请阅读并同意用户协议和隐私政策' }
  }

  return { valid: true }
}

// 注册处理
const handleRegister = async () => {
  // 表单验证
  const validation = validateForm()
  if (!validation.valid) {
    uni.showToast({
      title: validation.message,
      icon: 'none',
      duration: 2000
    })
    return
  }

  // 显示加载
  uni.showLoading({
    title: '注册中...',
    mask: true
  })

  try {
    // 模拟API请求
    await mockRegister(formData)
    
    uni.hideLoading()
    
    uni.showToast({
      title: `注册成功！欢迎 ${formData.username}`,
      icon: 'success',
      duration: 2000
    })

    // 延迟跳转到登录页
    setTimeout(() => {
      uni.redirectTo({
        url: '/pages/login/login'
      })
    }, 2000)

  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: error.message || '注册失败',
      icon: 'none',
      duration: 2000
    })
  }
}

// 模拟注册API
const mockRegister = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟验证码校验
      if (data.code !== '123456') {
        reject(new Error('验证码错误'))
        return
      }
      
      // 模拟账号已存在
      if (data.username === 'admin') {
        reject(new Error('该账号已被注册'))
        return
      }
      
      resolve({ success: true })
    }, 1500)
  })
}

// 页面卸载时清除定时器
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-container {
  position: relative;
  min-height: 100vh;
  padding: 80rpx 60rpx 60rpx;
  overflow: hidden;
}

/* 装饰性背景 */
.bg-decoration {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  
  &:nth-child(1) {
    width: 400rpx;
    height: 400rpx;
    top: -100rpx;
    right: -100rpx;
  }
  
  &:nth-child(2) {
    width: 500rpx;
    height: 500rpx;
    bottom: -160rpx;
    left: -160rpx;
  }
}

/* 顶部返回 */
.header {
  position: relative;
  z-index: 10;
  margin-bottom: 60rpx;
}

.back-btn {
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: #fff;
  transition: all 0.3s;
}

.back-btn-hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-6rpx);
}

/* Logo区域 */
.logo-section {
  position: relative;
  z-index: 10;
  text-align: center;
  margin-bottom: 80rpx;
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
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20rpx); }
}

.page-title {
  color: #ffffff;
  font-size: 56rpx;
  font-weight: 600;
  margin-bottom: 16rpx;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 28rpx;
}

/* 表单区域 */
.form-section {
  position: relative;
  z-index: 10;
}

.input-group {
  margin-bottom: 40rpx;
}

.input-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 26rpx;
  margin-bottom: 16rpx;
  display: block;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 30rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s;
  backdrop-filter: blur(20rpx);
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
  z-index: 1;
}

.input-field {
  width: 100%;
  padding: 32rpx 36rpx 32rpx 110rpx;
  background: transparent;
  color: #fff;
  font-size: 30rpx;
  border: none;
}

.placeholder {
  color: rgba(255, 255, 255, 0.6);
}

/* 验证码输入 */
.code-input-wrapper {
  display: flex;
  gap: 20rpx;
}

.code-input-wrapper .input-wrapper {
  flex: 1;
}

.code-btn {
  padding: 32rpx 40rpx;
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 30rpx;
  font-size: 26rpx;
  font-weight: 500;
  transition: all 0.3s;
  white-space: nowrap;
  min-width: 200rpx;
  text-align: center;
}

.code-btn::after {
  border: none;
}

.code-btn-hover {
  background: rgba(255, 255, 255, 0.35);
}

.code-btn.disabled {
  opacity: 0.5;
}

/* 协议勾选 */
.agreement-section {
  display: flex;
  align-items: flex-start;
  margin-bottom: 60rpx;
  gap: 20rpx;
}

.checkbox-wrapper {
  flex-shrink: 0;
  margin-top: 4rpx;
}

.checkbox-custom {
  width: 40rpx;
  height: 40rpx;
  background: rgba(255, 255, 255, 0.2);
  border: 4rpx solid rgba(255, 255, 255, 0.4);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.checkbox-custom.checked {
  background: #ffffff;
  border-color: #ffffff;
}

.check-icon {
  color: #667eea;
  font-size: 28rpx;
  font-weight: bold;
}

.agreement-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 26rpx;
  line-height: 1.6;
}

.agreement-link {
  color: #ffffff;
  text-decoration: underline;
  margin: 0 4rpx;
}

/* 注册按钮 */
.register-btn {
  width: 100%;
  padding: 36rpx;
  background: #ffffff;
  color: #667eea;
  border: none;
  border-radius: 30rpx;
  font-size: 34rpx;
  font-weight: 600;
  box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
  margin-bottom: 40rpx;
}

.register-btn::after {
  border: none;
}

.register-btn-hover {
  transform: translateY(-4rpx);
  box-shadow: 0 24rpx 60rpx rgba(0, 0, 0, 0.2);
}

/* 登录链接 */
.login-section {
  text-align: center;
  font-size: 28rpx;
}

.login-text {
  color: rgba(255, 255, 255, 0.8);
}

.login-link {
  color: #ffffff;
  font-weight: 600;
  margin-left: 10rpx;
}
</style>
