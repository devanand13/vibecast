'use client';

import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import mediasoupClient, { Device } from 'mediasoup-client';
import {
  AppData,
  Consumer,
  Producer,
  RtpCapabilities,
  Transport,
} from 'mediasoup-client/types';

interface ServerToClientEvents {
  'connection:success': (data: { socketId: string; existsProducer: boolean }) => void;
  'new:producer': (data: { producerId: string }) => void;
}

interface ClientToServerEvents {
  'joinRoom': (
    data: { roomName: string },
    callback: (data: { rtpCapabilities: RtpCapabilities }) => void
  ) => void;

  'createWebRtcTransport': (
    data: { consumer: boolean },
    callback: (response: { params: {
      id: string;
      iceParameters: any;
      iceCandidates: any;
      dtlsParameters: any;
    } }) => void
  ) => void;

  'transport-connect': (data: { dtlsParameters: any }) => void;

  'transport-produce': (
    data: {
      kind: string;
      rtpParameters: any;
      appData: any;
    },
    callback: (response: { id: string; producersExists: boolean }) => void
  ) => void;

  'transport-recv-connect': (
    data: { dtlsParameters: any; serverConsumerTransportId: string }
  ) => void;

  'consume': (
    data: {
      rtpCapabilities: RtpCapabilities;
      remoteProducerId: string;
      serverConsumerTransportId: string;
    },
    callback: (response: { params: {
      id: string;
      producerId: string;
      kind: string;
      rtpParameters: any;
      serverConsumerId: string;
    } | { error: string } }) => void
  ) => void;

  'consumer-resume': (data: { serverConsumerId: string }) => void;

  'getProducers': (callback: (producerIds: string[]) => void) => void;
}

export default function RoomPage() {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteContainerRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

  const deviceRef = useRef<Device | null>(null);
  const videoTrackRef = useRef<MediaStreamTrack | null>(null);
  const producerTransportRef = useRef<Transport<AppData> | null>(null);
  const producerRef = useRef<Producer | null>(null);

  const consumerTransportsRef = useRef<{
    transport: Transport<AppData>;
    consumer: Consumer<AppData>;
    producerId: string;
  }[]>([]);

  const room = typeof window !== 'undefined' ? window.location.pathname.split('/')[3] : '';

  const encodingParams = {
    encodings: [
      { rid: 'r0', maxBitrate: 100000, scalabilityMode: 'S1T3' },
      { rid: 'r1', maxBitrate: 300000, scalabilityMode: 'S1T3' },
      { rid: 'r2', maxBitrate: 900000, scalabilityMode: 'S1T3' },
    ],
    codecOptions: { videoGoogleStartBitrate: 1000 },
  };

  const getLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          width: { min: 640, max: 1920 },
          height: { min: 400, max: 1080 },
        },
      });

      videoTrackRef.current = stream.getVideoTracks()[0];

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      createSendTransport();
    } catch (err) {
      console.error('Error getting local stream:', err);
    }
  };

  const joinRoom = () => {
    socketRef.current?.emit(
      'joinRoom',
      { roomName: room },
      async ({ rtpCapabilities }) => {
        const device = new mediasoupClient.Device();
        await device.load({ routerRtpCapabilities: rtpCapabilities });
        deviceRef.current = device;

        getProducers();
      }
    );
  };

  const createSendTransport = () => {
    socketRef.current?.emit('createWebRtcTransport', { consumer: false }, ({ params }) => {
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
          ({ id }) => {
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
    socketRef.current?.emit('createWebRtcTransport', { consumer: true }, ({ params }) => {
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
          rtpCapabilities: deviceRef.current!.rtpCapabilities!,
          remoteProducerId,
          serverConsumerTransportId: params.id,
        },
        async ({ params: consumerParams }) => {
          if ('error' in consumerParams) {
            console.error('Consume error:', consumerParams.error);
            return;
          }

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

          remoteContainerRef.current?.appendChild(video);

          socketRef.current?.emit('consumer-resume', {
            serverConsumerId: consumerParams.serverConsumerId,
          });
        }
      );
    });
  };

  const getProducers = () => {
    socketRef.current?.emit('getProducers', (producerIds) => {
      producerIds.forEach(signalNewConsumerTransport);
    });
  };

  useEffect(() => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('https://localhost:3001/mediasoup', {
      path: '/socket.io',
      transports: ['websocket'],
      secure: true,
      rejectUnauthorized: false,
    });

    socketRef.current = socket;

    socket.on('new:producer', ({ producerId }) => {
      signalNewConsumerTransport(producerId);
    });

    socket.on('connection:success', ({ socketId, existsProducer }) => {
      console.log(`✅ Connected with socketId: ${socketId}, producer exists: ${existsProducer}`);
    });

    joinRoom();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-4 bg-neutral-800">
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2">Local Video</th>
              <th className="px-4 py-2">Remote Video</th>
            </tr>
          </thead>
          <tbody className="align-top">
            <tr>
              <td className="px-4 py-2">
                <div className="flex justify-center bg-papayawhip p-2">
                  <video ref={localVideoRef} autoPlay playsInline className="w-[360px] bg-black" />
                </div>
              </td>
              <td className="px-4 py-2">
                <div ref={remoteContainerRef} className="flex flex-wrap justify-center gap-2 bg-papayawhip p-2" />
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <div className="flex justify-center bg-papayawhip p-2">
                  <button onClick={getLocalStream} className="px-4 py-2 bg-blue-500 text-white rounded">
                    1. Get Local Video & Start
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
