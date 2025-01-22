import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PrivacyPolicy } from "@/components/legal/privacy-policy";
import {
  Dialog,
  DialogClose,
  DialogContent,

  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
export function PrivacyDialog() {
  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button >BrandHook Discover Privacy Policy</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>BrandHook Discover Privacy Policy</DialogTitle>
        </DialogHeader>
        <ScrollArea className="w-[1200] h-96">
          <PrivacyPolicy />
        </ScrollArea>
              <DialogFooter>
                  <DialogClose>
                      <Button type="submit" >I have read and understand this policy</Button>
                  </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
