export interface User {
  name: string;
  email: string;
  provider: string;
  photo: string;
  email_verified: boolean;
  email_verification_token: string | null;
  email_verification_token_expires_at: Date | null;
  password_reset_token: string | null;
  password_reset_token_expires_at: Date | null;
  password_digest: string;
  created_at: Date;
  updated_at: Date;
}
