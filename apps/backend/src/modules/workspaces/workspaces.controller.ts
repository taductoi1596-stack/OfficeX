import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  create(@CurrentUser('id') userId: string, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspacesService.create(userId, createWorkspaceDto);
  }

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.workspacesService.findAllForUser(userId);
  }

  @Get(':id')
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.workspacesService.getWorkspaceDetails(userId, id);
  }

  @Post(':id/members')
  addMember(
    @CurrentUser('id') userId: string,
    @Param('id') workspaceId: string,
    @Body() addMemberDto: AddMemberDto,
  ) {
    return this.workspacesService.addMember(userId, workspaceId, addMemberDto);
  }
}
