import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  Shield, 
  Eye,
  Settings
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface InteractiveRiskMeterProps {
  initialScore: number;
  title?: string;
  patientId?: string;
  onScoreChange?: (score: number) => void;
  className?: string;
}

const InteractiveRiskMeter = ({ 
  initialScore, 
  title = "AI Risk Assessment", 
  patientId,
  onScoreChange,
  className = "" 
}: InteractiveRiskMeterProps) => {
  const [score, setScore] = useState(initialScore);
  const [confidence, setConfidence] = useState(92);
  const [showConfidenceBands, setShowConfidenceBands] = useState(true);
  const [threshold, setThreshold] = useState([40, 70]);
  const [isRealTime, setIsRealTime] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      const variation = (Math.random() - 0.5) * 2; // ±1 point variation
      const newScore = Math.max(0, Math.min(100, initialScore + variation));
      setScore(Math.round(newScore));
      setConfidence(Math.max(85, Math.min(98, 92 + (Math.random() - 0.5) * 6)));
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [initialScore, isRealTime]);

  const getRiskLevel = (score: number) => {
    if (score < threshold[0]) return "low";
    if (score < threshold[1]) return "moderate";
    return "high";
  };

  const getRiskColor = (score: number) => {
    const level = getRiskLevel(score);
    switch (level) {
      case "low": return "hsl(var(--risk-low))";
      case "moderate": return "hsl(var(--risk-moderate))";
      case "high": return "hsl(var(--risk-high))";
      default: return "hsl(var(--primary))";
    }
  };

  const getRiskLabel = (score: number) => {
    const level = getRiskLevel(score);
    switch (level) {
      case "low": return "Low Risk";
      case "moderate": return "Moderate Risk"; 
      case "high": return "High Risk";
      default: return "Unknown";
    }
  };

  const getRiskDescription = (score: number) => {
    const level = getRiskLevel(score);
    switch (level) {
      case "low": return "Patient shows minimal risk factors. Continue routine monitoring.";
      case "moderate": return "Patient shows moderate risk factors. Enhanced monitoring recommended.";
      case "high": return "Patient shows significant risk factors. Immediate consultation recommended.";
      default: return "";
    }
  };

  const getTrendIcon = () => {
    const diff = score - initialScore;
    if (Math.abs(diff) < 1) return <Minus className="h-4 w-4" />;
    return diff > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const handleThresholdChange = (newThreshold: number[]) => {
    setThreshold(newThreshold);
    toast({
      title: "Risk Thresholds Updated",
      description: `Low: <${newThreshold[0]}%, Moderate: ${newThreshold[0]}-${newThreshold[1]}%, High: >${newThreshold[1]}%`,
    });
  };

  const exportRiskReport = () => {
    const report = {
      patientId,
      riskScore: score,
      confidence,
      riskLevel: getRiskLevel(score),
      thresholds: threshold,
      timestamp: lastUpdate.toISOString(),
    };
    
    // Simulate export
    toast({
      title: "Risk Report Exported",
      description: "Report has been generated and saved to patient file",
    });
    
    console.log("Risk Report:", report);
  };

  useEffect(() => {
    onScoreChange?.(score);
  }, [score, onScoreChange]);

  const riskLevel = getRiskLevel(score);

  return (
    <div className={`clinical-card-interactive ${className}`}>
      <div className="space-y-6">
        {/* Header with real-time indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {isRealTime && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {getTrendIcon()}
            <span 
              className="text-3xl font-bold"
              style={{ color: getRiskColor(score) }}
            >
              {score}%
            </span>
          </div>
        </div>

        {/* Risk Alert Banner */}
        {riskLevel === "high" && (
          <Alert className="border-destructive bg-destructive/5">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive font-medium">
              High risk patient requires immediate clinical attention
            </AlertDescription>
          </Alert>
        )}

        {/* Main Risk Visualization */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Risk Level</span>
            <Badge className={`risk-indicator risk-${riskLevel}`}>
              {getRiskLabel(score)}
            </Badge>
          </div>
          
          <div className="relative">
            <Progress 
              value={score} 
              className="h-4 bg-muted rounded-full overflow-hidden"
            />
            <div 
              className="absolute inset-0 h-4 rounded-full"
              style={{
                background: `linear-gradient(to right, 
                  hsl(var(--risk-low)) 0%, 
                  hsl(var(--risk-low)) ${threshold[0]}%, 
                  hsl(var(--risk-moderate)) ${threshold[0]}%, 
                  hsl(var(--risk-moderate)) ${threshold[1]}%, 
                  hsl(var(--risk-high)) ${threshold[1]}%, 
                  hsl(var(--risk-high)) 100%)`,
                opacity: 0.2
              }}
            />
            
            {/* Confidence bands */}
            {showConfidenceBands && (
              <div className="absolute inset-0 pointer-events-none">
                <div 
                  className="absolute h-4 bg-foreground/10 rounded-full"
                  style={{
                    left: `${Math.max(0, score - (100 - confidence) / 2)}%`,
                    width: `${Math.min(100, (100 - confidence))}%`
                  }}
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>{threshold[0]}%</span>
            <span>{threshold[1]}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">AI Confidence</span>
          </div>
          <span className="text-sm font-bold text-foreground">{confidence}%</span>
        </div>

        {/* Interactive Controls */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <Label htmlFor="confidence-bands" className="text-sm font-medium">
              Show Confidence Bands
            </Label>
            <Switch
              id="confidence-bands"
              checked={showConfidenceBands}
              onCheckedChange={setShowConfidenceBands}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="real-time" className="text-sm font-medium">
              Real-time Updates
            </Label>
            <Switch
              id="real-time"
              checked={isRealTime}
              onCheckedChange={setIsRealTime}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Risk Thresholds</Label>
            <div className="px-2">
              <Slider
                value={threshold}
                onValueChange={handleThresholdChange}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low: &lt;{threshold[0]}%</span>
              <span>Moderate: {threshold[0]}-{threshold[1]}%</span>
              <span>High: &gt;{threshold[1]}%</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            {getRiskDescription(score)}
          </p>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button onClick={exportRiskReport} variant="outline" size="sm">
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>

        {/* Last Update */}
        <div className="text-xs text-muted-foreground text-center">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default InteractiveRiskMeter;