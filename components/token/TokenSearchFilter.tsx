'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface TokenSearchFilterProps {
  readonly searchTerm: string;
  readonly onSearchTermChange: (value: string) => void;
  readonly onSearch: () => void;
}

/**
 * 代币搜索和筛选组件
 * 提供搜索代币的功能
 */
export function TokenSearchFilter({ searchTerm, onSearchTermChange, onSearch }: TokenSearchFilterProps) {
  return (
    <div className="flex gap-4 mb-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="搜索代币符号..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
        </div>
      </div>
      
      <Button onClick={onSearch}>搜索</Button>
    </div>
  );
}
