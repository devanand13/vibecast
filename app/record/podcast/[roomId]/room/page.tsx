'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

const iceServers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
  ],
};

export default function MeetingRoom() {
  const router = useRouter();
  const pathname = usePathname();
  const roomId = pathname?.split('/')[3];

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  console.log(clientId)
  useEffect(() => {
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const socket = io({ path: '/api/socket' });
      socketRef.current = socket;

      socket.on('connect', () => {
        setClientId(socket.id ?? null);
        socket.emit('join-room', roomId);
      });

      socket.on('user-joined', async (otherUserId: string) => {
        if (!peerConnectionRef.current) {
          createPeerConnection();
        }

        if (peerConnectionRef.current && localStreamRef.current) {
          localStreamRef.current.getTracks().forEach(track => {
            peerConnectionRef.current?.addTrack(track, localStreamRef.current!);
          });
        }

        const offer = await peerConnectionRef.current!.createOffer();
        await peerConnectionRef.current!.setLocalDescription(offer);

        socket.emit('offer', {
          sdp: offer,
          to: otherUserId,
        });
      });

      socket.on('offer', async ({ sdp, from }) => {
        if (!peerConnectionRef.current) {
          createPeerConnection();
        }

        if (peerConnectionRef.current && localStreamRef.current) {
          localStreamRef.current.getTracks().forEach(track => {
            peerConnectionRef.current?.addTrack(track, localStreamRef.current!);
          });
        }

        await peerConnectionRef.current!.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await peerConnectionRef.current!.createAnswer();
        await peerConnectionRef.current!.setLocalDescription(answer);

        socket.emit('answer', {
          sdp: answer,
          to: from,
        });
      });

      socket.on('answer', async ({ sdp }) => {
        await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(sdp));
      });

      socket.on('ice-candidate', async ({ candidate }) => {
        if (candidate) {
          await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      socket.on('user-disconnected', () => {
        peerConnectionRef.current?.close();
        peerConnectionRef.current = null;
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
      });
    };

    const createPeerConnection = () => {
      const pc = new RTCPeerConnection(iceServers);
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current?.emit('ice-candidate', {
            candidate: event.candidate,
          });
        }
      };

      pc.ontrack = (event) => {
        const remoteStream = new MediaStream();
        remoteStream.addTrack(event.track);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      };

      peerConnectionRef.current = pc;
    };

    init();

    return () => {
      socketRef.current?.disconnect();
      peerConnectionRef.current?.close();
    };
  }, [roomId]);

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <div className="p-4 bg-neutral-800 flex justify-between">
        <div>Room ID: {roomId}</div>
        <button
          className="bg-red-600 px-4 py-2 rounded"
          onClick={() => router.push('/')}
        >
          Leave
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 place-items-center">
        <div>
          <h2 className="mb-2">🎥 You</h2>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="rounded-xl w-[480px] h-[360px] bg-neutral-900"
          />
        </div>
        <div>
          <h2 className="mb-2">👤 Other</h2>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="rounded-xl w-[480px] h-[360px] bg-neutral-900"
          />
        </div>
      </div>
    </div>
  );
}
