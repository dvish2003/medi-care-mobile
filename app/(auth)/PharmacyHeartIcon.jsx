import React from 'react';
import { Svg, Path, Rect, G } from 'react-native-svg';

const PharmacyHeartIcon = ({ size = 60, color = "#F042FF" }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Heart outline */}
      <Path
        d="M50,85 C45,80 20,60 20,40 C20,25 35,15 50,25 C65,15 80,25 80,40 C80,60 55,80 50,85 Z"
        fill="none"
        stroke={color}
        strokeWidth="4"
      />
      
      {/* Pharmacy cross */}
      <G transform="translate(30, 30) scale(1.4)">
        {/* Vertical line of the cross */}
        <Rect x="23" y="5" width="4" height="30" rx="2" fill={color} />
        {/* Horizontal line of the cross */}
        <Rect x="5" y="23" width="30" height="4" rx="2" fill={color} />
      </G>
    </Svg>
  );
};

export default PharmacyHeartIcon;