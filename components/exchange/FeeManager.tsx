'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  PlusIcon, 
  TrashIcon,
  PencilIcon
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * 手续费数据接口
 */
interface Fee {
  id: number;
  exchange: string;
  fee: number;
}

/**
 * 手续费管理组件属性接口
 */
interface FeeManagerProps {
  readonly initialFees?: Fee[];
}

/**
 * 手续费管理组件
 * 管理各交易所的交易手续费
 */
export function FeeManager({ initialFees = [] }: FeeManagerProps) {
  // 如果提供了初始数据，使用它，否则使用空数组
  const [fees, setFees] = useState<readonly Fee[]>(initialFees);
  
  // 新手续费表单状态
  const [newFee, setNewFee] = useState({
    exchange: '',
    fee: 0
  });

  /**
   * 添加新手续费
   */
  const addFee = () => {
    // 在实际应用中，这里会调用API保存数据
    const newId = fees.length > 0 ? Math.max(...fees.map(f => f.id)) + 1 : 1;
    setFees([...fees, { 
      id: newId, 
      exchange: newFee.exchange, 
      fee: newFee.fee 
    }]);
    
    // 重置表单
    setNewFee({
      exchange: '',
      fee: 0
    });
  };

  /**
   * 删除手续费
   * @param id - 要删除的手续费ID
   */
  const deleteFee = (id: number) => {
    // 在实际应用中，这里会调用API删除数据
    setFees(fees.filter(fee => fee.id !== id));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>手续费列表</CardTitle>
            <CardDescription>
              管理各交易所的交易手续费
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>交易所名称</TableHead>
                  <TableHead className="text-right">交易手续费</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell>{fee.id}</TableCell>
                    <TableCell>{fee.exchange}</TableCell>
                    <TableCell className="text-right">{fee.fee}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <PencilIcon className="h-4 w-4" />
                          <span className="sr-only">编辑</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-500"
                          onClick={() => deleteFee(fee.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span className="sr-only">删除</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>新建手续费</CardTitle>
            <CardDescription>
              添加新的交易所手续费
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fee-exchange">交易所名称:</Label>
              <Select 
                value={newFee.exchange}
                onValueChange={(value) => setNewFee({...newFee, exchange: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择交易所" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="币安现货">币安现货</SelectItem>
                  <SelectItem value="币安合约">币安合约</SelectItem>
                  <SelectItem value="火币现货">火币现货</SelectItem>
                  <SelectItem value="火币合约">火币合约</SelectItem>
                  <SelectItem value="OKX现货">OKX现货</SelectItem>
                  <SelectItem value="OKX合约">OKX合约</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fee-value">交易手续费:</Label>
              <Input 
                id="fee-value" 
                type="number"
                step="0.000001"
                placeholder="输入手续费" 
                value={newFee.fee.toString()}
                onChange={(e) => setNewFee({...newFee, fee: parseFloat(e.target.value)})}
              />
            </div>
            
            <Button className="w-full" onClick={addFee}>
              <PlusIcon className="mr-2 h-4 w-4" />
              新建
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
