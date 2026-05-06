'use server';

import { query } from '@/lib/vendure/api';
import { AddToCartMutation } from '@/lib/vendure/mutations';
import { getAuthToken } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function addToCart(variantId: string, quantity: number = 1) {
  try {
    const token = await getAuthToken();
    const result = await query(AddToCartMutation, { variantId, quantity }, { token });
    const order = result.data?.addItemToOrder;
    if (!order) return { error: 'failedAddToCart' };
    if ('errorCode' in order) return { error: 'failedAddToCart' };
    revalidatePath('/cart');
    return { success: true };
  } catch {
    return { error: 'failedAddToCart' };
  }
}
