import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, TestTube, AlertCircle } from "lucide-react";

interface Biomarker {
  name: string;
  value: string;
  unit: string;
  status: "elevated" | "normal" | "low";
  trend: "up" | "down" | "stable";
  referenceRange: string;
}

interface BiomarkerIndicatorsProps {
  biomarkers: Biomarker[];
  patientBiomarkers?: {
    ca199?: string;
    cea?: string;
    lipase?: string;
    amylase?: string;
  };
  className?: string;
}

const BiomarkerIndicators = ({ 
  biomarkers, 
  patientBiomarkers, 
  className = "" 
}: BiomarkerIndicatorsProps) => {
  
  // Function to determine biomarker status based on value and reference range
  const calculateBiomarkerStatus = (name: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    
    switch (name.toLowerCase()) {
      case 'ca 19-9':
        if (numValue > 100) return { status: 'elevated', severity: 'high' };
        if (numValue > 37) return { status: 'elevated', severity: 'moderate' };
        return { status: 'normal', severity: 'normal' };
      
      case 'cea':
        if (numValue > 5) return { status: 'elevated', severity: 'high' };
        if (numValue > 3) return { status: 'elevated', severity: 'moderate' };
        return { status: 'normal', severity: 'normal' };
      
      case 'lipase':
        if (numValue > 200) return { status: 'elevated', severity: 'high' };
        if (numValue > 140) return { status: 'elevated', severity: 'moderate' };
        if (numValue < 10) return { status: 'low', severity: 'low' };
        return { status: 'normal', severity: 'normal' };
      
      case 'amylase':
        if (numValue > 150) return { status: 'elevated', severity: 'high' };
        if (numValue > 110) return { status: 'elevated', severity: 'moderate' };
        if (numValue < 30) return { status: 'low', severity: 'low' };
        return { status: 'normal', severity: 'normal' };
      
      default:
        return { status: 'normal', severity: 'normal' };
    }
  };

  // Merge patient-specific biomarker values with default biomarkers
  const displayBiomarkers = biomarkers.map(biomarker => {
    if (patientBiomarkers) {
      const patientValue = patientBiomarkers[biomarker.name.toLowerCase().replace(' ', '').replace('-', '') as keyof typeof patientBiomarkers];
      if (patientValue) {
        const calculatedStatus = calculateBiomarkerStatus(biomarker.name, patientValue);
        return {
          ...biomarker,
          value: patientValue,
          status: calculatedStatus.status as "elevated" | "normal" | "low",
          trend: calculatedStatus.severity === 'high' ? 'up' as const : 
                 calculatedStatus.severity === 'moderate' ? 'up' as const : 'stable' as const
        };
      }
    }
    return biomarker;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "elevated":
        return "risk-high";
      case "low":
        return "risk-moderate";
      case "normal":
        return "risk-low";
      default:
        return "risk-low";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4" />;
      case "down":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "elevated":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "low":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <TestTube className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <Card className={`clinical-card ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5 text-primary" />
          Biomarker Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Laboratory results and tumor marker levels
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {displayBiomarkers.map((biomarker, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(biomarker.status)}
                <div>
                  <div className="font-semibold text-foreground">
                    {biomarker.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Reference: {biomarker.referenceRange}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-bold text-lg text-foreground">
                    {biomarker.value} {biomarker.unit}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Current Level
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge className={`${getStatusBadge(biomarker.status)} text-xs`}>
                    {biomarker.status.charAt(0).toUpperCase() + biomarker.status.slice(1)}
                  </Badge>
                  <div className="text-muted-foreground">
                    {getTrendIcon(biomarker.trend)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">
                {displayBiomarkers.filter(b => b.status === 'normal').length}
              </div>
              <div className="text-xs text-muted-foreground">Normal</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-orange-600">
                {displayBiomarkers.filter(b => b.status === 'low').length}
              </div>
              <div className="text-xs text-muted-foreground">Low</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-red-600">
                {displayBiomarkers.filter(b => b.status === 'elevated').length}
              </div>
              <div className="text-xs text-muted-foreground">Elevated</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BiomarkerIndicators;
