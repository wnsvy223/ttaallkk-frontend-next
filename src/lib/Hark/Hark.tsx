"use client"

import hark, { Harker } from "hark";

interface RTCConnection {
  send: (message: any) => void;
}

interface RTCOnStreamEvent {
  userid: string;
  stream: MediaStream;
}

interface InitHarkArgs {
  connection: RTCConnection;
  event: RTCOnStreamEvent;
  stream: MediaStream;
}

const initHark = (args: InitHarkArgs): void => {
    if (typeof window === 'undefined' || !(window as any).hark) {
        throw new Error('Please link hark.js');
    }

    const { connection, event, stream } = args;

    const options: hark.Option = {
            smoothing: 0.1,
            interval: 50,
            history: 10,
            threshold: -50,
            audioContext: new AudioContext(),
        };
    const speechEvents: Harker = hark(stream, options); // hark.js 초기화

    speechEvents.on('speaking', () => {
        connection.send({
          userid: event.userid,
          type: 'speaking',
          isSpeak: true,
        });
    });

    speechEvents.on('stopped_speaking', () => {
        connection.send({
          userid: event.userid,
          type: 'silence',
          isSpeak: false,
        });
    });
};

export default initHark;