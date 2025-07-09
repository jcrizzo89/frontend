export enum UserRole {
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  VENDEDOR = 'vendedor',
  REPARTIDOR = 'repartidor',
  INVENTARIO = 'inventario',
  CLIENTE = 'cliente'
}

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: UserRole;
  avatar?: string;
  telefono?: string;
  activo: boolean;
  fechaCreacion: Date;
  ultimoAcceso?: Date;
  notificaciones: number;
  preferencias: {
    tema: 'claro' | 'oscuro' | 'sistema';
    notificaciones: boolean;
    idioma: 'es' | 'en';
  };
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  rol?: UserRole;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserProfile extends Omit<User, 'password'> {
  // Información adicional del perfil
  direccion?: string;
  fechaNacimiento?: Date;
  genero?: 'masculino' | 'femenino' | 'otro' | 'prefiero_no_decirlo';
  documentoIdentidad?: string;
}
