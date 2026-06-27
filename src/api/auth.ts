import axiosInstance from './axios';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface UserInfo {
  id: string;
  full_name: string;
  username: string;
  role: 'SUPER_ADMIN' | 'PROCURER' | 'CLIENT' | 'SELLER';
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: UserInfo;
  token: string;
}

export const loginApi = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/auth/login', payload);
  return response.data;
};
