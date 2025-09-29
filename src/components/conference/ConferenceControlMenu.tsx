"use client";

import { useState,useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Stack, Box, Button, IconButton, Badge} from '@mui/material';

import { useRTC  } from "@/context/RTCMultiConnectionContext";

import { Icon } from '@iconify/react';
import micOutline from '@iconify/icons-eva/mic-outline';
import micOffOutline from '@iconify/icons-eva/mic-off-outline';
import personAddOutline from '@iconify/icons-eva/person-add-outline';
import MessageCircleOutline from '@iconify/icons-eva/message-circle-outline';
import MessageCircleFill from '@iconify/icons-eva/message-circle-fill';



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
    const { connection, isMute, setIsMute, handleDisconnectRTC } = useRTC();
    const [isChatActive, setIsChatActive] = useState<boolean>(false);
    const [unReadMessageCount, setUnReadMessageCount] = useState<number>(0);

    const handleQuitConference = () => {
      handleDisconnectRTC();
    };

    const handleLocalMute = () => {
      setIsMute((isMute: boolean) => !isMute);
    };

    const handleChatActive = () => {
      setIsChatActive((isChatActive: boolean) => !isChatActive);
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
              icon={isMute ? micOffOutline : micOutline}
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