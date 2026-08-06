import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Company, CompanyDocument } from './schemas/company.schema';

import { Model } from 'mongoose';

import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { SearchCompanyDto } from './dto/search-company.dto';

import {
  CompanyCounter,
  CompanyCounterDocument,
} from './schemas/counter.schema';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,

    @InjectModel(CompanyCounter.name)
    private counterModel: Model<CompanyCounterDocument>,
  ) {}

  async getNextCompanyId(): Promise<number> {
    const counter = await this.counterModel.findOneAndUpdate(
      { name: 'companyId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    return counter.seq;
  }

  // ---------------------------------------------------------
  // Create Company
  // ---------------------------------------------------------

  async create(dto: CreateCompanyDto) {
    const nextCompanyId = await this.getNextCompanyId();

    const exists = await this.companyModel.findOne({
      $or: [
        {
          companyId: dto.companyId,
        },
        {
          email: dto.email,
        },
        {
          commercialRegistration: dto.commercialRegistration,
        },
      ],
      isDeleted: false,
    });

    if (exists) {
      throw new ConflictException('Company already exists.');
    }

    return this.companyModel.create({
      ...dto,
      companyId: `COMP-${nextCompanyId.toString()}`,
    });
  }

  // ---------------------------------------------------------
  // Get All
  // ---------------------------------------------------------

  async findAll() {
    return this.companyModel
      .find({
        isDeleted: false,
      })
      .sort({
        createdAt: -1,
      });
  }

  // ---------------------------------------------------------
  // Search
  // ---------------------------------------------------------

  async search(query: SearchCompanyDto) {
    const {
      search,
      companyId,
      companyName,
      industry,
      country,
      city,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = {
      isDeleted: false,
    };

    if (search?.trim()) {
      const keyword = this.escapeRegex(search.trim());

      filter.$or = [
        {
          companyId: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          companyName: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          legalName: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          description: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          industry: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          city: {
            $regex: keyword,
            $options: 'i',
          },
        },
        {
          country: {
            $regex: keyword,
            $options: 'i',
          },
        },
      ];
    }

    if (companyId) filter.companyId = companyId;

    if (companyName?.trim()) {
      filter.companyName = {
        $regex: this.escapeRegex(companyName.trim()),
        $options: 'i',
      };
    }

    if (industry?.trim()) {
      filter.industry = {
        $regex: this.escapeRegex(industry.trim()),
        $options: 'i',
      };
    }

    if (country?.trim()) {
      filter.country = {
        $regex: this.escapeRegex(country.trim()),
        $options: 'i',
      };
    }

    if (city?.trim()) {
      filter.city = {
        $regex: this.escapeRegex(city.trim()),
        $options: 'i',
      };
    }

    if (status?.trim()) {
      filter.status = status.trim().toUpperCase();
    }

    const data = await this.companyModel
      .find(filter)
      .sort({
        [sortBy]: sortOrder === 'asc' ? 1 : -1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await this.companyModel.countDocuments(filter);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ---------------------------------------------------------
  // Find One
  // ---------------------------------------------------------

  async findOne(id: string) {
    const company = await this.companyModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!company) {
      throw new NotFoundException('Company not found.');
    }

    return company;
  }

  // ---------------------------------------------------------
  // Update
  // ---------------------------------------------------------

  async update(id: string, dto: UpdateCompanyDto) {
    const company = await this.companyModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      dto,
      {
        new: true,
      },
    );

    if (!company) {
      throw new NotFoundException('Company not found.');
    }

    return company;
  }

  // ---------------------------------------------------------
  // Change Status
  // ---------------------------------------------------------

  async changeStatus(id: string, status: string) {
    const company = await this.companyModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        status,
      },
      {
        new: true,
      },
    );

    if (!company) {
      throw new NotFoundException('Company not found.');
    }

    return company;
  }

  // ---------------------------------------------------------
  // Update Logo
  // ---------------------------------------------------------

  async updateLogo(id: string, logo: string) {
    const company = await this.companyModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        logo,
      },
      {
        new: true,
      },
    );

    if (!company) {
      throw new NotFoundException('Company not found.');
    }

    return company;
  }

  // ---------------------------------------------------------
  // Soft Delete
  // ---------------------------------------------------------

  async remove(id: string) {
    const company = await this.companyModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        new: true,
      },
    );

    if (!company) {
      throw new NotFoundException('Company not found.');
    }

    return {
      message: 'Company deleted successfully.',
    };
  }

  // ---------------------------------------------------------
  // Escape Regex
  // ---------------------------------------------------------

  private escapeRegex(text: string): string {
    return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
}
