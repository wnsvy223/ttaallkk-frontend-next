import { Moment } from 'moment';

// RTCMultiConnection의 모듈 타입 정의 : ES5 모듈이기 때문에, ES6 import 구문을 사용하기 위해 타입을 정의한 뒤 default로 접근해서 사용
declare module '@/lib/RTCMultiConnection/RTCMultiConnection.js' {
  const RTCMultiConnection: RTCMultiConnection;
  export default RTCMultiConnection;
}

declare global {

  // RTCContext Provider context 타입
  type RTCContextType = {
      connection: RTCMultiConnection | null,
      useRTC: () => void,
  };

  // Speaking / Silence 이벤트
  interface SpeakData {
    type?: 'speaking' | 'silence';
    userid?: string;
    [key: string]: unknown;
  }

  // 대화방 참가자 데이터
  export interface ParticipantEventData {
    style: unknown;
    extra: ExtraData;
    isAudioMuted: boolean;
    mediaElement: HTMLMediaElement;
    session: {
      audio: boolean;
      video: boolean;
    };
    stream: MediaStream;
    streamid: string;
    type: 'local' | 'remote';
    unmuteType: 'audio' | 'video' | string;
    userid: string;
  }

  interface MuteEvent {
      extra: {
        displayName: string,
        profileUrl: string,
        uid: string
      };
      isAudioMuted: boolean;
      mediaElement: {
        id: string
      };
      muteType: string;
      session: {
        audio?: boolean;
        video?: boolean;
      };
      stream: MediaStream;
      streamid: string;
      type: string;
      userid: string
  }

  // 메시지 데이터
  interface MessageData {
    type: 'textMessage' | 'systemMessage' | string;
    text?: string;
    userid?: string;
    displayName?: string;
    profileUrl?: string;
    timeStamp?: Moment;
    isDividerMessage?: boolean;
    [key: string]: unknown;
    file?: any;
    fileUuids?: []
  }

  // onmessage 이벤트
  interface ConnectionEventData {
    data: {
      type: 'speaking' | 'silence' | 'textMessage' | string;
      [key: string]: unknown;
    };
    userid?: string;
    extra?: unknown;
  }

  // onleave 이벤트
  interface ConnectionLeaveEvent {
    userid?: string;
    extra?: {
      displayName?: string;
      profileUrl?: string;
      [key: string]: unknown;
    };
  }

  // RTCMultiConnection 전체 타입
  interface RTCMultiConnection {
    // --- 기본 속성 ---
    socketURL: string;
    socketMessageEvent: string;
    autoCloseEntireSession: boolean;
    dontAttachStream: boolean;
    autoCreateMediaElement: boolean;
    dontCaptureUserMedia: boolean;
    dontRecord: boolean;
    attachStreams: MediaStream[];
    streams: { [streamid: string]: MediaStream };
    filesContainer: HTMLElement | null;
    isInitiator: boolean
    publicRoomIdentifier: string

    // --- 파일 전송 ---
    enableFileSharing: boolean;
    chunkSize: number;
    autoSaveToDisk: boolean;

    // --- 참가자 제한 ---
    maxParticipantsAllowed: number;

    // --- 보안 ---
    password?: string; // 방 비밀번호 설정

    // --- 세션 정보 ---
    session: {
      audio?: boolean;
      video?: boolean;
      data?: boolean;
      screen?: boolean;
      oneway?: boolean;
      broadcast?: boolean;
    };

    // --- 미디어 제약 조건 ---
    mediaConstraints: {
      audio?: boolean | MediaTrackConstraints;
      video?: boolean | MediaTrackConstraints;
    };

    // --- 대역폭 제한 ---
    bandwidth: {
      audio?: number;
      video?: number;
      screen?: number;
    };

    // --- SDP ---
    processSdp: (sdp: unknown) => unknown;
    sdpConstraints: {
      mandatory: {
        OfferToReceiveAudio: boolean;
        OfferToReceiveVideo: boolean;
        VoiceActivityDetection?: boolean;
        IceRestart?: boolean;
      };
      optional: unknown[];
    };

    // --- ICE ---
    iceServers: RTCIceServer[];

    // --- 사용자 추가 데이터 ---
    extra: {
      displayName?: string;
      profileUrl?: string;
      [key: string]: unknown;
    };

    // --- 참가자 목록 ---
    peers: {
      [userid: string]: {
        peer: RTCPeerConnection;
        streams: MediaStream[];
        userid: string;
        addStream: (stream: MediaStream) => void;
        removeStream: (streamid: string) => void;
        addTrack: (track: MediaStreamTrack, stream: MediaStream) => void;
        replaceTrack: (
          track: MediaStreamTrack,
          stream: MediaStream,
          trackToReplace?: MediaStreamTrack
        ) => void;
        createDataChannel: (label: string, opts?: RTCDataChannelInit) => RTCDataChannel;
      };
    };

    // --- 주요 메서드 ---
    open(
      roomid?: string,
      callback?: (isRoomOpened: boolean, roomid: string, error?: string) => void
    ): void;
    open(
      roomid: string,
      password: string,
      callback?: (isRoomOpened: boolean, roomid: string, error?: string) => void
    ): void;

    join(
      roomid: string,
      callback?: (isJoined: boolean, roomid: string, error?: string) => void
    ): void;
    join(
      roomid: string,
      password: string,
      callback?: (isJoined: boolean, roomid: string, error?: string) => void
    ): void;

    getAllParticipants(): string[];
    disconnectWith(participantId: string): void;
    getSocket(callback: (socket: Socket) => void): void; 
    closeSocket(force?: boolean): void;
    checkPresence(roomid: string, callback: (isRoomExist: boolean, roomid: string, extra: unknown) => void): void;
    send(data: unknown, remoteUserId?: string): void;
    close(): void;
    leave(): void;
    renegotiate(remoteUserId: string): void;
    updateExtraData(): void;

    // --- 이벤트 핸들러 ---
    onmessage: (event: ConnectionEventData) => void;
    onopen: (event: { userid: string; extra: unknown }) => void;
    onclose: (event: { userid: string; extra: unknown }) => void;
    onleave: (event: ConnectionLeaveEvent) => void;
    onstream: (event: ParticipantEventData) => void;
    onstreamended: (event:ParticipantEventData) => void;
    onmute: (event: MuteEvent) => void;
    onunmute: (event: MuteEvent) => void;
    onCustomMessage: (message: unknown, userid: string) => void;
    onerror: () => void;

    // --- 내부 상태 ---
    userid: string;
    sessionid: string;
    isInitiator: boolean;
  }
}