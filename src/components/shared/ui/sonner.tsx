'use client';

import { useTheme } from '@wrksz/themes/client';
import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  const { resolvedTheme, theme } = useTheme();
  const currentTheme = (resolvedTheme ?? theme ?? 'light') as 'light' | 'dark';

  return (
    <SonnerToaster
      theme={currentTheme}
      position="top-center"
      offset={{ top: '78px' }}
      mobileOffset={{ top: '74px', left: '12px', right: '12px' }}
      gap={12}
      visibleToasts={3}
      swipeDirections={['top', 'left', 'right']}
      toastOptions={{
        classNames: {
          toast: 'sonner-toast',
          title: 'sonner-toast-title',
          description: 'sonner-toast-description',
          actionButton: 'sonner-toast-action',
          cancelButton: 'sonner-toast-cancel',
          icon: 'sonner-toast-icon',
          success: 'sonner-toast-success',
          error: 'sonner-toast-error',
          warning: 'sonner-toast-warning',
          info: 'sonner-toast-info',
          loading: 'sonner-toast-loading',
        },
      }}
    />
  );
}
