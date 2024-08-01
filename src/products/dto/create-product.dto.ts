import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsInt()
  @IsPositive()
  stock: number;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString({ each: true })
  @IsArray()
  images: string[];

  @IsInt()
  @IsPositive()
  category: number;
}
