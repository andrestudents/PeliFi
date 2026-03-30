"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { getMagic, Magic } from "@/lib/magic"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  email: string | null
  isLoading: boolean
  showLoginDialog: boolean
  openLoginDialog: () => void
  closeLoginDialog: () => void
  handleLoginSuccess: (address: string, email: string) => void
  disconnect: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  // Cek session yang sudah ada
  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const magic: Magic = getMagic()
      const isLoggedIn = await magic.user.isLoggedIn()

      if (isLoggedIn) {
        const metadata = await magic.user.getInfo()
        const flowAddress = await magic.flow.getPublicAddress()
        if (metadata && flowAddress) {
          setAddress(flowAddress)
          setEmail(metadata.email!)
          localStorage.setItem("user", flowAddress)
          setIsConnected(true)
        }
      }
    } catch {
      // No session
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginSuccess = useCallback((rawAddress: string, userEmail: string) => {
    setAddress(rawAddress)
    setEmail(userEmail)
    localStorage.setItem("user", rawAddress)
    setIsConnected(true)
    setShowLoginDialog(false)
  }, [])

  const disconnect = useCallback(async () => {
    try {
      const magic: Magic = getMagic()
      if (await magic.user.isLoggedIn()) {
        await magic.user.logout()
      }
    } catch { /* ignore */ }
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setIsConnected(false)
    setAddress(null)
    setEmail(null)
  }, [])

  return (
    <WalletContext.Provider value={{
      isConnected,
      address,
      email,
      isLoading,
      showLoginDialog,
      openLoginDialog: () => setShowLoginDialog(true),
      closeLoginDialog: () => setShowLoginDialog(false),
      handleLoginSuccess,
      disconnect,
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
