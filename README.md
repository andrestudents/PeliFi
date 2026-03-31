# PeliFi

**PeliFi** is a permissionless lottery finance protocol built on the **Flow blockchain**. Users deposit Flow tokens into lottery pools where their principal is fully protected — yield is generated from deposits, and winners are selected at random using a Fisher-Yates shuffle algorithm.

## Key Features

- **Lottery Pools** — Weekly, monthly, and yearly pools with different capacities
- **Principal Protection** — Deposits are returned 100%, whether you win or not
- **Walletless Authentication** — Sign in with email via Magic SDK (OTP)
- **Early Exit** — Users can leave a pool during OPEN status with no penalty
- **Auto-Activation** — Pool automatically activates when capacity is full
- **Yield Distribution** — Yield is distributed to randomly selected winners (onchain)


## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS 4 + Neobrutalism design system |
| UI Components | Radix UI + Framer Motion + Lucide Icons |
| Blockchain | Flow (Cadence) via FCL (`@onflow/fcl`) |
| Authentication | Magic SDK (`magic-sdk` + `@magic-ext/flow`) |
| Notifications | Sonner (toast notifications) |
| Theme | next-themes (dark/light mode) |

## Smart Contract Architecture

Contracts are written in **Cadence** (Flow's smart contract language) and consist of 2 main files:

### `PeliFiTypes.cdc`
Defines all data types and events:
- `UserPosition` — user's position in a pool (principal, entryTime, isWinner, yieldAmount, claimed)
- `PoolDetails` — pool details (poolId, name, capacity, depositAmount, status, etc.)
- Status constants: `STATUS_OPEN (0)`, `STATUS_ACTIVE (1)`, `STATUS_COMPLETED (2)`, `STATUS_CANCELLED (3)`
- Events: `PoolCreated`, `UserJoined`, `PoolActivated`, `PoolCancelled`, `PoolCompleted`, `YieldDistributed`, `WithdrawClaimed`, `PoolExtended`, `UserEarlyExited`

### `PeliFi.cdc`
Main contract managing the entire protocol:
- **Pool Resource** — Handles pool state, user deposits, yield calculation, and winner selection
- **Admin Resource** — Create pools, cancel pools, distribute yield, extend duration, force complete
- **Public Functions** — `joinPool()`, `earlyExit()`, `claimWithdraw()`
- **View Functions** — `getPoolDetails()`, `getUserPosition()`, `getAllPoolIds()`, `getPoolsByStatus()`, `canUserJoinPool()`, `getUserAllPoolIds()`


## Project Structure

```
frontend/
├── contract/                          # Smart Contracts (Cadence)
│   ├── contracts/
│   │   ├── PeliFi.cdc                 # Main contract (pool management)
│   │   └── PeliFiTypes.cdc            # Type definitions & events
│   ├── scripts/                       # Read-only queries (onchain)
│   │   ├── CalculateYield.cdc         # Yield calculation
│   │   ├── GetMultiplePools.cdc       # Fetch multiple pools at once
│   │   ├── GetPoolDetails.cdc         # Single pool details
│   │   └── GetUserPosition.cdc        # User position in a pool
│   └── transactions/                  # Write transactions (onchain)
│       ├── Admin/                     # Admin-only transactions
│       │   ├── CreatePool.cdc         # Create a new pool
│       │   ├── CancelPool.cdc         # Cancel a pool
│       │   ├── DistributeYield.cdc    # Distribute yield to winners
│       │   ├── ExtendPoolTime.cdc     # Extend active pool duration
│       │   └── ForceCompletePool.cdc  # Force complete a pool
│       └── User/                      # User transactions
│           ├── JoinPool.cdc           # Join a pool
│           ├── EarlyExit.cdc          # Exit pool during OPEN period
│           └── ClaimWithdraw.cdc      # Claim funds after completion
│
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── layout.tsx                 # Root layout + providers
│   │   ├── page.tsx                   # Landing page
│   │   ├── globals.css                # Tailwind + neobrutalism theme
│   │   └── api/auth/wallet/
│   │       └── route.ts               # Server-side Magic token validation
│   │
│   ├── components/
│   │   ├── auth/                      # Authentication
│   │   │   ├── EmailLoginDialog.tsx    # Email OTP login dialog
│   │   │   └── LoginDialogWrapper.tsx  # Login dialog wrapper
│   │   ├── landing/                   # Landing page sections
│   │   │   ├── Navbar.tsx             # Navigation bar
│   │   │   ├── HeroSection.tsx        # Hero section
│   │   │   ├── HowItWorksSection.tsx  # How it works section
│   │   │   ├── FeaturesSection.tsx    # Features section
│   │   │   └── Footer.tsx             # Footer
│   │   ├── layout/                    # Layout components
│   │   │   ├── TopBar.tsx             # Top bar (authenticated)
│   │   │   └── LandingLayout.tsx      # Landing page layout
│   │   ├── shared/                    # Shared UI components
│   │   │   ├── StatusBadge.tsx        # Pool status badge
│   │   │   ├── CapacityBar.tsx        # Pool capacity bar
│   │   │   └── SkeletonCard.tsx       # Loading skeleton
│   │   └── ui/                        # Shadcn/Radix UI primitives
│   │
│   ├── context/
│   │   └── WalletContext.tsx           # Global wallet & auth state
│   │
│   ├── features/
│   │   ├── pool/                      # Pool feature
│   │   │   ├── hooks/usePools.ts      # Hook for pool data
│   │   │   ├── types.ts               # Pool type definitions
│   │   │   └── components/            # Pool components (list, join, etc.)
│   │   └── profile/                   # User profile feature
│   │       ├── hooks/usePositions.ts  # Hook for user positions
│   │       ├── types.ts               # Profile type definitions
│   │       └── components/            # Profile components
│   │
│   ├── lib/
│   │   ├── magic.ts                   # Magic SDK client config
│   │   └── network.ts                 # Flow network config
│   │
│   └── types/
│       └── onflow.d.ts                # FCL type declarations
│
├── .env                               # Environment variables (do not commit!)
├── .gitignore
├── next.config.ts                     # Next.js configuration
├── package.json
├── postcss.config.mjs                 # PostCSS + Tailwind
├── tsconfig.json                      # TypeScript config
└── eslint.config.mjs                  # ESLint config
```

### Scripts (Read-Only)

| Script | Description |
|---|---|
| `GetPoolDetails.cdc` | Fetch details of a single pool by poolId |
| `GetMultiplePools.cdc` | Fetch details of multiple pools at once |
| `GetUserPosition.cdc` | Fetch a user's position in a specific pool |
| `CalculateYield.cdc` | Calculate estimated yield |

### Transactions — User

| Transaction | Description |
|---|---|
| `JoinPool.cdc` | Join a pool by depositing Flow tokens |
| `EarlyExit.cdc` | Exit a pool during OPEN status (full refund) |
| `ClaimWithdraw.cdc` | Claim principal + yield after pool completes |

### Transactions — Admin

| Transaction | Description |
|---|---|
| `CreatePool.cdc` | Create a new pool with specified parameters |
| `DistributeYield.cdc` | Distribute yield to randomly selected winners |
| `CancelPool.cdc` | Cancel a pool that is still OPEN |
| `ExtendPoolTime.cdc` | Extend the duration of an ACTIVE pool |
| `ForceCompletePool.cdc` | Force complete a pool (with random seed) |

## Authentication

PeliFi uses **Magic SDK** for walletless authentication:

1. User enters their email
2. Magic sends an OTP to the email
3. User enters the OTP for verification
4. Magic automatically creates a Flow wallet in the background
5. FCL is configured with the Magic wallet to sign transactions


## Pool Lifecycle

```
[OPEN] → Users join & deposit
   │
   ├── Capacity full? → [ACTIVE] (auto-activate)
   │                         │
   │                         ├── Duration elapsed → [COMPLETED] (yield distributed)
   │                         │
   │                         └── Admin extends → stays [ACTIVE]
   │
   ├── User early exit → Full refund (no penalty)
   │
   └── Admin cancel → [CANCELLED] (all users refunded)
```

### Pool Status

| Status | Code | Description |
|---|---|---|
| OPEN | 0 | Pool is open, users can join or early exit |
| ACTIVE | 1 | Pool is active, funds are locked, waiting for duration to complete |
| COMPLETED | 2 | Pool is completed, yield distributed, users can claim |
| CANCELLED | 3 | Pool is cancelled, users can claim refund |


## License

Private
