import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 不需要认证的路径
const publicPaths = ['/auth/login', '/auth/register'];

/**
 * 中间件函数，用于处理认证保护
 * @param request 请求对象
 */
export function middleware(request: NextRequest) {
  // 获取访问路径
  const path = request.nextUrl.pathname;
  
  // 检查是否为公开路径
  const isPublicPath = publicPaths.some(publicPath => path.startsWith(publicPath));
  
  // 获取认证令牌
  const token = request.cookies.get('access_token')?.value;
  
  // 如果是公开路径且已登录，重定向到首页
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // 如果不是公开路径且未登录，重定向到登录页面
  if (!isPublicPath && !token) {
    // 保存当前URL，以便登录后可以重定向回来
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('callbackUrl', path);
    
    return NextResponse.redirect(redirectUrl);
  }
  
  // 继续处理请求
  return NextResponse.next();
}

// 配置中间件匹配的路径
export const config = {
  // 匹配所有路径，除了静态资源和API路由
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
