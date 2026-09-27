import React from 'react';
import { BarChart3, TrendingUp, Users, IndianRupee, ShieldCheck, MapPin } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const AdminAnalyticsPage: React.FC = () => {
  const wageData = [
    { month: 'Apr', averageWage: 720, totalDisbursed: 140000 },
    { month: 'May', averageWage: 750, totalDisbursed: 210000 },
    { month: 'Jun', averageWage: 790, totalDisbursed: 380000 },
    { month: 'Jul', averageWage: 820, totalDisbursed: 590000 },
    { month: 'Aug', averageWage: 840, totalDisbursed: 840000 },
    { month: 'Sept', averageWage: 865, totalDisbursed: 1280000 },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
          National Construction Workforce Analytics
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted">
          Macro-economic data: wage growth, unorganized labour formalization, and geographic adoption.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-charcoal text-base">Average Daily Wage Index</h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              +20.1% YoY Uplift
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={wageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0efe9" />
                <XAxis dataKey="month" stroke="#888" fontSize={11} />
                <YAxis stroke="#888" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="averageWage" stroke="#176B5B" strokeWidth={3} fill="#176B5B33" name="Avg Daily Rate (₹)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-charcoal text-base">Monthly Wage Disbursements</h3>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              100% Direct to Bank
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0efe9" />
                <XAxis dataKey="month" stroke="#888" fontSize={11} />
                <YAxis stroke="#888" fontSize={11} />
                <Tooltip />
                <Bar dataKey="totalDisbursed" fill="#F4B942" radius={[8, 8, 0, 0]} name="Disbursed (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
