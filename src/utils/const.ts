export const socketUrl = 'http://localhost:3001/';

export const anonymousUserIdentifier = 'anonymous'; // 비 로그인 유저 식별자

export const publicRoomIdentifier = 'publicRoomIdentifier'; // 공개방 구분 키값

export const defaultMaxParticipantsAllowed = 15; // 대화방 참가 제한 인원 수

/* 
데이터 채널로 데이터 송수신할 때, 한번에 보낼 데이터의 단위값.
RTCMultiConnection의 경우 60KB까지 제공 - 내부적으로는 16KB로 다시 나누어 보내는 방식.
병렬 데이터 채널 전송을 위해 16KB로만 사용하도록 설정
*/
export const chunkSize = 16384; // 16kb
