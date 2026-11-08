import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class CollaborationService {
  private activeUsers = new Map<string, string>(); // socketId -> userId
  private documentRooms = new Map<string, Set<string>>(); // documentId -> Set of socketIds

  registerUser(socketId: string, userId: string) {
    this.activeUsers.set(socketId, userId);
  }

  unregisterUser(socketId: string) {
    this.activeUsers.delete(socketId);
    // Remove from all rooms
    for (const [docId, sockets] of this.documentRooms.entries()) {
      sockets.delete(socketId);
      if (sockets.size === 0) {
        this.documentRooms.delete(docId);
      }
    }
  }

  joinDocument(socketId: string, documentId: string) {
    if (!this.documentRooms.has(documentId)) {
      this.documentRooms.set(documentId, new Set());
    }
    this.documentRooms.get(documentId)!.add(socketId);
  }

  leaveDocument(socketId: string, documentId: string) {
    const room = this.documentRooms.get(documentId);
    if (room) {
      room.delete(socketId);
      if (room.size === 0) {
        this.documentRooms.delete(documentId);
      }
    }
  }

  // Handle OT/CRDT logic here or forward to Redis pub/sub for scaling
}
