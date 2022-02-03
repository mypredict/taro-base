import Taro from '@tarojs/taro';
import request from '@/lib/request';
import { baseUrl } from './config';

// 从微信获取用户code
export async function getUserCode() {
  return await Taro.login();
}

// 登录
export async function userLogin(code) {
  return await request({
    method: 'POST',
    url: `${baseUrl}/user/loginByMiniProgram`,
    data: { code },
  });
}

// 同步获取用户token
export function getUserTokenSync() {
  return Taro.getStorageSync('token');
}

// 获取用户token
export async function getUserToken(force) {
  const localToken = Taro.getStorageSync('token');

  if (force || !localToken) {
    const { code } = await getUserCode();
    const res = await userLogin(code);

    if (res.data.code === 0) {
      const token = res.data.data.token;
      Taro.setStorageSync('token', token);
      request.setOptions((options) => {
        return {
          ...options,
          header: {
            'content-type': 'application/json',
            'X-LOGIN-TOKEN': token,
          },
        };
      });
      return token;
    }

    return Promise.reject('login error');
  }

  request.setOptions((options) => {
    return {
      ...options,
      header: {
        'content-type': 'application/json',
        'X-LOGIN-TOKEN': localToken,
      },
    };
  });

  return localToken;
}

// 弹窗授权
export async function getUserProfile() {
  return new Promise((resolve, reject) => {
    Taro.getUserProfile({
      desc: '用于提交用户区分',
      success(res) {
        resolve(res);
      },
      fail(res) {
        reject(res);
      }
    });
  });
}

// 更新用户信息
export async function updateUser(data) {
  return await request({
    method: 'POST',
    url: `${baseUrl}/user/updateProfile`,
    data,
  });
}

// 获取用户信息
export async function getUser() {
  const userInfo = await request({
    method: 'POST',
    url: `${baseUrl}/user/profile`,
    data: {},
  });

  // 不是注册用户
  if (!userInfo?.data?.hasInfo) {
    const newUserInfo = await getUserProfile();
    await updateUser({
      nickName: newUserInfo?.userInfo?.nickName,
      avatarUrl: newUserInfo?.userInfo?.avatarUrl,
    });
    return newUserInfo?.userInfo;
  }

  return userInfo?.res?.data?.data;
}

// 获取web临时登录token
export async function getTempLoginToken(data) {
  return await request({
    method: 'POST',
    url: `${baseUrl}/user/genTempLoginToken`,
    data,
  });
}
