"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const react_1 = require("react");
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const socket = (0, socket_io_client_1.default)();
function Home() {
    const [isConnected, setIsConnected] = (0, react_1.useState)(false);
    const [peerConnection, setPeerConnection] = (0, react_1.useState)(null);
    const [signalReceived, setSignalReceived] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
            setIsConnected(true);
        });
        socket.on('signal', async (data) => {
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
        if (!peerConnection)
            return;
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit('signal', offer);
        console.log('Signal sent:', offer);
    };
    return (<div>
      <h1>WebRTC Test</h1>
      <p>Connected to server: {isConnected ? 'Yes' : 'No'}</p>
      <p>Signal received: {signalReceived ? 'Yes' : 'No'}</p>
      <button onClick={createPeerConnection}>Connect</button>
      <button onClick={sendSignal} disabled={!peerConnection}>Send Signal</button>
    </div>);
}
