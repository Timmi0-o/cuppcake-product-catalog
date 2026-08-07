import { CredentialsSignin } from 'next-auth';
import type { IAuthSignInErrorCode } from '../constants/auth-sign-in-error-messages';

export class AuthSignInError extends CredentialsSignin {
  code: IAuthSignInErrorCode;

  constructor(code: IAuthSignInErrorCode) {
    super();
    this.code = code;
  }
}
