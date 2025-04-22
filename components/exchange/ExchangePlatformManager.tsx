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
import { Switch } from "@/components/ui/switch";
import { 
  PlusIcon, 
  TrashIcon,
  PencilIcon
} from 'lucide-react';

/**
 * 交易所平台数据接口
 */
interface Exchange {
  id: number;
  name: string;
  isVerified: boolean;
  extendField: string;
  marker: string;
}

/**
 * 交易平台管理组件属性接口
 */
interface ExchangePlatformManagerProps {
  readonly initialExchanges?: Exchange[];
}

/**
 * 交易平台管理组件
 * 管理交易所账户和标识符
 */
export function ExchangePlatformManager({ initialExchanges = [] }: ExchangePlatformManagerProps) {
  // 如果提供了初始数据，使用它，否则使用空数组
  const [exchanges, setExchanges] = useState<readonly Exchange[]>(initialExchanges);
  
  // 新交易所表单状态
  const [newExchange, setNewExchange] = useState({
    name: '',
    isVerified: false,
    extendField: '-',
    marker: ''
  });

  /**
   * 添加新交易所
   */
  const addExchange = () => {
    // 在实际应用中，这里会调用API保存数据
    const newId = exchanges.length > 0 ? Math.max(...exchanges.map(e => e.id)) + 1 : 1;
    setExchanges([...exchanges, { 
      id: newId, 
      name: newExchange.name, 
      isVerified: newExchange.isVerified, 
      extendField: newExchange.extendField, 
      marker: newExchange.marker 
    }]);
    
    // 重置表单
    setNewExchange({
      name: '',
      isVerified: false,
      extendField: '-',
      marker: ''
    });
  };

  /**
   * 删除交易所
   * @param id - 要删除的交易所ID
   */
  const deleteExchange = (id: number) => {
    // 在实际应用中，这里会调用API删除数据
    setExchanges(exchanges.filter(exchange => exchange.id !== id));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>交易平台管理</CardTitle>
            <CardDescription>
              管理您的交易所账户和标识符
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">序号</TableHead>
                  <TableHead>交易平台</TableHead>
                  <TableHead>是否默认</TableHead>
                  <TableHead>扩展字段</TableHead>
                  <TableHead>交易所标签</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exchanges.map((exchange) => (
                  <TableRow key={exchange.id}>
                    <TableCell>{exchange.id}</TableCell>
                    <TableCell>{exchange.name}</TableCell>
                    <TableCell>{exchange.isVerified ? '是' : '否'}</TableCell>
                    <TableCell>{exchange.extendField}</TableCell>
                    <TableCell>{exchange.marker}</TableCell>
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
                          onClick={() => deleteExchange(exchange.id)}
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
            <CardTitle>新建交易平台</CardTitle>
            <CardDescription>
              添加新的交易所账户
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exchange-name">交易平台</Label>
              <Input 
                id="exchange-name" 
                placeholder="输入交易所名称" 
                value={newExchange.name}
                onChange={(e) => setNewExchange({...newExchange, name: e.target.value})}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="is-verified" 
                checked={newExchange.isVerified}
                onCheckedChange={(checked) => setNewExchange({...newExchange, isVerified: checked})}
              />
              <Label htmlFor="is-verified">是否默认</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="extend-field">扩展字段</Label>
              <Input 
                id="extend-field" 
                placeholder="扩展字段" 
                value={newExchange.extendField}
                onChange={(e) => setNewExchange({...newExchange, extendField: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="marker">交易所标签</Label>
              <Input 
                id="marker" 
                placeholder="输入交易所标签" 
                value={newExchange.marker}
                onChange={(e) => setNewExchange({...newExchange, marker: e.target.value})}
              />
            </div>
            
            <Button className="w-full" onClick={addExchange}>
              <PlusIcon className="mr-2 h-4 w-4" />
              新建
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
