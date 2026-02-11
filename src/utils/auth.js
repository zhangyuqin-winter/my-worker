/**
 * 权限控制工具
 */

// 获取用户角色
export const getUserRole = () => {
  return uni.getStorageSync('role') || ''
}

// 获取用户信息
export const getUserInfo = () => {
  return uni.getStorageSync('userInfo') || null
}

// 获取Token
export const getToken = () => {
  return uni.getStorageSync('token') || ''
}

// 检查是否登录
export const isLogin = () => {
  return !!getToken()
}

// 检查是否是管理员
export const isAdmin = () => {
  return getUserRole() === 'admin'
}

// 检查是否是普通用户
export const isUser = () => {
  return getUserRole() === 'user'
}

// 清除登录信息
export const clearAuth = () => {
  uni.removeStorageSync('userInfo')
  uni.removeStorageSync('token')
  uni.removeStorageSync('role')
}

// 权限检查中间件
export const checkAuth = (requiredRole = null) => {
  if (!isLogin()) {
    uni.showModal({
      title: '提示',
      content: '请先登录',
      showCancel: false,
      success: () => {
        uni.reLaunch({
          url: '/pages/login/login'
        })
      }
    })
    return false
  }
  
  if (requiredRole && getUserRole() !== requiredRole) {
    uni.showModal({
      title: '权限不足',
      content: '您没有访问该页面的权限',
      showCancel: false,
      success: () => {
        uni.reLaunch({
          url: '/pages/login/login'
        })
      }
    })
    return false
  }
  
  return true
}
