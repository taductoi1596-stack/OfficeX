import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CollaborationService } from './collaboration.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/collaboration',
})
export class CollaborationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly collaborationService: CollaborationService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers['authorization']?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }
      
      const payload = this.jwtService.verify(token);
      this.collaborationService.registerUser(client.id, payload.sub);
      
      // Notify successful connection
      client.emit('connected', { userId: payload.sub });
    } catch (err) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.collaborationService.unregisterUser(client.id);
  }

  @SubscribeMessage('join-document')
  handleJoinDocument(client: Socket, documentId: string) {
    client.join(`doc-${documentId}`);
    this.collaborationService.joinDocument(client.id, documentId);
    
    // Broadcast to others in the room
    client.to(`doc-${documentId}`).emit('user-joined', { socketId: client.id });
    return { event: 'join-success', data: { documentId } };
  }

  @SubscribeMessage('leave-document')
  handleLeaveDocument(client: Socket, documentId: string) {
    client.leave(`doc-${documentId}`);
    this.collaborationService.leaveDocument(client.id, documentId);
    client.to(`doc-${documentId}`).emit('user-left', { socketId: client.id });
  }

  @SubscribeMessage('cursor-move')
  handleCursorMove(client: Socket, payload: { documentId: string; position: any }) {
    client.to(`doc-${payload.documentId}`).emit('cursor-update', {
      socketId: client.id,
      position: payload.position,
    });
  }

  @SubscribeMessage('document-update')
  handleDocumentUpdate(client: Socket, payload: { documentId: string; changes: any }) {
    // In a real OT/CRDT implementation, we would validate and transform here
    client.to(`doc-${payload.documentId}`).emit('document-changed', {
      socketId: client.id,
      changes: payload.changes,
    });
  }
}
