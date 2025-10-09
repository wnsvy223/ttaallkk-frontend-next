"use client"

import { useState, useRef } from 'react';

import { styled } from '@mui/material/styles';
import {
  Typography,
  Box,
  Stack,
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Divider,
  TextField,
  Button
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';

import { Icon } from '@iconify/react';
import messageCircleFill from '@iconify/icons-eva/message-circle-fill';
import eyeFill from '@iconify/icons-eva/eye-fill';

import LetterAvatarButton from '../common/LetterAvatarButton';

// moment
import moment from 'moment';
import 'moment/locale/ko';

// num-to-korean
import { numToKorean, FormatOptions } from 'num-to-korean';

// toast
import { toast } from 'react-toastify';



// ----------------------------------------------------------------------

const PostContentCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
  borderRadius: 3
}));

const GridItemColumn = styled(Box)(() => ({
  height: '50%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: 5
}));

const CardUserPorifle = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'end',
  padding: 15,
  marginRight: 20
}));


const ControlBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '15px',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

const EditorButtonBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

const ControlButton = styled(Button)(() => ({
  backgroundColor: '#605A89',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#2E2851',
    color: '#fff'
  },
  boxShadow: '0px 2px 2px 0px rgba(152, 150, 181, 1)'
}));

interface BoardContentCardProps {
    postId: number;
    title: string;
    commentCnt: number;
    views: number,
    createdAt: string,
    content: string,
    displayName: string
    profileUrl: string,
    uid: string
}


export default function BoardContentCard({ postId, title,commentCnt, views, createdAt, content, displayName, profileUrl, uid} : BoardContentCardProps) {

  const [isLoading, setIsLoading] = useState(false);

  return (
    <PostContentCard>
      <Box>
          <Grid container sx={{ p: 1 }}>
            <Grid item xs={12} md={10}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  height: '100%',
                  ml: { xs: 0, md: 2 },
                  justifyContent: { xs: 'center', md: 'start' }
                }}
              >
                <Typography sx={{ fontSize: 10, color: 'text.secondary', textAlign: 'center' }}>
                  {`#${postId}`}
                </Typography>
                <Typography
                  noWrap
                  sx={{ fontSize: 15, color: 'text.primary', textAlign: 'center' }}
                >
                  {title}
                </Typography>
              </Stack>
            </Grid>
            <Grid container item xs={12} md={2}>
              <Grid container direction="column">
                <GridItemColumn>
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'grey.600'
                      }}
                    >
                      <Box
                        component={Icon}
                        icon={messageCircleFill}
                        sx={{ width: 15, height: 15, color: 'text.secondary' }}
                      />
                      <Typography
                        variant="subtitle2"
                        sx={{ ml: 0.5, fontSize: '12px', color: 'text.primary' }}
                      >
                        {numToKorean(commentCnt, FormatOptions.MIXED)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'grey.600'
                      }}
                    >
                       <Box
                        component={Icon}
                        icon={eyeFill}
                        sx={{ width: 20, height: 20, color: 'text.secondary' }}
                      />
                      <Typography
                        variant="subtitle2"
                        sx={{ ml: 0.5, fontSize: '12px', color: 'text.primary' }}
                      >
                        {numToKorean(views, FormatOptions.MIXED)}
                      </Typography>
                    </Box>
                  </Stack>
                </GridItemColumn>
                <GridItemColumn>
                  <Typography sx={{ fontSize: 10, color: 'text.secondary', textAlign: 'center' }}>
                    {moment(createdAt).format('YYYY-MM-DD HH:mm:ss')}
                  </Typography>
                </GridItemColumn>
              </Grid>
            </Grid>
          </Grid>
          <Divider />
          <CardUserPorifle>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="start"
              spacing={1}
              sx={{ maxWidth: '50%' }}
            >
              <LetterAvatarButton
                uid={uid}
                displayName={displayName}
                profileUrl={profileUrl}
              />
              <Typography noWrap sx={{ fontSize: 12 }}>
                {displayName}
              </Typography>
            </Stack>
          </CardUserPorifle>
          
          <CardContent sx={{ minHeight: 400, wordBreak: 'break-all' }}>
            {content}
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            
          </CardActions>
          <Divider />
          <ControlBox>
              <ControlButton
                loading={isLoading}
               
                variant="contained"
                sx={{ mr: 1 }}
              >
                수정
              </ControlButton>
              <ControlButton 
                variant="contained"
                sx={{ ml: 1 }}
              >
                삭제
              </ControlButton>
            </ControlBox>
        </Box>
    </PostContentCard>
  );
}
