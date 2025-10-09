/* eslint-disable @next/next/no-img-element */
import { CSSProperties } from 'react';

interface AvatarProps {
    displayName: string;
    src?: string;
    alt?: string;
    size?: number;
    style?: CSSProperties;
    className?: string;
}

// 문자열을 기반으로 일관된 색상을 생성하는 함수
function getColorFromString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // 밝고 채도가 높은 색상을 생성
    const hue = Math.abs(hash % 360);
    const saturation = 65 + (Math.abs(hash) % 20); // 65-85%
    const lightness = 50 + (Math.abs(hash >> 8) % 15); // 50-65%
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// 첫 글자를 추출하는 함수
function getInitial(name: string): string {
    if (!name) return '?';
    
    // 이모지나 특수문자 처리
    const firstChar = name.trim()[0];
    return firstChar ? firstChar.toUpperCase() : '?';
}

export default function LetterAvatarTailwind({
    displayName,
    src,
    alt,
    size = 40,
    style,
    className = '',
}: AvatarProps) {
    const initial = getInitial(displayName);
    const backgroundColor = getColorFromString(displayName);
    
    const sizeStyle = { width: size, height: size, fontSize: size * 0.5 };
    const bgStyle = src ? {} : { backgroundColor };
    const combinedStyle = { ...sizeStyle, ...bgStyle, ...style };

    if (src) {
        return (
        <div 
            style={combinedStyle}
            className={`rounded-full inline-flex items-center justify-center font-semibold text-white overflow-hidden flex-shrink-0 select-none ${className}`}
        >
            <img
            src={src}
            alt={alt || displayName}
            className="w-full h-full object-cover"
            />
        </div>
        );
    }

    return (
        <div 
        style={combinedStyle}
        className={`rounded-full inline-flex items-center justify-center font-semibold text-white overflow-hidden flex-shrink-0 select-none ${className}`}
        >
        {initial}
        </div>
    );
}