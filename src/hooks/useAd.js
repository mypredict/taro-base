import { useCallback, useEffect, useRef, useState } from "react";
import Taro from '@tarojs/taro';

const defaultAdUnitId = 'adunit-5dc61b61b5d69a90';

function useAd(options) {
  const { adUnitId = defaultAdUnitId, onComplete = () => {}, onError = () => {} } = options || {};

  const cbRef = useRef({
    onComplete,
    onError,
  });
  cbRef.current = {
    onComplete,
    onError,
  };

  const [rewardedVideoAd, setRewardedVideoAd] = useState(null);
  useEffect(() => {
    if (!rewardedVideoAd) {
      setRewardedVideoAd(Taro.createRewardedVideoAd({
        adUnitId,
      }));
    }
  }, [adUnitId, rewardedVideoAd]);

  useEffect(() => {
    const { onComplete, onError } = cbRef.current;
    if (rewardedVideoAd) {
      rewardedVideoAd.onLoad(() => {
        Taro.hideLoading();
        console.log('onLoad');
      });
      rewardedVideoAd.onClose((data) => {
        console.log('用户关闭广告');
        if (data.isEnded) {
          onComplete();
        }
      });
      rewardedVideoAd.onError((err) => {
        console.log('监听激励视频错误事件');
        Taro.hideLoading();
        onError(err);
      });
    }

    return () => {
      if (rewardedVideoAd) {
        rewardedVideoAd.offLoad(() => {
          console.log('取消监听激励视频广告加载事件');
        });
        rewardedVideoAd.offClose(() => {
          console.log('取消监听用户点击关闭广告按钮的事件');
        });
        rewardedVideoAd.offError(() => {
          console.log('取消监听激励视频错误事件');
        });
      }
    };
  }, [rewardedVideoAd]);

  const show = useCallback(() => {
    Taro.showLoading({ title: '加载中...' });
    const { onError } = cbRef.current;
    if (rewardedVideoAd) {
      // 第一次拉取
      rewardedVideoAd.show()
        .then(() => {
          Taro.hideLoading();
        })
        .catch(() => {
          rewardedVideoAd.load()
            .then(() => {
              // 再次拉取
              rewardedVideoAd.show()
                .then(() => {
                  Taro.hideLoading();
                })
                .catch((err) => {
                  Taro.hideLoading();
                  onError(err);
                });
            })
            .catch((err) => {
              Taro.hideLoading();
              onError(err);
            });
        });
    }
  }, [rewardedVideoAd]);

  return { show };
}

export default useAd;
