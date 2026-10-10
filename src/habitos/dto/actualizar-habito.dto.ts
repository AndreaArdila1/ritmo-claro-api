import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { EstadoHabito, Frecuencia } from '../../generated/prisma/client';

export class ActualizarHabitoDto {
  @ApiPropertyOptional({ example: 'Comer frutas (revisado)' })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(120, { message: 'El nombre no puede superar 120 caracteres' })
  nombre?: string;

  @ApiPropertyOptional({ example: 'Comer frutas diariamente' })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'La descripción no puede superar 500 caracteres' })
  descripcion?: string;

  @ApiPropertyOptional({ enum: EstadoHabito, example: 'PAUSADO' })
  @IsOptional()
  @IsEnum(EstadoHabito, {
    message: 'El estado debe ser ACTIVO, PAUSADO o ARCHIVADO',
  })
  estado?: EstadoHabito;

  @ApiPropertyOptional({ enum: Frecuencia, example: 'SEMANAL' })
  @IsOptional()
  @IsEnum(Frecuencia, { message: 'La frecuencia debe ser Diaria, Semanal o Mensual' })
  frecuencia?: Frecuencia;
}