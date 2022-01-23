import { View } from '@tarojs/components';
import { MyTag } from '@/components';
import ScrollList from '@/components/ScrollList/ScrollList';
import { navigater } from '@/utils/navigater';
import './SubmitFiles.scss';

// 1: 初始化
// 2: 成功
// 3: 系统错误
// 4: 提交人删除
// 5: 管理员删除

function SubmitFiles(props) {
  const { prevPage, taskId, submitToken, submits = [], showLabel, canEdit } = props;

  const previewFile = ({ filePath, fastFileUrl, genFileName, submitId, status }) => {
    if (4 === Number(status)) return;
    navigater({
      url: '/package-tools/file-preview/index',
      data: {
        prevPage,
        filePath,
        fastFileUrl,
        genFileName,
        taskId,
        submitToken,
        submitId,
        status,
        canEdit,
      },
    });
  };

  return (
    <View className="my-submit-files-container">
      {showLabel && (
        <View className="my-submit-files-column my-submit-files-labels">
          {submits.map(({ filePath, status }) => (
            <View key={filePath} className="my-submit-files-row my-submit-files-label">
              {[4, 5].includes(status) && <MyTag title={'已删除'} status="delete" />}
            </View>
          ))}
        </View>
      )}

      <ScrollList className="my-submit-files-column my-submit-files-filenames">
        {submits.map(({ filePath, genFileName, status }) => (
          <View
            key={filePath}
            className={`my-submit-files-row my-submit-files-filename ${
              [4, 5].includes(status) && 'my-submit-files-filename__delete'
            }`}
          >
            <View className="at-icon at-icon-file-generic" />
            {genFileName}
          </View>
        ))}
      </ScrollList>

      <View className="my-submit-files-column my-submit-files-btns">
        {submits.map((item) => (
          <View
            key={item.filePath}
            className="my-submit-files-row my-submit-files-btn click-active"
            onClick={() => previewFile(item)}
          >
            {4 === Number(item?.status) ? '用户已删' : canEdit ? '查看/管理' : '查看'}
          </View>
        ))}
      </View>
    </View>
  );
}

export default SubmitFiles;
