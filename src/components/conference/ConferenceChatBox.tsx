"use client";

import { useState, useEffect, useRef, memo } from "react";
import {
  Stack,
  Box,
  Typography,
  Divider,
  LinearProgress,
  linearProgressClasses,
  Link,
  IconButton,
  CardMedia,
  Grow
} from "@mui/material";
import { styled } from "@mui/material/styles";

// iconify
import { Icon } from "@iconify/react";
import DownLoad from "@iconify/icons-mdi/download";

// simplebar-react
import SimpleBarReact from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import moment from "moment";
import "moment/locale/ko";
moment.locale("ko");

// react-virtuoso
import { Virtuoso } from "react-virtuoso";

// component
import LetterAvatar from "../common/LetterAvatar";
import { useRTC } from "@/context/RTCMultiConnectionContext";
import { useMessage } from "@/context/MessageProvidor";

interface MessageItemProps {
  data: MessageData;
}

const SimplebarStyle = styled(Stack)(() => ({
  height: 450,
  padding: 10,
  marginTop: 5,
  borderRadius: 10,
  backgroundColor: "#222121ff"
}));

const DisplayNameTextView = styled(Typography)(() => ({
  fontSize: "10px",
  fontWeight: "bold",
  paddingBottom: 5,
  color: "#F2F2F2",
}));

const UnReadMessageDivider = styled(Divider)(() => ({
  color: "#FFF",
  padding: "40px 0px",
  fontSize: 12
}));

const FileMessageWrapper = styled(Box)(() => ({
  width: "100%",
  height: "100%",
  textAlign: "center",
  borderRadius: 10,
  backgroundColor: "#FFF",
  padding: 20,
  margin: 10,
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  margin: 10,
  padding: 3,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

// -------------------------------SystemMessage---------------------------------------
// eslint-disable-next-line react/display-name
const SystemMessageItem = memo(({ data }: MessageItemProps) => (
  <Stack direction="row" alignItems="center" justifyContent="center" sx={{ pt: 5, pb: 5 }}>
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        p: 0.5,
        backgroundColor: "#125e8a",
        color: "#F2F2F2",
        borderRadius: 2,
        width: "80%",
      }}
    >
      <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>{data?.text}</Typography>
      <Typography noWrap sx={{ fontSize: 10, color: "#F2F2F2" }}>
        {moment(data?.timeStamp).format("YYYY년 MMMM Do dddd A h:mm:ss")}
      </Typography>
    </Stack>
  </Stack>
));

// -------------------------------SendMessageItem---------------------------------------
// eslint-disable-next-line react/display-name
const SendMessageItem = memo(({ data }: MessageItemProps) => (
  <Stack direction="row" justifyContent="right" spacing={1} sx={{ pt: 1, pb: 1 }}>
    <Stack direction="row" alignItems="flex-end">
      <Typography noWrap sx={{ fontSize: 10, color: "#a09d9dff" }}>
        {moment(data?.timeStamp).fromNow()}
      </Typography>
    </Stack>
    <Box
      sx={{
        backgroundColor: "#505050",
        color: "#F2F2F2",
        p: 1.5,
        borderRadius: 2,
        minWidth: 150,
        maxWidth: "80%",
        boxShadow: 1,
      }}
    >
      <Typography
        sx={{
          fontSize: "12px",
          wordWrap: "break-word",
          textAlign: data?.file ? "center" : "initial",
        }}
      >
        {data?.text}
      </Typography>

      {/* 다중 파일 프로그래스바 */}
      {data?.fileUuids && data.fileUuids.length > 0 && (
        <Stack>
          {data.fileUuids.map((uuid: string, index: number) => (
            <ProgressBar key={index} variant="determinate" value={0} data-file-uuid={uuid} />
          ))}
        </Stack>
      )}

      {/* 단일 파일 진행 */}
      {data?.file && data?.file?.end !== true && (
        <ProgressBar variant="determinate" value={0} data-file-uuid={data.file.uuid} />
      )}

      {/* 단일 파일 완료 */}
      {data?.file && data?.file?.end === true && (
        <Stack alignItems="center" justifyContent="center">
          <FileMessageWrapper>
            {data?.file?.type.indexOf("image") !== -1 && (
              <CardMedia component="img" image={data?.file?.url} alt="image file" />
            )}
            <Link
              href={data?.file?.url}
              target="_blank"
              rel="noreferrer"
              download={data?.file?.name}
              underline="hover"
              sx={{ fontSize: 12, textAlign: "center" }}
            >
              <IconButton sx={{ fontSize: 20 }}>
                <Box component={Icon} icon={DownLoad} sx={{ width: 23, heigh: 23, color: "gray" }} />
              </IconButton>
            </Link>
          </FileMessageWrapper>
        </Stack>
      )}
    </Box>
  </Stack>
));

// -------------------------------ReceiveMessageItem---------------------------------------
// eslint-disable-next-line react/display-name
const ReceiveMessageItem = memo(({ data }: MessageItemProps) => (
  <Stack direction="row" justifyContent="left" spacing={1} sx={{ pt: 1, pb: 1, maxWidth: "90%" }}>
    <LetterAvatar
      src={data?.profileUrl}
      sx={{
        width: 32,
        height: 32,
        name: data?.displayName || "",
        fontSize: 12,
      }}
    />
    <Stack sx={{ minWidth: 150, maxWidth: "80%" }}>
      <DisplayNameTextView>{data?.displayName}</DisplayNameTextView>
      <Box
        sx={{
          backgroundColor: "#FCEC4F",
          color: "black",
          p: 1.5,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: "12px",
            wordWrap: "break-word",
            textAlign: data?.file ? "center" : "initial",
          }}
        >
          {data?.text}
        </Typography>
        {data?.file && data?.file?.end !== true && (
          <ProgressBar variant="determinate" value={0} data-file-uuid={data?.file?.uuid} />
        )}
        {data?.file && data?.file?.end === true && (
          <Stack alignItems="center" justifyContent="center">
            <FileMessageWrapper>
              {data?.file?.type.indexOf("image") !== -1 && (
                <CardMedia component="img" image={data?.file?.url} alt="image file" />
              )}
              <Link
                href={data?.file?.url}
                target="_blank"
                rel="noreferrer"
                download={data?.file?.name}
                underline="hover"
                sx={{ fontSize: 12, textAlign: "center" }}
              >
                <IconButton sx={{ fontSize: 20 }}>
                  <Box
                    component={Icon}
                    icon={DownLoad}
                    sx={{ width: 23, heigh: 23, color: "gray" }}
                  />
                </IconButton>
              </Link>
            </FileMessageWrapper>
          </Stack>
        )}
      </Box>
    </Stack>
    <Stack direction="row" alignItems="flex-end">
      <Typography noWrap sx={{ fontSize: 10, color: "#a09d9dff" }}>
        {moment(data?.timeStamp).fromNow()}
      </Typography>
    </Stack>
  </Stack>
));

export default function ConferenceChatBox() {
  const { connection } = useRTC();
  const { messageList } = useMessage();
  const virtuosoRef = useRef<any>(null);

  useEffect(() => {
    if (virtuosoRef.current) {
      setTimeout(() => {
        virtuosoRef.current.scrollToIndex({
          index: messageList.length - 1, // 마지막 인덱스는 length - 1
          align: "end",
          behavior: "smooth",
        });
      }, 100);
    }
  }, [messageList]);

  return (
    <SimplebarStyle>
      <Virtuoso
        ref={virtuosoRef}
        style={{ height: '100%' }}
        data={messageList}
        followOutput="smooth" 
        increaseViewportBy={200}
        itemContent={(index, data) => {
          if (data?.type === "systemMessage") {
            return data?.isDividerMessage === true ? (
              <UnReadMessageDivider
                sx={{
                  height: index === 0 || index === messageList.length - 1 ? "5px" : "12px",
                }}
              >
                여기까지 읽었습니다.
              </UnReadMessageDivider>
            ) : (
              <SystemMessageItem data={data} />
            );
          }
          return data?.userid === connection?.userid ? (
            <SendMessageItem data={data} />
          ) : (
            <ReceiveMessageItem data={data} />
          );
        }}
      />
    </SimplebarStyle>
  );
}