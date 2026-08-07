"use client";

import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BottomSheet } from "@/components/shared/ui/bottom-sheet";
import { Dialog } from "@/components/shared/ui/dialog";
import { useMediaQuery } from "@/hooks/use-media-query";

const DEFAULT_MOBILE_MEDIA_QUERY = "(max-width: 1024px)";

type AdaptiveDialogContextValue = {
  isMobile: boolean;
};

const AdaptiveDialogContext = createContext<AdaptiveDialogContextValue | null>(
  null,
);

const useAdaptiveDialog = (): AdaptiveDialogContextValue => {
  const context = useContext(AdaptiveDialogContext);

  if (!context) {
    throw new Error(
      "AdaptiveDialog compound components must be used within AdaptiveDialog",
    );
  }

  return context;
};

type AdaptiveDialogRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  mediaQuery?: string;
  dismissible?: boolean;
  shouldScaleBackground?: boolean;
  repositionInputs?: boolean;
};

function AdaptiveDialogRoot({
  open,
  defaultOpen,
  onOpenChange,
  children,
  mediaQuery = DEFAULT_MOBILE_MEDIA_QUERY,
  dismissible,
  shouldScaleBackground,
  repositionInputs,
}: AdaptiveDialogRootProps) {
  const isMobile = useMediaQuery(mediaQuery);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const contextValue = useMemo(
    () => ({
      isMobile,
    }),
    [isMobile],
  );

  if (!hasMounted) {
    return null;
  }

  const handleOpenChange = (isNextOpen: boolean) => {
    onOpenChange?.(isNextOpen);
  };

  return (
    <AdaptiveDialogContext.Provider value={contextValue}>
      {isMobile ? (
        <BottomSheet
          open={open}
          onOpenChange={handleOpenChange}
          dismissible={dismissible}
          shouldScaleBackground={shouldScaleBackground}
          repositionInputs={repositionInputs}
        >
          {children}
        </BottomSheet>
      ) : (
        <Dialog
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={handleOpenChange}
        >
          {children}
        </Dialog>
      )}
    </AdaptiveDialogContext.Provider>
  );
}

type AdaptiveDialogContentProps = {
  className?: string;
  children?: ReactNode;
  showCloseButton?: boolean;
};

function AdaptiveDialogContent({
  showCloseButton,
  className,
  children,
}: AdaptiveDialogContentProps) {
  const { isMobile } = useAdaptiveDialog();

  if (isMobile) {
    return (
      <BottomSheet.Content
        showCloseButton={showCloseButton}
        className={className}
      >
        {children}
      </BottomSheet.Content>
    );
  }

  return (
    <Dialog.Content showCloseButton={showCloseButton} className={className}>
      {children}
    </Dialog.Content>
  );
}

type AdaptiveDialogHeaderProps = {
  className?: string;
  children?: ReactNode;
};

function AdaptiveDialogHeader({
  className,
  children,
}: AdaptiveDialogHeaderProps) {
  const { isMobile } = useAdaptiveDialog();

  if (isMobile) {
    return (
      <BottomSheet.Header className={className}>{children}</BottomSheet.Header>
    );
  }

  return <Dialog.Header className={className}>{children}</Dialog.Header>;
}

type AdaptiveDialogFooterProps = {
  className?: string;
  children?: ReactNode;
  showCloseButton?: boolean;
};

function AdaptiveDialogFooter({
  className,
  children,
  showCloseButton,
}: AdaptiveDialogFooterProps) {
  const { isMobile } = useAdaptiveDialog();

  if (isMobile) {
    return (
      <BottomSheet.Footer className={className}>{children}</BottomSheet.Footer>
    );
  }

  return (
    <Dialog.Footer className={className} showCloseButton={showCloseButton}>
      {children}
    </Dialog.Footer>
  );
}

type AdaptiveDialogTitleProps = {
  className?: string;
  children?: ReactNode;
};

function AdaptiveDialogTitle({
  className,
  children,
}: AdaptiveDialogTitleProps) {
  const { isMobile } = useAdaptiveDialog();

  if (isMobile) {
    return (
      <BottomSheet.Title className={className}>{children}</BottomSheet.Title>
    );
  }

  return <Dialog.Title className={className}>{children}</Dialog.Title>;
}

type AdaptiveDialogDescriptionProps = {
  className?: string;
  children?: ReactNode;
};

function AdaptiveDialogDescription({
  className,
  children,
}: AdaptiveDialogDescriptionProps) {
  const { isMobile } = useAdaptiveDialog();

  if (isMobile) {
    return (
      <BottomSheet.Description className={className}>
        {children}
      </BottomSheet.Description>
    );
  }

  return (
    <Dialog.Description className={className}>{children}</Dialog.Description>
  );
}

function AdaptiveDialogTrigger(props: ComponentProps<typeof Dialog.Trigger>) {
  const { isMobile } = useAdaptiveDialog();

  if (isMobile) {
    return (
      <BottomSheet.Trigger
        {...(props as ComponentProps<typeof BottomSheet.Trigger>)}
      />
    );
  }

  return <Dialog.Trigger {...props} />;
}

function AdaptiveDialogClose(props: ComponentProps<typeof Dialog.Close>) {
  const { isMobile } = useAdaptiveDialog();

  if (isMobile) {
    return (
      <BottomSheet.Close
        {...(props as ComponentProps<typeof BottomSheet.Close>)}
      />
    );
  }

  return <Dialog.Close {...props} />;
}

type AdaptiveDialogComponent = typeof AdaptiveDialogRoot & {
  Trigger: typeof AdaptiveDialogTrigger;
  Close: typeof AdaptiveDialogClose;
  Content: typeof AdaptiveDialogContent;
  Header: typeof AdaptiveDialogHeader;
  Footer: typeof AdaptiveDialogFooter;
  Title: typeof AdaptiveDialogTitle;
  Description: typeof AdaptiveDialogDescription;
};

const AdaptiveDialog = Object.assign(AdaptiveDialogRoot, {
  Trigger: AdaptiveDialogTrigger,
  Close: AdaptiveDialogClose,
  Content: AdaptiveDialogContent,
  Header: AdaptiveDialogHeader,
  Footer: AdaptiveDialogFooter,
  Title: AdaptiveDialogTitle,
  Description: AdaptiveDialogDescription,
}) as AdaptiveDialogComponent;

export { AdaptiveDialog, useAdaptiveDialog };
