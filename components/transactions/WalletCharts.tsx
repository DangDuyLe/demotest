'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart, PieChart, Pie, Cell, RadialBarChart, RadialBar } from "recharts";
import { Activity, Wallet, TrendingUp, Database, Cpu } from "lucide-react";
import { BlockchainMetrics, GlobalMetrics, fetchBlockchainMetrics, fetchGlobalMetrics } from "@/services/cryptoService";
import { Loader2, AlertCircle } from "lucide-react";

const COLORS = {
  primary: '#F5B056',
  secondary: '#3b82f6',
  tertiary: '#22c55e',
  quaternary: '#a855f7',
  error: '#ef4444',
  gray: '#666',
};

export default function WalletCharts() {
  const [blockchainMetrics, setBlockchainMetrics] = useState<BlockchainMetrics | null>(null);
  const [globalMetrics, setGlobalMetrics] = useState<GlobalMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [blockData, globalData] = await Promise.all([
          fetchBlockchainMetrics(),
          fetchGlobalMetrics()
        ]);
        setBlockchainMetrics(blockData);
        setGlobalMetrics(globalData);
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError('Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="bg-gray-900 border border-gray-800 rounded-2xl">
              <CardContent className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-[#F5B056]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !blockchainMetrics || !globalMetrics) {
    return (
      <div className="text-red-500 text-center">
        Error loading metrics. Please try again later.
      </div>
    );
  }

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  // Prepare data for visualizations
  const networkHealthData = [
    { name: 'Block Time', value: (blockchainMetrics.avgBlockTime / 15) * 100, fill: COLORS.primary },
    { name: 'Gas Price', value: (blockchainMetrics.gasPrice / 50) * 100, fill: COLORS.secondary },
    { name: 'Validators', value: (blockchainMetrics.activeValidators / 600000) * 100, fill: COLORS.tertiary },
    { name: 'Staking', value: (blockchainMetrics.stakingAPR / 10) * 100, fill: COLORS.quaternary }
  ];

  const marketShareData = Object.entries(globalMetrics.market_cap_percentage || {})
    .slice(0, 5)
    .map(([name, value], index) => ({
      name: name.toUpperCase(),
      value,
      fill: Object.values(COLORS)[index]
    }));

  return (
    <div className="text-white font-exo2">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Market Share Chart */}
        <Card className="md:col-span-2 bg-white/5 rounded-[10px] p-4 border border-gray-800 backdrop-blur-[4px]">
          <CardHeader className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#F5B056]" />
              <CardTitle className="text-lg text-white">Market Share</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[200px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={marketShareData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    startAngle={90}
                    endAngle={450}
                  >
                    {marketShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: number) => [`${value.toFixed(2)}%`]}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {marketShareData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }} />
                  <span className="text-xs text-white">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-white/5 rounded-[10px] p-4 border border-gray-800 backdrop-blur-[4px] font-quantico hover:border-[#fff] transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-center gap-2">
                <Wallet className="w-5 h-5 text-[#F5B056]" />
                <CardTitle className="text-xl text-center text-white">Market Cap</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl text-center font-bold text-white">
                ${formatNumber(globalMetrics.total_market_cap.usd)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 rounded-[10px] p-4 border border-gray-800 backdrop-blur-[4px] font-quantico hover:border-[#fff] transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-center gap-2">
                <Activity className="w-5 h-5 text-[#3b82f6]" />
                <CardTitle className="text-xl text-center text-white">24h Volume</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl text-center font-bold text-white">
                ${formatNumber(globalMetrics.total_volume.usd)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 rounded-[10px] p-4 border border-gray-800 backdrop-blur-[4px] font-quantico hover:border-[#fff] transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-center gap-2">
                <Database className="w-5 h-5 text-[#22c55e]" />
                <CardTitle className="text-xl text-center text-white">Active Coins</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl text-center font-bold text-white">
                {globalMetrics.active_cryptocurrencies.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 rounded-[10px] p-4 border border-gray-800 backdrop-blur-[4px] font-quantico hover:border-[#fff] transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-center gap-2">
                <Cpu className="w-5 h-5 text-[#a855f7]" />
                <CardTitle className="text-xl text-center text-white">Markets</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl text-center font-bold text-white">
                {globalMetrics.markets.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 