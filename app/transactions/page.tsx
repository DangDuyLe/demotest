'use client';

import { Suspense, useState } from "react"
import NetworkStats from '@/components/transactions/NetworkStats';
import ParticlesBackground from '@/components/ParticlesBackground';
import RevenueGraph from '@/components/transactions/RevenueGraph';
import WalletCharts from '@/components/transactions/WalletCharts';
import TransactionSection from '@/components/transactions/TransactionSection';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { CoinOption } from "@/services/cryptoService";

// Loading component
const LoadingCard = ({ children }: { children: React.ReactNode }) => (
  <Card className="w-full p-4 bg-white/5 rounded-[10px] border border-gray-800 backdrop-blur-[4px]">
    <CardContent className="flex items-center justify-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin text-[#F5B056]" />
      <p className="text-sm text-white">{children}</p>
    </CardContent>
  </Card>
);

// Error boundary component
const ErrorCard = ({ error }: { error: string }) => (
  <Card className="w-full p-4 bg-gray-900 border-gray-800">
    <CardContent className="text-center text-red-500">
      {error}
    </CardContent>
  </Card>
);

export default function TransactionExplorer() {
  const [selectedCoin, setSelectedCoin] = useState<CoinOption | null>(null);

  return (
    <div className="relative min-h-screen text-white font-exo2">
      <ParticlesBackground />
      
      <div className="relative z-10">
        <div className="container mx-auto p-4">
          {/* Revenue Graph */}
          <div className="mb-6">
            <Suspense fallback={<LoadingCard>Loading revenue graph...</LoadingCard>}>
              <RevenueGraph onCoinChange={setSelectedCoin} />
            </Suspense>
          </div>

          {/* Wallet Charts */}
          <div className="mb-6">
            <Suspense fallback={<LoadingCard>Loading wallet charts...</LoadingCard>}>
              <WalletCharts />
            </Suspense>
          </div>

          {/* Network Stats */}
          <div className="mb-6">
            <Suspense fallback={<LoadingCard>Loading network stats...</LoadingCard>}>
              <NetworkStats />
            </Suspense>
          </div>

          {/* Transaction Section - At the very end */}
          <div>
            <Suspense fallback={<LoadingCard>Loading transactions...</LoadingCard>}>
              <TransactionSection selectedCoin={selectedCoin} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}