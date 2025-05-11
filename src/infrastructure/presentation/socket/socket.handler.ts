import { Socket } from "socket.io";

export class SocketHandler {
  constructor(private messageRepo: any, private roomRepo: any) {}

  public handleJoinRoom(socket: Socket, roomId: string): void {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  }

  public async handleMessage(
    socket: Socket,
    roomId: string,
    messageData: {
      content: string;
      senderId: string;
      username: string;
    }
  ): Promise<void> {
    try {
      const message = await this.messageRepo.create({
        content: messageData.content,
        senderId: messageData.senderId,
        roomId,
        username: messageData.username,
      });

      socket.to(roomId).emit("message", message);
    } catch (error) {
      socket.emit("error", "Failed to send message");
    }
  }

  public handleDisconnect(socket: Socket): void {
    console.log(`Socket ${socket.id} disconnected`);
  }
}
