import { memo, useEffect, useState } from 'react';
import { MyCardAccordion } from '../index';
import UploadFile from '../UploadFile/UploadFile';
import './UploadCard.scss';

const defaultFiles = {
  isComplate: true,
  fileList: [],
};

function UploadCard(props) {
  const {
    title = '文件上传',
    defaultChecked = false,
    checked,
    onCheckedChange = () => {},
    preview,
    chooseTypes,
    extension,
    count,
    maxSize,
    unit,
    limit,
    url,
    name,
    scene,
    token,
    onChange = () => {},
  } = props;

  const [realChecked, setRealChecked] = useState(defaultChecked || checked || false);
  const handleCheckedChange = (e) => {
    if (!(typeof checked === 'boolean')) {
      setRealChecked(e.detail.value);
    }
    onCheckedChange(e);
  };

  useEffect(() => {
    if (typeof checked === 'boolean') {
      setRealChecked(checked);
    }
  }, [checked]);

  const [data, setData] = useState(defaultFiles);
  useEffect(() => {
    if (realChecked) {
      onChange(data);
    } else {
      onChange(defaultFiles);
    }
  }, [realChecked, data]);

  return (
    <MyCardAccordion title={title} checked={realChecked} onChange={handleCheckedChange}>
      <UploadFile
        preview={preview}
        chooseTypes={chooseTypes}
        extension={extension}
        count={count}
        maxSize={maxSize}
        unit={unit}
        limit={limit}
        url={url}
        name={name}
        scene={scene}
        token={token}
        onChange={setData}
      />
    </MyCardAccordion>
  );
}

export default memo(UploadCard);
