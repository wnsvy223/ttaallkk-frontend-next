"use client";
import React, { useContext, useState } from "react";
import Label from '../form/Label';
import Input from '../form/input/InputField';
import ComponentCard from '../common/ComponentCard';

import Slider from "../common/Slider";
import Button from "../ui/button/Button";

import { RTCMultiConnectionContext } from "@/context/RTCMultiConnectionContext";

export const PublicConferenceForm = () => {
  const { connection } = useContext(RTCMultiConnectionContext);
  const [roomName, setRoomName] = useState('');
  const [displayName, setDisplayName] = useState(''); 

  const handleCreateRoom = () => {
    if(connection){
      connection.extra = {
        displayName: displayName, // 대화방 닉네임
        profileUrl: '', // 프로필 이미지
        uid: connection.userid
      };
      connection.open(roomName, (isRoomOpened, roomName, error) => {
        if (isRoomOpened && !error) {
          console.log(`방 생성 완료(비공개방) : ${roomName}`);
        } else {
          console.log(`방 생성 오류(비공개방) : ${error}`);
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
      connection.join(roomName, (isJoinedRoom, roomName, error) => {
        if (error) {
            switch (error) {
              case 'Invalid password':
                
                break;
              case 'Room not available':
                
                break;
              case 'Room full':
                
                break;
              default:
            }
          } else {
            console.log('참가성공(비공개방)');
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

  return (
    <div className="space-y-6">
     <ComponentCard title="대화방 정보 입력">
      <form>
        <div className="space-y-6 mx-auto max-w-sm">
          <div>
            <Label className="text-md">닉네임</Label>
            <Input type="text" placeholder="방 이름을 입력하세요." onChange={handleChangeDisplayName}/>
          </div>
          <div>
            <Label className="text-md">방 이름</Label>
            <Input type="text" placeholder="방 이름을 입력하세요." onChange={handleChangeRoomName}/>
          </div>
          <div>
            <Label className="text-md">방 최대 인원 수</Label>
            <Slider maxValue={connection?.maxParticipantsAllowed}/>
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
    <ComponentCard title="공개방 목록">
      <Label>방 목록</Label>
    </ComponentCard>
    </div>
  );
};
