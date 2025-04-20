import Link from 'next/link';

/**
 * 自定义 404 页面
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">页面未找到</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        抱歉，您请求的页面不存在。
      </p>
      <Link 
        href="/"
        className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        返回首页
      </Link>
    </div>
  );
}
