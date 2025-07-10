'use client';

import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import mediasoupClient, { Device } from 'mediasoup-client';
import { AppData, Consumer, Producer, RtpCapabilities, Transport } from 'mediasoup-client/types';

export default function RoomPage() {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const socketRef = useRef<any>(null);

  const [device, setDevice] = useState<Device | null>(null);
  const [rtpCapabilities, setRtpCapabilities] = useState<RtpCapabilities | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [producerTransport, setProducerTransport] = useState<Transport<AppData> | null>(null);
  const [producer, setProducer] = useState<Producer | null>(null);
  const [videoTrack, setVideoTrack] = useState<MediaStreamTrack | null>(null);
  const [consumerTransport,setconsumerTransport] = useState<Transport<AppData> | undefined>(undefined);
  const [consumer, setConsumer] = useState<Consumer | undefined>(undefined);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const encodingParams = {
    encodings: [
      { rid: 'r0', maxBitrate: 100000, scalabilityMode: 'S1T3' },
      { rid: 'r1', maxBitrate: 300000, scalabilityMode: 'S1T3' },
      { rid: 'r2', maxBitrate: 900000, scalabilityMode: 'S1T3' }
    ],
    codecOptions: { videoGoogleStartBitrate: 1000 }
  };

  const streamSuccess = (stream: MediaStream) => {
    const track = stream.getVideoTracks()[0];
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    setVideoTrack(track);
  };

  const getLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          width: { min: 640, max: 1920 },
          height: { min: 400, max: 1080 }
        }
      });
      streamSuccess(stream);
    } catch (err) {
      console.error('Error getting local stream:', err);
    }
  };

  const createDevice = async (rtp: RtpCapabilities) => {
    try {
      const device = new mediasoupClient.Device();
      await device.load({ routerRtpCapabilities: rtp });
      setDevice(device);
      console.log('✅ Device loaded with RTP Capabilities:', device.rtpCapabilities);
    } catch (e: any) {
      console.error(e);
      if (e.name === 'UnsupportedError') {
        console.warn('Browser not supported!');
      }
    }
  };

  // Connect socket on mount
  useEffect(() => {
    const socket = io('https://localhost:3001/mediasoup', {
      path: '/socket.io',
      transports: ['websocket'],
      secure: true,
      rejectUnauthorized: false // only for self-signed certs
    });

    socketRef.current = socket;

    socket.on('connection:success', (data) => {
      console.log('✅ Connected to server:', data);
      setIsConnected(true);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Get RTP Capabilities after connection
  useEffect(() => {
    if (!isConnected || !socketRef.current) return;

    socketRef.current.emit('getRtpCapabilities', (rtp: RtpCapabilities) => {
      console.log('🟡 Received RTP Capabilities:', rtp);
      setRtpCapabilities(rtp);
    });
  }, [isConnected]);

  // Create mediasoup Device
  useEffect(() => {
    if (rtpCapabilities) {
      createDevice(rtpCapabilities);
    }
  }, [rtpCapabilities]);

  // Create Send Transport
  useEffect(() => {
    if (!device || !socketRef.current) return;

    socketRef.current.emit('createWebRtcTransport', { sender: true }, ({ params }: any) => {
      if (params?.error) {
        console.log('❌ Transport creation error:', params.error);
        return;
      }

      console.log('🟢 Send transport params:', params);
      const transport = device.createSendTransport(params);

      transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          await socketRef.current.emit('transport-connect', { dtlsParameters });
          callback();
        } catch (e) {
          errback(new Error("Error"));
          console.log(e)
        }
      });

      transport.on('produce', async (parameters, callback, errback) => {
        try {
          await socketRef.current.emit(
            'transport-produce',
            {
              kind: parameters.kind,
              rtpParameters: parameters.rtpParameters,
              appData: parameters.appData
            },
            ({ id }: any) => {
              callback({ id });
            }
          );
        } catch (e) {
          errback(new Error("Error"));
          console.log(e)
        }
      });

      setProducerTransport(transport);
    });
  }, [device]);

  // Produce when transport and videoTrack are ready
  useEffect(() => {
    if (!producerTransport || !videoTrack) return;

    producerTransport
      .produce({
        track: videoTrack,
        ...encodingParams
      })
      .then((prod) => {
        console.log('📤 Producer created');
        prod.on('trackended', () => {
          console.log('Track ended');
        });
        prod.on('transportclose', () => {
          console.log('Transport closed');
        });
        setProducer(prod);
      });
  }, [producerTransport, videoTrack]);

  useEffect(() => {
    if (!device || !producer || !socketRef.current) return;
  
    // socketRef.current.emit('createWebRtcTransport', { sender: false }, ({ params }: any) => {
    //   if (params?.error) {
    //     console.log('❌ Recv Transport creation error:', params.error);
    //     return;
    //   }
  
    //   console.log('🟢 Recv transport params:', params);
    //   const transport = device.createRecvTransport(params);
  
    //   transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
    //     try {
    //       await socketRef.current.emit('transport-recv-connect', {
    //         dtlsParameters,
    //       });
    //       callback();
    //     } catch (err) {
    //       errback(err);
    //     }
    //   });
  
    //   setconsumerTransport(transport);
    // });
  }, [device, producer]);

  useEffect(() => {
    if (!consumerTransport || !device || !producer || !socketRef.current) return;
  
    // const connect = async () => {
    //   socketRef.current.emit(
    //     'consume',
    //     { rtpCapabilities: device.rtpCapabilities },
    //     async ({ params }: any) => {
    //       if (params.error) {
    //         console.log('❌ Cannot consume:', params.error);
    //         return;
    //       }
  
    //       console.log('📥 Consumer Params:', params);
  
    //       const consumer = await consumerTransport.consume({
    //         id: params.id,
    //         producerId: params.producerId,
    //         kind: params.kind,
    //         rtpParameters: params.rtpParameters,
    //       });
  
    //       const { track } = consumer;
  
    //       const remoteStream = new MediaStream([track]);
    //       if (remoteVideoRef.current) {
    //         remoteVideoRef.current.srcObject = remoteStream;
    //       }
  
    //       socketRef.current.emit('consumer-resume');
    //       setConsumer(consumer);
    //     }
    //   );
    // };
  
    // connect();
  }, [consumerTransport, device, producer]);

  const createRecvTransport = async ()=>{
    await socketRef.current.emit('createWebRtcTransport', { sender: false }, ({ params }: any) => {
      if (params?.error) {
        console.log('❌ Recv Transport creation error:', params.error);
        return;
      }
  
      console.log('🟢 Recv transport params:', params);
      const transport = device?.createRecvTransport(params);
  
      transport?.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
          await socketRef.current.emit('transport-recv-connect', {
            dtlsParameters,
          });
          callback();
        } catch (err) {
          errback(new Error("Error"));
          console.log(err)
        }
      });
  
      setconsumerTransport(transport);

      const connect = async () => {
        socketRef.current.emit(
          'consume',
          { rtpCapabilities: device?.rtpCapabilities },
          async ({ params }: any) => {
            if (params.error) {
              console.log('❌ Cannot consume:', params.error);
              return;
            }
    
            console.log('📥 Consumer Params:', params);
    
            const consumer = await transport?.consume({
              id: params.id,
              producerId: params.producerId,
              kind: params.kind,
              rtpParameters: params.rtpParameters,
            });
    
            const { track }= consumer;
    
            const remoteStream = new MediaStream([track]);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
    
            socketRef.current.emit('consumer-resume');
            setConsumer(consumer);
          }
        );
      };
    
      connect();
    });
  }
  
  

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
                <div className="flex justify-center bg-papayawhip p-2">
                  <video ref={remoteVideoRef} autoPlay playsInline className="w-[360px] bg-black" />

                </div>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2" colSpan={2}>
                <div className="flex justify-center bg-papayawhip p-2">
                  <button
                    onClick={getLocalStream}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    1. Get Local Video
                  </button>
                </div>
                <div className="flex justify-center bg-papayawhip p-2">
                  <button
                    onClick={createRecvTransport}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >Consume 
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
