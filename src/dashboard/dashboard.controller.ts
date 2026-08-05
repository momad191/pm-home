import { Controller, Get, Param } from '@nestjs/common';

import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // =====================================================
  // Dashboard Overview
  // =====================================================

  @Get('overview')
  getOverview() {
    return this.dashboardService.getOverview();
  }

  // =====================================================
  // Project Health Dashboard
  // =====================================================

  @Get('project-health')
  getProjectHealth() {
    return this.dashboardService.getProjectHealth();
  }

  // =====================================================
  // Team Workload Dashboard
  // =====================================================

  @Get('workload')
  getWorkload() {
    return this.dashboardService.getWorkload();
  }

  // =====================================================
  // Executive Dashboard
  // =====================================================

  @Get('executive')
  getExecutiveDashboard() {
    return this.dashboardService.getExecutiveDashboard();
  }

  // =====================================================
  // Dashboard Charts
  // =====================================================

  @Get('charts')
  getCharts() {
    return this.dashboardService.getCharts();
  }

  // =====================================================
  // Single Project Dashboard
  // =====================================================

  @Get('project/:id')
  getProjectDashboard(@Param('id') id: string) {
    return this.dashboardService.getProjectDashboard(id);
  }

  // =====================================================
  // Manager Dashboard
  // =====================================================

  @Get('manager/:managerId')
  getManagerDashboard(@Param('managerId') managerId: string) {
    return this.dashboardService.getManagerDashboard(managerId);
  }

  // =====================================================
  // Team Dashboard
  // =====================================================

  @Get('team/:userId')
  getTeamDashboard(@Param('userId') userId: string) {
    return this.dashboardService.getTeamDashboard(userId);
  }

  // =====================================================
  // Risk Analysis Dashboard
  // =====================================================

  @Get('risk-analysis')
  getRiskAnalysis() {
    return this.dashboardService.getRiskAnalysis();
  }

  // =====================================================
  // Performance Dashboard
  // =====================================================

  @Get('performance')
  getPerformance() {
    return this.dashboardService.getPerformance();
  }

  // =====================================================
  // Trends Dashboard
  // =====================================================

  @Get('trends')
  getTrends() {
    return this.dashboardService.getTrends();
  }
}
