import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ExternalLink, LinkIcon, CheckCircle } from "lucide-react";
import { useAccount } from "wagmi";
import { abstractLinkingPortal } from "../../utils/constant";

interface RequiredInfoModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isAccountLinked: boolean;
  linkedAccount?: string;
}

const RequiredInfoModal: React.FC<RequiredInfoModalProps> = ({
  isOpen,
  onOpenChange,
  isAccountLinked,
  linkedAccount,
}) => {
  const { address } = useAccount();

  const handleOpenLink = () => {
    window.open(abstractLinkingPortal, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg bg-zinc-900"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isAccountLinked ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                Linked Account Detected
              </>
            ) : (
              <>
                <LinkIcon className="w-5 h-5 text-blue-500" />
                Account Linking Required
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {isAccountLinked
              ? "Your wallet is properly linked and ready for migration"
              : "Please link your external account to continue"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {isAccountLinked ? (
            <>
              <Label className="text-sm font-medium text-gray-400">
                Migration Account
              </Label>
              <div className="p-2 rounded-lg">
                <p className="font-mono text-lg break-all text-white">
                  {linkedAccount}
                </p>
              </div>
              <p className="text-sm text-gray-400">
                This account will be used for the migration process
              </p>
            </>
          ) : (
            <>
              <Label className="text-sm font-medium text-gray-400">
                Action Required
              </Label>
              <div className="p-4 rounded-lg border border-blue-100 bg-blue-50">
                <p className="text-sm text-gray-700 mb-4">
                  To proceed, you need to link your external account to your
                  Abstract Global Wallet
                  {address &&
                    ` (${address.slice(0, 6)}...${address.slice(-4)})`}
                </p>
                <Button
                  onClick={handleOpenLink}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Linking Portal
                </Button>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          {isAccountLinked ? (
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto text-black"
            >
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequiredInfoModal;
