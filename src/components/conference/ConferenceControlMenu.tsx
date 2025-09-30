"use client";

import { useState,useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Stack, Box, Button, IconButton, Badge} from '@mui/material';

import { useChatStore } from "@/store/ChatStore";
import { useRTC  } from "@/context/RTCMultiConnectionContext";
import { useMessage } from '@/context/MessageProvidor';

import { Icon } from '@iconify/react';
import micOutline from '@iconify/icons-eva/mic-outline';
import micOffFill from '@iconify/icons-eva/mic-off-fill';
import personAddOutline from '@iconify/icons-eva/person-add-outline';
import MessageCircleOutline from '@iconify/icons-eva/message-circle-outline';
import MessageCircleFill from '@iconify/icons-eva/message-circle-fill';
import { useStream } from '@/context/StreamProvidor';



const QuitButton = styled(Button)({
  padding: 10,
  backgroundColor: 'rgb(5, 60, 92)',
  '&:hover': {
    backgroundColor: 'rgb(5, 50, 72)'
  }
});

const MessageBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
    color: '#FFF',
    backgroundColor: '#FD001B'
  }
}));

interface CustomMediaStream extends MediaStream {
  mute?: (type: 'audio' | 'video') => void;
  unmute?: (type: 'audio' | 'video') => void;
}

export default function ConferenceControlMenu() {
    const [ isMute, setIsMute ] = useState(false);
    const { handleDisconnectRTC } = useStream();
    const { connection } = useRTC();
    const { isChatActive, toggleChat} = useChatStore();
    const { unReadMessageCount, setUnReadMessageCount } = useMessage();
    const handleQuitConference = () => {
      handleDisconnectRTC();
    };

    const handleLocalMute = () => {
      setIsMute((isMute: boolean) => !isMute);
    };

    const handleChatActive = () => {
      toggleChat();
      if(!isChatActive && unReadMessageCount > 0){
        setUnReadMessageCount(0);
      }
    };

    const handleInviteUser = () => {

    };

    useEffect(() => {
      if(connection){
        if (isMute) {
          connection.attachStreams.forEach((stream : CustomMediaStream) => {
            stream.mute?.('audio');
            connection.extra.isMute = true;
            connection.updateExtraData();
          });
        } else {
          connection.attachStreams.forEach((stream : CustomMediaStream) => {
            stream.unmute?.('audio');
            connection.extra.isMute = false;
            connection.updateExtraData();
          });
        }
      }
    }, [connection, isMute]);

    return (
    <Box sx={{ backgroundColor: '#dedee4', borderRadius: 2 }}>
      <Stack sx={{ p: 2 }} spacing={2}>
        <Stack direction="row" spacing={3} alignItems="center" justifyContent="center">
          <IconButton
            aria-label="mute"
            color="primary"
            onClick={handleLocalMute}
          >
            <Box
              component={Icon}
              icon={isMute ? micOffFill : micOutline}
              sx={{ width: 23, heigh: 23 }}
            />
          </IconButton>
          <IconButton aria-label="mute" color="primary" onClick={handleInviteUser}>
            <Box component={Icon} icon={personAddOutline} sx={{ width: 23, heigh: 23 }} />
          </IconButton>
          <IconButton
            aria-label="mute"
            color="primary"
            onClick={handleChatActive}
          >
            <MessageBadge badgeContent={unReadMessageCount}>
              <Box
                component={Icon}
                icon={isChatActive ? MessageCircleFill : MessageCircleOutline}
                sx={{ width: 23, heigh: 23 }}
              />
            </MessageBadge>
          </IconButton>
        </Stack>
        <QuitButton variant="contained" onClick={handleQuitConference}>
            음성대화종료
        </QuitButton>
      </Stack>
    </Box>
  );
}