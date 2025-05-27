'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

interface ContractAddressInputProps {
  addresses: Array<{network: string, address: string}>;
  onChange: (addresses: Array<{network: string, address: string}>) => void;
  disabled?: boolean;
}

/**
 * 合约地址输入组件
 * 用于添加和管理代币的合约地址
 */
export function ContractAddressInput({ 
  addresses = [], 
  onChange, 
  disabled = false 
}: ContractAddressInputProps) {
  const [newNetwork, setNewNetwork] = useState('');
  const [newAddress, setNewAddress] = useState('');

  // 添加新的网络和地址
  const handleAddAddress = () => {
    if (!newNetwork || !newAddress) return;
    
    const updatedAddresses = [
      ...addresses,
      { network: newNetwork, address: newAddress }
    ];
    
    onChange(updatedAddresses);
    
    // 清空输入
    setNewNetwork('');
    setNewAddress('');
  };

  // 删除网络和地址
  const handleRemoveAddress = (index: number) => {
    const updatedAddresses = [...addresses];
    updatedAddresses.splice(index, 1);
    
    onChange(updatedAddresses);
  };

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">合约地址</CardTitle>
        <CardDescription>
          为不同的网络添加合约地址
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 现有地址列表 */}
        {addresses.length > 0 && (
          <div className="space-y-2">
            {addresses.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <Label className="text-xs text-muted-foreground">网络</Label>
                    <div className="px-3 py-2 border rounded-md bg-muted/50">{item.network}</div>
                  </div>
                  <div className="flex flex-col">
                    <Label className="text-xs text-muted-foreground">地址</Label>
                    <div className="px-3 py-2 border rounded-md bg-muted/50 truncate" title={item.address}>
                      {item.address}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemoveAddress(index)}
                  disabled={disabled}
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* 添加新地址 */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="network">网络</Label>
              <Input 
                id="network" 
                placeholder="例如: ETH, BSC" 
                value={newNetwork}
                onChange={(e) => setNewNetwork(e.target.value)}
                disabled={disabled}
              />
            </div>
            <div>
              <Label htmlFor="address">地址</Label>
              <Input 
                id="address" 
                placeholder="输入合约地址" 
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                disabled={disabled}
              />
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddAddress}
            disabled={disabled || !newNetwork || !newAddress}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            添加合约地址
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
