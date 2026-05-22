'use client';

import React from 'react';

interface Props {
  width:         number | string;
  height:        number;
  borderRadius?: number;
  className?:    string;
}

const SkeletonLoader: React.FC<Props> = ({
  width, height, borderRadius = 8, className = '',
}) => (
  <div
    className={`skeleton-pulse ${className}`}
    style={{ width, height, borderRadius, flexShrink: 0 }}
  />
);

export default SkeletonLoader;
