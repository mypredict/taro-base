import { initRequest } from './request';

export * from './middleware';
export * from './request';
export * from './compose';

const request = initRequest();

export default request;
