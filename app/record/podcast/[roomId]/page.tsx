'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';


export default function Podcast() {
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [cameraId, setCameraId] = useState('');
  const [micId, setMicId] = useState('');
  const [speakerId, setSpeakerId] = useState('');

  const router = useRouter();

  const getDevices = async () => {
    const all = await navigator.mediaDevices.enumerateDevices();
    setDevices(all);
    const cam = all.find((d) => d.kind === 'videoinput')?.deviceId || '';
    const mic = all.find((d) => d.kind === 'audioinput')?.deviceId || '';
    const speaker = all.find((d) => d.kind === 'audiooutput')?.deviceId || '';
    setCameraId(cam);
    setMicId(mic);
    setSpeakerId(speaker);
  };

  const startVideo = async () => {
    if (!cameraOn) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: cameraId ? { deviceId: { exact: cameraId } } : true,
        audio: false,
      });
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Video error:', err);
    }
  };

  const stopVideo = () => {
    videoStream?.getTracks().forEach((track) => track.stop());
    setVideoStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startAudio = async () => {
    if (!micOn) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: micId ? { deviceId: { exact: micId } } : true,
        video: false,
      });
      setAudioStream(stream);
    } catch (err) {
      console.error('Audio error:', err);
    }
  };
  

  const stopAudio = () => {
    audioStream?.getTracks().forEach((track) => track.stop());
    setAudioStream(null);
  };

  const toggleCamera = () => {
    if (cameraOn) {
      stopVideo();
      setCameraOn(false);
    } else {
      setCameraOn(true);
    }
  };

  const toggleMic = () => {
    if (micOn) {
      stopAudio();
      setMicOn(false);
    } else {
      setMicOn(true);
    }
  };

  useEffect(() => {
    getDevices();
    return () => {
      stopVideo();
      stopAudio();
    };
  }, []);

  useEffect(() => {
    if(cameraOn){
        startVideo()
    }else{
        stopVideo();
    }
  }, [cameraOn, cameraId]);

  useEffect(() => {
    if(micOn){
        startAudio();
    }else{
        stopAudio();
    }
  }, [micOn, micId]);

  return (
    <div className='h-screen flex flex-col'>
        <div className="h-15 bg-neutral-900 flex items-center">
        <div className="w-60 flex items-center">
            <div className='ml-5 p-3 max-h-10 font-extrabold text-white hover:bg-neutral-800 flex justify-center items-center rounded-lg cursor-pointer' onClick={()=>{router.back()}}>{'<'}</div>
            <div className="ml-5 font-extrabold text-white">VIBECAST</div>
        </div>
      </div>
        <div className=" flex-1 bg-neutral-900 text-white px-6 py-10 flex justify-center items-center">
      <div className='py-15 px-20 w-4/5'>
      <h1 className="text-2xl font-semibold mb-8">🎙️ Join the Studio</h1>
        <div className="flex flex-col lg:flex-row gap-8">
        <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full lg:w-[480px] h-[360px] bg-neutral-800 rounded-xl object-cover"
        />

        <div className="flex-1 space-y-6 ">
            <div>
            <label className="block mb-1 font-medium">🎥 Camera</label>
            <select
                value={cameraId}
                onChange={(e) => setCameraId(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600"
            >
                {devices
                .filter((d) => d.kind === 'videoinput')
                .map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>
                    {d.label || 'Camera'}
                    </option>
                ))}
            </select>
            </div>

            <div>
            <label className="block mb-1 font-medium">🎤 Microphone</label>
            <select
                value={micId}
                onChange={(e) => setMicId(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600"
            >
                {devices
                .filter((d) => d.kind === 'audioinput')
                .map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>
                    {d.label || 'Microphone'}
                    </option>
                ))}
            </select>
            </div>

            <div>
            <label className="block mb-1 font-medium">🔈 Speaker</label>
            <select
                value={speakerId}
                onChange={(e) => setSpeakerId(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600"
            >
                {devices
                .filter((d) => d.kind === 'audiooutput')
                .map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>
                    {d.label || 'Speaker'}
                    </option>
                ))}
            </select>
            </div>

            <div className="flex gap-4 pt-4">
            <button
                onClick={toggleCamera}
                className={`px-4 py-2 rounded-md font-medium cursor-pointer ${
                cameraOn
                    ? 'bg-neutral-600 hover:bg-neutral-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
            >
                {cameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
            </button>

            <button
                onClick={toggleMic}
                className={`px-4 py-2 rounded-md font-medium cursor-pointer ${
                micOn
                    ? 'bg-neutral-600 hover:bg-neutral-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
            >
                {micOn ? 'Turn Off Mic' : 'Turn On Mic'}
            </button>
            </div>
        </div>
        </div>
        <div className='mt-5 flex justify-center items-center  '>
            <button className='bg-neutral-700 p-3 rounded-xl shadow:neutral-600 cursor-pointer font-bold hover:bg-neutral-600 hover:shadow-lg shadow-neutral-800'>Join Room</button>
        </div>
      </div>
    </div>
    </div>
  );
}
