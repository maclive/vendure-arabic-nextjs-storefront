'use server';

import { query } from '@/lib/vendure/api';
import { RegisterCustomerAccountMutation } from '@/lib/vendure/mutations';

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!email || !firstName || !lastName || !password) return { error: 'fieldsRequired' };
  if (password !== confirmPassword) return { error: 'passwordsMismatch' };

  try {
    const result = await query(RegisterCustomerAccountMutation, {
      input: { emailAddress: email, firstName, lastName, password },
    });
    const reg = result.data?.registerCustomerAccount;
    if (!reg) return { error: 'unexpectedError' };
    if (reg.__typename === 'Success') return { success: true };
    return { error: 'unexpectedError' };
  } catch {
    return { error: 'unexpectedError' };
  }
}
