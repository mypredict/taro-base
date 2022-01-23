import Taro from '@tarojs/taro';

const defaultAdUnitId = 'adunit-5dc61b61b5d69a90';
export let rewardedVideoAd = null;

// export function createAd(options) {
//   const { adUnitId = defaultAdUnitId, onComplete = () => {}, onError = () => {} } = options || {};

//   if (!rewardedVideoAd) {
//     let rewardedVideoAd = Taro.createRewardedVideoAd({
//       adUnitId,
//     });

//     rewardedVideoAd.onLoad(() => {
//       Taro.hideLoading();
//       console.log('onLoad');
//     });

//     rewardedVideoAd.onClose((data) => {
//       console.log('用户关闭广告');
//       if (data.isEnded) {
//         onComplete();
//       }
//     });

//     rewardedVideoAd.onError((err) => {
//       console.log('监听激励视频错误事件');
//       Taro.hideLoading();
//       onError(err);
//     });
//   }

//   const loadAd = () => {
//     rewardedVideoAd.load()
//       .then(() => {
//         rewardedVideoAd.show()
//           .then(() => {
//             Taro.hideLoading();
//           })
//           .catch((err) => {
//             Taro.hideLoading();
//             onError(err);
//           });
//       })
//       .catch((err) => {
//         Taro.hideLoading();
//         onError(err);
//       });
//   };

//   return {
//     show: () => {
//       if (rewardedVideoAd) {
//         console.log(8888)
//         Taro.showLoading({ title: '加载中...' });
//         // 第一次拉取
//         rewardedVideoAd.show()
//           .then(() => {
//             Taro.hideLoading();
//           })
//           .catch(() => {
//             loadAd();
//           });
//       }
//     },
//   };
// }
