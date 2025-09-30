"use client";
import React from 'react';
import { styled } from '@mui/material/styles';
import { Drawer, Stack, Box, Grow, Typography } from '@mui/material';
import ConferenceControlMenu from '@/components/conference/ConferenceControlMenu';
import SimpleBarReact from 'simplebar-react'; // simplebar-react
import ConferenceParticipantsItem from '@/components/conference/ConferenceParticipantsItem';
import ConferenceChatBox from '@/components/conference/ConferenceChatBox';
import { useChatStore } from "@/store/ChatStore";
import ConferenceChatInput from '@/components/conference/ConferenceChatInput';
import { useStream } from '@/context/StreamProvidor';


const SimplebarStyle = styled(SimpleBarReact)(() => ({
  height: 500,
  padding: 10,
  marginTop: 5,
  borderRadius: 10,
  backgroundColor: '#dedee4'
}));

interface SidebarProps {
  isOpen: boolean,
  onCloseRightSideBar: () => void
}

const AppSidebarRight: React.FC<SidebarProps> = (props) => {
    const { muteStates, participants } = useStream();
    const { isChatActive } = useChatStore();

    return (
       <Drawer
        anchor="right"
        open={props.isOpen}
        onClose={props.onCloseRightSideBar}
        sx={{
        '& .MuiDrawer-paper': {
            zIndex: 9999
          }
        }}
      >
        <Stack sx={{ p: 2, width: 350, height: '90%', mt: 10 }} justifyContent="space-around" spacing={3}>
          <ConferenceControlMenu/>
          <Box>
            <Grow in={isChatActive}>
              <Box sx={{ display: isChatActive ? 'block' : 'none', pb: 2 }}>
                <Box sx={{ pb: 1, pl: 1 }}>
                  <Typography variant="h6">채팅</Typography>
                </Box>
                <ConferenceChatBox/>
                <ConferenceChatInput/>
              </Box>
            </Grow>
            <Grow in={!isChatActive}>
              <Box sx={{ display: isChatActive ? 'none' : 'block', pb: 2 }}>
                <Box sx={{ pb: 1, pl: 1 }}>
                  <Typography variant="h6">대화방 참가자 ({participants?.length})</Typography>
                </Box>
                <SimplebarStyle>
                {participants.map((event) => (
                  <Box 
                      key={event.userid} 
                      sx={{
                        filter: muteStates[event.userid] ? 'brightness(0.5)' : 'brightness(1)'
                      }}>
                    <ConferenceParticipantsItem event={event}/>
                  </Box>
                ))}
                </SimplebarStyle>
              </Box>
            </Grow>
          </Box>
        </Stack>
      </Drawer>
  );
};

export default AppSidebarRight;