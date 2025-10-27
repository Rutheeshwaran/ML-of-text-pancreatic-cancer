import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CalendarDays, 
  User, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  ChevronRight,
  Search,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  mrn: string;
  lastVisit: string;
  riskLevel: "low" | "moderate" | "high";
  riskScore: number;
  condition?: string;
  nextAppointment?: string;
}

interface PatientListProps {
  patients: Patient[];
  onPatientSelect: (patient: Patient) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const PatientList = ({ patients, onPatientSelect, searchQuery, onSearchChange }: PatientListProps) => {
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

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.condition?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search and Filter Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Patient Dashboard</h2>
          <p className="text-muted-foreground text-sm">
            {filteredPatients.length} patients • Click to view detailed assessment
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Patient List */}
      <div className="grid gap-4">
        {filteredPatients.map((patient) => (
          <Card 
            key={patient.id} 
            className="clinical-card-interactive cursor-pointer transition-all duration-200"
            onClick={() => onPatientSelect(patient)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {/* Left side - Patient Info */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getPatientInitials(patient.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground text-lg">
                        {patient.name}
                      </h3>
                      <Badge className={`${getRiskBadgeClass(patient.riskLevel)} text-xs`}>
                        {getRiskLabel(patient.riskScore)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{patient.age}y • {patient.gender}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>{patient.mrn}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        <span>Last: {patient.lastVisit}</span>
                      </div>
                    </div>

                    {patient.condition && (
                      <div className="text-sm text-muted-foreground">
                        <strong>Condition:</strong> {patient.condition}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side - Risk Score and Action */}
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {patient.riskScore}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Risk Score
                    </div>
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              {/* Additional Info Bar */}
              {patient.nextAppointment && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Next appointment:</span>
                    <span className="text-foreground font-medium">{patient.nextAppointment}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredPatients.length === 0 && (
          <Card className="clinical-card p-12 text-center">
            <div className="space-y-2">
              <Search className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold text-foreground">No patients found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or add a new patient.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PatientList;
