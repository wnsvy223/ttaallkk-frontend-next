"use client";
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Drawer, Stack, Box } from '@mui/material';
import ConferenceControlMenu from '@/components/conference/ConferenceControlMenu';
import SimpleBarReact from 'simplebar-react'; // simplebar-react
import ConferenceParticipantsItem from '@/components/conference/ConferenceParticipantsItem';
import { useRTC } from '@/context/RTCMultiConnectionContext';


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
    const { muteStates ,participants } = useRTC();

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
        <Stack sx={{ p: 2, width: 300, mt: 10 }} justifyContent="space-around" spacing={3}>
          <ConferenceControlMenu/>
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
        </Stack>
      </Drawer>
  );
};

export default AppSidebarRight;