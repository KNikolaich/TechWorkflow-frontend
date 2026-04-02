export interface AuthResponse {
  accessToken?: string;
  accessTokenExpiresAt?: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
}

export interface ClubDto {
  id?: string;
  name?: string;
  comment?: string;
}

export interface CreateTaskRequest {
  equipmentId?: string;
  clubId?: string;
  zoneId?: string;
  description?: string;
  executorId?: string;
  estimatedTime?: number;
  deadline?: string;
  statusText?: string;
}

export interface CreateUserRequest {
  userName?: string;
  email?: string;
  fullName?: string;
  role?: string;
  password?: string;
}

export interface EquipmentDto {
  id?: string;
  name?: string;
  comment?: string;
}

export interface LoginRequest {
  login?: string;
  password?: string;
}

export interface TaskDto {
  id?: string;
  taskNumber?: number;
  createdAt?: string;
  equipmentId?: string;
  clubId?: string;
  zoneId?: string;
  description?: string;
  executorId?: string;
  estimatedTime?: number;
  deadline?: string;
  statusText?: string;
  isArchived?: boolean;
  createdById?: string;
  updatedById?: string;
}

export interface UpdateTaskRequest {
  equipmentId?: string;
  clubId?: string;
  zoneId?: string;
  description?: string;
  executorId?: string;
  estimatedTime?: number;
  deadline?: string;
  statusText?: string;
  isArchived?: boolean;
}

export interface UpdateTaskStatusRequest {
  statusText?: string;
}

export interface UpdateUserRequest {
  email?: string;
  fullName?: string;
  isActive?: boolean;
}

export interface UpdateWorkerStatusRequest {
  status?: string;
}

export interface UpsertClubRequest {
  name?: string;
  comment?: string;
}

export interface UpsertEquipmentRequest {
  name?: string;
  comment?: string;
}

export interface UpsertZoneRequest {
  name?: string;
  comment?: string;
  clubId?: string;
}

export interface UserDto {
  id?: string;
  userName?: string;
  email?: string;
  fullName?: string;
  role?: string;
  status?: string;
  isActive?: boolean;
}

export interface ZoneDto {
  id?: string;
  name?: string;
  comment?: string;
  clubId?: string;
}
