import { IsEnum, IsOptional, IsString, IsObject } from 'class-validator';
import { DocumentType } from '@prisma/client';

export class CreateDocumentDto {
  @IsString()
  title!: string;

  @IsEnum(DocumentType)
  type!: DocumentType;

  @IsOptional()
  @IsString()
  workspaceId?: string;

  @IsOptional()
  @IsObject()
  content?: Record<string, any>;
}
