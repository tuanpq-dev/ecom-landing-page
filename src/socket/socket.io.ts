import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function socketIO(): Socket {
    const PORT_SOCKET_IO = import.meta.env.VITE_PORT_SOCKET_IO;
    if (!socket) {
        socket = io(PORT_SOCKET_IO);

        socket.on('connect', () => {
            console.log('connected...', socket.id);
        })

        socket.on('message', (message): any => {
            console.log(message);
        })

        socket.on("disconnect", (reason) => {
            console.log('disconnected....', reason);
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
        });
    }

    return socket;
}

export function getSocket(): Socket | null {
    return socket;
}