import { useGlobalIconFont } from './assets/iconfont/helper';

export default {
  usingComponents: Object.assign(useGlobalIconFont()),
  pages: [
    'pages/index/index', // 日历面板
    'pages/my/index', // 我的
  ],
  subPackages: [],
  tabBar: {
    list: [
      {
        iconPath: 'assets/image/add.png',
        selectedIconPath: 'assets/image/add-selected.png',
        pagePath: 'pages/index/index',
        text: '发起收集',
      },
      {
        iconPath: 'assets/image/my.png',
        selectedIconPath: 'assets/image/my-selected.png',
        pagePath: 'pages/my/index',
        text: '我的',
      },
    ],
    color: '#8a8a8a',
    selectedColor: '#7fc3fb',
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  networkTimeout: {
    request: 60000,
    connectSocket: 60000,
    uploadFile: 1000000,
    downloadFile: 1000000
  }
}
