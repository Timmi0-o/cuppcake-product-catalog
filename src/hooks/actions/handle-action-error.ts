import type { IAppActionResponse } from '@/contracts/api-response/types';
import { toast } from 'sonner';

export const handleActionError = (
  response: IAppActionResponse<unknown>,
  fallbackMessage: string,
) => {
  if (response.error) {
    toast.error(fallbackMessage, { description: response.error.message });
    throw new Error(response.error.message);
  }
};
