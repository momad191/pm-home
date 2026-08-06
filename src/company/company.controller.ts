import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CompanyService } from './company.service';

import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { SearchCompanyDto } from './dto/search-company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  /**
   * ------------------------------------
   * Create Company
   * POST /company
   * ------------------------------------
   */
  @Post()
  create(
    @Body()
    createCompanyDto: CreateCompanyDto,
  ) {
    return this.companyService.create(createCompanyDto);
  }

  /**
   * ------------------------------------
   * Get All Companies
   * GET /company
   * ------------------------------------
   */
  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  /**
   * ------------------------------------
   * Search Companies
   * GET /company/search
   * ------------------------------------
   */
  @Get('search')
  search(
    @Query()
    query: SearchCompanyDto,
  ) {
    return this.companyService.search(query);
  }

  /**
   * ------------------------------------
   * Get Company By Id
   * GET /company/:id
   * ------------------------------------
   */
  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.companyService.findOne(id);
  }

  /**
   * ------------------------------------
   * Update Company
   * PATCH /company/:id
   * ------------------------------------
   */
  @Patch(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.update(id, updateCompanyDto);
  }

  /**
   * ------------------------------------
   * Change Company Status
   * PATCH /company/:id/status
   * ------------------------------------
   */
  @Patch(':id/status')
  changeStatus(
    @Param('id')
    id: string,

    @Body('status')
    status: string,
  ) {
    return this.companyService.changeStatus(id, status);
  }

  /**
   * ------------------------------------
   * Update Company Logo
   * PATCH /company/:id/logo
   * ------------------------------------
   */
  @Patch(':id/logo')
  updateLogo(
    @Param('id')
    id: string,

    @Body('logo')
    logo: string,
  ) {
    return this.companyService.updateLogo(id, logo);
  }

  /**
   * ------------------------------------
   * Soft Delete Company
   * DELETE /company/:id
   * ------------------------------------
   */
  @Delete(':id')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.companyService.remove(id);
  }
}
