import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  User, 
  FileText, 
  Scan,
  Download,
  Eye,
  ExternalLink
} from "lucide-react";

interface PatientHeaderProps {
  patient: {
    id: string;
    name: string;
    age: number;
    gender: string;
    mrn: string;
    lastVisit: string;
    riskLevel: "low" | "moderate" | "high";
    riskScore: number;
    condition?: string;
  };
  onViewReport?: (patientId: string) => void;
  onViewCTImage?: (patientId: string) => void;
}

const PatientHeader = ({ patient, onViewReport, onViewCTImage }: PatientHeaderProps) => {
  const getRiskBadgeClass = (risk: string) => {
    switch (risk) {
      case "low": return "risk-low";
      case "moderate": return "risk-moderate";
      case "high": return "risk-high";
      default: return "risk-low";
    }
  };

  const getRiskLabel = (score: number) => {
    if (score < 40) return "Low Risk";
    if (score < 70) return "Moderate Risk";
    return "High Risk";
  };

  const getPatientInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const handleViewReport = () => {
    if (onViewReport) {
      onViewReport(patient.id);
    } else {
      // Default behavior - could open modal or navigate to report page
      console.log(`Viewing report for patient ${patient.id}`);
    }
  };

  const handleViewCTImage = () => {
    if (onViewCTImage) {
      onViewCTImage(patient.id);
    } else {
      // Default behavior - could open modal or navigate to imaging page
      console.log(`Viewing CT images for patient ${patient.id}`);
    }
  };

  return (
    <div className="clinical-card p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left side - Patient Info */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar className="h-16 w-16 mx-auto sm:mx-0">
            <AvatarImage src={`/api/placeholder/64/64`} alt={patient.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
              {getPatientInitials(patient.name)}
            </AvatarFallback>
          </Avatar>

          <div className="text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-2xl font-bold text-foreground">
                {patient.name}
              </h2>
              <Badge className={`${getRiskBadgeClass(patient.riskLevel)} w-fit mx-auto sm:mx-0`}>
                {getRiskLabel(patient.riskScore)} ({patient.riskScore}%)
              </Badge>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{patient.age} years • {patient.gender}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>MRN: {patient.mrn}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span>Last Visit: {patient.lastVisit}</span>
              </div>
            </div>

            {patient.condition && (
              <div className="text-sm">
                <span className="text-muted-foreground">Condition: </span>
                <span className="text-foreground font-medium">{patient.condition}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* View Report Button */}
          <Button 
            onClick={handleViewReport}
            className="btn-secondary flex items-center gap-2 justify-center"
          >
            <Eye className="h-4 w-4" />
            <span>View Report</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </Button>

          {/* View CT Images Button */}
          <Button 
            onClick={handleViewCTImage}
            className="btn-primary flex items-center gap-2 justify-center"
          >
            <Scan className="h-4 w-4" />
            <span>CT Images</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </Button>

          {/* Download Button (Optional) */}
          <Button 
            variant="outline"
            size="icon"
            className="h-12 w-12"
            title="Download patient data"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Additional Info Row */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-wrap justify-between items-center gap-4 text-sm">
          <div className="flex gap-6">
            <div>
              <span className="text-muted-foreground">Risk Score:</span>
              <span className="ml-2 font-semibold text-foreground">{patient.riskScore}%</span>
            </div>
            <div>
              <span className="text-muted-foreground">Classification:</span>
              <span className="ml-2 font-semibold text-foreground">{getRiskLabel(patient.riskScore)}</span>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHeader;
