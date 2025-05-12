import { io, Socket } from "socket.io";

export class SocketClient {
  private socket: Socket;

  constructor() {
    this.socket = io;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.socket.on("connect", () => {
      console.log("Connected to server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    this.socket.on("message", (message: _MessageEntity) => {
      console.log("Received message:", message);
    });
  }

  public joinRoom(roomId: string): void {
    this.socket.emit("join", { roomId });
  }

  public sendMessage(
    roomId: string,
    messageData: {
      content: string;
      senderId: string;
      username: string;
    }
  ): void {
    this.socket.emit("message", {
      roomId,
      ...messageData,
    });
  }
}
