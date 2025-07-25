export interface MyTokenPayload {
    id: number;
    username: string;
    name: string;
    profileImage?: string;
    iat?: number;
    exp?: number;
  }