"use client"

import { useWallet } from "@/context/WalletContext"
import { EmailLoginDialog } from "./EmailLoginDialog"

export function LoginDialogWrapper() {
  const { showLoginDialog, closeLoginDialog, handleLoginSuccess } = useWallet()
  return (
    <EmailLoginDialog
      open={showLoginDialog}
      onOpenChange={closeLoginDialog}
      onSuccess={handleLoginSuccess}
    />
  )
}
