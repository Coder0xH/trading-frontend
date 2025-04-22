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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
 * API管理组件属性接口
 */
interface ApiManagerProps {
  readonly initialExchanges?: Exchange[];
}

/**
 * API管理组件
 * 管理交易所API密钥和参数
 */
export function ApiManager({ initialExchanges = [] }: ApiManagerProps) {
  // 如果提供了初始数据，使用它，否则使用空数组
  const [exchanges, setExchanges] = useState<readonly Exchange[]>(initialExchanges);
  
  // 新API配置表单状态
  const [newApi, setNewApi] = useState({
    name: '',
    isVerified: false,
    extendField: '-',
    marker: '',
    apiKey: '',
    apiSecret: '',
    passphrase: '0'
  });

  /**
   * 添加新API配置
   */
  const addApi = () => {
    // 在实际应用中，这里会调用API保存数据
    const newId = exchanges.length > 0 ? Math.max(...exchanges.map(e => e.id)) + 1 : 1;
    setExchanges([...exchanges, { 
      id: newId, 
      name: newApi.name, 
      isVerified: newApi.isVerified, 
      extendField: newApi.extendField, 
      marker: newApi.marker 
    }]);
    
    // 重置表单
    setNewApi({
      name: '',
      isVerified: false,
      extendField: '-',
      marker: '',
      apiKey: '',
      apiSecret: '',
      passphrase: '0'
    });
  };

  /**
   * 删除API配置
   * @param id - 要删除的API配置ID
   */
  const deleteApi = (id: number) => {
    // 在实际应用中，这里会调用API删除数据
    setExchanges(exchanges.filter(exchange => exchange.id !== id));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>交易平台参数配置</CardTitle>
            <CardDescription>
              管理您的API密钥和交易所参数
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
                          onClick={() => deleteApi(exchange.id)}
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
            <CardTitle>交易平台参数配置</CardTitle>
            <CardDescription>
              添加新的API密钥
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-exchange" className="text-red-500">* 交易平台:</Label>
              <Select 
                value={newApi.name}
                onValueChange={(value) => setNewApi({...newApi, name: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择交易所" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BYBIT">BYBIT</SelectItem>
                  <SelectItem value="BITGET">BITGET</SelectItem>
                  <SelectItem value="火币">火币</SelectItem>
                  <SelectItem value="OK">OK</SelectItem>
                  <SelectItem value="币安">币安</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-key" className="text-red-500">* Api Key:</Label>
              <Input 
                id="api-key" 
                placeholder="输入API Key" 
                value={newApi.apiKey}
                onChange={(e) => setNewApi({...newApi, apiKey: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-secret" className="text-red-500">* Api Secret:</Label>
              <Input 
                id="api-secret" 
                type="password"
                placeholder="输入API Secret" 
                value={newApi.apiSecret}
                onChange={(e) => setNewApi({...newApi, apiSecret: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="passphrase" className="text-red-500">* passphrase:</Label>
              <Input 
                id="passphrase" 
                placeholder="输入密码短语" 
                value={newApi.passphrase}
                onChange={(e) => setNewApi({...newApi, passphrase: e.target.value})}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="is-verified-api" 
                checked={newApi.isVerified}
                onCheckedChange={(checked) => setNewApi({...newApi, isVerified: checked})}
              />
              <Label htmlFor="is-verified-api">是否默认</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="extend-field-api">扩展字段:</Label>
              <Input 
                id="extend-field-api" 
                placeholder="扩展字段" 
                value={newApi.extendField}
                onChange={(e) => setNewApi({...newApi, extendField: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="marker-api">交易所标签:</Label>
              <Input 
                id="marker-api" 
                placeholder="输入交易所标签" 
                value={newApi.marker}
                onChange={(e) => setNewApi({...newApi, marker: e.target.value})}
              />
            </div>
            
            <Button className="w-full" onClick={addApi}>
              <PlusIcon className="mr-2 h-4 w-4" />
              新建
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
