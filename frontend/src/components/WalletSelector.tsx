import {
    APTOS_CONNECT_ACCOUNT_URL,
    AnyAptosWallet,
    WalletItem,
    groupAndSortWallets,
    isAptosConnectWallet,
    isInstallRequired,
    truncateAddress,
    useWallet,
} from "@aptos-labs/wallet-adapter-react";
import {ChevronDown, Copy, LogOut, User} from "lucide-react";
import {useCallback, useState} from "react";

import {Button} from "@/components/ui/button";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useToast} from "@/components/ui/use-toast";

export function WalletSelector() {
    const {account, connected, disconnect, wallet} = useWallet();
    const {toast} = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const closeDialog = useCallback(() => setIsDialogOpen(false), []);

    const copyAddress = useCallback(async () => {
        if (!account?.address) return;
        try {
            await navigator.clipboard.writeText(account.address);
            toast({
                title: "Success",
                description: "Copied wallet address to clipboard.",
            });
        } catch {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to copy wallet address.",
            });
        }
    }, [account?.address, toast]);

    return connected ? (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <Button>{account?.ansName || truncateAddress(account?.address) || "Unknown"}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={copyAddress} className="gap-2">
                    <Copy className="h-4 w-4"/> Copy address
                </DropdownMenuItem>
                {wallet && isAptosConnectWallet(wallet) && (
                    <DropdownMenuItem asChild>
                        <a href={APTOS_CONNECT_ACCOUNT_URL} target="_blank" rel="noopener noreferrer"
                           className="flex gap-2">
                            <User className="h-4 w-4"/> Account
                        </a>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem onSelect={disconnect} className="gap-2">
                    <LogOut className="h-4 w-4"/> Disconnect
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>Connect a Wallet</Button>
            </DialogTrigger>
            <ConnectWalletDialog close={closeDialog}/>
        </Dialog>
    );
}

interface ConnectWalletDialogProps {
    close: () => void;
}

function ConnectWalletDialog({close}: ConnectWalletDialogProps) {
    const {wallets = []} = useWallet();

    const {availableWallets, installableWallets} = groupAndSortWallets(wallets);
    return (
        <DialogContent className="max-h-screen overflow-auto">
            <DialogHeader className="flex flex-col items-center">
                <DialogTitle className="flex flex-col text-center leading-snug">
                    <span>Connect a Wallet</span>
                </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3 pt-3">
                {availableWallets.map((wallet) => (
                    <WalletRow key={wallet.name} wallet={wallet} onConnect={close}/>
                ))}
                {!!installableWallets.length && (
                    <Collapsible className="flex flex-col gap-3">
                        <CollapsibleTrigger asChild>
                            <Button size="sm" variant="ghost" className="gap-2">
                                More wallets <ChevronDown/>
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="flex flex-col gap-3">
                            {installableWallets.map((wallet) => (
                                <WalletRow key={wallet.name} wallet={wallet} onConnect={close}/>
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                )}
            </div>
        </DialogContent>
    );
}

interface WalletRowProps {
    wallet: AnyAptosWallet;
    onConnect?: () => void;
}

function WalletRow({wallet, onConnect}: WalletRowProps) {
    return (
        <WalletItem
            wallet={wallet}
            onConnect={onConnect}
            className="flex items-center justify-between px-4 py-3 gap-4 border rounded-md"
        >
            <div className="flex items-center gap-4">
                <WalletItem.Icon className="h-6 w-6"/>
                <WalletItem.Name className="text-base font-normal"/>
            </div>
            {isInstallRequired(wallet) ? (
                <Button size="sm" variant="ghost" asChild>
                    <WalletItem.InstallLink/>
                </Button>
            ) : (
                <WalletItem.ConnectButton asChild>
                    <Button size="sm">Connect</Button>
                </WalletItem.ConnectButton>
            )}
        </WalletItem>
    );
}

