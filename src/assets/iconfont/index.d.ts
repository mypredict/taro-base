/* eslint-disable */
import React, { FunctionComponent } from 'react';

interface Props {
  name: 'quxiao' | 'quxiao1' | 'quxiao2';
  size?: number;
  color?: string | string[];
  style?: React.CSSProperties;
}

declare const IconFont: FunctionComponent<Props>;

export default IconFont;
