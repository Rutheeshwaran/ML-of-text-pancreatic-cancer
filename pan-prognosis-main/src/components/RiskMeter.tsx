import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  TestTube, 
  Scan,
  TrendingUp,
  Brain,
  Layers
} from "lucide-react";

interface RiskMeterProps {
  score: number; // Overall fusion score
  biomarkerScore?: number; // Individual biomarker model score
  ctImageScore?: number; // Individual CT image model score
  title?: string;
  className?: string;
}

const RiskMeter = ({ 
  score, 
  biomarkerScore = 65, // Default biomarker score
  ctImageScore = 78,   // Default CT image score
  title = "AI Cancer Risk Assessment", 
  className = "" 
}: RiskMeterProps) => {
  
  const getRiskColor = (score: number) => {
    if (score < 40) return "hsl(var(--risk-low))";
    if (score < 70) return "hsl(var(--risk-moderate))";
    return "hsl(var(--risk-high))";
  };

  const getRiskLabel = (score: number) => {
    if (score < 40) return "Low Risk";
    if (score < 70) return "Moderate Risk";
    return "High Risk";
  };

  const getRiskDescription = (score: number) => {
    if (score < 40) return "Patient shows minimal risk factors for pancreatic cancer";
    if (score < 70) return "Patient shows moderate risk factors - monitoring recommended";
    return "Patient shows significant risk factors - immediate consultation recommended";
  };

  const getRiskBadgeClass = (score: number) => {
    if (score < 40) return "risk-low";
    if (score < 70) return "risk-moderate";
    return "risk-high";
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Fusion Score Card */}
      <Card className="clinical-card-elevated">
        <CardHeader className="text-center pb-2">
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            <Brain className="h-6 w-6" />
            {title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            AI Fusion Layer Analysis
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {/* Main Score Display */}
          <div className="space-y-3">
            <div className="relative">
              <div 
                className="text-6xl font-bold"
                style={{ color: getRiskColor(score) }}
              >
                {score}%
              </div>
              <Badge 
                className={`${getRiskBadgeClass(score)} absolute -top-2 -right-2`}
              >
                {getRiskLabel(score)}
              </Badge>
            </div>
            
            <Progress 
              value={score} 
              className="h-3 bg-muted"
              style={{
                '--progress-foreground': getRiskColor(score)
              } as React.CSSProperties}
            />
          </div>

          <p className="text-sm text-muted-foreground px-4">
            {getRiskDescription(score)}
          </p>

          {/* Fusion Layer Indicator */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <Layers className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium">
              Fusion Layer Result
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Individual Model Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Biomarker Model Score */}
        <Card className="clinical-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TestTube className="h-5 w-5 text-primary" />
              Biomarker Model
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div 
                className="text-3xl font-bold"
                style={{ color: getRiskColor(biomarkerScore) }}
              >
                {biomarkerScore}%
              </div>
              <Badge 
                className={`${getRiskBadgeClass(biomarkerScore)} text-xs`}
              >
                {getRiskLabel(biomarkerScore)}
              </Badge>
            </div>
            
            <Progress 
              value={biomarkerScore} 
              className="h-2 bg-muted"
              style={{
                '--progress-foreground': getRiskColor(biomarkerScore)
              } as React.CSSProperties}
            />
            
            <p className="text-xs text-muted-foreground">
              Based on CA 19-9, CEA, Lipase analysis
            </p>
          </CardContent>
        </Card>

        {/* CT Image Model Score */}
        <Card className="clinical-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Scan className="h-5 w-5 text-primary" />
              CT Image Model
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div 
                className="text-3xl font-bold"
                style={{ color: getRiskColor(ctImageScore) }}
              >
                {ctImageScore}%
              </div>
              <Badge 
                className={`${getRiskBadgeClass(ctImageScore)} text-xs`}
              >
                {getRiskLabel(ctImageScore)}
              </Badge>
            </div>
            
            <Progress 
              value={ctImageScore} 
              className="h-2 bg-muted"
              style={{
                '--progress-foreground': getRiskColor(ctImageScore)
              } as React.CSSProperties}
            />
            
            <p className="text-xs text-muted-foreground">
              Based on pancreatic imaging analysis
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Model Fusion Explanation */}
      <Card className="clinical-card border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-sm">AI Fusion Analysis</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The overall risk score is calculated using a fusion layer that combines 
                biomarker predictions ({biomarkerScore}%) and CT imaging analysis ({ctImageScore}%) 
                to provide a comprehensive risk assessment of {score}%.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskMeter;
