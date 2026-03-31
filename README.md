# Lossless (PeliFi)

A **Lossless Lottery Pool** decentralized application built on the **Flow blockchain**. Users deposit into lottery pools where their principal is protected — yields are generated from deposits, and winners are selected at random.

## Tech Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS 4** + Shadcn UI + Framer Motion
- **Flow Blockchain** (testnet) via FCL
- **Magic SDK** — walletless email OTP authentication
- Neobrutalism design system

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_MAGIC_API_KEY=your_magic_api_key
NEXT_PUBLIC_CONTRACT_ADDRESS=0xb959b143faff5775
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page
│   └── app/page.tsx        # Dashboard (Profile/Pool tabs)
├── components/
│   ├── landing/            # Landing page sections
│   ├── layout/             # Layout components (TopBar, etc.)
│   ├── shared/             # Shared UI (FlowAmount, CapacityBar, etc.)
│   └── ui/                 # Shadcn UI primitives
├── context/
│   └── WalletContext.tsx    # Wallet & auth state (Magic SDK + FCL)
├── features/
│   ├── pool/               # Pool list, JoinPool, Claim
│   └── profile/            # User positions, portfolio, early exit
├── lib/                    # Flow config, scripts, transactions, Magic SDK
└── types/                  # TypeScript type definitions
```

## Key Features

- **Lottery Pools** — Weekly, Monthly, and Yearly pools with different capacities
- **Principal Protection** — deposits are returned in full
- **Walletless Auth** — sign in with email via Magic SDK
- **Onchain Transactions** — join pools, claim winnings, early exit — all on Flow testnet

## License

Private
