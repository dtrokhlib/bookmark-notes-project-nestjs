import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto, UpdateNoteDto } from './dto';

@Injectable()
export class NoteService {
  constructor(private prismaService: PrismaService) {}

  async getNotes(userId: number) {
    return await this.prismaService.note.findMany({
      where: {
        userId,
      },
    });
  }

  async getNotesById(userId: number, noteId: number) {
    return await this.prismaService.note.findFirst({
      where: {
        userId,
        id: noteId,
      },
    });
  }

  async createNote(userId: number, dto: CreateNoteDto) {
    return await this.prismaService.note.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async updateNoteById(userId: number, noteId: number, dto: UpdateNoteDto) {
    const note = await this.prismaService.note.findUnique({
      where: {
        id: noteId,
      },
    });

    if (!note || note.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return await this.prismaService.note.update({
      where: {
        id: noteId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteNoteById(userId: number, noteId: number) {
    const note = await this.prismaService.note.findUnique({
      where: {
        id: noteId,
      },
    });

    if (!note || note.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prismaService.note.delete({
      where: {
        id: noteId,
      },
    });
  }
}
