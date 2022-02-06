/* eslint-disable */
import React, { FunctionComponent } from 'react';

interface Props {
  name: 'image' | 'wenjian' | 'wenjian1' | 'list' | 'left' | 'right' | 'delete' | 'add' | 'close';
  size?: number;
  color?: string | string[];
  style?: React.CSSProperties;
}

declare const IconFont: FunctionComponent<Props>;

export default IconFont;
