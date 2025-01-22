import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TOUPolicy } from "@/components/legal/tou-policy";
import {
  Dialog,
  DialogClose,
  DialogContent,

  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
export function TOUDialog() {
  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button>BrandHook Discover Terms of Use</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>BrandHook Discover Terms of Use</DialogTitle>
        </DialogHeader>
        <ScrollArea className="w-[1200] h-96">
          <TOUPolicy />
        </ScrollArea>
              <DialogFooter>
                  <DialogClose>
                      <Button type="submit">I have read and understand this policy</Button>
                  </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
