"use client"

import React from 'react';
import Link from 'next/link'
import { IconButton } from '@mui/material';
import LetterAvatar from './LetterAvatar';

/**
 * [커스텀 아바타 버튼]
 * 아바타 컴포넌트의 버튼형태 컴포넌트. navigate를 이용하여 클릭 시 해당 사용자의 프로필 페이지로 이동
 */
const defaultWidth = 26;
const defaultHeight = 26;
const defaultFontSize = 11;

interface AvatarSxProps {
  width?: number;
  height?: number;
  fontSize?: number;
}

interface LetterAvatarButtonProps {
  uid: string;
  displayName: string;
  profileUrl: string;
  sx?: AvatarSxProps;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>, uid: string) => void;
}

function LetterAvatarButton({ 
  uid, 
  displayName, 
  profileUrl, 
  sx = {},
  onClick 
}: LetterAvatarButtonProps) {
  
  const handleAvatarClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    
    if (onClick) {
      onClick(event, uid);
    }
  };

  const avatarWidth = sx.width ?? defaultWidth;
  const avatarHeight = sx.height ?? defaultHeight;
  const avatarFontSize = sx.fontSize ?? defaultFontSize;

  return (
    <IconButton
      onClick={handleAvatarClick}
      sx={{
        padding: 0,
        width: avatarWidth + 4,
        height: avatarHeight + 4
      }}
    >
      <Link 
        href={`/profile`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10
      }}/>
      <LetterAvatar
        src={profileUrl}
        sx={{
          ...sx,
          width: avatarWidth,
          height: avatarHeight,
          name: displayName,
          fontSize: avatarFontSize
        }}
      />
    </IconButton>
  );
}

export default LetterAvatarButton;