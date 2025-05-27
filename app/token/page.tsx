'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  TokenStatsCards,
  SyncActions,
  TokenSearchFilter,
  TokenTable,
  ContractAddressDialog,
  Pagination,
  CreateTokenDialog,
  EditTokenDialog,
  DeleteTokenDialog
} from '@/components/token';
import { TokenProvider, useTokenContext } from '@/contexts/TokenContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';

/**
 * 代币页面内容组件
 * 展示和管理代币信息
 */
function TokenPageContent() {
  const {
    activeTab,
    tokens,
    usdtPairTokens,
    syncStatus,
    loading,
    syncLoading,
    actionLoading,
    searchTerm,
    page,
    limit,
    selectedToken,
    editingToken,
    copiedAddress,
    isCreateDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    setActiveTab,
    setSearchTerm,
    setSelectedToken,
    setEditingToken,
    setIsCreateDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    syncTokens,
    syncUsdtPairs,
    createToken,
    updateToken,
    deleteToken,
    handleSearch,
    handlePrevPage,
    handleNextPage,
    copyToClipboard,
    getNetworkCount,
    getFirstNetworkAndAddress,
    formatDate
  } = useTokenContext();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">代币管理</h1>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          创建代币
        </Button>
      </div>
      
      {/* 代币统计信息卡片 */}
      <TokenStatsCards 
        syncStatus={syncStatus} 
        formatDate={formatDate} 
      />
      
      {/* 同步操作按钮 */}
      <SyncActions 
        syncLoading={syncLoading} 
        onSyncTokens={syncTokens} 
        onSyncUsdtPairs={syncUsdtPairs} 
      />
      
      {/* 代币列表标签页 */}
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as 'all' | 'usdt')}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="all">所有代币</TabsTrigger>
          <TabsTrigger value="usdt">USDT交易对</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {/* 搜索和筛选 */}
          <TokenSearchFilter 
            searchTerm={searchTerm} 
            onSearchTermChange={setSearchTerm} 
            onSearch={handleSearch} 
          />
          
          {/* 代币列表表格 */}
          <Card>
            <TokenTable 
              tokens={tokens} 
              loading={loading} 
              page={page} 
              getNetworkCount={getNetworkCount} 
              getFirstNetworkAndAddress={getFirstNetworkAndAddress} 
              formatDate={formatDate} 
              onSelectToken={setSelectedToken}
              onEditToken={(token) => {
                setEditingToken(token);
                setIsEditDialogOpen(true);
              }}
              onDeleteToken={(token) => {
                setEditingToken(token);
                setIsDeleteDialogOpen(true);
              }}
            />
          </Card>
        </TabsContent>
        
        <TabsContent value="usdt">
          {/* USDT交易对代币列表表格 */}
          <Card>
            <TokenTable 
              tokens={usdtPairTokens} 
              loading={loading} 
              page={page} 
              getNetworkCount={getNetworkCount} 
              getFirstNetworkAndAddress={getFirstNetworkAndAddress} 
              formatDate={formatDate} 
              onSelectToken={setSelectedToken}
              onEditToken={(token) => {
                setEditingToken(token);
                setIsEditDialogOpen(true);
              }}
              onDeleteToken={(token) => {
                setEditingToken(token);
                setIsDeleteDialogOpen(true);
              }}
            />
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* 分页控制 */}
      <Pagination 
        page={page} 
        loading={loading} 
        hasMore={activeTab === 'all' ? tokens.length >= limit : usdtPairTokens.length >= limit} 
        onPrevPage={handlePrevPage} 
        onNextPage={handleNextPage} 
      />

      {/* 合约地址详情对话框 */}
      <ContractAddressDialog 
        token={selectedToken} 
        open={!!selectedToken} 
        onOpenChange={(open) => !open && setSelectedToken(null)} 
        copiedAddress={copiedAddress} 
        onCopy={copyToClipboard} 
      />
      
      {/* 创建代币对话框 */}
      <CreateTokenDialog
        open={isCreateDialogOpen}
        loading={actionLoading}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={createToken}
      />
      
      {/* 编辑代币对话框 */}
      <EditTokenDialog
        token={editingToken}
        open={isEditDialogOpen}
        loading={actionLoading}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={updateToken}
      />
      
      {/* 删除代币对话框 */}
      <DeleteTokenDialog
        token={editingToken}
        open={isDeleteDialogOpen}
        loading={actionLoading}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={deleteToken}
      />
    </div>
  );
}

/**
 * 代币页面组件
 * 包含TokenProvider和ErrorBoundary
 */
export default function TokenPage() {
  return (
    <ErrorBoundary>
      <TokenProvider>
        <TokenPageContent />
      </TokenProvider>
    </ErrorBoundary>
  );
}
