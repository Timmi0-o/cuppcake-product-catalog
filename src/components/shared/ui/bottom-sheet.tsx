"use client";

import { XIcon } from "lucide-react";
import type * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { Button } from "@/components/shared/ui/button";
import { cn } from "@/lib/utils";

function BottomSheetRoot({
  shouldScaleBackground = false,
  repositionInputs = false,
  fixed = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return (
    <DrawerPrimitive.Root
      data-slot="bottom-sheet"
      shouldScaleBackground={shouldScaleBackground}
      repositionInputs={repositionInputs}
      fixed={fixed}
      {...props}
    />
  );
}

function BottomSheetTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return (
    <DrawerPrimitive.Trigger data-slot="bottom-sheet-trigger" {...props} />
  );
}

function BottomSheetPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="bottom-sheet-portal" {...props} />;
}

function BottomSheetClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="bottom-sheet-close" {...props} />;
}

function BottomSheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="bottom-sheet-overlay"
      className={cn("fixed inset-0 z-50 bg-black/40", className)}
      {...props}
    />
  );
}

function BottomSheetContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <BottomSheetPortal>
      <BottomSheetOverlay />
      <DrawerPrimitive.Content
        data-slot="bottom-sheet-content"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex h-auto max-h-[min(92dvh,100%)] flex-col overflow-hidden rounded-t-2xl border border-border bg-card text-card-foreground outline-none",
          className,
        )}
        {...props}
      >
        <DrawerPrimitive.Handle className="mx-auto mt-3 mb-1 h-1 w-10 shrink-0 rounded-full bg-muted-foreground/30" />

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {children}
        </div>

        {showCloseButton ? (
          <DrawerPrimitive.Close asChild>
            <Button
              variant="ghost"
              className="absolute top-3 right-3 size-8"
              size="icon"
              aria-label="Close"
            >
              <XIcon />
            </Button>
          </DrawerPrimitive.Close>
        ) : null}
      </DrawerPrimitive.Content>
    </BottomSheetPortal>
  );
}

function BottomSheetHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bottom-sheet-header"
      className={cn("flex flex-col gap-1.5 pr-8", className)}
      {...props}
    />
  );
}

function BottomSheetFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bottom-sheet-footer"
      className={cn(
        "mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function BottomSheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="bottom-sheet-title"
      className={cn(
        "font-display text-lg font-semibold leading-none text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function BottomSheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="bottom-sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

type BottomSheetComponent = typeof BottomSheetRoot & {
  Trigger: typeof BottomSheetTrigger;
  Portal: typeof BottomSheetPortal;
  Close: typeof BottomSheetClose;
  Overlay: typeof BottomSheetOverlay;
  Content: typeof BottomSheetContent;
  Header: typeof BottomSheetHeader;
  Footer: typeof BottomSheetFooter;
  Title: typeof BottomSheetTitle;
  Description: typeof BottomSheetDescription;
};

const BottomSheet = Object.assign(BottomSheetRoot, {
  Trigger: BottomSheetTrigger,
  Portal: BottomSheetPortal,
  Close: BottomSheetClose,
  Overlay: BottomSheetOverlay,
  Content: BottomSheetContent,
  Header: BottomSheetHeader,
  Footer: BottomSheetFooter,
  Title: BottomSheetTitle,
  Description: BottomSheetDescription,
}) as BottomSheetComponent;

export { BottomSheet };
