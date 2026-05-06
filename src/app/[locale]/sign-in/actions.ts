'use server';

import { query } from '@/lib/vendure/api';
import { LoginMutation, LogoutMutation } from '@/lib/vendure/mutations';
import { setAuthToken, removeAuthToken } from '@/lib/auth';

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) return { error: 'emailPasswordRequired' };

  try {
    const result = await query(LoginMutation, { username: email, password });
    const login = result.data?.login;
    if (!login) return { error: 'unexpectedError' };

    if (login.__typename === 'CurrentUser') {
      if (result.token) await setAuthToken(result.token);
      return { success: true };
    }

    if ('errorCode' in login) {
      if (login.errorCode === 'NOT_VERIFIED_ERROR') return { error: 'verifyEmailFirst' };
      return { error: 'invalidCredentials' };
    }

    return { error: 'unexpectedError' };
  } catch {
    return { error: 'unexpectedError' };
  }
}

export async function logoutAction() {
  try {
    await query(LogoutMutation, undefined);
    await removeAuthToken();
    return { success: true };
  } catch {
    return { error: 'unexpectedError' };
  }
}
