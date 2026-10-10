import {
    ForbiddenException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import { CrearHabitoDto } from './dto/crear-habito.dto';
  import { ActualizarHabitoDto } from './dto/actualizar-habito.dto';
  
  @Injectable()
  export class HabitosService {
    constructor(private readonly prisma: PrismaService) {}
  
    crear(dto: CrearHabitoDto, usuarioId: number) {
      return this.prisma.habito.create({
        data: {
          nombre: dto.nombre,
          descripcion: dto.descripcion,
          frecuencia: dto.frecuencia,
          usuarioId,
        },
      });
    }
  
    obtenerMias(usuarioId: number) {
      return this.prisma.habito.findMany({
        where: { usuarioId },
        orderBy: { id: 'asc' },
      });
    }
  
    obtenerTodosAdmin() {
      return this.prisma.habito.findMany({
        include: {
          usuario: { select: { id: true, nombre: true, email: true } },
        },
        orderBy: { id: 'asc' },
      });
    }
  
    async obtenerUna(id: number, usuarioId: number) {
      const habito = await this.prisma.habito.findUnique({ where: { id } });
  
      if (!habito) {
        throw new NotFoundException('El habito no existe');
      }
  
      if (habito.usuarioId !== usuarioId) {
        throw new ForbiddenException('Este habito no es tuyo');
      }
  
      return habito;
    }
  
    async actualizar(id: number, dto: ActualizarHabitoDto, usuarioId: number) {
      await this.obtenerUna(id, usuarioId);
      return this.prisma.habito.update({ where: { id }, data: dto });
    }
  
    async eliminar(id: number, usuarioId: number) {
      await this.obtenerUna(id, usuarioId);
      return this.prisma.habito.delete({ where: { id } });
    }
  }