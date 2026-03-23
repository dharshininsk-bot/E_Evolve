# E-Evolve

A comprehensive, verifiable waste management and resource tracking platform designed to connect consumers, collectors, recyclers, and producers. Built on a modern tech stack and leveraging distributed ledger technology (Hedera Hashgraph), E-Evolve ensures transparency, traceabilty, and accountability in the waste recycling lifecycle, while incentivizing sustainable practices through tokenized eco-credits.

## Key Features

- **Multi-Role Ecosystem**: Tailored experiences and dashboards for distinct participants:
  - **Consumers**: Log and track waste disposal, earn rewards via milestones.
  - **Collectors**: Accept waste pickup requests, log collections, and verify waste sources.
  - **Recyclers**: Receive collected waste, process it, and mint verifiable Plastic Recovery Credits (PRCs).
  - **Producers**: Purchase PRCs to meet Extended Producer Responsibility (EPR) and ESG compliance goals.
- **Verifiable Tracking**: Integrates with the **Hedera Consensus Service (HCS)** and **Hedera Token Service (HTS)** for immutable audit logs and secure tokenization of recycling credits.
- **Credit Marketplace**: Recyclers can sell PRCs to Producers directly via the platform's credit transaction engine.
- **Modern UI**: Intuitive and responsive dashboards built with Tailwind CSS, Lucide React icons, and Recharts for data visualization.

## Tech Stack

- **Frontend & Framework**: [Next.js](https://nextjs.org) (App Router), React 19
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Blockchain / DLT**: [@hashgraph/sdk](https://github.com/hashgraph/hedera-sdk-js)
- **Charts**: [Recharts](https://recharts.org/)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database
- Hedera Testnet/Mainnet Account (for HCS/HTS integrations)

### Installation

1. Navigate to the `platform` directory:
   ```bash
   cd platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `platform` directory based on required variables:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/eevolve"
   DIRECT_URL="postgresql://user:password@localhost:5432/eevolve"
   # Hedera Keys and Account Details
   ```

4. Set up the Database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the Development Server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/platform` - Main Next.js application directory.
  - `/src/app` - Standard Next.js 13+ App router containing pages, layouts, and role-specific dashboards (`/dashboard/consumer`, `/dashboard/collector`, etc.).
  - `/src/components` - Reusable React components.
  - `/src/lib` - Utility functions and reusable logic.
  - `/src/api` - API routes handling specific logic and Hedera transactions.
  - `/prisma` - Contains `schema.prisma` defining PostgreSQL DB schema.
- `/platform/*.js` - Various scripts located at the root for seeding, testing database queries, Hedera integration tests, and platform diagnosis (`check-db.js`, `verify-logic.js`, `seed-dashboards.js`, etc.).

## Contribution & License

Feel free to fork this repository, open issues, and submit PRs to contribute to E-Evolve's mission of transforming waste management!
