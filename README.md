# PeliFi

**PeliFi** is a permissionless lottery finance protocol built on the **Flow blockchain**. Users deposit Flow tokens into lottery pools where their principal is fully protected — the moment a pool transitions from **OPEN → ACTIVE**, deposited funds are automatically routed into **Ankr's liquid staking protocol**, generating real yield. Winners are selected at random using a Fisher-Yates shuffle algorithm, and that yield is distributed exclusively to them. Everyone else gets their principal back in full.

> No prediction. No loss. Just stake, wait, and luck.

## How It Works

When a pool reaches full capacity and transitions from **OPEN** to **ACTIVE**, the pooled FLOW tokens are not left idle — they are automatically adapted into **Ankr Protocol's liquid staking**, where they generate real staking yield (ankrFLOW). The longer the pool stays active, the more yield accumulates. When the pool completes, that accumulated yield is distributed to a randomly selected group of winners. Everyone else — whether they win or not — receives their full principal back, untouched.

```
User deposits FLOW
        ↓
Pool reaches capacity → status: OPEN → ACTIVE
        ↓
Funds routed to Ankr Liquid Staking (real yield generation)
        ↓
Pool duration elapses → yield distributed to random winners
        ↓
Winners: principal + yield share
Non-winners: principal returned in full (zero loss)
```

This is what makes PeliFi a **lossless lottery** — your deposit is never at risk. The only thing at stake is the yield, and that yield is real.

## Key Features

- **Lossless Lottery Pools** — Weekly, monthly, and yearly pools with different capacities and yield durations
- **Real Yield via Ankr** — When a pool goes ACTIVE, funds are staked through Ankr's liquid staking protocol to generate genuine on-chain yield
- **Principal Protection** — Every user gets their deposit back 100%, win or lose
- **Walletless Authentication** — Sign in with email via Magic SDK (OTP), no wallet extension needed
- **Early Exit** — Exit a pool during OPEN status with no penalty and full principal refund
- **Auto-Activation** — Pool automatically activates and begins yield generation when capacity is full
- **Provably Fair Distribution** — Winners selected on-chain using Fisher-Yates shuffle with provided random seed

## Pool Lifecycle

```
[OPEN]
  Users join & deposit FLOW
  Early exit available (full refund, no penalty)
        │
        ├── Capacity full?
        ↓
[ACTIVE]  ← Funds routed to Ankr Liquid Staking
  Deposits are staked via Ankr protocol
  Real yield accumulates over pool duration
  Funds locked — no early exit
        │
        ├── Duration elapsed?
        ↓
[COMPLETED]
  Yield harvested from Ankr
  Admin distributes yield to random winners
  All users can claim
        │
        └── Admin cancelled? → [CANCELLED]
              All users receive full principal refund
```

### Pool Status

| Status | Code | Description |
|---|---|---|
| OPEN | 0 | Pool is open — users can join or early exit freely |
| ACTIVE | 1 | Pool is full — funds are staked via Ankr, yield is generating |
| COMPLETED | 2 | Duration elapsed — yield distributed, users can claim |
| CANCELLED | 3 | Pool cancelled — all users claim full principal refund |

## Pool Types

| Type | Duration | Description |
|---|---|---|
| **Weekly** | ≤ 7 days | Fast pools, lower yield, high turnover |
| **Monthly** | 8–60 days | Balanced pools, moderate yield accumulation |
| **Yearly** | > 60 days | Long-term pools, maximum yield potential |

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS 4 + Neobrutalism design system |
| UI Components | Radix UI + Framer Motion + Lucide Icons |
| Blockchain | Flow (Cadence) via FCL (`@onflow/fcl`) |
| Authentication | Magic SDK (`magic-sdk` + `@magic-ext/flow`) |
| Yield Protocol | Ankr Liquid Staking (ankrFLOW) |
| Notifications | Sonner (toast notifications) |
| Theme | next-themes (dark/light mode) |

## Smart Contract Architecture

Contracts are written in **Cadence** (Flow's smart contract language).

### `PeliFiTypes.cdc`
Defines all data types and events:
- `UserPosition` — user's position in a pool (principal, entryTime, isWinner, yieldAmount, claimed)
- `PoolDetails` — pool details (poolId, name, capacity, depositAmount, status, activeDuration, etc.)
- Status constants: `STATUS_OPEN (0)`, `STATUS_ACTIVE (1)`, `STATUS_COMPLETED (2)`, `STATUS_CANCELLED (3)`
- Events: `PoolCreated`, `UserJoined`, `PoolActivated`, `PoolCancelled`, `PoolCompleted`, `YieldDistributed`, `WithdrawClaimed`, `PoolExtended`, `UserEarlyExited`

### `PeliFi.cdc`
Main contract managing the entire protocol:
- **Pool Resource** — Handles pool state, user deposits, Ankr adapter routing, yield calculation, and winner selection
- **Admin Resource** — Create pools, cancel pools, distribute yield, extend duration, force complete
- **Public Functions** — `joinPool()`, `earlyExit()`, `claimWithdraw()`
- **View Functions** — `getPoolDetails()`, `getUserPosition()`, `getAllPoolIds()`, `getPoolsByStatus()`, `canUserJoinPool()`, `getUserAllPoolIds()`

### Adapter Architecture (Roadmap)

The current implementation uses a simulated yield model (7% fixed APR) as a placeholder during development. The adapter layer is designed to be swapped with real yield protocols:

```
Pool ACTIVE state
      ↓
IYieldProtocol (interface)
      ↓
├── SimulatedYield    ← current (dev/testnet)
└── AnkrAdapter       ← target (mainnet)
        ↓
    Ankr Liquid Staking
    FLOW → ankrFLOW → yield
```

When `AnkrAdapter` is plugged in, the flow on pool activation becomes:
1. Pool reaches capacity → status `OPEN → ACTIVE`
2. Pooled FLOW deposited into Ankr → minted as ankrFLOW
3. ankrFLOW held in pool vault, accruing staking rewards over time
4. On `distributeYield()` → redeem ankrFLOW → receive FLOW + yield
5. Yield split among winners, principal returned to all

## Project Structure

```
frontend/
├── contract/                          # Smart Contracts (Cadence)
│   ├── contracts/
│   │   ├── core/
│   │   │   ├── PeliFi.cdc             # Main contract (pool management)
│   │   │   └── PeliFiTypes.cdc        # Type definitions & events
│   │   ├── adapters/
│   │   │   └── IYieldProtocol.cdc     # Yield adapter interface (design phase)
│   │   ├── yield/                     # Yield strategy implementations
│   │   └── helpers/                   # Utility contracts
│   ├── scripts/                       # Read-only queries (onchain)
│   │   ├── CalculateYield.cdc
│   │   ├── GetMultiplePools.cdc
│   │   ├── GetPoolDetails.cdc
│   │   └── GetUserPosition.cdc
│   └── transactions/                  # Write transactions (onchain)
│       ├── Admin/
│       │   ├── CreatePool.cdc
│       │   ├── CancelPool.cdc
│       │   ├── DistributeYield.cdc
│       │   ├── ExtendPoolTime.cdc
│       │   └── ForceCompletePool.cdc
│       └── User/
│           ├── JoinPool.cdc
│           ├── EarlyExit.cdc
│           └── ClaimWithdraw.cdc
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
│   │   ├── auth/
│   │   │   ├── EmailLoginDialog.tsx    # Email OTP login dialog
│   │   │   └── LoginDialogWrapper.tsx
│   │   ├── landing/
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   └── Footer.tsx
│   │   ├── layout/
│   │   │   ├── TopBar.tsx
│   │   │   └── LandingLayout.tsx
│   │   ├── shared/
│   │   │   ├── StatusBadge.tsx        # Open/Active/Completed/Cancelled badge
│   │   │   ├── CapacityBar.tsx        # Pool capacity progress bar
│   │   │   └── SkeletonCard.tsx
│   │   └── ui/                        # Shadcn/Radix UI primitives
│   │
│   ├── context/
│   │   └── WalletContext.tsx           # Global wallet & auth state
│   │
│   ├── features/
│   │   ├── pool/
│   │   │   ├── hooks/usePools.ts      # Hook for pool data + duration filter
│   │   │   ├── types.ts               # Pool & PoolDuration type definitions
│   │   │   └── components/
│   │   │       ├── PoolGrid.tsx
│   │   │       ├── PoolCard.tsx
│   │   │       ├── PoolFilter.tsx     # All / Weekly / Monthly / Yearly
│   │   │       ├── JoinPoolDialog.tsx
│   │   │       └── ClaimButton.tsx
│   │   └── profile/
│   │       ├── hooks/usePositions.ts
│   │       ├── types.ts
│   │       └── components/
│   │           ├── PortfolioSummary.tsx
│   │           ├── PositionList.tsx
│   │           ├── PositionCard.tsx
│   │           ├── EarlyExitDialog.tsx
│   │           └── EmptyProfile.tsx
│   │
│   ├── lib/
│   │   ├── magic.ts                   # Magic SDK client config
│   │   ├── network.ts                 # Flow network config
│   │   ├── mock-data.ts               # Mock pools (dev/UI phase)
│   │   ├── mock-positions.ts          # Mock positions (dev/UI phase)
│   │   └── mock-utils.ts              # Yield estimation helpers
│   │
│   └── types/
│       └── onflow.d.ts                # FCL type declarations
│
├── .env
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── eslint.config.mjs
```

## Scripts (Read-Only)

| Script | Description |
|---|---|
| `GetPoolDetails.cdc` | Fetch details of a single pool by poolId |
| `GetMultiplePools.cdc` | Fetch details of multiple pools at once |
| `GetUserPosition.cdc` | Fetch a user's position in a specific pool |
| `CalculateYield.cdc` | Calculate estimated yield for a pool |

## Transactions — User

| Transaction | Description |
|---|---|
| `JoinPool.cdc` | Join a pool by depositing FLOW tokens |
| `EarlyExit.cdc` | Exit a pool during OPEN status (full refund, no penalty) |
| `ClaimWithdraw.cdc` | Claim principal + yield after pool completes or is cancelled |

## Transactions — Admin

| Transaction | Description |
|---|---|
| `CreatePool.cdc` | Create a new pool with specified parameters |
| `DistributeYield.cdc` | Harvest yield from Ankr and distribute to random winners |
| `CancelPool.cdc` | Cancel a pool that is still OPEN |
| `ExtendPoolTime.cdc` | Extend the duration of an ACTIVE pool |
| `ForceCompletePool.cdc` | Force complete a pool early (with random seed) |

## Authentication

PeliFi uses **Magic SDK** for walletless, frictionless authentication:

1. User enters their email address
2. Magic sends a 6-digit OTP to that email
3. User enters the OTP in the in-app dialog (no external popups)
4. Magic automatically creates a Flow wallet in the background
5. FCL is configured with the Magic wallet — all subsequent transactions are silent

No MetaMask. No seed phrases. No browser extensions. Just email.

## Key Constants (Current)

```cadence
YIELD_APR            = 0.07   // 7% simulated APR (replaced by Ankr in production)
ADMIN_FEE_PERCENTAGE = 0.01   // 1% admin fee on yield only
MIN_YIELD_THRESHOLD  = 0.01   // 0.01 FLOW minimum payout per winner
```

## Roadmap

### Phase 1 — Foundation ✅
- Core pool logic (OPEN → ACTIVE → COMPLETED/CANCELLED)
- Simulated yield (7% APR) for dev/testnet
- Winner selection (Fisher-Yates shuffle)
- Early exit mechanism (no penalty)
- Walletless auth (Magic SDK + email OTP)

### Phase 2 — Ankr Integration 🔵
- `AnkrAdapter.cdc` implementing `IYieldProtocol`
- FLOW → ankrFLOW on pool activation
- ankrFLOW → FLOW + yield on pool completion
- Real APY display from Ankr API
- Mainnet deployment

### Phase 3 — Advanced 🔜
- Multi-strategy pools (Ankr + other protocols)
- Dynamic APY display
- Governance / multi-sig admin
- VRF (verifiable random function) for provably fair draws
- Mobile-optimized UI

## License
MIT
