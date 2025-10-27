import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Upload, 
  FileText, 
  Scan,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  X
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import axios from 'axios'; // Added for API calls

// ===============================================================
// CHANGE #1: UPDATED INTERFACE TO MATCH YOUR MODEL'S FEATURES
// ===============================================================
interface NewPatient {
  // Your model's features
  age: string;
  sex: string; // The backend will handle 'M'/'F'
  creatinine: string;
  LYVE1: string;
  REG1B: string;
  TFF1: string;
  REG1A: string;
  // --- ADD ALL OTHER BIOMARKER FEATURES YOUR MODEL NEEDS HERE ---

  // Other form fields from the original file (preserved)
  name: string;
  gender: string;
  mrn: string;
  condition: string;
  symptoms: string;
  medicalHistory: string;
  reportFile: File | null;
  ctImageFiles: File[];
  contactNumber: string;
  emergencyContact: string;
  allergies: string;
  currentMedications: string;
}

// Interface for the response from YOUR Flask backend
interface PredictionResponse {
  prediction: string;
  class: number;
  confidence: string;
}
// ===============================================================

interface AddPatientProps {
  onAddPatient: (patient: any) => void;
}

const AddPatient = ({ onAddPatient }: AddPatientProps) => {
  // ===============================================================
  // CHANGE #2: UPDATED INITIAL STATE TO MATCH YOUR MODEL'S FEATURES
  // ===============================================================
  const [formData, setFormData] = useState<NewPatient>({
    // Initialize your model's features
    age: "",
    sex: "M", 
    creatinine: "",
    LYVE1: "",
    REG1B: "",
    TFF1: "",
    REG1A: "",
    // --- INITIALIZE ALL OTHER BIOMARKER FEATURES TO "" HERE ---

    // Other fields from the original file (preserved)
    name: "",
    gender: "",
    mrn: "",
    condition: "",
    symptoms: "",
    medicalHistory: "",
    reportFile: null,
    ctImageFiles: [],
    contactNumber: "",
    emergencyContact: "",
    allergies: "",
    currentMedications: ""
  });
  // ===============================================================

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);

  const handleInputChange = (field: keyof NewPatient, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (type: 'report' | 'ctImages', files: FileList | null) => {
    if (!files) return;

    if (type === 'report' && files[0]) {
      setFormData(prev => ({
        ...prev,
        reportFile: files[0]
      }));
      toast({
        title: "Report Uploaded",
        description: `${files[0].name} has been uploaded successfully.`
      });
    } else if (type === 'ctImages') {
      const newFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        ctImageFiles: [...prev.ctImageFiles, ...newFiles]
      }));
      toast({
        title: "CT Images Uploaded", 
        description: `${newFiles.length} CT image(s) uploaded successfully.`
      });
    }
  };

  const removeCtImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ctImageFiles: prev.ctImageFiles.filter((_, i) => i !== index)
    }));
  };

  const generateMRN = () => {
    const mrn = `MRN-${Date.now().toString().slice(-9)}`;
    setFormData(prev => ({
      ...prev,
      mrn
    }));
  };
  
  // The original calculateRiskScore function is no longer needed.

  // ===================================================================
  // CHANGE #3: REPLACED HANDLESUBMIT WITH REAL API CALL
  // ===================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPredictionResult(null);

    // Validate required fields (preserved from original)
    const requiredFields = ['name', 'age', 'gender', 'mrn'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof NewPatient]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Prepare ONLY the data your model needs
    const modelData = {
      age: parseFloat(formData.age) || 0,
      sex: formData.gender === 'Male' ? 'M' : 'F', 
      creatinine: parseFloat(formData.creatinine) || 0,
      LYVE1: parseFloat(formData.LYVE1) || 0,
      REG1B: parseFloat(formData.REG1B) || 0,
      TFF1: parseFloat(formData.TFF1) || 0,
      REG1A: parseFloat(formData.REG1A) || 0,
      // --- ADD ALL OTHER BIOMARKER FEATURES HERE, CONVERTING TO NUMBERS ---
    };

    try {
      const response = await axios.post<PredictionResponse>('http://127.0.0.1:5000/predict', modelData);
      setPredictionResult(response.data);
      toast({
        title: "Prediction Successful!",
        description: `Model diagnosis: ${response.data.prediction}`
      });

      const newPatient = {
        id: `P${String(Date.now()).slice(-3)}`,
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        mrn: formData.mrn,
        condition: response.data.prediction,
        lastVisit: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        riskLevel: response.data.class === 3 ? "high" : response.data.class === 2 ? "moderate" : "low",
        riskScore: response.data.class * 33,
        biomarkerScore: 0,
        ctImageScore: 0,
        nextAppointment: "Pending Schedule",
        contactNumber: formData.contactNumber,
        symptoms: formData.symptoms,
        medicalHistory: formData.medicalHistory,
        biomarkers: {
          creatinine: formData.creatinine,
          LYVE1: formData.LYVE1,
          REG1B: formData.REG1B,
          TFF1: formData.TFF1,
          REG1A: formData.REG1A
        },
        files: {
          report: formData.reportFile,
          ctImages: formData.ctImageFiles
        }
      };
      onAddPatient(newPatient);

      // Reset form (preserved)
      setFormData({
        age: "", sex: "M", creatinine: "", LYVE1: "", REG1B: "", TFF1: "", REG1A: "",
        name: "", gender: "", mrn: "", condition: "", symptoms: "", medicalHistory: "",
        reportFile: null, ctImageFiles: [], contactNumber: "", emergencyContact: "",
        allergies: "", currentMedications: ""
      });

    } catch (error) {
      toast({
        title: "Prediction Error",
        description: "Could not connect to the backend server. Is it running?",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      age: "", sex: "M", creatinine: "", LYVE1: "", REG1B: "", TFF1: "", REG1A: "",
      name: "", gender: "", mrn: "", condition: "", symptoms: "", medicalHistory: "",
      reportFile: null, ctImageFiles: [], contactNumber: "", emergencyContact: "",
      allergies: "", currentMedications: ""
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
          <UserPlus className="h-8 w-8 text-primary" />
          Add New Patient
        </h2>
        <p className="text-muted-foreground">
          Enter patient information and upload medical documents
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="clinical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter patient's full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="Age in years"
                min="0"
                max="120"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mrn">Medical Record Number *</Label>
              <div className="flex gap-2">
                <Input
                  id="mrn"
                  value={formData.mrn}
                  onChange={(e) => handleInputChange('mrn', e.target.value)}
                  placeholder="MRN-XXXXXXXXX"
                  required
                />
                <Button type="button" variant="outline" onClick={generateMRN}>
                  Generate
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                value={formData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                placeholder="Phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                placeholder="Emergency contact number"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="clinical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Medical Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="condition">Primary Condition</Label>
              <Input
                id="condition"
                value={formData.condition}
                onChange={(e) => handleInputChange('condition', e.target.value)}
                placeholder="e.g., Pancreatic Mass, Chronic Pancreatitis"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="symptoms">Current Symptoms</Label>
              <Textarea
                id="symptoms"
                value={formData.symptoms}
                onChange={(e) => handleInputChange('symptoms', e.target.value)}
                placeholder="Describe current symptoms..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory"
                value={formData.medicalHistory}
                onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                placeholder="Past medical history, surgeries, etc..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="allergies">Known Allergies</Label>
                <Input
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  placeholder="List any known allergies"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentMedications">Current Medications</Label>
                <Input
                  id="currentMedications"
                  value={formData.currentMedications}
                  onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                  placeholder="List current medications"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* =================================================================== */}
        {/* CHANGE #4: UPDATED BIOMARKER CARD WITH YOUR FEATURES */}
        {/* =================================================================== */}
        <Card className="clinical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Biomarker Values for Prediction
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="creatinine">Creatinine *</Label>
              <Input id="creatinine" type="number" step="any" value={formData.creatinine} onChange={(e) => handleInputChange('creatinine', e.target.value)} placeholder="e.g., 0.8" required />
              <p className="text-xs text-muted-foreground">Kidney function biomarker.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="LYVE1">LYVE1 *</Label>
              <Input id="LYVE1" type="number" step="any" value={formData.LYVE1} onChange={(e) => handleInputChange('LYVE1', e.target.value)} placeholder="Enter value" required />
              <p className="text-xs text-muted-foreground">Lymphatic vessel marker.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="REG1B">REG1B *</Label>
              <Input id="REG1B" type="number" step="any" value={formData.REG1B} onChange={(e) => handleInputChange('REG1B', e.target.value)} placeholder="Enter value" required />
              <p className="text-xs text-muted-foreground">Regenerating protein.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="TFF1">TFF1 *</Label>
              <Input id="TFF1" type="number" step="any" value={formData.TFF1} onChange={(e) => handleInputChange('TFF1', e.target.value)} placeholder="Enter value" required />
              <p className="text-xs text-muted-foreground">Trefoil factor 1.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="REG1A">REG1A *</Label>
              <Input id="REG1A" type="number" step="any" value={formData.REG1A} onChange={(e) => handleInputChange('REG1A', e.target.value)} placeholder="Enter value" required />
              <p className="text-xs text-muted-foreground">Regenerating protein alpha.</p>
            </div>
            {/* === ADD THE REST OF YOUR BIOMARKERS HERE === */}
          </CardContent>
        </Card>
        {/* =================================================================== */}

        <Card className="clinical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Medical Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reportFile">Medical Report (PDF)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="reportFile"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload('report', e.target.files)}
                  className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary file:text-white"
                />
                {formData.reportFile && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {formData.reportFile.name}
                  </Badge>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctImageFiles">CT Images (DICOM, JPG, PNG)</Label>
              <Input
                id="ctImageFiles"
                type="file"
                accept=".dcm,.jpg,.jpeg,.png,.dicom"
                multiple
                onChange={(e) => handleFileUpload('ctImages', e.target.files)}
                className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary file:text-white"
              />
              {formData.ctImageFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.ctImageFiles.map((file, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <Scan className="h-3 w-3" />
                      {file.name}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => removeCtImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={resetForm}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Form
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary min-w-32"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Add Patient
              </>
            )}
          </Button>
        </div>
      </form>

      {/* ADDED: A new card to display the prediction result */}
      {predictionResult && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <CheckCircle />
              Model Prediction Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-lg">
            <p><strong>Diagnosis:</strong> {predictionResult.prediction}</p>
            <p><strong>Confidence:</strong> {predictionResult.confidence}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddPatient;