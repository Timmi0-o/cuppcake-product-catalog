'use client';

import { AdaptiveDialog } from '@/components/shared/components/adaptive-dialog/adaptive-dialog';
import { Button } from '@/components/shared/ui/button';
import { cn } from '@/lib/utils';

export interface IConfirmationModalOptions {
  title: string;
  description: string;
  primaryLabel: string;
  cancelLabel: string;
  variant?: 'default' | 'destructive';
}

interface IConfirmationModalProps {
  isOpen: boolean;
  isPending: boolean;
  options: IConfirmationModalOptions | null;
  onConfirm: () => void;
  onCancel: () => void;
}

interface IActionsProps {
  options: IConfirmationModalOptions;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const Actions = ({
  options,
  isPending,
  onConfirm,
  onCancel,
}: IActionsProps) => (
  <>
    <Button variant="outline" disabled={isPending} onClick={onCancel}>
      {options.cancelLabel}
    </Button>
    <Button
      variant={options.variant === 'destructive' ? 'outline' : 'default'}
      className={cn(
        options.variant === 'destructive' &&
          'border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive',
      )}
      disabled={isPending}
      onClick={onConfirm}
    >
      {options.primaryLabel}
    </Button>
  </>
);

export const ConfirmationModal = ({
  isOpen,
  isPending,
  options,
  onConfirm,
  onCancel,
}: IConfirmationModalProps) => {
  if (!options) {
    return null;
  }

  const handleOpenChange = (isNextOpen: boolean) => {
    if (!isNextOpen && !isPending) {
      onCancel();
    }
  };

  return (
    <AdaptiveDialog
      open={isOpen}
      onOpenChange={handleOpenChange}
      dismissible={!isPending}
    >
      <AdaptiveDialog.Content showCloseButton={false} className="sm:max-w-md">
        <AdaptiveDialog.Header className="pr-0">
          <AdaptiveDialog.Title>{options.title}</AdaptiveDialog.Title>
          <AdaptiveDialog.Description>
            {options.description}
          </AdaptiveDialog.Description>
        </AdaptiveDialog.Header>
        <AdaptiveDialog.Footer className="border-t-0 bg-transparent pt-2">
          <Actions
            options={options}
            isPending={isPending}
            onConfirm={onConfirm}
            onCancel={onCancel}
          />
        </AdaptiveDialog.Footer>
      </AdaptiveDialog.Content>
    </AdaptiveDialog>
  );
};
