import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    try {
      const token =
        client.handshake.auth.token ||
        (client.handshake.headers.authorization as string)?.split(' ')[1];

      if (!token) {
        console.log(`Client ${client.id} has no token`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      client.data.user = payload;
      console.log(`Client ${client.id} authenticated as user ${payload.sub}`);

      const bookingId = client.handshake.query.bookingId as string;
      if (bookingId) {
        client.join(bookingId);
        console.log(`Client ${client.id} joined room ${bookingId}`);
      }
    } catch (error) {
      console.log(`Client ${client.id} authentication failed: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  sendMessage(bookingId: string, message: any) {
    this.server.to(bookingId).emit('messageCreated', message);
  }
}
