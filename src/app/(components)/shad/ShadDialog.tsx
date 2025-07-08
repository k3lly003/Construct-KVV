import { GenericButton } from "@/components/ui/generic-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shop } from '@/types/shop';

interface DialogDemoProps {
  shop?: Shop;
}

export function DialogDemo({ shop }: DialogDemoProps) {
  console.log('=== DialogDemo Component ===');
  console.log('Received shop prop:', shop);
  console.log('Shop name:', shop?.name);
  console.log('Shop seller businessName:', shop?.seller?.businessName);
  
  const shopName = shop?.name || shop?.seller?.businessName || 'this shop';
  return (
    <Dialog>
      <DialogTrigger asChild>
        <GenericButton variant="outline">Add review</GenericButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add your feedback for {shopName}</DialogTitle>
          <DialogDescription>
            Help {shopName} improve their products and services by your valuable insights and suggestions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rating" className="text-right">
              Rating
            </Label>
            <Input id="rating" placeholder="Ratings" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="comment" className="text-right">
              Comment
            </Label>
            <Textarea
              id="comment"
              placeholder="Type your comment here"
              className="col-span-3 min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <GenericButton type="submit">Send</GenericButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

