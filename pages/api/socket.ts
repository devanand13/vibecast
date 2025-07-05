import type { NextApiRequest } from "next";
import type { NextApiResponseServerIO } from "../../types/next";
import { Server as IOServer } from "socket.io";
import type { Server as HTTPServer } from "http";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    const httpServer: HTTPServer = res.socket.server as HTTPServer;

    const io = new IOServer(httpServer, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("join-room", (roomId: string) => {
        socket.join(roomId);
        socket.to(roomId).emit("user-joined", socket.id);

        socket.on("offer", (data) => {
          socket.to(roomId).emit("offer", { ...data, from: socket.id });
        });

        socket.on("answer", (data) => {
          socket.to(roomId).emit("answer", { ...data, from: socket.id });
        });

        socket.on("ice-candidate", (data) => {
          socket.to(roomId).emit("ice-candidate", { ...data, from: socket.id });
        });

        socket.on("disconnect", () => {
          socket.to(roomId).emit("user-disconnected", socket.id);
        });
      });
    });

    res.socket.server.io = io;
    console.log("✅ Socket.IO server started");
  }

  res.end();
}
