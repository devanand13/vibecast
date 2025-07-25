import type { Server as HTTPServer } from 'http';
import type { Socket as NetSocket } from 'net';
import type { Server as IOServer } from 'socket.io';
import type { NextApiResponse } from 'next';

export interface NextApiResponseServerIO extends NextApiResponse {
  socket: NetSocket & {
    server: HTTPServer & {
      io?: IOServer;
    };
  };
}
