import { UserRole } from './Enums';

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  createdAt: Date;
}

export interface UserDTO {
  id: string;
  name: string;
  email?: string;
  role: string;
  created_at: number;
}

// Преобразование из DTO (БД) в модель
export function userFromDTO(dto: UserDTO): User {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    role: dto.role as UserRole,
    createdAt: new Date(dto.created_at * 1000),
  };
}

// Преобразование из модели в DTO (БД)
export function userToDTO(user: User): UserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: Math.floor(user.createdAt.getTime() / 1000),
  };
}
