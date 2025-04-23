'use client';

import { BinanceTokenResponse } from '@/app/api/token/service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Copy, Check } from 'lucide-react';

interface ContractAddressDialogProps {
  readonly token: BinanceTokenResponse | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly copiedAddress: string | null;
  readonly onCopy: (address: string) => void;
}

/**
 * 合约地址详情对话框组件
 * 显示代币的所有网络合约地址
 */
export function ContractAddressDialog({ 
  token, 
  open, 
  onOpenChange, 
  copiedAddress, 
  onCopy 
}: ContractAddressDialogProps) {
  if (!token) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{token.coin} 合约地址</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-4 max-h-[400px] overflow-y-auto">
          {token.contract_addresses && Object.entries(token.contract_addresses).length > 0 ? (
            Object.entries(token.contract_addresses).map(([network, address]) => (
              <div key={network} className="flex flex-col space-y-1 p-3 border rounded-md">
                <div className="flex items-center justify-between">
                  <Badge className="mr-2">{network.toUpperCase()}</Badge>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onCopy(address)}
                    className="h-7 px-2"
                  >
                    {copiedAddress === address ? 
                      <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                      <Copy className="h-3 w-3 mr-1" />
                    }
                    复制
                  </Button>
                </div>
                <div className="font-mono text-xs break-all bg-muted p-2 rounded">
                  {address}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-4">无合约地址数据</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
