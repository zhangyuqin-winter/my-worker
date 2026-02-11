// utils/sm2Encrypt.js
import smCrypto from 'sm-crypto'
const { sm2 } = smCrypto

// 与PC端保持相同的公钥及模式
const publicKey = '04BD62406DF6789B1FBE8C457AECAE6D7C806CDB39316F190519905C24DF395E8952C47798D76ADECF8CA28C935702AFCDD9B17DE77121FA6448F0EDEFBD8365D6'
const cipherMode = 0

export function encryptPassword(password) {
  return sm2.doEncrypt(password, publicKey, cipherMode)
}
