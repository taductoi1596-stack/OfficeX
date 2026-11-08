import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Permission } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateDocumentDto) {
    // Basic creation. Real implementation would check workspace permissions.
    const doc = await this.prisma.document.create({
      data: {
        title: dto.title,
        type: dto.type,
        ownerId: userId,
        workspaceId: dto.workspaceId,
        content: dto.content ? dto.content : {},
        collaborators: {
          create: {
            userId,
            permission: Permission.OWNER,
          },
        },
      },
    });
    return doc;
  }

  async findAllForUser(userId: string) {
    return this.prisma.document.findMany({
      where: {
        isDeleted: false,
        collaborators: {
          some: { userId },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const doc = await this.prisma.document.findFirst({
      where: {
        id,
        isDeleted: false,
        collaborators: {
          some: { userId },
        },
      },
    });
    if (!doc) throw new NotFoundException('Document not found or access denied');
    return doc;
  }

  async update(userId: string, id: string, dto: UpdateDocumentDto) {
    const doc = await this.findOne(userId, id);
    
    // Check permission (simplified)
    const collab = await this.prisma.collaboration.findUnique({
      where: { documentId_userId: { documentId: id, userId } },
    });
    
    if (!collab || (collab.permission !== Permission.OWNER && collab.permission !== Permission.WRITE)) {
      throw new ForbiddenException('Not enough permissions to edit');
    }

    return this.prisma.document.update({
      where: { id },
      data: {
        ...dto,
        version: doc.version + 1,
      },
    });
  }

  async softDelete(userId: string, id: string) {
    // Only owner can delete
    const doc = await this.findOne(userId, id);
    if (doc.ownerId !== userId) {
      throw new ForbiddenException('Only owner can delete documents');
    }

    return this.prisma.document.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }
}
