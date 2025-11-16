import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMonthlyStatsList, useMonthlyStats } from "@/hooks/useReports";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, DollarSign, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const AdminReports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: monthlyStatsList = [], isLoading: isLoadingList } = useMonthlyStatsList();
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const firstMonth = useMemo(() => {
    if (monthlyStatsList.length > 0 && !selectedMonth) {
      return monthlyStatsList[0].month;
    }
    return selectedMonth;
  }, [monthlyStatsList, selectedMonth]);

  const { data: currentStats, isLoading: isLoadingStats } = useMonthlyStats(firstMonth);

  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }

  const completionRate = currentStats
    ? Math.round((currentStats.completedReservations / currentStats.totalReservations) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5 mr-2" />
                Назад
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Місячні звіти</h1>
                <p className="text-muted-foreground mt-1">Статистика та аналітика бронювань</p>
              </div>
            </div>
            <Select
              value={firstMonth}
              onValueChange={(value) => setSelectedMonth(value)}
              disabled={isLoadingList}
            >
              <SelectTrigger className="w-48">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Оберіть місяць" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingList ? (
                  <div className="p-2">
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : (
                  monthlyStatsList.map((stat) => (
                    <SelectItem key={stat.month} value={stat.month}>
                      {new Date(stat.month + "-01").toLocaleDateString("uk-UA", {
                        year: "numeric",
                        month: "long",
                      })}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoadingStats || !currentStats ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Всього бронювань</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentStats.totalReservations}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <TrendingUp className="h-3 w-3 inline mr-1 text-success" />
                    +12% від минулого місяця
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Завершено</CardTitle>
                  <TrendingUp className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentStats.completedReservations}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <Badge variant="outline" className="text-xs">
                      {completionRate}% успішність
                    </Badge>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Скасовано</CardTitle>
                  <TrendingDown className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentStats.cancelledReservations}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((currentStats.cancelledReservations / currentStats.totalReservations) * 100)}% від загальної кількості
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Дохід</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentStats.revenue.toLocaleString("uk-UA")} ₴
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {currentStats.completedReservations > 0
                      ? `~${Math.round(currentStats.revenue / currentStats.completedReservations)} ₴ / бронювання`
                      : "Немає завершених бронювань"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Популярні столики</CardTitle>
                  <CardDescription>Топ-5 найбільш бронюваних столиків</CardDescription>
                </CardHeader>
                <CardContent>
                  {currentStats.popularTables.length > 0 ? (
                    <div className="space-y-4">
                      {currentStats.popularTables.map((table, index) => (
                        <div key={table.tableNumber} className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary mr-3">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">Столик #{table.tableNumber}</span>
                              <span className="text-sm text-muted-foreground">{table.count} бронювань</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{
                                  width: `${(table.count / currentStats.popularTables[0].count) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">Немає даних про популярні столики</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Пікові години</CardTitle>
                  <CardDescription>Найзавантаженіші години дня</CardDescription>
                </CardHeader>
                <CardContent>
                  {currentStats.peakHours.length > 0 ? (
                    <div className="space-y-4">
                      {currentStats.peakHours.map((hour, index) => (
                        <div key={hour.hour} className="flex items-center">
                          <Clock className="h-5 w-5 text-muted-foreground mr-3" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{hour.hour}</span>
                              <span className="text-sm text-muted-foreground">{hour.count} бронювань</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{
                                  width: `${(hour.count / currentStats.peakHours[0].count) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">Немає даних про пікові години</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
