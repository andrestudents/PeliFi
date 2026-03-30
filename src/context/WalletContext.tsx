"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

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
      const { getMagic } = await import("@/lib/magic")
      const magic = getMagic()
      const isLoggedIn = await magic.user.isLoggedIn()

      if (isLoggedIn) {
        const metadata = await magic.user.getInfo()
        const flowAddress = metadata.wallets.flow?.publicAddress
        if (flowAddress) {
          setAddress(truncateAddress(flowAddress))
        }
        setEmail(metadata.email!)
        setIsConnected(true)
      }
    } catch {
      // No session
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginSuccess = useCallback((rawAddress: string, userEmail: string) => {
    setAddress(truncateAddress(rawAddress))
    setEmail(userEmail)
    setIsConnected(true)
    setShowLoginDialog(false)
  }, [])

  const disconnect = useCallback(async () => {
    try {
      const { getMagic } = await import("@/lib/magic")
      const magic = getMagic()
      await magic.user.logout()
    } catch { /* ignore */ }
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

function truncateAddress(address: string): string {
  if (!address || address.length <= 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
