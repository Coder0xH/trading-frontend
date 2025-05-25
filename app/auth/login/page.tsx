"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Lock, User, ShieldCheck, KeyRound } from "lucide-react";

import { authApi } from "@/api/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

// 定义表单验证模式
const loginSchema = z.object({
  username: z.string().min(3, "用户名至少需要3个字符").max(50, "用户名不能超过50个字符"),
  password: z.string().min(8, "密码至少需要8个字符"),
  totpCode: z.string().min(6, "TOTP验证码必须是6位数字").max(6, "TOTP验证码必须是6位数字").optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [requiresTotp, setRequiresTotp] = useState(false);

  // 获取URL中的回调地址
  const [callbackUrl, setCallbackUrl] = useState("/");

  // 在组件挂载时获取回调URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const callback = searchParams.get('callbackUrl');
    if (callback) {
      setCallbackUrl(callback);
    }
  }, []);

  // 初始化表单
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 处理表单提交
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(data.username, data.password);

      if (response.data.requires_totp) {
        setRequiresTotp(true);
        toast({
          title: "需要验证码",
          description: "请输入您的TOTP验证码完成登录",
          variant: "default",
        });
      } else {
        toast({
          title: "登录成功",
          description: "欢迎回来！",
          variant: "default",
        });
        router.push(callbackUrl);
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'detail' in error.response.data) 
          ? String(error.response.data.detail) 
          : "用户名或密码错误";
      
      toast({
        title: "登录失败",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      {/* 背景图片容器 */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: 'url("/backg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.3,
        }}
      />

      {/* 登录表单 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >

        {/* 登录表单 */}
        <Card className="border-none bg-white shadow-2xl rounded-xl overflow-hidden">

          {/* 头部 */}
          <CardHeader className="space-y-1 pb-2">
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                  <div className="relative z-10 flex items-center justify-center w-full h-full">
                    {requiresTotp ? (
                      <ShieldCheck className="h-10 w-10 text-white" />
                    ) : (
                      <KeyRound className="h-10 w-10 text-white" />
                    )}
                  </div>
                </div>

              </motion.div>
            </div>
            <CardTitle className="text-2xl text-center font-bold text-blue-600">加密货币套利平台</CardTitle>
            <CardDescription className="text-center">
              {requiresTotp ? "请输入您的TOTP验证码完成登录" : "请输入您的账户信息登录"}
            </CardDescription>
          </CardHeader>

          {/* 表单 */}
          <CardContent className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>用户名</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input
                              placeholder="请输入用户名"
                              className="pl-10"
                              disabled={isLoading}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>密码</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="请输入密码"
                              className="pl-10"
                              disabled={isLoading}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                                    <FormField
                    control={form.control}
                    name="totpCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TOTP验证码</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input
                              type="text"
                              placeholder="请输入6位TOTP验证码"
                              className="pl-10"
                              disabled={isLoading}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 登录中...
                      </>
                    ) : (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        登录
                      </motion.span>
                    )}
                  </Button>
                </form>
              </Form>
          </CardContent>

          {/* 底部 */}
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Web3交易安全
                  </span>
                </span>
              </div>
            </div>
            <div className="text-center text-sm text-gray-500">
              通过登录，您同意我们的
              <a href="#" className="text-blue-600 hover:text-blue-500 ml-1">
                服务条款
              </a>
              和
              <a href="#" className="text-blue-600 hover:text-blue-500 ml-1">
                隐私政策
              </a>
            </div>
          </CardFooter>
          
        </Card>
      </motion.div>

    </div>
  );
}
