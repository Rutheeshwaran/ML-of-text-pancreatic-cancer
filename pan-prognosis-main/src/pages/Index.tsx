import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginScreen from "@/components/LoginScreen";
import MobileHeader from "@/components/MobileHeader";
import PatientHeader from "@/components/PatientHeader";
import ClinicalTabs from "@/components/ClinicalTabs";
import PatientList from "@/components/PatientList";
import AddPatient from "@/components/AddPatient";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, UserPlus } from "lucide-react";

// Initial mock patients data
const initialMockPatients = [
  {
    id: "P001",
    name: "Sarah Johnson",
    age: 58,
    gender: "Female",
    mrn: "MRN-789456123",
    lastVisit: "Jan 15, 2024",
    riskLevel: "high" as const,
    riskScore: 75,
    biomarkerScore: 65,
    ctImageScore: 78,
    condition: "Pancreatic Mass",
    nextAppointment: "Feb 2, 2024"
  },
  {
    id: "P002", 
    name: "Michael Chen",
    age: 62,
    gender: "Male",
    mrn: "MRN-456789012",
    lastVisit: "Jan 12, 2024",
    riskLevel: "moderate" as const,
    riskScore: 55,
    biomarkerScore: 50,
    ctImageScore: 60,
    condition: "Chronic Pancreatitis",
    nextAppointment: "Jan 28, 2024"
  },
  {
    id: "P003",
    name: "Emily Rodriguez",
    age: 45,
    gender: "Female", 
    mrn: "MRN-123456789",
    lastVisit: "Jan 10, 2024",
    riskLevel: "low" as const,
    riskScore: 25,
    biomarkerScore: 20,
    ctImageScore: 30,
    condition: "Routine Screening",
    nextAppointment: "Mar 10, 2024"
  },
  {
    id: "P004",
    name: "David Thompson",
    age: 71,
    gender: "Male",
    mrn: "MRN-987654321", 
    lastVisit: "Jan 8, 2024",
    riskLevel: "high" as const,
    riskScore: 85,
    biomarkerScore: 80,
    ctImageScore: 90,
    condition: "Pancreatic Adenocarcinoma",
    nextAppointment: "Jan 22, 2024"
  },
  {
    id: "P005",
    name: "Lisa Wang",
    age: 39,
    gender: "Female",
    mrn: "MRN-555666777",
    lastVisit: "Jan 5, 2024", 
    riskLevel: "moderate" as const,
    riskScore: 45,
    biomarkerScore: 40,
    ctImageScore: 50,
    condition: "Family History Screening"
  }
];

// Mock biomarkers for selected patient
const mockBiomarkers = [
  {
    name: "CA 19-9",
    value: "125",
    unit: "U/mL",
    status: "elevated" as const,
    trend: "up" as const,
    referenceRange: "0-37 U/mL",
  },
  {
    name: "CEA",
    value: "8.2",
    unit: "ng/mL",
    status: "elevated" as const,
    trend: "stable" as const,
    referenceRange: "0-3.0 ng/mL",
  },
  {
    name: "Lipase",
    value: "285",
    unit: "U/L", 
    status: "elevated" as const,
    trend: "up" as const,
    referenceRange: "10-140 U/L",
  },
  {
    name: "Amylase",
    value: "95",
    unit: "U/L",
    status: "normal" as const,
    trend: "stable" as const,
    referenceRange: "30-110 U/L",
  },
];

const Index = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [view, setView] = useState("main"); // "main", "dashboard"
  const [activeTab, setActiveTab] = useState("patients");
  const [patients, setPatients] = useState(initialMockPatients);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setView("dashboard");
  };

  const handleBackToMain = () => {
    setSelectedPatient(null);
    setView("main");
  };

  const handleAddPatient = (newPatient) => {
    setPatients(prev => [newPatient, ...prev]);
    // Switch to patients list tab to show the new patient
    setActiveTab("patients");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <MobileHeader 
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {view === "main" ? (
          // Main Dashboard with Tabs
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="patients" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">View Patients List</span>
                <span className="sm:hidden">Patients</span>
              </TabsTrigger>
              <TabsTrigger value="add-patient" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Add New Patient</span>
                <span className="sm:hidden">Add Patient</span>
              </TabsTrigger>
            </TabsList>

            {/* Patients List Tab */}
            <TabsContent value="patients" className="space-y-6">
              <PatientList
                patients={patients}
                onPatientSelect={handlePatientSelect}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </TabsContent>

            {/* Add Patient Tab */}
            <TabsContent value="add-patient" className="space-y-6">
              <AddPatient onAddPatient={handleAddPatient} />
            </TabsContent>
          </Tabs>
        ) : (
          // Patient Dashboard View
          <div className="space-y-6">
            {/* Back Button */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={handleBackToMain}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>

            {/* Patient Header */}
            {selectedPatient && (
              <PatientHeader patient={selectedPatient} />
            )}

            {/* Clinical Dashboard */}
            {selectedPatient && (
              <ClinicalTabs 
                patientData={{
                  riskScore: selectedPatient.riskScore,
                  biomarkerScore: selectedPatient.biomarkerScore,
                  ctImageScore: selectedPatient.ctImageScore,
                  biomarkers: mockBiomarkers,
                }}
                patientId={selectedPatient.id}
                patientInfo={{
                  name: selectedPatient.name,
                  age: selectedPatient.age,
                  gender: selectedPatient.gender,
                  condition: selectedPatient.condition,
                  biomarkers: selectedPatient.biomarkers, // From AddPatient form
                  symptoms: selectedPatient.symptoms,     // From AddPatient form
                  medicalHistory: selectedPatient.medicalHistory // From AddPatient form
                }}
              />
            )}

          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
