import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { category, ...productData } = createProductDto;

    const found = await this.categoriesRepository.findOneBy({ id: category });
    if (!found) {
      throw new Error('Category not found');
    }

    const newProduct = await this.productRepository.create({
      ...productData,
      category: found,
    });
    return this.productRepository.save(newProduct);
  }

  async findAll() {
    const allProducts = await this.productRepository.find({
      relations: ['category'],
    });

    return allProducts;
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    const { category, ...productData } = updateProductDto;

    const existProduct = this.findOne(id);

    if (!existProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.productRepository.update(id, {
      ...productData,
      category: category ? { id: category } : undefined,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
