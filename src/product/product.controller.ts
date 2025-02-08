import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  CreateProductDto,
  CreateProductSchema,
} from './dto/create-product.dto';

import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { REQUEST_ADM } from 'src/auth/auth.constants';
import { ZodValidationPipe } from 'src/pipes/zod-validator.pipe';

import { ApiCreatedResponse } from '@nestjs/swagger';
import {
  UpdateProductDto,
  UpdateProductSchema,
} from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(REQUEST_ADM)
  @ApiCreatedResponse({ type: CreateProductDto })
  create(
    @Body(new ZodValidationPipe(CreateProductSchema))
    createProductDto: CreateProductDto,
  ) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.productService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(REQUEST_ADM)
  @ApiCreatedResponse({ type: UpdateProductDto })
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateProductSchema))
    updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles(REQUEST_ADM)
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
