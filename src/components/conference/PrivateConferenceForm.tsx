"use client";
import React, { useState } from "react"
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Label from '../form/Label';
import ComponentCard from '../common/ComponentCard';
import Button from "../ui/button/Button";
import { toast } from 'react-toastify'; // toast
import { styled } from '@mui/material/styles';
import MuiInput from '@mui/material/Input';
import { Grid, Box, TextField, Slider } from '@mui/material';
import { useRTC } from "@/context/RTCMultiConnectionContext";
import { useStream } from "@/context/StreamProvidor";

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

export const PrivateConferenceForm = () => {
  const { connection } = useRTC();
  const [showPassword, setShowPassword] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState(''); 
  const [sliderValue, setSliderValue] = useState<number>(0);
  const { handleDisconnectRTC } = useStream();

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
          connection.password = password; // 비밀번호
          connection.publicRoomIdentifier = roomName; // 비공개 방은 방 구분자를 방 제목으로 하여 조회 하도록 함.
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

  const openConference = () => {
    if (roomName === '') {
      toast.info('방이름을 입력하세요.', {
        position: 'top-center'
      });
    } else if (password === '') {
      toast.info('비밀번호를 입력하세요.', {
        position: 'top-center'
      });
    } else if (displayName === '') {
      toast.info('닉네임을 입력하세요.', {
        position: 'top-center'
      });
    } else {
      handleCreateRoom();
    }
  }

  const handleJoinRoom = () => {
    if(connection){
      connection.extra = {
        displayName: displayName, // 대화방 닉네임
        profileUrl: '', // 프로필 이미지
        uid: connection.userid
      };
      connection.password = password;
      connection.checkPresence(roomName, (isRoomExist, roomid) => {
        roomid = roomName;
        if (isRoomExist === true) {
          connection.password = password;
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

  const handleChangePassword = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setPassword(event.target.value);
  };

  const handleChangeDisplayName = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setDisplayName(event.target.value);
  };

  const handleSliderChange = (event: Event, newValue: number | number[] ) => {
    if (typeof newValue === "number") {
      setSliderValue(newValue);
    }
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
     <ComponentCard title="대화방 정보 입력">
        <form>
          <div className="space-y-6 space-y-6 mx-auto max-w-sm">
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
              <div>
                <Label className="text-md">비밀번호</Label>
                <div className="relative">
                  <TextField
                    label="비밀번호"
                    type="password"
                    variant="outlined"
                    fullWidth
                    size="small"
                    onChange={handleChangePassword}
                    value={password}
                    color="primary"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            <div>
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
  );
};
