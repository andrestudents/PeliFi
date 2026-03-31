"use client"

import { useState } from "react"
import { getMagic } from "@/lib/magic"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Step = "email" | "otp" | "loading" | "done"

interface EmailLoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (address: string, email: string) => void
}

export function EmailLoginDialog({ open, onOpenChange, onSuccess }: EmailLoginDialogProps) {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [otpHandle, setOtpHandle] = useState<any>(null)

  const handleSendOTP = async () => {
    if (!email || !email.includes("@")) {
      setError("Enter a valid email address")
      return
    }

    setError("")
    setStep("loading")

    try {
      const magic = getMagic()

      // showUI: false — Magic TIDAK tampilkan UI-nya sendiri
      const handle = magic.auth.loginWithEmailOTP({
        email,
        showUI: false,
      })

      // Magic minta user input OTP
      handle.on("email-otp-sent", () => {
        setOtpHandle(handle)
        setStep("otp")
      })

      // Login selesai
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handle.on("done", async () => {
        setStep("loading")

        // Ambil Flow address langsung dari extension
        const flowAddress = await magic.flow.getPublicAddress()
        const metadata = await magic.user.getInfo()

        setStep("done")
        onSuccess(flowAddress, metadata.email!)
        onOpenChange(false)

        // Reset state
        setTimeout(() => {
          setStep("email")
          setEmail("")
          setOtp("")
        }, 300)
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handle.on("error", (err: any) => {
        setError(err.message || "Login gagal")
        setStep("email")
      })

      handle.on("settled", () => {
        // Handle selesai (sukses atau gagal)
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan")
      setStep("email")
    }
  }

  const handleSubmitOTP = () => {
    if (!otp || otp.length < 6) {
      setError("Masukkan 6 digit OTP")
      return
    }

    setError("")

    // Kirim OTP ke Magic untuk diverifikasi
    otpHandle.emit("verify-email-otp", otp)
    setStep("loading")
  }

  const handleClose = () => {
    // Cancel handle jika sedang pending
    if (otpHandle) {
      try { otpHandle.emit("cancel") } catch { /* ignore */ }
    }
    setStep("email")
    setEmail("")
    setOtp("")
    setError("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-2 border-black shadow-shadow max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-bold">
            {step === "email" && "Login to PeliFi"}
            {step === "otp" && "Check your email"}
            {step === "loading" && "Processing..."}
            {step === "done" && "Done!"}
          </DialogTitle>
          <DialogDescription>
            {step === "email" && "Enter your email to login. Wallet will be created automatically."}
            {step === "otp" && `OTP code sent to ${email}`}
            {step === "loading" && "wait a moment..."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">

          {/* Step 1: Input Email */}
          {step === "email" && (
            <>
              <Input
                type="email"
                placeholder="email@kamu.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                className="border-2 border-black"
                autoFocus
              />
              {error && <p className="text-sm text-red-600 font-bold">{error}</p>}
              <Button
                onClick={handleSendOTP}
                className="w-full bg-main text-main-foreground border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              >
                Send OTP Code
              </Button>
            </>
          )}

          {/* Step 2: Input OTP */}
          {step === "otp" && (
            <>
              <p className="text-sm">
                Open your email and enter the 6 digit code sent from PeliFi.
              </p>
              <Input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                onKeyDown={(e) => e.key === "Enter" && handleSubmitOTP()}
                className="border-2 border-black text-center text-2xl font-mono tracking-widest"
                maxLength={6}
                autoFocus
              />
              {error && <p className="text-sm text-red-600 font-bold">{error}</p>}
              <div className="flex gap-2">
                <Button
                  onClick={() => { setStep("email"); setOtp(""); setError("") }}
                  variant="outline"
                  className="flex-1 border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmitOTP}
                  disabled={otp.length < 6}
                  className="flex-1 bg-main text-main-foreground border-2 border-black shadow-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                >
                  Verification
                </Button>
              </div>
            </>
          )}

          {/* Step 3: Loading */}
          {step === "loading" && (
            <div className="text-center py-6">
              <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent mx-auto mb-3" />
              <p className="text-sm font-bold">Preparing your address...</p>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  )
}
