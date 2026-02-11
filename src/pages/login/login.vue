<template>
  <view class="page-container">
    <view class="login-container">
      <!-- Logo区域 -->
      <view class="logo-section">
        <view class="logo">🚀</view>
        <view class="app-name">欢迎回来</view>
        <view class="app-slogan">登录以继续使用</view>
      </view>
      
      <!-- 角色选择 -->
      <view class="role-selector">
        <view 
          class="role-item" 
          :class="{ 'active': formData.role === 'user' }"
          @tap="selectRole('user')"
        >
          <text class="role-icon">👤</text>
          <text class="role-text">用户登录</text>
        </view>
        <view 
          class="role-item" 
          :class="{ 'active': formData.role === 'admin' }"
          @tap="selectRole('admin')"
        >
          <text class="role-icon">👨‍💼</text>
          <text class="role-text">管理员登录</text>
        </view>
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
		
		<view class="input-group captcha-group">
		  <view class="captcha-wrapper">
		    <!-- 输入框 -->
		    <view class="input-wrapper" :class="{ 'focused': captchaFocused }">
		      <text class="input-icon">🧩</text>
		      <input
		        v-model="formData.captcha"
		        class="input-field"
		        type="text"
		        placeholder="请输入验证码"
		        placeholder-class="placeholder"
		        @focus="captchaFocused = true"
		        @blur="captchaFocused = false"
		      />
		    </view>
		    <!-- 验证码图片 -->
		    <view class="captcha-image-wrapper" @tap="getCaptcha">
		      <image
		        v-if="captchaData.validCodeBase64"
		        :src="captchaData.validCodeBase64"
		        mode="aspectFit"
		        class="captcha-image"
		      />
		      <view v-else class="captcha-loading">点击刷新</view>
		    </view>
		  </view>
		</view>

        
        <view class="forgot-password">
          <text class="forgot-link" @tap="handleForgotPassword">忘记密码？</text>
        </view>
        
        <button class="login-btn" @tap="handleLogin" hover-class="login-btn-hover">
          登录
        </button>
        
        <view class="register-section" v-if="formData.role === 'user'">
          <text class="register-text">还没有账号？</text>
          <text class="register-link" @tap="handleRegister">立即注册</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive,onMounted } from 'vue'
import md5 from 'js-md5'
import { encryptPassword } from '@/utils/smCrypto.js'
// 表单数据
const formData = reactive({
  username: '',
  password: '',
  captcha:'',
  validCodeReqNo:'',
  role: 'user' ,// 默认用户角色
})

// 输入框聚焦状态
const usernameFocused = ref(false)
const passwordFocused = ref(false)
const captchaFocused = ref(false)

// 选择角色
const selectRole = (role) => {
  formData.role = role
}

// 验证码数据
const captchaData = reactive({
  validCodeBase64: '',
  validCodeReqNo: ''
})

// 获取验证码函数
const getCaptcha = async () => {
  try {
    // 显示加载提示（防止接口慢时用户以为卡顿）
    uni.showLoading({ title: '加载验证码...' })

    const res = await uni.request({
      url: 'http://s03.kaintelli.com:5035/api/sys/auth/b/getPicCaptcha',
      method: 'GET',
      timeout: 8000 // 超时保护
    })

    // 关闭 loading
    uni.hideLoading()

    // 判断返回结构是否合法
    if (
      res.statusCode === 200 &&
      res.data &&
      res.data.code === 200 &&
      res.data.data
    ) {
      const { validCodeBase64, validCodeReqNo } = res.data.data

      // 验证字段结构
      if (!validCodeBase64 || !validCodeReqNo) {
        throw new Error('验证码数据格式异常')
      }

      // 写入响应数据
      captchaData.validCodeBase64 = validCodeBase64
      captchaData.validCodeReqNo = validCodeReqNo
      formData.validCodeReqNo = validCodeReqNo
    } else {
      uni.showToast({
        title: res.data.msg || '验证码获取失败',
        icon: 'none',
        duration: 2000
      })
    }
  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: error.message.includes('timeout')
        ? '请求超时，请重试'
        : error.message || '网络错误，请重试',
      icon: 'none',
      duration: 2000
    })
  }
}

// 页面加载时自动获取验证码
onMounted(() => {
  getCaptcha()
})


// 新增：本地模拟“验证码验证”登录逻辑
const handleLogin = async () => {
  if (!formData.username) return uni.showToast({ title: '请输入账号', icon: 'none' })
  if (!formData.password) return uni.showToast({ title: '请输入密码', icon: 'none' })
  if (!formData.captcha) return uni.showToast({ title: '请输入验证码', icon: 'none' })

  uni.showLoading({ title: '登录中...' })

  try {
    // 使用国密 SM2 加密密码（与 PC 保持一致）
    const encryptedPwd = encryptPassword(formData.password)

    const res = await uni.request({
      url: 'http://s03.kaintelli.com:5035/api/sys/auth/b/login',
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: {
        account: formData.username.trim(),
        password: encryptedPwd,
        validCodeReqNo: formData.validCodeReqNo,
        validCode: formData.captcha.trim(),
      }
    })

    uni.hideLoading()
    const data = res.data

    if (data.code === 200 && data.data) {
      uni.setStorageSync('token', data.data.token)
      uni.setStorageSync('userInfo', data.data)
      uni.showToast({ title: '登录成功！', icon: 'success', duration: 1500 })
      setTimeout(() => uni.switchTab({ url: '/pages/index/index' }), 1000)
    } else {
      uni.showToast({ title: data.msg || '登录失败', icon: 'none', duration: 2000 })
      getCaptcha()
    }
  } catch (error) {
    uni.hideLoading()
    uni.showToast({ title: error.message || '登录异常', icon: 'none', duration: 2000 })
    getCaptcha()
  }
}
// 模拟登录API
const realLogin = async (data) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'http://s03.kaintelli.com:5035/api/sys/auth/b/login',
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data,
      success: (res) => {
        if (res.data && res.data.code === 200) {
          resolve(res.data.data)
        } else {
          reject(new Error(res.data.msg || '登录失败'))
        }
      },
      fail: () => {
        reject(new Error('网络连接失败'))
      }
    })
  })
}
// 忘记密码
const handleForgotPassword = () => {
  uni.showToast({
    title: '忘记密码功能',
    icon: 'none',
    duration: 2000
  })
}

// 注册
const handleRegister = () => {
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
  padding: 80rpx 60rpx 60rpx;
  display: flex;
  flex-direction: column;
}

/* Logo区域 */
.logo-section {
  text-align: center;
  margin-bottom: 60rpx;
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

/* 角色选择 */
.role-selector {
  display: flex;
  gap: 24rpx;
  margin-bottom: 60rpx;
}

.role-item {
  flex: 1;
  padding: 32rpx 24rpx;
  background: rgba(255, 255, 255, 0.15);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 24rpx;
  text-align: center;
  transition: all 0.3s;
  backdrop-filter: blur(20rpx);
}

.role-item.active {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-4rpx);
  box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.1);
}

.role-icon {
  display: block;
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.role-text {
  color: #fff;
  font-size: 28rpx;
  font-weight: 500;
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

.captcha-group {
  display: flex;
  align-items: center;
}

.captcha-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.captcha-image-wrapper {
  margin-left: 20rpx;
  width: 200rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.captcha-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.captcha-loading {
  color: rgba(255, 255, 255, 0.8);
  font-size: 26rpx;
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
