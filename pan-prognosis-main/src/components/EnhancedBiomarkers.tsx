import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle,
  Activity,
  Filter,
  RefreshCw,
  Download
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Biomarker {
  name: string;
  value: string;
  unit: string;
  status: "elevated" | "normal" | "low" | "critical";
  trend: "up" | "down" | "stable";
  referenceRange: string;
  lastChecked: string;
  changePercent?: number;
  category: "tumor" | "metabolic" | "inflammatory" | "liver";
  priority: "high" | "medium" | "low";
}

interface EnhancedBiomarkersProps {
  biomarkers: Biomarker[];
  className?: string;
}

const EnhancedBiomarkers = ({ biomarkers, className = "" }: EnhancedBiomarkersProps) => {
  const [showAllBiomarkers, setShowAllBiomarkers] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("priority");

  const getStatusIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4" />;
      case "down": return <TrendingDown className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "hsl(var(--destructive))";
      case "elevated": return "hsl(var(--risk-high))";
      case "low": return "hsl(var(--risk-moderate))";
      case "normal": return "hsl(var(--risk-low))";
      default: return "hsl(var(--muted-foreground))";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "critical": return "bg-destructive text-destructive-foreground";
      case "elevated": return "risk-high";
      case "low": return "risk-moderate"; 
      case "normal": return "risk-low";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "tumor": return "hsl(var(--primary))";
      case "metabolic": return "hsl(var(--secondary))";
      case "inflammatory": return "hsl(var(--warning))";
      case "liver": return "hsl(var(--success))";
      default: return "hsl(var(--muted-foreground))";
    }
  };

  const getPriorityScore = (priority: string) => {
    switch (priority) {
      case "high": return 3;
      case "medium": return 2;
      case "low": return 1;
      default: return 0;
    }
  };

  const getSeverityScore = (status: string) => {
    switch (status) {
      case "critical": return 4;
      case "elevated": return 3;
      case "low": return 2;
      case "normal": return 1;
      default: return 0;
    }
  };

  const filteredAndSortedBiomarkers = biomarkers
    .filter(marker => filterCategory === "all" || marker.category === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case "priority":
          return getPriorityScore(b.priority) - getPriorityScore(a.priority);
        case "status":
          return getSeverityScore(b.status) - getSeverityScore(a.status);
        case "name":
          return a.name.localeCompare(b.name);
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const displayedBiomarkers = showAllBiomarkers 
    ? filteredAndSortedBiomarkers 
    : filteredAndSortedBiomarkers.slice(0, 6);

  const criticalCount = biomarkers.filter(m => m.status === "critical").length;
  const elevatedCount = biomarkers.filter(m => m.status === "elevated").length;

  const refreshBiomarkers = () => {
    toast({
      title: "Biomarkers Refreshed",
      description: "Latest lab results have been synchronized",
    });
  };

  const exportBiomarkers = () => {
    toast({
      title: "Biomarkers Exported",
      description: "Lab report has been downloaded to your device",
    });
  };

  return (
    <div className={`clinical-card ${className}`}>
      <div className="space-y-6">
        {/* Header with Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Biomarker Panel</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button onClick={refreshBiomarkers} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={exportBiomarkers} variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-3 gap-4">
          {criticalCount > 0 && (
            <div className="text-center p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <div className="text-lg font-bold text-destructive">{criticalCount}</div>
              <div className="text-xs text-destructive">Critical</div>
            </div>
          )}
          <div className="text-center p-3 bg-risk-high-bg rounded-lg border border-risk-high/20">
            <div className="text-lg font-bold text-risk-high">{elevatedCount}</div>
            <div className="text-xs text-risk-high">Elevated</div>
          </div>
          <div className="text-center p-3 bg-risk-low-bg rounded-lg border border-risk-low/20">
            <div className="text-lg font-bold text-risk-low">{biomarkers.length - criticalCount - elevatedCount}</div>
            <div className="text-xs text-risk-low">Normal/Low</div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="tumor">Tumor Markers</SelectItem>
                  <SelectItem value="metabolic">Metabolic</SelectItem>
                  <SelectItem value="inflammatory">Inflammatory</SelectItem>
                  <SelectItem value="liver">Liver Function</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">By Priority</SelectItem>
                <SelectItem value="status">By Status</SelectItem>
                <SelectItem value="name">By Name</SelectItem>
                <SelectItem value="category">By Category</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="show-all" className="text-sm">Show All</Label>
            <Switch
              id="show-all"
              checked={showAllBiomarkers}
              onCheckedChange={setShowAllBiomarkers}
            />
          </div>
        </div>

        {/* Biomarkers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedBiomarkers.map((marker, index) => (
            <div 
              key={index} 
              className="clinical-card-interactive !p-4 border-l-4 transition-smooth"
              style={{ borderLeftColor: getCategoryColor(marker.category) }}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-foreground">{marker.name}</span>
                    {marker.status === "critical" && (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <Badge className={`text-xs ${getStatusBadgeClass(marker.status)}`}>
                    {marker.status}
                  </Badge>
                </div>

                {/* Value and Trend */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold" style={{ color: getStatusColor(marker.status) }}>
                      {marker.value}
                    </span>
                    <span className="text-sm text-muted-foreground">{marker.unit}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <span style={{ color: getStatusColor(marker.status) }}>
                      {getStatusIcon(marker.trend)}
                    </span>
                    {marker.changePercent && (
                      <span className="text-xs text-muted-foreground">
                        {marker.changePercent > 0 ? "+" : ""}{marker.changePercent}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Reference Range */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Reference: {marker.referenceRange}</span>
                    <span className="capitalize">{marker.category}</span>
                  </div>
                  
                  {/* Visual Range Indicator */}
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ 
                        backgroundColor: getStatusColor(marker.status),
                        width: `${Math.min(100, Math.max(10, (parseFloat(marker.value) / 200) * 100))}%`,
                        opacity: 0.7
                      }}
                    />
                  </div>
                </div>

                {/* Last Checked */}
                <div className="text-xs text-muted-foreground">
                  Last checked: {marker.lastChecked}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {filteredAndSortedBiomarkers.length > 6 && (
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => setShowAllBiomarkers(!showAllBiomarkers)}
              className="transition-smooth"
            >
              {showAllBiomarkers 
                ? `Show Less (${filteredAndSortedBiomarkers.length - 6} hidden)` 
                : `Show All Biomarkers (${filteredAndSortedBiomarkers.length - 6} more)`
              }
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedBiomarkers;