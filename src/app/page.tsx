"use client";

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io();

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [signalReceived, setSignalReceived] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    socket.on('signal', async (data: RTCSessionDescriptionInit) => {
      console.log('Signal received:', data);
      setSignalReceived(true);
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data));
      }
    });

    return () => {
      socket.off('connect');
      socket.off('signal');
    };
  }, [peerConnection]);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection();
    setPeerConnection(pc);
  };

  const sendSignal = async () => {
    if (!peerConnection) return;
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit('signal', offer);
    console.log('Signal sent:', offer);
  };

  return (
    <div>
      <h1>WebRTC Test</h1>
      <p>Connected to server: {isConnected ? 'Yes' : 'No'}</p>
      <p>Signal received: {signalReceived ? 'Yes' : 'No'}</p>
      <button onClick={createPeerConnection}>Connect</button>
      <button onClick={sendSignal} disabled={!peerConnection}>Send Signal</button>
    </div>
  );
}