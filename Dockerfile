# syntax=docker/dockerfile:1.4

# 使用特定版本的轻量级 Node.js 镜像作为基础镜像
# 使用固定版本以减少安全漏洞
FROM node:23.11.1-alpine AS base
WORKDIR /app

# 安装必要的系统依赖
RUN apk add --no-cache g++ libc6-compat make python3

# 构建阶段：安装依赖并构建项目
FROM base AS builder
WORKDIR /app

# 拷贝依赖文件
COPY package.json pnpm-lock.yaml* ./

# 安装依赖 (包括开发依赖)
RUN npm install

# 拷贝项目文件
COPY . .
RUN ls -la /app/.next/standalone || true

# 创建缓存目录并设置权限
RUN mkdir -p .next/cache && chown -R node:node .next

# 构建 Next.js 项目
RUN npm run build

# 生产运行镜像
FROM base AS runner
WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs \
    && mkdir -p .next/cache/images \
    && chown -R nextjs:nodejs .

# 拷贝构建产物
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 创建缓存目录并设置权限
RUN mkdir -p /app/.next/cache/images && chown -R nextjs:nodejs /app/.next

# 切换为非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "server.js"]