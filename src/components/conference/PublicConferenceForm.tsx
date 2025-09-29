"use client";
import React, { useState } from "react";
import Label from '../form/Label';
import ComponentCard from '../common/ComponentCard';
import Button from "../ui/button/Button";
import { styled } from '@mui/material/styles';
import MuiInput from '@mui/material/Input';
import { Grid, Box, TextField, Slider } from '@mui/material';
import { useRTC } from "@/context/RTCMultiConnectionContext";
import { publicRoomIdentifier } from "@/utils/const";


const PrettoSlider = styled(Slider)({
  color: '#52af77',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&::before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#52af77',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&::before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
});

export const PublicConferenceForm = () => {
  const { connection } = useRTC();
  const [roomName, setRoomName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [sliderValue, setSliderValue] = useState(0);
  const { handleDisconnectRTC } = useRTC();

  const handleCreateRoom = () => {
    if(connection){
      connection.extra = {
        displayName: displayName, // 대화방 닉네임
        profileUrl: '', // 프로필 이미지
        uid: connection.userid
      };
      connection.checkPresence(roomName, (isRoomExist, roomid) => {
        roomid = roomName;
        if (isRoomExist === true) {
          handleDisconnectRTC();
        } else {
          connection.publicRoomIdentifier = publicRoomIdentifier;
          connection.open(roomName, (isRoomOpened, roomName, error) => {
            if (isRoomOpened && !error) {
              console.log(`방 생성 완료(비공개방) : ${roomName}`);
            } else {
              console.log(`방 생성 오류(비공개방) : ${error}`);
              handleDisconnectRTC();
            }
          });
        }
      });
    }
  };

  const handleJoinRoom = () => {
    if(connection){
      connection.extra = {
        displayName: displayName, // 대화방 닉네임
        profileUrl: '', // 프로필 이미지
        uid: connection.userid
      };
      connection.checkPresence(roomName, (isRoomExist, roomid) => {
        roomid = roomName;
        if (isRoomExist === true) {
          connection.join(roomName, (isJoinedRoom, roomName, error) => {
            if (error) {
              handleDisconnectRTC();
              switch (error) {
                case 'Invalid password':
                  console.error('비밀번호가 틀렸습니다.');
                  break;
                case 'Room not available':
                  console.error('사용할 수 없는 방입니다,.');
                  break;
                case 'Room full':
                  console.error('방 인원이 꽉 찼습니다.');
                  break;
                default:
              }
            } else {
              console.log('참가성공(비공개방)');
            }
          });
        } else {
          handleDisconnectRTC();
          console.error('생성된 방이 없습니다.');
        }
      });
      }
  };

  const handleChangeRoomName = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setRoomName(event.target.value);
  };

  const handleChangeDisplayName = (event: { target: { value: React.SetStateAction<string>; }; }) => {
      setDisplayName(event.target.value);
  };

  const handleSliderChange = (event: Event, newValue: any ) => {
    setSliderValue(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(event.target.value === '' ? 0 : Number(event.target.value));
  };

  const handleBlur = () => {
    if (sliderValue < 0) {
      setSliderValue(0);
    } else if (sliderValue > 100) {
      setSliderValue(100);
    }
  };

  return (
    <div className="space-y-6">
     <ComponentCard title="대화방 정보 입력">
      <form>
        <div className="space-y-6 mx-auto max-w-sm">
          <div>
            <Label className="text-md">닉네임</Label>
            <TextField
              label="닉네임"
              type="text"
              variant="outlined"
              fullWidth
              size="small"
              onChange={handleChangeDisplayName}
              color="primary"
            />
          </div>
          <div>
            <Label className="text-md">방 이름</Label>
            <TextField
              label="방 제목"
              type="text"
              variant="outlined"
              fullWidth
              size="small"
              onChange={handleChangeRoomName}
              color="primary"
            />
          </div>
          <Box>
            <Label className="text-md">방 최대 인원 수</Label>
            <Grid container spacing={2} sx={{ pl: 1, pr: 1 }}>
              <Grid size="grow">
                <PrettoSlider 
                  value={typeof sliderValue === 'number' ? sliderValue : 0}
                  max={connection?.maxParticipantsAllowed} 
                  valueLabelDisplay="auto" 
                  onChange={handleSliderChange}/>
              </Grid>
              <Grid>
                <MuiInput
                  value={sliderValue}
                  size="small"
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  inputProps={{
                    step: 1,
                    min: 0,
                    max: connection?.maxParticipantsAllowed,
                    type: 'number',
                    'aria-labelledby': 'input-slider',
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </div>
      </form>
      <div className="flex gap-5 justify-center">
        <Button size="md" variant="primary" onClick={handleCreateRoom}>
          방 생성
        </Button>
        <Button size="md" variant="primary" onClick={handleJoinRoom}>
          방 참가
        </Button>
      </div>
    </ComponentCard>
    <ComponentCard title="공개방 목록">
      <Label>방 목록</Label>
    </ComponentCard>
    </div>
  );
};
