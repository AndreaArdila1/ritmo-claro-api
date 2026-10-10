import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Frecuencia } from '../../generated/prisma/client';

export class CrearHabitoDto {
  @ApiProperty({ example: 'Comer frutas' })
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(120, { message: 'El nombre no puede superar 120 caracteres' })
  nombre!: string;

  @ApiPropertyOptional({ example: 'Comer frutas diariamente' })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'La descripción no puede superar 500 caracteres' })
  descripcion?: string;

  @ApiPropertyOptional({ enum: Frecuencia, example: 'Diaria' })
  @IsOptional()
  @IsEnum(Frecuencia, { message: 'La frecuencia debe ser Diaria, Semanal o Mensual' })
  frecuencia?: Frecuencia;
}