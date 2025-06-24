

export interface SignupPayload {
  email?: string | undefined;
  password?: string | undefined;
  displayName?: string | undefined;
}

export interface SignupResult {
  success: boolean;
  userId?: string;
  error?: string;
}

export interface TokenPayload {
  userId: string;
}
