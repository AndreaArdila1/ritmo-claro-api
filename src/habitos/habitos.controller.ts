import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { RolesGuard } from '../auth/roles.guard';
  import { Roles } from '../auth/roles.decorator';
  import { Rol } from '../generated/prisma/client';
  import { UsuarioActual } from '../auth/usuario-actual.decorator';
  import { HabitosService } from './habitos.service';
  import { CrearHabitoDto } from './dto/crear-habito.dto';
  import { ActualizarHabitoDto } from './dto/actualizar-habito.dto';
  
  @ApiTags('habitos')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('habitos')
  export class HabitosController {
    constructor(private readonly habitosService: HabitosService) {}
  
    @Post()
    crear(
      @Body() dto: CrearHabitoDto,
      @UsuarioActual() usuario: { id: number },
    ) {
      return this.habitosService.crear(dto, usuario.id);
    }
  
    @Get()
    obtenerMias(@UsuarioActual() usuario: { id: number }) {
      return this.habitosService.obtenerMias(usuario.id);
    }
  
    @Get('admin/todas')
    @UseGuards(RolesGuard)
    @Roles([Rol.ADMIN])
    obtenerTodasAdmin() {
      return this.habitosService.obtenerTodasAdmin();
    }
  
    @Get(':id')
    obtenerUna(
      @Param('id', ParseIntPipe) id: number,
      @UsuarioActual() usuario: { id: number },
    ) {
      return this.habitosService.obtenerUna(id, usuario.id);
    }
  
    @Patch(':id')
    actualizar(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: ActualizarHabitoDto,
      @UsuarioActual() usuario: { id: number },
    ) {
      return this.habitosService.actualizar(id, dto, usuario.id);
    }
  
    @Delete(':id')
    eliminar(
      @Param('id', ParseIntPipe) id: number,
      @UsuarioActual() usuario: { id: number },
    ) {
      return this.habitosService.eliminar(id, usuario.id);
    }
  }