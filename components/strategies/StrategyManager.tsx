'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from 'lucide-react';
import { 
  ArbitrageStrategy, 
  ArbitrageStrategyConfig
} from '@/types/arbitrage';
import arbitrageApi from '@/api/arbitrage';
import { StrategyForm } from './StrategyForm';
import { StrategyList } from './StrategyList';
import { EmptyState, getDefaultStrategyConfig } from './EmptyState';

/**
 * 策略管理组件
 */
export function StrategyManager() {
  // 策略状态
  const [strategies, setStrategies] = useState<ArbitrageStrategy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 表单状态
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStrategyId, setEditingStrategyId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<ArbitrageStrategyConfig>(getDefaultStrategyConfig());

  /**
   * 加载策略列表
   */
  const fetchStrategies = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await arbitrageApi.getStrategies();
      setStrategies(response.data?.items || []);
    } catch (err) {
      console.error('获取策略失败:', err);
      setError('获取策略失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 初始加载策略列表
  useEffect(() => {
    fetchStrategies();
  }, []);

  /**
   * 打开新建策略表单
   */
  const openCreateForm = () => {
    setIsEditing(false);
    setEditingStrategyId(null);
    setFormValues(getDefaultStrategyConfig());
    setIsDialogOpen(true);
  };

  /**
   * 打开编辑策略表单
   */
  const openEditForm = (strategy: ArbitrageStrategy) => {
    setIsEditing(true);
    setEditingStrategyId(strategy.id);
    
    // 将策略数据转换为表单值
    setFormValues({
      name: strategy.name,
      symbol: strategy.symbol,
      chain_id: strategy.chain_id,
      buy_exchange: strategy.buy_exchange,
      sell_exchange: strategy.sell_exchange,
      direction: strategy.direction,
      min_trade_amount: strategy.min_trade_amount,
      max_trade_amount: strategy.max_trade_amount,
      max_position: strategy.max_position,
      open_price_diff: strategy.open_price_diff,
      min_price_diff: strategy.min_price_diff ?? strategy.open_price_diff,
      enabled: strategy.enabled ?? false,
      trade_mode: strategy.trade_mode,
      hedge_type: strategy.hedge_type,
      bidirectional: strategy.bidirectional ?? false,
      close_price_diff: strategy.close_price_diff,
      batch_buying: strategy.batch_buying,
      batch_count: strategy.batch_count,
      batch_interval: strategy.batch_interval,
      hedge_position: strategy.hedge_position,
      hedge_leverage: strategy.hedge_leverage,
      hedge_enabled: strategy.hedge_enabled
    });
    
    setIsDialogOpen(true);
  };

  /**
   * 执行策略
   */
  const handleExecuteStrategy = async (id: string) => {
    try {
      await arbitrageApi.executeStrategy(id);
      await fetchStrategies();
      alert('策略执行已触发');
    } catch (err) {
      console.error('执行策略失败:', err);
      setError('执行策略失败，请稍后重试');
    }
  };

  /**
   * 删除策略
   */
  const handleDeleteStrategy = async (id: string) => {
    if (!confirm('确定要删除此策略吗？此操作不可撤销。')) return;
    
    try {
      await arbitrageApi.deleteStrategy(id);
      await fetchStrategies();
      alert('策略已删除');
    } catch (err) {
      console.error('删除策略失败:', err);
      setError('删除策略失败，请稍后重试');
    }
  };

  /**
   * 表单提交成功后的回调
   */
  const handleFormSuccess = () => {
    fetchStrategies();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>套利策略</CardTitle>
          <CardDescription>
            管理您的套利策略，设置交易参数和自动执行条件。
          </CardDescription>
          <div className="flex justify-end">
            <Button onClick={openCreateForm}>
              <PlusIcon className="h-4 w-4 mr-2" />
              新建策略
            </Button>
          </div>
        </CardHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 mx-6">
            {error}
          </div>
        )}
        
        <CardContent>
          {/* 加载状态和内容渲染 */}
          {(() => {
            // 显示加载中状态
            if (isLoading && strategies.length === 0) {
              return (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              );
            }
            
            // 显示空状态
            if (strategies.length === 0) {
              return <EmptyState onCreateNew={openCreateForm} />;
            }
            
            // 显示策略列表
            return (
              <StrategyList 
                strategies={strategies}
                onExecute={handleExecuteStrategy}
                onEdit={openEditForm}
                onDelete={handleDeleteStrategy}
                isLoading={isLoading}
              />
            );
          })()}
        </CardContent>
      </Card>

      <StrategyForm 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleFormSuccess}
        isEditing={isEditing}
        editingStrategyId={editingStrategyId}
        initialValues={formValues}
      />
    </div>
  );
}
