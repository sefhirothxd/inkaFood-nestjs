import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const newCategory =
        await this.categoryRepository.create(createCategoryDto);
      await this.categoryRepository.save(newCategory);
      return {
        message: 'Category created successfully',
        data: newCategory,
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    const categories = await this.categoryRepository.find();

    return categories;
  }

  async findOne(term: string) {
    const categoryExists = await this.categoryRepository.findOneBy({
      name: term,
    });

    if (!categoryExists) {
      throw new NotFoundException(`Category #${term} not found`);
    }

    return categoryExists;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return updateCategoryDto;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    throw new InternalServerErrorException(`Errror Ayuda`);
  }
}
