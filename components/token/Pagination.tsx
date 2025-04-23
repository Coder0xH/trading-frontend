'use client';

import { Button } from '@/components/ui/button';

interface PaginationProps {
  readonly page: number;
  readonly loading: boolean;
  readonly hasMore: boolean;
  readonly onPrevPage: () => void;
  readonly onNextPage: () => void;
}

/**
 * 分页控制组件
 * 提供上一页和下一页的导航功能
 */
export function Pagination({ page, loading, hasMore, onPrevPage, onNextPage }: PaginationProps) {
  return (
    <div className="flex justify-between items-center mt-4">
      <Button 
        variant="outline" 
        onClick={onPrevPage}
        disabled={page === 1 || loading}
      >
        上一页
      </Button>
      <span>第 {page} 页</span>
      <Button 
        variant="outline" 
        onClick={onNextPage}
        disabled={loading || !hasMore}
      >
        下一页
      </Button>
    </div>
  );
}
