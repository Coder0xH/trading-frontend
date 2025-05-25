"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { authApi } from "@/api/auth";
import { Loader2 } from "lucide-react";

interface TotpSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSetupComplete?: () => void;
}

/**
 * TOTP两步验证设置对话框
 * 用于设置和启用Google Authenticator
 */
export function TotpSetupDialog({
  open,
  onOpenChange,
  onSetupComplete,
}: TotpSetupDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<"setup" | "verify">("setup");
  const [isLoading, setIsLoading] = useState(false);
  const [totpData, setTotpData] = useState<{
    secret: string;
    uri: string;
  } | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  // 获取TOTP设置信息
  const handleSetup = async () => {
    setIsLoading(true);
    try {
      const response = await authApi.setupTotp();
      setTotpData(response.data);
      setStep("verify");
    } catch (error) {
      console.error("获取TOTP设置信息失败", error);
      toast({
        variant: "destructive",
        title: "设置失败",
        description: "获取TOTP设置信息时发生错误，请重试",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 当TOTP数据变化时，生成QR码
  useEffect(() => {
    if (totpData?.uri) {
      QRCode.toDataURL(totpData.uri, { errorCorrectionLevel: 'H' })
        .then(url => {
          setQrCodeDataUrl(url);
        })
        .catch(err => {
          console.error('QR码生成失败:', err);
          toast({
            variant: "destructive",
            title: "QR码生成失败",
            description: "请使用手动输入的方式添加",
          });
        });
    }
  }, [totpData, toast]);

  // 验证并启用TOTP
  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        variant: "destructive",
        title: "验证码无效",
        description: "请输入6位数字验证码",
      });
      return;
    }

    setIsLoading(true);
    try {
      await authApi.enableTotp(verificationCode);
      toast({
        title: "设置成功",
        description: "两步验证已成功启用",
      });
      onOpenChange(false);
      if (onSetupComplete) {
        onSetupComplete();
      }
    } catch (error) {
      console.error("验证TOTP失败", error);
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "验证码无效或已过期，请重试",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 重置状态
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setStep("setup");
      setTotpData(null);
      setVerificationCode("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "setup" ? "设置两步验证" : "验证并启用"}
          </DialogTitle>
          <DialogDescription>
            {step === "setup"
              ? "使用Google Authenticator或其他TOTP应用增强账户安全"
              : "扫描二维码并输入验证码以完成设置"}
          </DialogDescription>
        </DialogHeader>

        {step === "setup" ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="mb-4 text-center">
              <p className="text-sm text-muted-foreground">
                两步验证可以为您的账户添加额外的安全层级。启用后，每次登录都需要输入验证码。
              </p>
            </div>
            <Button
              onClick={handleSetup}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  正在获取...
                </>
              ) : (
                "开始设置"
              )}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            {totpData && (
              <>
                <div className="mb-4 p-1 border rounded-lg bg-white">
                  {qrCodeDataUrl ? (
                    <Image
                      src={qrCodeDataUrl}
                      alt="TOTP QR Code"
                      width={200}
                      height={200}
                      className="rounded-md"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-[200px] h-[200px]">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  )}
                </div>
                <div className="mb-4 w-full">
                  <Label htmlFor="secret" className="text-xs">
                    密钥（如果无法扫描，请手动输入）
                  </Label>
                  <div className="flex mt-1">
                    <Input
                      id="secret"
                      value={totpData.secret}
                      readOnly
                      className="text-xs font-mono"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={() => {
                        navigator.clipboard.writeText(totpData.secret);
                        toast({
                          title: "已复制",
                          description: "密钥已复制到剪贴板",
                        });
                      }}
                    >
                      复制
                    </Button>
                  </div>
                </div>
                <div className="mb-4 w-full">
                  <Label htmlFor="code" className="text-sm">
                    验证码
                  </Label>
                  <Input
                    id="code"
                    value={verificationCode}
                    onChange={(e) => {
                      // 只允许输入数字，最多6位
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 6) {
                        setVerificationCode(value);
                      }
                    }}
                    placeholder="请输入6位验证码"
                    className="mt-1"
                    maxLength={6}
                  />
                </div>
              </>
            )}
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          {step === "verify" && (
            <Button
              variant="outline"
              onClick={() => setStep("setup")}
              disabled={isLoading}
            >
              返回
            </Button>
          )}
          {step === "verify" && (
            <Button onClick={handleVerify} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  验证中...
                </>
              ) : (
                "验证并启用"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * TOTP管理对话框
 * 用于管理已启用的两步验证
 */
export function TotpManageDialog({
  open,
  onOpenChange,
  enabled,
  onComplete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enabled: boolean;
  onComplete?: () => void;
}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // 禁用TOTP
  const handleDisable = async () => {
    setIsLoading(true);
    try {
      await authApi.disableTotp();
      toast({
        title: "已禁用",
        description: "两步验证已成功禁用",
      });
      onOpenChange(false);
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("禁用TOTP失败", error);
      toast({
        variant: "destructive",
        title: "禁用失败",
        description: "禁用两步验证时发生错误，请重试",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>两步验证</DialogTitle>
          <DialogDescription>
            {enabled
              ? "您已启用两步验证，可以在此处管理"
              : "设置两步验证以增强账户安全性"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-4">
          {enabled ? (
            <div className="space-y-4 w-full">
              <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                <p className="text-green-700 dark:text-green-400 text-sm">
                  两步验证已启用，您的账户受到额外保护。每次登录时，您都需要输入验证码。
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleDisable}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    禁用中...
                  </>
                ) : (
                  "禁用两步验证"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 w-full">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900">
                <p className="text-amber-700 dark:text-amber-400 text-sm">
                  您尚未启用两步验证。建议启用两步验证以增强账户安全性。
                </p>
              </div>
              <Button
                onClick={() => {
                  onOpenChange(false);
                  // 这里需要打开设置对话框
                  if (onComplete) {
                    onComplete();
                  }
                }}
                className="w-full"
              >
                设置两步验证
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
