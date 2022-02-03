import request from '@/lib/request';
import { baseUrl } from './config';

// 获取我创建的(或者我提交的)任务列表
export async function getMyCreateList(data) {
  return await request({
    method: 'POST',
    url: `${baseUrl}/task/list`,
    data,
  });
}

// 获取上传进度
export async function getUploadProgress(data) {
  return await request({
    method: 'POST',
    url: `${baseUrl}/task/file/getUploadProgress`,
    data,
  });
}