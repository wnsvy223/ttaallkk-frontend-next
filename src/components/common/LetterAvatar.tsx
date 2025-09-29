import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Avatar, SxProps, Theme } from '@mui/material';
import Inko from 'inko';

/**
 * [커스텀 아바타 컴포넌트]
 * 프로필 이미지 리소스가 없을 경우 사용자의 이름 기반으로 첫글자와 색상코드가 적용
 * 사용자이름이 한글일 경우를 대비해 Inko 라이브러리로 변환하여 적용
 * props 이름은 material ui 커스텀 props 혼동방지를 위해 그대로 sx로 사용
 */

interface LetterAvatarsProps {
  sx?: SxProps<Theme> & {
    name: string;
  };
  src?: string;
}

const CustomAvatar = styled(Avatar)({
  lineHeight: 0
});

function stringToColor(string: string): string {
  let hash = 0;
  let i: number;

  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = ((hash << 5) + hash) + char; // hash * 33 + char
    hash = hash & hash; // 32비트 정수로 변환
  }

  // 절댓값 사용하여 음수 방지
  hash = Math.abs(hash);
  
  // HSL 색상 공간을 사용하여 더 다양하고 균등한 색상 생성
  const hue = hash % 360; // 0-359도 사이의 색상
  const saturation = 45 + (hash % 30); // 45-74% 사이의 채도 (너무 선명하지 않게)
  const lightness = 35 + (hash % 20); // 35-54% 사이의 밝기 (적절한 대비)
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function stringAvatar(props: SxProps<Theme> & { name: string }) {
  const inko = new Inko();
  const regex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글 체크 정규식
  const displayName = props?.name;
  const isKoreanName = regex.test(displayName.charAt(0)); // 닉네임 첫글자가 한글인지 영어인지 체크
  const convertName = isKoreanName ? inko.en2ko(displayName) : displayName; // 닉네임 첫글자가 한글이면 한글로 변환값, 영어면 그대로
  const name = displayName ? convertName : 'Unknown';
  
  return {
    sx: {
      ...props,
      bgcolor: stringToColor(name)
    },
    children: name.charAt(0)
  };
}


export default function LetterAvatar({ sx, src }: LetterAvatarsProps) {
  if (src) {
    return <CustomAvatar sx={sx} src={src} />;
  }
  return <CustomAvatar {...stringAvatar(sx!)} src={src} />;
}