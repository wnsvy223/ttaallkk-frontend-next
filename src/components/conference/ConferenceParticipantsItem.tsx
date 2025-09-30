"use client";

import { useState, useRef, useEffect } from 'react';

// material ui
import { styled } from '@mui/material/styles';
import { Grid, Stack, Typography, Slider, Box } from '@mui/material';
import { Icon } from '@iconify/react';
import volumUpOutline from '@iconify/icons-eva/volume-up-outline';

// api
import hark from 'hark';

// component
import LetterAvatar from '../common/LetterAvatar';


interface ConferenceEvent {
  stream?: MediaStream;
  type: 'local' | 'remote';
  extra?: {
      profileUrl?: string;
      displayName: string;
    };
  userid: string;
  isAudioMuted: boolean
}

interface ConferenceParticipantsItemProps {
  event: ConferenceEvent;
}

const VolumeSlider = styled(Slider)({
  color: 'rgb(5, 60, 92)',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none'
  },
  '& .MuiSlider-thumb': {
    height: 18,
    width: 18,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit'
    },
    '&:before': {
      display: 'none'
    }
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: 'rgb(5, 60, 92)',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)'
    },
    '& > *': {
      transform: 'rotate(45deg)'
    }
  }
});

export default function ConferenceParticipantsItem({ event }: ConferenceParticipantsItemProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null); // 비디오 엘리먼트 참조
  const speechRef = useRef<any>(null); // 스피치 이벤트 참조 값
  const [isMount, setIsMount] = useState<boolean>(false); // 컴포넌트 언마운트시 상태 변경 방지를 위한 상태값 : 스피치 이벤트를 통한 상태변경은 컴포넌트 마운트된 경우에만 수행
  const [localSpeak, setLocalSpeak] = useState<boolean>(false); // 로컬 유저의 대화 상태값
  const [remoteSpeak, setRemoteSpeak] = useState<boolean>(false); // 리모트 유저의 대화 상태값

  const handleVolumeChange = (e: Event, value: number | number[]) => {
    if (videoRef.current && typeof value === 'number') {
      videoRef.current.volume = value / 10;
    }
  };

  // hark 스피치 이벤트 참조값 초기화
  useEffect(() => {
    if (event?.stream) {
        setIsMount(true);
        const options: hark.Option = {
                  smoothing: 0.1,
                  interval: 50,
                  history: 10,
                  threshold: -50,
                  audioContext: new AudioContext(),
              };
        speechRef.current = hark(event?.stream, options); // hark.js 초기화
    }
  }, [event?.stream]);

  // 각 비디오 엘리먼트에 stream 리소스 설정
  useEffect(() => {
    if (videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = event?.stream || null;
    }
  }, [event?.stream]);

  // 로컬유저와 리모트유저의 볼륨 초기값 설정
  useEffect(() => {
    if (videoRef.current) {
      if (event?.type === 'local') {
        videoRef.current.volume = 0;
        videoRef.current.muted = true;
        videoRef.current.defaultMuted = true;
      } else {
        videoRef.current.volume = 0.5;
        videoRef.current.muted = false;
        videoRef.current.defaultMuted = false;
      }
    }
  }, [event?.type]);

  // 로컬 유저의 대화상태 감지
  useEffect(() => {
    if (event?.stream && event?.type === 'local' && speechRef.current) {
      speechRef.current.on('speaking', () => {
        if (!event.isAudioMuted && isMount) setLocalSpeak(true);
      });

      speechRef.current.on('stopped_speaking', () => {
        if (!event.isAudioMuted && isMount) setLocalSpeak(false);
      });
    }
    return () => {
      if (isMount) setIsMount(false);
    };
  }, [event.isAudioMuted, event?.stream, event?.type, isMount]);

  // 리모트 유저의 대화상태 감지
  useEffect(() => {
    if (event?.stream && event?.type === 'remote' && speechRef.current) {
      speechRef.current.on('speaking', () => {
        if (!event.isAudioMuted && isMount) setRemoteSpeak(true);
      });

      speechRef.current.on('stopped_speaking', () => {
        if (!event.isAudioMuted && isMount) setRemoteSpeak(false);
      });
    }
    return () => {
      if (isMount) setIsMount(false);
    };
  }, [event.isAudioMuted, event?.stream, event?.type, isMount]);


  return event?.type === 'local' ? (
    <Box sx={{ p: 0.5}} >
      <Grid container direction="row" alignItems="center" justifyContent="center">
        <Grid size={2}>
          <LetterAvatar
            src={event?.extra?.profileUrl}
            sx={{
              width: 32,
              height: 32,
              name: event?.extra?.displayName || '',
              fontSize: 12,
              border: localSpeak ? '3px solid #fb0102' : 0
            }}
          />
        </Grid>
        <Grid size={10}>
          <Typography sx={{ fontSize: 12, minWidth: 30 }} noWrap>
            {event?.extra?.displayName}
          </Typography>
        </Grid>
      </Grid>
      <video ref={videoRef} autoPlay playsInline style={{ display: 'none' }} />
    </Box>
  ) : (
    <Box sx={{ p: 0.5}}>
      <Grid container direction="row" alignItems="center" justifyContent="center">
        <Grid size={2}>
          <LetterAvatar
            src={event?.extra?.profileUrl}
            sx={{
              width: 32,
              height: 32,
              name: event?.extra?.displayName || '',
              fontSize: 12,
              border: remoteSpeak === true ? '3px solid #fb0102' : 0
            }}
          />
        </Grid>
        <Grid size={4}>
          <Typography sx={{ fontSize: 12, minWidth: 30 }} noWrap>
            {event?.extra?.displayName}
          </Typography>
        </Grid>
        <Grid size={2} sx={{ pr: 0.5 }}>
          <Stack alignItems="center">
            <Box component={Icon} icon={volumUpOutline} sx={{ width: 22, height: 22 }} />
          </Stack>
        </Grid>
        <Grid size={4}>
          <Stack alignItems="center">
            <VolumeSlider
              valueLabelDisplay="auto"
              aria-label="volume"
              defaultValue={5}
              max={10}
              onChange={handleVolumeChange}
            />
          </Stack>
        </Grid>
      </Grid>
      <video ref={videoRef} autoPlay playsInline style={{ display: 'none' }} />
    </Box>
  );
}