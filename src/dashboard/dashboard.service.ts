import {
  Injectable,
  NotFoundException,
  // ConflictException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import {
  Notification,
  NotificationDocument,
} from 'src/notification/schemas/notification.schema';

import { Project, ProjectDocument } from 'src/project/schemas/project.schema';
import { Sprint, SprintDocument } from 'src/sprint/schemas/sprint.schema';
import { Task, TaskDocument, TaskStatus } from 'src/task/schemas/task.schema';
import { Risk, RiskDocument } from 'src/risk/schemas/risk.schema';
import { Issue, IssueDocument } from 'src/issue/schemas/issue.schema';
import { User, UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,

    @InjectModel(Sprint.name)
    private readonly sprintModel: Model<SprintDocument>,

    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,

    @InjectModel(Risk.name)
    private readonly riskModel: Model<RiskDocument>,

    @InjectModel(Issue.name)
    private readonly issueModel: Model<IssueDocument>,

    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,

    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  // =====================================================
  // Dashboard Overview
  //Projects Aggregation
  // =====================================================

  async getOverview() {
    const projects = this.projectModel.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,

          total: {
            $sum: 1,
          },

          planning: {
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

          active: {
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

          completed: {
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

          onHold: {
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

          averageCompletion: {
            $avg: '$completionPercentage',
          },
        },
      },
    ]);
    // ======================end ===============================

    // =====================================================
    //Sprint Aggregation
    // =====================================================

    const sprints = this.sprintModel.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,

          total: {
            $sum: 1,
          },

          planned: {
            $sum: {
              $cond: [
                {
                  $eq: ['$status', 'PLANNED'],
                },
                1,
                0,
              ],
            },
          },

          active: {
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

          completed: {
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
        },
      },
    ]);
    // ======================end ===============================

    // =====================================================
    //Task Aggregation
    // =====================================================

    const tasks = this.taskModel.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,

          total: {
            $sum: 1,
          },

          todo: {
            $sum: {
              $cond: [{ $eq: ['$status', 'TODO'] }, 1, 0],
            },
          },

          inProgress: {
            $sum: {
              $cond: [{ $eq: ['$status', 'IN_PROGRESS'] }, 1, 0],
            },
          },

          review: {
            $sum: {
              $cond: [{ $eq: ['$status', 'REVIEW'] }, 1, 0],
            },
          },

          done: {
            $sum: {
              $cond: [{ $eq: ['$status', 'DONE'] }, 1, 0],
            },
          },

          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ['$dueDate', new Date()] },
                    { $ne: ['$status', 'DONE'] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);
    // ======================end ===============================

    // =====================================================
    //Risk Aggregation
    // =====================================================

    const risks = this.riskModel.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,

          total: {
            $sum: 1,
          },

          low: {
            $sum: {
              $cond: [{ $eq: ['$level', 'LOW'] }, 1, 0],
            },
          },

          medium: {
            $sum: {
              $cond: [{ $eq: ['$level', 'MEDIUM'] }, 1, 0],
            },
          },

          high: {
            $sum: {
              $cond: [{ $eq: ['$level', 'HIGH'] }, 1, 0],
            },
          },
        },
      },
    ]);
    // ======================end ===============================

    // =====================================================
    //Issue Aggregation
    // =====================================================

    const issues = this.issueModel.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,

          total: {
            $sum: 1,
          },

          open: {
            $sum: {
              $cond: [{ $eq: ['$status', 'OPEN'] }, 1, 0],
            },
          },

          inProgress: {
            $sum: {
              $cond: [{ $eq: ['$status', 'IN_PROGRESS'] }, 1, 0],
            },
          },

          resolved: {
            $sum: {
              $cond: [{ $eq: ['$status', 'RESOLVED'] }, 1, 0],
            },
          },

          closed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'CLOSED'] }, 1, 0],
            },
          },
        },
      },
    ]);
    // ======================end ===============================

    // =====================================================
    //Notification Aggregation
    // =====================================================

    const notifications = this.notificationModel.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,

          total: {
            $sum: 1,
          },

          unread: {
            $sum: {
              $cond: [{ $eq: ['$isRead', false] }, 1, 0],
            },
          },
        },
      },
    ]);
    // ======================end ===============================

    // Execute all aggregations concurrently and format the response

    const [
      projectData,
      sprintData,
      taskData,
      riskData,
      issueData,
      notificationData,
    ] = await Promise.all([
      projects,
      sprints,
      tasks,
      risks,
      issues,
      notifications,
    ]);

    return {
      projects: projectData[0] ?? {},
      sprints: sprintData[0] ?? {},
      tasks: taskData[0] ?? {},
      risks: riskData[0] ?? {},
      issues: issueData[0] ?? {},
      notifications: notificationData[0] ?? {},
    };
  }

  async getProjectHealth() {
    const result = await this.projectModel.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },

      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,

                totalProjects: {
                  $sum: 1,
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

                healthyProjects: {
                  $sum: {
                    $cond: [
                      {
                        $gte: ['$completionPercentage', 75],
                      },
                      1,
                      0,
                    ],
                  },
                },

                atRiskProjects: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $gte: ['$completionPercentage', 25],
                          },
                          {
                            $lt: ['$completionPercentage', 75],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },

                overdueProjects: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $lt: ['$endDate', new Date()],
                          },
                          {
                            $ne: ['$status', 'COMPLETED'],
                          },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },

                averageCompletion: {
                  $avg: '$completionPercentage',
                },
              },
            },
          ],

          statusDistribution: [
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

          completionRanges: [
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
        },
      },
    ]);

    return {
      summary: result[0].summary[0] ?? {},

      statusDistribution: result[0].statusDistribution,

      completionRanges: result[0].completionRanges.map((item) => ({
        range:
          item._id === 0
            ? '0-25'
            : item._id === 25
              ? '26-50'
              : item._id === 50
                ? '51-75'
                : item._id === 75
                  ? '76-100'
                  : 'Other',

        count: item.count,
      })),

      monthlyProjects: result[0].monthlyProjects,
    };
  }

  async getWorkload() {
    const now = new Date();

    //----------------------------------------------------
    // Tasks per User
    //----------------------------------------------------

    const tasksPerUser = await this.taskModel.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },

      {
        $group: {
          _id: '$assignedTo',

          totalTasks: {
            $sum: 1,
          },

          completedTasks: {
            $sum: {
              $cond: [
                {
                  $eq: ['$status', 'DONE'],
                },
                1,
                0,
              ],
            },
          },

          inProgressTasks: {
            $sum: {
              $cond: [
                {
                  $eq: ['$status', 'IN_PROGRESS'],
                },
                1,
                0,
              ],
            },
          },

          todoTasks: {
            $sum: {
              $cond: [
                {
                  $eq: ['$status', 'TODO'],
                },
                1,
                0,
              ],
            },
          },

          overdueTasks: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $lt: ['$dueDate', now],
                    },
                    {
                      $ne: ['$status', 'DONE'],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },

      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 0,

          userId: '$_id',

          username: '$user.username',

          fullName: '$user.fullName',

          email: '$user.email',

          totalTasks: 1,

          completedTasks: 1,

          inProgressTasks: 1,

          todoTasks: 1,

          overdueTasks: 1,

          completionRate: {
            $cond: [
              {
                $eq: ['$totalTasks', 0],
              },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: ['$completedTasks', '$totalTasks'],
                      },
                      100,
                    ],
                  },
                  2,
                ],
              },
            ],
          },
        },
      },

      {
        $sort: {
          totalTasks: -1,
        },
      },
    ]);

    //----------------------------------------------------
    // Sprint Velocity
    //----------------------------------------------------

    const sprintVelocity = await this.sprintModel.aggregate([
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'sprintId',
          as: 'tasks',
        },
      },

      {
        $project: {
          sprintId: 1,

          name: 1,

          totalTasks: {
            $size: '$tasks',
          },

          completedTasks: {
            $size: {
              $filter: {
                input: '$tasks',
                as: 'task',
                cond: {
                  $eq: ['$$task.status', 'DONE'],
                },
              },
            },
          },
        },
      },

      {
        $addFields: {
          velocity: {
            $cond: [
              {
                $eq: ['$totalTasks', 0],
              },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: ['$completedTasks', '$totalTasks'],
                      },
                      100,
                    ],
                  },
                  2,
                ],
              },
            ],
          },
        },
      },

      {
        $sort: {
          velocity: -1,
        },
      },
    ]);

    //----------------------------------------------------
    // Team Utilization
    //----------------------------------------------------

    const teamUtilization = await this.taskModel.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },

      {
        $group: {
          _id: '$assignedTo',

          assigned: {
            $sum: 1,
          },

          active: {
            $sum: {
              $cond: [
                {
                  $eq: ['$status', 'IN_PROGRESS'],
                },
                1,
                0,
              ],
            },
          },

          completed: {
            $sum: {
              $cond: [
                {
                  $eq: ['$status', 'DONE'],
                },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },

      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 0,

          userId: '$_id',

          username: '$user.username',

          assigned: 1,

          active: 1,

          completed: 1,

          utilization: {
            $cond: [
              {
                $eq: ['$assigned', 0],
              },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: ['$active', '$assigned'],
                      },
                      100,
                    ],
                  },
                  2,
                ],
              },
            ],
          },
        },
      },

      {
        $sort: {
          utilization: -1,
        },
      },
    ]);

    //----------------------------------------------------
    // Tasks Distribution
    //----------------------------------------------------

    const taskDistribution = await this.taskModel.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },

      {
        $group: {
          _id: '$status',

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
    ]);

    //----------------------------------------------------
    // Projects per Manager
    //----------------------------------------------------

    const projectsPerManager = await this.projectModel.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },

      {
        $group: {
          _id: '$managerId',

          totalProjects: {
            $sum: 1,
          },

          avgCompletion: {
            $avg: '$completionPercentage',
          },
        },
      },

      {
        $sort: {
          totalProjects: -1,
        },
      },
    ]);

    //----------------------------------------------------
    // Return
    //----------------------------------------------------

    return {
      tasksPerUser,
      sprintVelocity,
      teamUtilization,
      taskDistribution,
      projectsPerManager,
    };
  }

  async getExecutiveDashboard() {
    const [projects, tasks, sprints, risks, issues] = await Promise.all([
      this.projectModel.aggregate([
        {
          $group: {
            _id: null,

            totalProjects: {
              $sum: 1,
            },

            activeProjects: {
              $sum: {
                $cond: [{ $eq: ['$status', 'ACTIVE'] }, 1, 0],
              },
            },

            completedProjects: {
              $sum: {
                $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0],
              },
            },

            averageCompletion: {
              $avg: '$completionPercentage',
            },
          },
        },
      ]),

      this.taskModel.aggregate([
        {
          $group: {
            _id: null,

            totalTasks: {
              $sum: 1,
            },

            completedTasks: {
              $sum: {
                $cond: [{ $eq: ['$status', 'DONE'] }, 1, 0],
              },
            },

            inProgressTasks: {
              $sum: {
                $cond: [{ $eq: ['$status', 'IN_PROGRESS'] }, 1, 0],
              },
            },

            overdueTasks: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $lt: ['$dueDate', new Date()],
                      },
                      {
                        $ne: ['$status', 'DONE'],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),

      this.sprintModel.aggregate([
        {
          $group: {
            _id: null,

            totalSprints: {
              $sum: 1,
            },

            activeSprints: {
              $sum: {
                $cond: [{ $eq: ['$status', 'ACTIVE'] }, 1, 0],
              },
            },

            completedSprints: {
              $sum: {
                $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0],
              },
            },
          },
        },
      ]),

      this.riskModel.aggregate([
        {
          $group: {
            _id: null,

            totalRisks: {
              $sum: 1,
            },

            highRisks: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$level', 'HIGH'],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),

      this.issueModel.aggregate([
        {
          $group: {
            _id: null,

            totalIssues: {
              $sum: 1,
            },

            openIssues: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$status', 'OPEN'],
                  },
                  1,
                  0,
                ],
              },
            },

            resolvedIssues: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$status', 'RESOLVED'],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),
    ]);

    const project = projects[0] || {};
    const task = tasks[0] || {};
    const sprint = sprints[0] || {};
    const risk = risks[0] || {};
    const issue = issues[0] || {};

    const projectSuccessRate =
      project.totalProjects > 0
        ? Number(
            ((project.completedProjects / project.totalProjects) * 100).toFixed(
              2,
            ),
          )
        : 0;

    const taskCompletionRate =
      task.totalTasks > 0
        ? Number(((task.completedTasks / task.totalTasks) * 100).toFixed(2))
        : 0;

    const issueResolutionRate =
      issue.totalIssues > 0
        ? Number(((issue.resolvedIssues / issue.totalIssues) * 100).toFixed(2))
        : 0;

    return {
      projects: {
        total: project.totalProjects || 0,

        active: project.activeProjects || 0,

        completed: project.completedProjects || 0,

        successRate: projectSuccessRate,

        averageCompletion: Number((project.averageCompletion || 0).toFixed(2)),
      },

      sprints: {
        total: sprint.totalSprints || 0,

        active: sprint.activeSprints || 0,

        completed: sprint.completedSprints || 0,
      },

      tasks: {
        total: task.totalTasks || 0,

        completed: task.completedTasks || 0,

        inProgress: task.inProgressTasks || 0,

        overdue: task.overdueTasks || 0,

        completionRate: taskCompletionRate,
      },

      risks: {
        total: risk.totalRisks || 0,

        high: risk.highRisks || 0,
      },

      issues: {
        total: issue.totalIssues || 0,

        open: issue.openIssues || 0,

        resolved: issue.resolvedIssues || 0,

        resolutionRate: issueResolutionRate,
      },

      executiveScore: Number(
        (
          (projectSuccessRate + taskCompletionRate + issueResolutionRate) /
          3
        ).toFixed(2),
      ),
    };
  }

  async getCharts() {
    const currentYear = new Date().getFullYear().toString();

    const [
      projectStatus,
      projectMonthly,
      taskStatus,
      riskLevels,
      issueStatus,
      sprintStatus,
      completionDistribution,
    ] = await Promise.all([
      // -------------------------------------
      // Projects by Status
      // -------------------------------------
      this.projectModel.aggregate([
        {
          $group: {
            _id: '$status',
            value: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            value: 1,
          },
        },
      ]),

      // -------------------------------------
      // Projects Created Per Month
      // -------------------------------------
      this.projectModel.aggregate([
        {
          $match: {
            year: currentYear,
          },
        },
        {
          $group: {
            _id: '$month',
            projects: {
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
            projects: 1,
          },
        },
      ]),

      // -------------------------------------
      // Tasks by Status
      // -------------------------------------
      this.taskModel.aggregate([
        {
          $group: {
            _id: '$status',
            value: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            value: 1,
          },
        },
      ]),

      // -------------------------------------
      // Risks by Level
      // -------------------------------------
      this.riskModel.aggregate([
        {
          $group: {
            _id: '$level',
            value: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            value: 1,
          },
        },
      ]),

      // -------------------------------------
      // Issues by Status
      // -------------------------------------
      this.issueModel.aggregate([
        {
          $group: {
            _id: '$status',
            value: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            value: 1,
          },
        },
      ]),

      // -------------------------------------
      // Sprint Status
      // -------------------------------------
      this.sprintModel.aggregate([
        {
          $group: {
            _id: '$status',
            value: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            value: 1,
          },
        },
      ]),

      // -------------------------------------
      // Project Completion Buckets
      // -------------------------------------
      this.projectModel.aggregate([
        {
          $bucket: {
            groupBy: '$completionPercentage',
            boundaries: [0, 20, 40, 60, 80, 101],
            default: 'Unknown',

            output: {
              value: {
                $sum: 1,
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            range: '$_id',
            value: 1,
          },
        },
      ]),
    ]);

    return {
      projectStatus,

      monthlyProjects: projectMonthly,

      taskStatus,

      riskLevels,

      issueStatus,

      sprintStatus,

      completionDistribution,
    };
  }

  async getProjectDashboard(projectId: string) {
    const [
      project,
      sprintSummary,
      taskSummary,
      riskSummary,
      issueSummary,
      overdueTasks,
      activeSprint,
    ] = await Promise.all([
      this.projectModel.findById(projectId),

      //----------------------------------------
      // Sprint Summary
      //----------------------------------------

      this.sprintModel.aggregate([
        {
          $match: {
            projectId,
          },
        },
        {
          $group: {
            _id: null,

            total: {
              $sum: 1,
            },

            active: {
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

            completed: {
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
          },
        },
      ]),

      //----------------------------------------
      // Task Summary
      //----------------------------------------

      this.taskModel.aggregate([
        {
          $match: {
            projectId,
          },
        },
        {
          $group: {
            _id: '$status',

            count: {
              $sum: 1,
            },
          },
        },
      ]),

      //----------------------------------------
      // Risk Summary
      //----------------------------------------

      this.riskModel.aggregate([
        {
          $match: {
            projectId,
          },
        },
        {
          $group: {
            _id: '$level',

            count: {
              $sum: 1,
            },
          },
        },
      ]),

      //----------------------------------------
      // Issue Summary
      //----------------------------------------

      this.issueModel.aggregate([
        {
          $match: {
            projectId,
          },
        },
        {
          $group: {
            _id: '$status',

            count: {
              $sum: 1,
            },
          },
        },
      ]),

      //----------------------------------------
      // Overdue Tasks
      //----------------------------------------

      this.taskModel.countDocuments({
        projectId,

        dueDate: {
          $lt: new Date(),
        },

        status: {
          $ne: TaskStatus.DONE,
        },
      }),

      //----------------------------------------
      // Active Sprint
      //----------------------------------------

      this.sprintModel.findOne({
        projectId: new (require('mongoose').Types.ObjectId)(projectId),

        status: 'ACTIVE' as any,
      }),
    ]);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    //----------------------------------------
    // Calculate Performance Score
    //----------------------------------------

    const completion = project.completionPercentage || 0;

    const highRisks = riskSummary.find((x) => x._id === 'HIGH')?.count || 0;

    const openIssues = issueSummary.find((x) => x._id === 'OPEN')?.count || 0;

    let score = completion;

    score -= highRisks * 5;

    score -= openIssues * 3;

    score -= overdueTasks * 2;

    score = Math.max(0, Math.min(100, score));

    return {
      project,

      progress: {
        completion: project.completionPercentage,
      },

      timeline: {
        startDate: project.startDate,

        endDate: project.endDate,
      },

      sprints: sprintSummary[0] || {
        total: 0,
        active: 0,
        completed: 0,
      },

      taskStatus: taskSummary,

      risks: riskSummary,

      issues: issueSummary,

      overdueTasks,

      activeSprint,

      performanceScore: score,
    };
  }

  async getManagerDashboard(managerId: string) {
    const [
      projectSummary,
      sprintSummary,
      taskSummary,
      riskSummary,
      issueSummary,
      projects,
    ] = await Promise.all([
      //----------------------------------------
      // Projects
      //----------------------------------------
      this.projectModel.aggregate([
        {
          $match: {
            managerId,
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: null,

            totalProjects: {
              $sum: 1,
            },

            activeProjects: {
              $sum: {
                $cond: [{ $eq: ['$status', 'ACTIVE'] }, 1, 0],
              },
            },

            completedProjects: {
              $sum: {
                $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0],
              },
            },

            planningProjects: {
              $sum: {
                $cond: [{ $eq: ['$status', 'PLANNING'] }, 1, 0],
              },
            },

            onHoldProjects: {
              $sum: {
                $cond: [{ $eq: ['$status', 'ON_HOLD'] }, 1, 0],
              },
            },

            averageCompletion: {
              $avg: '$completionPercentage',
            },

            projectIds: {
              $push: '$_id',
            },
          },
        },
      ]),

      //----------------------------------------
      // Sprint Summary
      //----------------------------------------
      this.sprintModel.aggregate([
        {
          $lookup: {
            from: 'projects',
            localField: 'projectId',
            foreignField: '_id',
            as: 'project',
          },
        },
        {
          $unwind: '$project',
        },
        {
          $match: {
            'project.managerId': managerId,
          },
        },
        {
          $group: {
            _id: null,

            totalSprints: {
              $sum: 1,
            },

            activeSprints: {
              $sum: {
                $cond: [{ $eq: ['$status', 'ACTIVE'] }, 1, 0],
              },
            },

            completedSprints: {
              $sum: {
                $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0],
              },
            },
          },
        },
      ]),

      //----------------------------------------
      // Tasks
      //----------------------------------------
      this.taskModel.aggregate([
        {
          $lookup: {
            from: 'projects',
            localField: 'projectId',
            foreignField: '_id',
            as: 'project',
          },
        },
        {
          $unwind: '$project',
        },
        {
          $match: {
            'project.managerId': managerId,
          },
        },
        {
          $group: {
            _id: '$status',

            count: {
              $sum: 1,
            },
          },
        },
      ]),

      //----------------------------------------
      // Risks
      //----------------------------------------
      this.riskModel.aggregate([
        {
          $lookup: {
            from: 'projects',
            localField: 'projectId',
            foreignField: '_id',
            as: 'project',
          },
        },
        {
          $unwind: '$project',
        },
        {
          $match: {
            'project.managerId': managerId,
          },
        },
        {
          $group: {
            _id: '$level',

            count: {
              $sum: 1,
            },
          },
        },
      ]),

      //----------------------------------------
      // Issues
      //----------------------------------------
      this.issueModel.aggregate([
        {
          $lookup: {
            from: 'projects',
            localField: 'projectId',
            foreignField: '_id',
            as: 'project',
          },
        },
        {
          $unwind: '$project',
        },
        {
          $match: {
            'project.managerId': managerId,
          },
        },
        {
          $group: {
            _id: '$status',

            count: {
              $sum: 1,
            },
          },
        },
      ]),

      //----------------------------------------
      // Project Cards
      //----------------------------------------
      this.projectModel.find(
        {
          managerId,
          isDeleted: false,
        },
        {
          name: 1,
          projectId: 1,
          status: 1,
          completionPercentage: 1,
          startDate: 1,
          endDate: 1,
        },
      ),
    ]);

    const project = projectSummary[0] || {};

    //----------------------------------------
    // Calculate KPIs
    //----------------------------------------

    const highRisks = riskSummary.find((r) => r._id === 'HIGH')?.count || 0;

    const openIssues = issueSummary.find((i) => i._id === 'OPEN')?.count || 0;

    const completedTasks =
      taskSummary.find((t) => t._id === 'DONE')?.count || 0;

    const totalTasks = taskSummary.reduce((sum, t) => sum + t.count, 0);

    const taskCompletion =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    let performance =
      (project.averageCompletion || 0) * 0.5 + taskCompletion * 0.5;

    performance -= highRisks * 2;

    performance -= openIssues;

    performance = Math.max(0, Math.min(100, performance));

    return {
      managerId,

      projects: {
        total: project.totalProjects || 0,

        active: project.activeProjects || 0,

        completed: project.completedProjects || 0,

        planning: project.planningProjects || 0,

        onHold: project.onHoldProjects || 0,

        averageCompletion: Number((project.averageCompletion || 0).toFixed(2)),
      },

      sprints: sprintSummary[0] || {
        totalSprints: 0,
        activeSprints: 0,
        completedSprints: 0,
      },

      taskStatus: taskSummary,

      risks: riskSummary,

      issues: issueSummary,

      performanceScore: Number(performance.toFixed(2)),

      projectList: projects,
    };
  }

  async getTeamDashboard(userId: string) {
    const [
      taskSummary,
      issueSummary,
      riskSummary,
      activeSprint,
      recentTasks,
      projectCount,
    ] = await Promise.all([
      //----------------------------------------
      // Task Summary
      //----------------------------------------
      this.taskModel.aggregate([
        {
          $match: {
            assignedTo: userId,
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: '$status',

            count: {
              $sum: 1,
            },
          },
        },
      ]),

      //----------------------------------------
      // Issue Summary
      //----------------------------------------
      this.issueModel.aggregate([
        {
          $match: {
            assignedTo: userId,
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: '$status',

            count: {
              $sum: 1,
            },
          },
        },
      ]),

      //----------------------------------------
      // Risk Summary
      //----------------------------------------
      this.riskModel.aggregate([
        {
          $match: {
            assignedTo: userId,
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: '$level',

            count: {
              $sum: 1,
            },
          },
        },
      ]),

      //----------------------------------------
      // Active Sprint
      //----------------------------------------
      this.sprintModel.aggregate([
        {
          $lookup: {
            from: 'tasks',
            localField: '_id',
            foreignField: 'sprintId',
            as: 'tasks',
          },
        },
        {
          $match: {
            status: 'ACTIVE',
            'tasks.assignedTo': userId,
          },
        },
        {
          $project: {
            name: 1,
            sprintId: 1,
            startDate: 1,
            endDate: 1,
          },
        },
      ]),

      //----------------------------------------
      // Recent Tasks
      //----------------------------------------
      this.taskModel
        .find(
          {
            assignedTo: userId,
            isDeleted: false,
          },
          {
            taskId: 1,
            title: 1,
            status: 1,
            priority: 1,
            dueDate: 1,
            projectId: 1,
          },
        )
        .sort({
          updatedAt: -1,
        })
        .limit(10),

      //----------------------------------------
      // Distinct Projects
      //----------------------------------------
      this.taskModel.distinct('projectId', {
        assignedTo: userId,
        isDeleted: false,
      }),
    ]);

    //----------------------------------------
    // KPI Calculations
    //----------------------------------------

    const totalTasks = taskSummary.reduce((sum, item) => sum + item.count, 0);

    const completedTasks =
      taskSummary.find((t) => t._id === 'DONE')?.count || 0;

    const inProgress =
      taskSummary.find((t) => t._id === 'IN_PROGRESS')?.count || 0;

    const todo = taskSummary.find((t) => t._id === 'TODO')?.count || 0;

    const openIssues = issueSummary.find((i) => i._id === 'OPEN')?.count || 0;

    const resolvedIssues =
      issueSummary.find((i) => i._id === 'RESOLVED')?.count || 0;

    const highRisks = riskSummary.find((r) => r._id === 'HIGH')?.count || 0;

    const overdueTasks = await this.taskModel.countDocuments({
      assignedTo: new Types.ObjectId(userId),
      isDeleted: false,

      dueDate: {
        $lt: new Date(),
      },

      status: {
        $ne: TaskStatus.DONE,
      },
    });

    const completionRate =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    //----------------------------------------
    // Personal Performance Score
    //----------------------------------------

    let performance = completionRate;

    performance -= overdueTasks * 3;

    performance -= openIssues * 2;

    performance -= highRisks * 2;

    performance = Math.max(0, Math.min(100, performance));

    return {
      userId,

      tasks: {
        total: totalTasks,
        completed: completedTasks,
        inProgress,
        todo,
        overdue: overdueTasks,
        completionRate: Number(completionRate.toFixed(2)),
      },

      issues: {
        total: issueSummary.reduce((sum, i) => sum + i.count, 0),

        open: openIssues,

        resolved: resolvedIssues,

        details: issueSummary,
      },

      risks: {
        total: riskSummary.reduce((sum, r) => sum + r.count, 0),

        high: highRisks,

        details: riskSummary,
      },

      activeSprint: activeSprint[0] || null,

      totalProjects: projectCount.length,

      performanceScore: Number(performance.toFixed(2)),

      recentTasks,
    };
  }

  async getRiskAnalysis() {
    const [
      risksByLevel,
      risksByStatus,
      projectRiskRanking,
      taskRiskRanking,
      monthlyRisks,
      unresolvedRisks,
      mitigationCoverage,
    ] = await Promise.all([
      /**
       * Risks grouped by severity
       */
      this.riskModel.aggregate([
        {
          $match: {
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: '$level',
            total: { $sum: 1 },
          },
        },
        {
          $sort: {
            total: -1,
          },
        },
      ]),

      /**
       * Risks grouped by status
       */
      this.riskModel.aggregate([
        {
          $match: {
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: '$status',
            total: { $sum: 1 },
          },
        },
      ]),

      /**
       * Projects with highest risk count
       */
      this.riskModel.aggregate([
        {
          $match: {
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: '$projectId',
            totalRisks: {
              $sum: 1,
            },
            highRisks: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$level', 'HIGH'],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $lookup: {
            from: 'projects',
            localField: '_id',
            foreignField: '_id',
            as: 'project',
          },
        },
        {
          $unwind: {
            path: '$project',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            projectId: '$project.projectId',
            projectName: '$project.name',
            totalRisks: 1,
            highRisks: 1,
          },
        },
        {
          $sort: {
            totalRisks: -1,
          },
        },
        {
          $limit: 10,
        },
      ]),

      /**
       * Tasks with highest risk count
       */
      this.riskModel.aggregate([
        {
          $match: {
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: '$taskId',
            totalRisks: {
              $sum: 1,
            },
          },
        },
        {
          $lookup: {
            from: 'tasks',
            localField: '_id',
            foreignField: '_id',
            as: 'task',
          },
        },
        {
          $unwind: {
            path: '$task',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            taskName: '$task.title',
            taskId: '$task.taskId',
            totalRisks: 1,
          },
        },
        {
          $sort: {
            totalRisks: -1,
          },
        },
        {
          $limit: 10,
        },
      ]),

      /**
       * Risks created each month
       */
      this.riskModel.aggregate([
        {
          $match: {
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: {
              year: {
                $year: '$createdAt',
              },
              month: {
                $month: '$createdAt',
              },
            },
            total: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            '_id.year': 1,
            '_id.month': 1,
          },
        },
      ]),

      /**
       * Open Risks
       */
      this.riskModel.countDocuments({
        isDeleted: false,
        status: { $ne: 'RESOLVED' as any },
      } as any),

      /**
       * Risks having mitigation plan
       */
      this.riskModel.aggregate([
        {
          $match: {
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: 1,
            },
            withPlan: {
              $sum: {
                $cond: [
                  {
                    $gt: [
                      {
                        $strLenCP: {
                          $ifNull: ['$mitigationPlan', ''],
                        },
                      },
                      0,
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            total: 1,
            withPlan: 1,
            percentage: {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: ['$withPlan', '$total'],
                    },
                    100,
                  ],
                },
                1,
              ],
            },
          },
        },
      ]),
    ]);

    return {
      summary: {
        totalRisks: await this.riskModel.countDocuments({
          isDeleted: false,
        }),

        unresolvedRisks,

        highRiskCount: risksByLevel.find((r) => r._id === 'HIGH')?.total || 0,
      },

      risksByLevel,

      risksByStatus,

      projectRiskRanking,

      taskRiskRanking,

      monthlyRisks,

      mitigationCoverage: mitigationCoverage[0] || {
        total: 0,
        withPlan: 0,
        percentage: 0,
      },
    };
  }

  async getPerformance() {
    const [
      projectPerformance,
      sprintPerformance,
      taskPerformance,
      issuePerformance,
      riskPerformance,
      averageProjectDuration,
    ] = await Promise.all([
      /**
       * -----------------------------
       * Project Performance
       * -----------------------------
       */
      this.projectModel.aggregate([
        {
          $match: {
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: null,

            totalProjects: {
              $sum: 1,
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

            averageCompletion: {
              $avg: '$completionPercentage',
            },
          },
        },
        {
          $project: {
            _id: 0,

            totalProjects: 1,

            completedProjects: 1,

            averageCompletion: {
              $round: ['$averageCompletion', 1],
            },

            completionRate: {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: ['$completedProjects', '$totalProjects'],
                    },
                    100,
                  ],
                },
                1,
              ],
            },
          },
        },
      ]),

      /**
       * -----------------------------
       * Sprint Performance
       * -----------------------------
       */
      this.sprintModel.aggregate([
        {
          $match: {
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: null,

            totalSprints: {
              $sum: 1,
            },

            completedSprints: {
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
          },
        },
        {
          $project: {
            _id: 0,

            totalSprints: 1,

            completedSprints: 1,

            completionRate: {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: ['$completedSprints', '$totalSprints'],
                    },
                    100,
                  ],
                },
                1,
              ],
            },
          },
        },
      ]),

      /**
       * -----------------------------
       * Task Performance
       * -----------------------------
       */
      this.taskModel.aggregate([
        {
          $match: {
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: null,

            totalTasks: {
              $sum: 1,
            },

            completedTasks: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$status', 'DONE'],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,

            totalTasks: 1,

            completedTasks: 1,

            completionRate: {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: ['$completedTasks', '$totalTasks'],
                    },
                    100,
                  ],
                },
                1,
              ],
            },
          },
        },
      ]),

      /**
       * -----------------------------
       * Issue Resolution
       * -----------------------------
       */
      this.issueModel.aggregate([
        {
          $match: {
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: null,

            totalIssues: {
              $sum: 1,
            },

            resolvedIssues: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$status', 'RESOLVED'],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,

            totalIssues: 1,

            resolvedIssues: 1,

            resolutionRate: {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: ['$resolvedIssues', '$totalIssues'],
                    },
                    100,
                  ],
                },
                1,
              ],
            },
          },
        },
      ]),

      /**
       * -----------------------------
       * Risk Mitigation
       * -----------------------------
       */
      this.riskModel.aggregate([
        {
          $match: {
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: null,

            totalRisks: {
              $sum: 1,
            },

            mitigatedRisks: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$status', 'MITIGATED'],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,

            totalRisks: 1,

            mitigatedRisks: 1,

            mitigationRate: {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: ['$mitigatedRisks', '$totalRisks'],
                    },
                    100,
                  ],
                },
                1,
              ],
            },
          },
        },
      ]),

      /**
       * -----------------------------
       * Average Project Duration
       * -----------------------------
       */
      this.projectModel.aggregate([
        {
          $match: {
            isDeleted: false,
            startDate: {
              $exists: true,
            },
            endDate: {
              $exists: true,
            },
          },
        },
        {
          $project: {
            duration: {
              $dateDiff: {
                startDate: '$startDate',
                endDate: '$endDate',
                unit: 'day',
              },
            },
          },
        },
        {
          $group: {
            _id: null,

            averageDuration: {
              $avg: '$duration',
            },
          },
        },
        {
          $project: {
            _id: 0,

            averageDuration: {
              $round: ['$averageDuration', 1],
            },
          },
        },
      ]),
    ]);

    return {
      projects: projectPerformance[0] || {},

      sprints: sprintPerformance[0] || {},

      tasks: taskPerformance[0] || {},

      issues: issuePerformance[0] || {},

      risks: riskPerformance[0] || {},

      averageProjectDuration: averageProjectDuration[0]?.averageDuration || 0,
    };
  }

  async getTrends() {
    const [
      projectTrend,
      taskTrend,
      issueTrend,
      riskTrend,
      completionTrend,
      sprintTrend,
    ] = await Promise.all([
      /**
       * ----------------------------------------
       * Projects Created Per Month
       * ----------------------------------------
       */
      this.projectModel.aggregate([
        {
          $match: {
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            totalProjects: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            '_id.year': 1,
            '_id.month': 1,
          },
        },
      ]),

      /**
       * ----------------------------------------
       * Tasks Created Per Month
       * ----------------------------------------
       */
      this.taskModel.aggregate([
        {
          $match: {
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            totalTasks: {
              $sum: 1,
            },
            completedTasks: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$status', 'DONE'],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $sort: {
            '_id.year': 1,
            '_id.month': 1,
          },
        },
      ]),

      /**
       * ----------------------------------------
       * Issues Per Month
       * ----------------------------------------
       */
      this.issueModel.aggregate([
        {
          $match: {
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            totalIssues: {
              $sum: 1,
            },
            resolved: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$status', 'RESOLVED'],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $sort: {
            '_id.year': 1,
            '_id.month': 1,
          },
        },
      ]),

      /**
       * ----------------------------------------
       * Risks Per Month
       * ----------------------------------------
       */
      this.riskModel.aggregate([
        {
          $match: {
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            totalRisks: {
              $sum: 1,
            },
            highRisks: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$level', 'HIGH'],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $sort: {
            '_id.year': 1,
            '_id.month': 1,
          },
        },
      ]),

      /**
       * ----------------------------------------
       * Average Project Completion
       * ----------------------------------------
       */
      this.projectModel.aggregate([
        {
          $match: {
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            averageCompletion: {
              $avg: '$completionPercentage',
            },
          },
        },
        {
          $project: {
            averageCompletion: {
              $round: ['$averageCompletion', 1],
            },
          },
        },
        {
          $sort: {
            '_id.year': 1,
            '_id.month': 1,
          },
        },
      ]),

      /**
       * ----------------------------------------
       * Sprint Completion Trend
       * ----------------------------------------
       */
      this.sprintModel.aggregate([
        {
          $match: {
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            totalSprints: {
              $sum: 1,
            },
            completed: {
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
          },
        },
        {
          $sort: {
            '_id.year': 1,
            '_id.month': 1,
          },
        },
      ]),
    ]);

    return {
      projects: projectTrend,

      tasks: taskTrend,

      issues: issueTrend,

      risks: riskTrend,

      completion: completionTrend,

      sprints: sprintTrend,
    };
  }
}
