import {
  Injectable,
  NotFoundException,
  // ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';

import { Project, ProjectDocument } from './schemas/project.schema';

import { CreateProjectDto } from './dto/create-project.dto';

import { UpdateProjectDto } from './dto/update-project.dto';

import { SearchProjectDto } from './dto/search-project.dto';

import {
  ProjectCounter,
  ProjectCounterDocument,
} from './schemas/counter.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(ProjectCounter.name)
    private counterModel: Model<ProjectCounterDocument>,
  ) {}

  async getNextProjectId(): Promise<number> {
    const counter = await this.counterModel.findOneAndUpdate(
      { name: 'projectId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    return counter.seq;
  }

  async create(dto: CreateProjectDto) {
    const nextProjectId = await this.getNextProjectId();

    // const exists =
    //   await this.projectModel.findOne({
    //     projectId: dto.projectId,
    //   });

    // if (exists) {
    //   throw new ConflictException(
    //     'Project already exists',
    //   );
    // }

    let month: string | undefined;
    let year: string | undefined;

    if (dto.startDate) {
      const startDate = new Date(dto.startDate);

      month = String(startDate.getMonth() + 1);
      year = String(startDate.getFullYear());
    }

    return this.projectModel.create({
      ...dto,
      projectId: `PRO-${nextProjectId.toString()}`,
      month,
      year,
    });
  }

  async findAll() {
    return this.projectModel.find({ isDeleted: false }).sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const project = await this.projectModel.findById(id);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    const project = await this.projectModel.findByIdAndUpdate(id, dto, {
      returnDocument: 'after',
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  // async remove(id: string) {
  //   return this.projectModel.findByIdAndUpdate(
  //     id,
  //     { isDeleted: true },
  //     { returnDocument: 'after' },
  //   );
  // }
  async remove(id: string): Promise<{ message: string }> {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid product ID');
    const deleted = await this.projectModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('project not found');
    return { message: `project ${id} deleted` };
  }

  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async search(query: SearchProjectDto) {
    const {
      search,
      projectId,
      name,
      managerId,
      department,
      month,
      year,
      status,
      startDate,
      endDate,
      completionPercentage,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = {
      // isDeleted: false,
    };

    if (search?.trim()) {
      const searchTerm = this.escapeRegex(search.trim());

      filter.$or = [
        {
          projectId: {
            $regex: searchTerm,
            $options: 'i',
          },
        },
        {
          name: {
            $regex: searchTerm,
            $options: 'i',
          },
        },
        {
          description: {
            $regex: searchTerm,
            $options: 'i',
          },
        },
      ];
    }

    if (department?.trim()) {
      const searchTerm = this.escapeRegex(department.trim());

      filter.$or = [
        {
          department: {
            $regex: searchTerm,
            $options: 'i',
          },
        },
      ];
    }

    if (name?.trim()) {
      const searchTerm = this.escapeRegex(name.trim());

      filter.$or = [
        {
          name: {
            $regex: searchTerm,
            $options: 'i',
          },
        },
      ];
    }

    if (status?.trim()) {
      filter.status = status.trim().toUpperCase();
    }

    if (month?.trim()) {
      filter.month = month.trim();
    }

    if (projectId) filter.projectId = projectId;

    if (managerId) filter.managerId = managerId;

    if (completionPercentage)
      filter.completionPercentage = completionPercentage;

    if (year) filter.year = year;
    // if (month) filter.month = month;

    // if (startDate && endDate) {
    //   filter.$and = [
    //     {
    //       startDate: {
    //         $lte: new Date(endDate),
    //       },
    //     },
    //     {
    //       endDate: {
    //         $gte: new Date(startDate),
    //       },
    //     },
    //   ];
    // }

    if (startDate || endDate) {
      filter.startDate = {};

      if (startDate) {
        filter.startDate.$gte = new Date(startDate);
      }

      if (endDate) {
        filter.startDate.$lte = new Date(endDate);
      }
    }

    // if (startDate || endDate) {
    //   filter.endDate = {};

    //   if (startDate) {
    //     filter.endDate.$gte = new Date(startDate);
    //   }

    //   if (endDate) {
    //     filter.endDate.$lte = new Date(endDate);
    //   }
    // }

    console.log('Query:', query);

    console.log('Month:', month);
    console.log('Type:', typeof month);

    console.log('Filter:', filter);

    const data = await this.projectModel
      .find(filter)
      .sort({
        [sortBy]: sortOrder === 'asc' ? 1 : -1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await this.projectModel.countDocuments(filter);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async dashboard() {
    const result = await this.projectModel.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },

      {
        $facet: {
          //----------------------------------
          // Summary
          //----------------------------------

          summary: [
            {
              $group: {
                _id: null,

                totalProjects: {
                  $sum: 1,
                },

                activeProjects: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ['$status', 'ACTIVE'],
                      },
                      1,
                      0,
                    ],
                  },
                },

                completedProjects: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ['$status', 'COMPLETED'],
                      },
                      1,
                      0,
                    ],
                  },
                },

                planningProjects: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ['$status', 'PLANNING'],
                      },
                      1,
                      0,
                    ],
                  },
                },

                onHoldProjects: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ['$status', 'ON_HOLD'],
                      },
                      1,
                      0,
                    ],
                  },
                },

                completionAverage: {
                  $avg: '$completionPercentage',
                },
              },
            },
          ],

          //----------------------------------
          // Status
          //----------------------------------

          statusChart: [
            {
              $group: {
                _id: '$status',
                count: {
                  $sum: 1,
                },
              },
            },

            {
              $project: {
                _id: 0,
                status: '$_id',
                count: 1,
              },
            },
          ],

          //----------------------------------
          // Departments
          //----------------------------------

          departmentChart: [
            {
              $group: {
                _id: '$department',
                count: {
                  $sum: 1,
                },
              },
            },

            {
              $sort: {
                count: -1,
              },
            },

            {
              $project: {
                _id: 0,
                department: '$_id',
                count: 1,
              },
            },
          ],

          //----------------------------------
          // Monthly
          //----------------------------------

          monthlyProjects: [
            {
              $group: {
                _id: '$month',
                count: {
                  $sum: 1,
                },
              },
            },

            {
              $sort: {
                _id: 1,
              },
            },

            {
              $project: {
                _id: 0,
                month: '$_id',
                count: 1,
              },
            },
          ],

          //----------------------------------
          // Top Managers
          //----------------------------------

          topManagers: [
            {
              $group: {
                _id: '$managerId',

                projects: {
                  $sum: 1,
                },

                averageCompletion: {
                  $avg: '$completionPercentage',
                },
              },
            },

            {
              $sort: {
                projects: -1,
              },
            },

            {
              $limit: 10,
            },

            {
              $project: {
                _id: 0,
                managerId: '$_id',
                projects: 1,
                averageCompletion: {
                  $round: ['$averageCompletion', 2],
                },
              },
            },
          ],

          //----------------------------------
          // Completion Distribution
          //----------------------------------

          completionDistribution: [
            {
              $bucket: {
                groupBy: '$completionPercentage',

                boundaries: [0, 25, 50, 75, 101],

                default: 'Other',

                output: {
                  count: {
                    $sum: 1,
                  },
                },
              },
            },
          ],
        },
      },
    ]);

    return {
      summary: result[0].summary[0] ?? {},

      statusChart: result[0].statusChart,

      departmentChart: result[0].departmentChart,

      monthlyProjects: result[0].monthlyProjects,

      completionDistribution: result[0].completionDistribution.map((x) => ({
        range:
          x._id === 0
            ? '0-25'
            : x._id === 25
              ? '26-50'
              : x._id === 50
                ? '51-75'
                : x._id === 75
                  ? '76-100'
                  : 'Other',

        count: x.count,
      })),

      topManagers: result[0].topManagers,
    };
  }
}
