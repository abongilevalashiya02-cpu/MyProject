import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp,
  FileText,
  Send,
  Eye,
  CheckCircle,
  XCircle,
  DollarSign,
  Clock
} from 'lucide-react';

interface QuotationStatsProps {
  quotations: any[];
  isAdmin: boolean;
}

export const QuotationStats: React.FC<QuotationStatsProps> = ({ quotations, isAdmin }) => {
  const stats = React.useMemo(() => {
    const total = quotations.length;
    const draft = quotations.filter(q => q.status === 'draft').length;
    const sent = quotations.filter(q => q.status === 'sent').length;
    const viewed = quotations.filter(q => q.status === 'viewed').length;
    const accepted = quotations.filter(q => q.status === 'accepted').length;
    const declined = quotations.filter(q => q.status === 'declined').length;
    const expired = quotations.filter(q => q.status === 'expired').length;
    
    const totalAmount = quotations.reduce((sum, q) => sum + (q.total_amount || 0), 0);
    const acceptedAmount = quotations
      .filter(q => q.status === 'accepted')
      .reduce((sum, q) => sum + (q.total_amount || 0), 0);
    
    const acceptanceRate = total > 0 ? (accepted / total) * 100 : 0;
    
    return {
      total,
      draft,
      sent,
      viewed,
      accepted,
      declined,
      expired,
      totalAmount,
      acceptedAmount,
      acceptanceRate
    };
  }, [quotations]);

  const formatCurrency = (amount: number) => {
    // Use the first quotation's currency or default to ZAR
    const currency = quotations.length > 0 && quotations[0]?.currency ? quotations[0].currency : 'ZAR';
    const locale = currency === 'USD' ? 'en-US' : 'en-ZA';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Quotations',
      value: stats.total,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Sent',
      value: stats.sent,
      icon: Send,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Viewed',
      value: stats.viewed,
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Accepted',
      value: stats.accepted,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Value',
      value: formatCurrency(stats.totalAmount),
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Acceptance Rate',
      value: `${stats.acceptanceRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};