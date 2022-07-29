export interface UserResponse {
  id: string;
  name: string;
  familyId: string;
  familyName: string;
  budget: number;
}

export interface UserRegisterResponse {
  id: string;
}

export interface UserLoginResponse {
  ok: true;
}