import { useMediaQuery } from "@uidotdev/usehooks";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "./ui/drawer";
import { ReactNode } from "react";

interface ResponsiveModalProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export const ResponsiveModal = ({
  children,
  onOpenChange,
  open,
}: ResponsiveModalProps) => {
  // const isDesktop = useMedia("(min-width: 1024px)", true);
  const isDesktop = useMediaQuery("only screen and (min-width : 120px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]">
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className=" overflow-y-auto hide-scrollbar max-h-[85vh]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
