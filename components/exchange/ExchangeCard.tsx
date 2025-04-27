'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
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
import { Badge } from "@/components/ui/badge";
import { 
  PlusIcon, 
  TrashIcon,
  PencilIcon,
  KeyIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from 'lucide-react';
import { 
  ExchangeResponse, 
  ApiKeyResponse, 
  ExchangeType
} from '@/services/exchangeApi';

/**
 * 交易所卡片组件属性接口
 */
interface ExchangeCardProps {
  readonly exchange: ExchangeResponse;
  readonly apiKeys: ApiKeyResponse[];
  readonly onEdit: (exchange: ExchangeResponse) => void;
  readonly onDelete: (id: number) => void;
  readonly onAddApiKey: (exchangeId: number) => void;
  readonly onEditApiKey: (apiKey: ApiKeyResponse) => void;
  readonly onDeleteApiKey: (id: number) => void;
  readonly onRefresh: () => void;
}

/**
 * 交易所卡片组件
 * 显示交易所信息和相关的API密钥
 */
export function ExchangeCard({ 
  exchange, 
  apiKeys, 
  onEdit, 
  onDelete, 
  onAddApiKey, 
  onEditApiKey, 
  onDeleteApiKey,
  onRefresh
}: ExchangeCardProps) {
  // 展开/折叠状态
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 获取该交易所的API密钥
  const exchangeApiKeys = isExpanded ? apiKeys.filter(apiKey => apiKey.exchange_id === exchange.id) : [];

  // 处理展开/折叠
  const handleToggle = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    
    // 如果是展开状态，刷新数据
    if (newExpandedState) {
      onRefresh();
    }
  };
  
  /**
   * 获取交易所类型显示文本
   * @param type - 交易所类型
   * @returns 交易所类型显示文本
   */
  const getExchangeTypeText = (type: ExchangeType): string => {
    switch (type) {
      case ExchangeType.SPOT:
        return '现货';
      case ExchangeType.FUTURES:
        return '合约';
      case ExchangeType.BOTH:
        return '现货和合约';
      default:
        return '未知';
    }
  };
  
  /**
   * 处理删除交易所
   */
  const handleDelete = () => {
    if (window.confirm(`确定要删除交易所 ${exchange.display_name} 吗？`)) {
      onDelete(exchange.id);
    }
  };
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            {exchange.display_name}
            <Badge variant={exchange.is_active ? "default" : "destructive"} className="ml-2">
              {exchange.is_active ? '启用' : '禁用'}
            </Badge>
          </CardTitle>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={() => onEdit(exchange)}>
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDelete}>
              <TrashIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleToggle}
            >
              {isExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="text-sm text-muted-foreground mb-2">
          <div><strong>标识:</strong> {exchange.name}</div>
          <div><strong>类型:</strong> {getExchangeTypeText(exchange.exchange_type)}</div>
        </div>
        
        {isExpanded && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold flex items-center">
                <KeyIcon className="h-4 w-4 mr-2" />
                API密钥
              </h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onAddApiKey(exchange.id)}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                添加API密钥
              </Button>
            </div>
            
            {exchangeApiKeys.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>标签</TableHead>
                    <TableHead>API Key</TableHead>
                    <TableHead>默认</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exchangeApiKeys.map((apiKey) => (
                    <TableRow key={apiKey.id}>
                      <TableCell>{apiKey.label}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {apiKey.api_key_masked ?? (apiKey.api_key ? `${apiKey.api_key.substring(0, 8)}...` : '未设置')}
                      </TableCell>
                      <TableCell>
                        {apiKey.is_default && (
                          <Badge variant="outline">默认</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => onEditApiKey(apiKey)}>
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              if (window.confirm(`确定要删除API密钥 ${apiKey.label} 吗？`)) {
                                onDeleteApiKey(apiKey.id);
                              }
                            }}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                该交易所暂无API密钥，点击上方"添加API密钥"按钮添加
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
