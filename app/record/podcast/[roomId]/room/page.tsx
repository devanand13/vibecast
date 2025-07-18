'use client';

import { useEffect, useRef,useState } from 'react';
import io from 'socket.io-client';
import mediasoupClient, { Device } from 'mediasoup-client';
import { TransportOptions,RtpParameters } from 'mediasoup-client/types';
import { IoVideocam,IoVideocamOff } from "react-icons/io5";
import { IoMdMic,IoMdMicOff } from "react-icons/io";
import { ImExit } from "react-icons/im";



import {
  AppData,
  Consumer,
  Producer,
  RtpCapabilities,
  Transport,
} from 'mediasoup-client/types';
import { DefaultEventsMap } from 'socket.io';
import {Socket} from 'socket.io-client'

type ServerConsumerParams = {
  id: string;
  producerId: string;
  kind: 'audio' | 'video';
  rtpParameters: RtpParameters;
  serverConsumerId: string;
  peerName:string;
  peerSocketId: string;
};

type RemoteStream = {
  stream: MediaStream;
  producerId: string;
  isPaused?:boolean;
  name?:string;
};


export default function RoomPage() {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

  const deviceRef = useRef<Device | null>(null);
  const videoTrackRef = useRef<MediaStreamTrack | null>(null);
  const producerTransportRef = useRef<Transport<AppData> | null>(null);
  const producerRef = useRef<Producer | null>(null);
  const isVideoOnRef = useRef(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);

  const consumerTransportsRef = useRef<{
    transport: Transport<AppData>;
    consumer: Consumer<AppData>;
    producerId: string;
  }[]>([]);

  console.log(`Rerender`)

  const room = typeof window !== 'undefined' ? window.location.pathname.split('/')[3] : '';

  const encodingParams = {
    encodings: [
      { rid: 'r0', maxBitrate: 100000, scalabilityMode: 'S1T3' },
      { rid: 'r1', maxBitrate: 300000, scalabilityMode: 'S1T3' },
      { rid: 'r2', maxBitrate: 900000, scalabilityMode: 'S1T3' },
    ],
    codecOptions: { videoGoogleStartBitrate: 1000 },
  };

  const handleLocalStream = async () => {
    if (isVideoOnRef.current) {
      await producerRef.current?.pause();
  
      if (videoTrackRef.current) {
        videoTrackRef.current.stop();
        videoTrackRef.current = null;
      }
  
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
  
      socketRef.current?.emit('producer-pause');
      isVideoOnRef.current = false;
      setIsVideoOn(false)
      return;
    }
  
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          width: { min: 640, max: 1920 },
          height: { min: 400, max: 1080 },
        },
      });
  
      const newTrack = stream.getVideoTracks()[0];
      videoTrackRef.current = newTrack;
  
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
  
      if (!producerRef.current) {
        await createSendTransport();
      } else {
        await producerRef.current.replaceTrack({ track: newTrack });
        await producerRef.current.resume();
      }
  
      socketRef.current?.emit('producer-resume');
      isVideoOnRef.current = true;
      setIsVideoOn(true)
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };
  
  const handleLocalAudioStream = ()=>{
    setIsMicOn(!isMicOn);
  }
  

  const joinRoom = () => {
    socketRef.current?.emit(
      'joinRoom',
      { roomName: room, userName: "Random user" },
      async ({ rtpCapabilities, peers }: { rtpCapabilities: RtpCapabilities; peers: { socketId: string; name: string }[] }) => {
        const device = new mediasoupClient.Device();
        await device.load({ routerRtpCapabilities: rtpCapabilities });
        deviceRef.current = device;
    
        setRemoteStreams(prev => {
          const updated = [...prev];
          peers.forEach(({ socketId, name }) => {
            const alreadyExists = updated.some(s => s.producerId === socketId);
            if (!alreadyExists) {
              updated.push({
                stream: new MediaStream(),
                producerId: socketId,
                isPaused: true,
                name
              });
            }
          });
          return updated;
        });
    
        getProducers();
      }
    );    
  };

  const leaveRoom = () => {
    socketRef.current?.disconnect(); 
  
    videoTrackRef.current?.stop();
    videoTrackRef.current = null;
  
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  
    producerTransportRef.current?.close();
    producerTransportRef.current = null;
  
    producerRef.current?.close();
    producerRef.current = null;
  
    consumerTransportsRef.current.forEach(({ transport, consumer }) => {
      consumer.close();
      transport.close();
    });
    consumerTransportsRef.current = [];
  
    setRemoteStreams([]);
    setIsVideoOn(false);
    setIsMicOn(false);
  
    window.location.href = '/'; 
  };

  
  const createSendTransport = () => {
    if (producerTransportRef.current || producerRef.current) return;

    socketRef.current?.emit('createWebRtcTransport', { consumer: false }, ({ params }: { params: TransportOptions }) => {
      console.log('Params')
      console.log(params)
      const transport = deviceRef.current?.createSendTransport(params);
      if (!transport) return;
      producerTransportRef.current = transport;

      transport.on('connect', async ({ dtlsParameters }, callback) => {
        try {
          await socketRef.current?.emit('transport-connect', { dtlsParameters });
          callback();
        } catch (e) {
          console.error('Transport connect error:', e);
        }
      });

      transport.on('produce', async (parameters, callback) => {
        socketRef.current?.emit(
          'transport-produce',
          {
            kind: parameters.kind,
            rtpParameters: parameters.rtpParameters,
            appData: parameters.appData,
          },
          ({ id }: { id: string }) => {
            callback({ id });
          }
        );
      });

      transport
        .produce({
          track: videoTrackRef.current!,
          ...encodingParams,
        })
        .then((producer) => {
          producerRef.current = producer;
        });
    });
  };

  const signalNewConsumerTransport = (remoteProducerId: string) => {
    socketRef.current?.emit('createWebRtcTransport', { consumer: true }, ({ params }: { params: TransportOptions }) => {
      const transport = deviceRef.current?.createRecvTransport(params);
      if (!transport) return;

      transport.on('connect', async ({ dtlsParameters }, callback) => {
        try {
          await socketRef.current?.emit('transport-recv-connect', {
            dtlsParameters,
            serverConsumerTransportId: params.id,
          });
          callback();
        } catch (e) {
          console.error('Consumer connect error:', e);
        }
      });

      socketRef.current?.emit(
        'consume',
        {
          rtpCapabilities: deviceRef.current?.rtpCapabilities,
          remoteProducerId,
          serverConsumerTransportId: params.id,
        },
        async ({ params: consumerParams }: { params: ServerConsumerParams }) => {
          const consumer = await transport.consume({
            id: consumerParams.id,
            producerId: consumerParams.producerId,
            kind: consumerParams.kind,
            rtpParameters: consumerParams.rtpParameters,
          });

          consumerTransportsRef.current.push({
            transport,
            consumer,
            producerId: remoteProducerId,
          });

          const stream = new MediaStream([consumer.track]);
          const video = document.createElement('video');
          video.autoplay = true;
          video.playsInline = true;
          video.muted = true;
          video.srcObject = stream;
          video.className = 'w-[360px] bg-black';

          video.onloadedmetadata = () => {
            video.play().catch((e) => console.warn('[❌] Auto-play blocked:', e));
          };

          console.log(remoteStreams)

          setRemoteStreams((prev) => {
            const exists = prev.some(s => s.producerId === consumerParams.peerSocketId);
            if (exists) {
              return prev.map(s =>
                s.producerId === consumerParams.peerSocketId
                  ? { ...s, stream, isPaused: false, name: consumerParams.peerName }
                  : s
              );
            } else {
              return [...prev, {
                stream,
                producerId: consumerParams.peerSocketId,
                isPaused: false,
                name: consumerParams.peerName
              }];
            }
          });
                                   

          socketRef.current?.emit('consumer-resume', {
            serverConsumerId: consumerParams.serverConsumerId,
          });
        }
      );
    });
  };

  const getProducers = () => {
    socketRef.current?.emit('getProducers', (producerIds: string[]) => {
      producerIds.forEach(signalNewConsumerTransport);
    });
  };

  useEffect(() => {
    const socket = io('https://localhost:3001/mediasoup', {
      path: '/socket.io',
      transports: ['websocket'],
      secure: true,
      rejectUnauthorized: false,
    });

    socketRef.current = socket;

    socket.on('new:producer', ({ producerId }: { producerId: string }) => signalNewConsumerTransport(producerId));

    socket.on('producer-closed', ({ remoteProducerId }) => {
      consumerTransportsRef.current = consumerTransportsRef.current.filter(c => c.producerId !== remoteProducerId);

      setRemoteStreams(prev => prev.filter(s => s.producerId !== remoteProducerId));
    });

    socket.on('producer-paused', ({ producerId }) => {
      setRemoteStreams(prev =>
        prev.map(streamObj =>
          streamObj.producerId === producerId
            ? { ...streamObj, isPaused: true }
            : streamObj
        )
      );
    });
    
    socket.on('producer-resumed', ({ producerId }) => {
      setRemoteStreams(prev =>
        prev.map(streamObj =>
          streamObj.producerId === producerId
            ? { ...streamObj, isPaused: false }
            : streamObj
        )
      );
    });

    socket.on('peer-joined', ({ socketId, name }) => {
      setRemoteStreams(prev => {
        const alreadyExists = prev.some(s => s.producerId === socketId);
        if (alreadyExists) return prev;
    
        return [
          ...prev,
          {
            stream: new MediaStream(), 
            producerId: socketId,
            isPaused: true,
            name
          }
        ];
      });
    });

    socket.on('peer-left', ({ socketId }) => {
      setRemoteStreams(prev =>
        prev.filter(s => s.producerId !== socketId)
      );
    
      consumerTransportsRef.current = consumerTransportsRef.current.filter(
        (t) => t.producerId !== socketId
      );
    });
    
    joinRoom();

    return () => {
      socket.disconnect();
    };
  },[]);

  return (
    <div className="relative bg-neutral-800 h-screen flex flex-col justify-between p-4">
      <div className="flex-1 flex justify-center items-center overflow-hidden relative">
        {remoteStreams.length > 0 && (
          <div
            className={`grid gap-4 justify-center ${
              remoteStreams.length === 1 ? 'grid-cols-1 w-full' : 'grid-cols-2 w-13/16'
            }`}
          >
            {remoteStreams.map(({ stream, isPaused, name }, index) => (
              <div key={index} className="relative w-full aspect-video">
                <video
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full bg-black rounded object-contain ${
                    isPaused ? 'opacity-30 grayscale' : ''
                  }`}
                  ref={(video) => {
                    if (video) video.srcObject = stream;
                  }}
                />
                {isPaused && (
                  <div className="absolute inset-0 flex items-center justify-center text-white text-xl bg-black bg-opacity-60 rounded">
                    Camera Off
                  </div>
                )}
                <div className="absolute top-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                  {name}
                </div>
              </div>
            ))}

          </div>
        )}
        <div
          className={`${
            remoteStreams.length === 0
              ? 'relative w-full h-full'
              : 'absolute bottom-4 right-4 w-[160px] h-[120px]'
          }`}
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`bg-black rounded shadow-lg w-full h-full object-contain`}
          />
          <div className="absolute top-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
            You
          </div>
        </div>
      </div>

      <div className="flex justify-center p-4">
        <button
          onClick={handleLocalStream}
          className="p-4 bg-blue-500 text-white rounded-3xl w-12 h-12 flex items-center"
        >
          {isVideoOn ? <IoVideocamOff className='w-8 h-8'/>:<IoVideocam className='w-8 h-8'/>}
        </button>
        <button
          onClick={handleLocalAudioStream}
          className="ml-5 p-4 bg-blue-500 text-white rounded-3xl w-12 h-12 flex items-center"
        >
          {isMicOn ? <IoMdMicOff className='w-8 h-8'/>:<IoMdMic className='w-8 h-8'/>}
        </button>
        <button
          onClick={leaveRoom}
          className="ml-5 p-4 bg-blue-500 text-white rounded-3xl w-12 h-12 flex items-center"
        >
          <ImExit className='w-8 h-8'/>
        </button>
      </div>
    </div>
  );
  
}