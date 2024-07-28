import { Exclude } from 'class-transformer';
import { Dashboard, DashboardDevice } from './dashboard.entity';

export class ListDashboardSerializer implements Dashboard {
  @Exclude()
  devices: DashboardDevice[];

  name: string;
  description: string | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateDashboardSerializer implements Dashboard {
  @Exclude()
  devices: DashboardDevice[];

  name: string;
  description: string | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
export class UpsertDashboardSerializer extends CreateDashboardSerializer {}
export class UpdateDashboardSerializer extends CreateDashboardSerializer {}
export class DeleteDashboardSerializer extends CreateDashboardSerializer {}
export class GetDashboardSerializer extends CreateDashboardSerializer {}