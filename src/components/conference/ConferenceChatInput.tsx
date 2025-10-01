"use client";

import { SetStateAction, useState, useRef } from 'react';

import { Box, IconButton, Paper, InputBase } from '@mui/material';
import { styled } from '@mui/material/styles';

// iconify
import { Icon } from '@iconify/react';
import SendIcon from '@iconify/icons-mdi/send';
import SharFileIcon from '@iconify/icons-fluent/image-multiple-16-regular';

// Moment
import moment from 'moment';
import 'moment/locale/ko';
import { useRTC } from '@/context/RTCMultiConnectionContext';
import { useMessageStore } from '@/context/ChatStoreContext';


const ChatInputBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: 10
}));

const ChatInputPaper = styled(Paper)(() => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  backgroundColor: '#505050'
}));

export default function ConferenceChatInput() {
  const [chatMessage, setChatMessage] = useState('');
  const { connection } = useRTC();
  const addMessage = useMessageStore((state) => state.addMessage);
  const resetDividerMessage = useMessageStore((state) => state.resetDividerMessage);

  const handleEnterPress = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setChatMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if(connection){
        const newMessage = {
        type: 'textMessage',
        text: chatMessage,
        userid: connection.userid,
        displayName: connection.extra.displayName,
        profileUrl: connection.extra.profileUrl,
        timeStamp: moment()
      };
      connection.send(newMessage);
      resetDividerMessage();
      addMessage(newMessage);
      setChatMessage('');
    }
  };

  // 타입 수정: HTMLInputElement로 지정
  const inputFile = useRef<HTMLInputElement>(null);

  const handleOpenFileSelector = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    inputFile.current?.click();
  };

  const handleChangeFile = (e: { target: { files: any; }; }) => {
    const { files } = e.target;
    if (files.length < 1) {
      return;
    }
    if (files.length === 1) {
      // 단일 파일 전송
      connection?.send(files[0]);
    } else {
      // 다수 파일 전송
      // sendMultipleFile(Array.from(files));
    }
    if (inputFile.current) {
      inputFile.current.value = ''; // input 값 리셋
    }
  };

  return (
    <ChatInputBox>
      <ChatInputPaper>
        <Box>
        <input
            type="file"
            multiple
            accept="*"
            ref={inputFile}
            style={{ display: 'none' }}
            onChange={handleChangeFile}
        />
        <IconButton aria-label="share file" component="label" onClick={handleOpenFileSelector}>
            <Box component={Icon} icon={SharFileIcon} sx={{ width: 23, heigh: 23, color: '#F2F2F2' }} />
        </IconButton>
        </Box>
        <InputBase
          sx={{ ml: 1, flex: 1, height: 40, fontSize: 12, color: '#F2F2F2' }}
          placeholder="채팅 메시지를 입력하세요."
          onChange={handleChange}
          onKeyPress={handleEnterPress}
          value={chatMessage || ''}
        />
        {chatMessage && (
          <IconButton onClick={handleSendMessage}>
            <Box component={Icon} icon={SendIcon} sx={{ width: 23, heigh: 23, color: '#F2F2F2' }} />
          </IconButton>
        )}
      </ChatInputPaper>
    </ChatInputBox>
  );
}