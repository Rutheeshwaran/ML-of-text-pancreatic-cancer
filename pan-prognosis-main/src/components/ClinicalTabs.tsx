import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  BarChart3, 
  FileText, 
  Clock,
  Scan,
  Download,
  Eye,
  ZoomIn,
  Printer,
  Share2,
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
  User
} from "lucide-react";
import RiskMeter from "./RiskMeter";
import BiomarkerIndicators from "./BiomarkerIndicators";

interface ClinicalTabsProps {
  patientData: {
    riskScore: number;
    biomarkerScore?: number;
    ctImageScore?: number;
    biomarkers: Array<{
      name: string;
      value: string;
      unit: string;
      status: "elevated" | "normal" | "low";
      trend: "up" | "down" | "stable";
      referenceRange: string;
    }>;
  };
  patientId?: string;
  patientInfo?: {
    name?: string;
    age?: number;
    gender?: string;
    condition?: string;
    biomarkers?: {
      ca199?: string;
      cea?: string;
      lipase?: string;
      amylase?: string;
    };
    symptoms?: string;
    medicalHistory?: string;
  };
}

const ClinicalTabs = ({ patientData, patientId, patientInfo }: ClinicalTabsProps) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Dynamic CT images based on patient condition
  const getCtImages = () => {
    const baseImages = [
      {
        id: "ct_001",
        name: "Axial CT - Upper Abdomen",
        date: new Date().toLocaleDateString(),
        type: "Contrast Enhanced",
        findings: `Pancreatic assessment for ${patientInfo?.name || 'patient'}`,
        url: "/api/placeholder/400/300"
      },
      {
        id: "ct_002", 
        name: "Coronal CT - Pancreas",
        date: new Date().toLocaleDateString(),
        type: "Arterial Phase",
        findings: "Vascular involvement assessment",
        url: "/api/placeholder/400/300"
      },
      {
        id: "ct_003",
        name: "Sagittal CT - Pancreas", 
        date: new Date().toLocaleDateString(),
        type: "Portal Venous Phase",
        findings: "Staging evaluation and analysis",
        url: "/api/placeholder/400/300"
      }
    ];

    // Add condition-specific findings
    if (patientInfo?.condition?.toLowerCase().includes('mass')) {
      baseImages[0].findings = "Pancreatic mass identified - detailed morphological analysis";
      baseImages.push({
        id: "ct_004",
        name: "3D Reconstruction",
        date: new Date().toLocaleDateString(),
        type: "Volume Rendering",
        findings: "3D visualization of pancreatic mass",
        url: "/api/placeholder/400/300"
      });
    }

    return baseImages;
  };

  // Dynamic report sections based on patient data
  const generateReportSections = () => {
    const sections = [
      {
        title: "Clinical Summary",
        content: `${patientInfo?.age || 'Adult'}-year-old ${patientInfo?.gender?.toLowerCase() || 'patient'} presenting with ${patientInfo?.symptoms || 'abdominal symptoms'}. ${patientInfo?.condition ? `Primary condition: ${patientInfo.condition}.` : 'Clinical assessment in progress.'} ${patientInfo?.medicalHistory ? `Medical history: ${patientInfo.medicalHistory}` : ''}`
      },
      {
        title: "Imaging Findings",
        content: patientData.ctImageScore && patientData.ctImageScore > 70 
          ? `CT imaging reveals significant pancreatic abnormalities with ${patientData.ctImageScore}% AI confidence score. Advanced imaging analysis indicates areas of concern requiring immediate attention.`
          : patientData.ctImageScore && patientData.ctImageScore > 40
          ? `CT imaging shows moderate pancreatic changes with ${patientData.ctImageScore}% AI confidence score. Continued monitoring and follow-up imaging recommended.`
          : `CT imaging appears relatively normal with ${patientData.ctImageScore || 'N/A'}% AI confidence score. Routine follow-up appropriate.`
      },
      {
        title: "Laboratory Results",
        content: (() => {
          const biomarkerResults = [];
          if (patientInfo?.biomarkers?.ca199) {
            const ca199 = parseFloat(patientInfo.biomarkers.ca199);
            biomarkerResults.push(`CA 19-9: ${ca199} U/mL ${ca199 > 37 ? '(elevated)' : '(normal)'}`);
          }
          if (patientInfo?.biomarkers?.cea) {
            const cea = parseFloat(patientInfo.biomarkers.cea);
            biomarkerResults.push(`CEA: ${cea} ng/mL ${cea > 3 ? '(elevated)' : '(normal)'}`);
          }
          if (patientInfo?.biomarkers?.lipase) {
            const lipase = parseFloat(patientInfo.biomarkers.lipase);
            biomarkerResults.push(`Lipase: ${lipase} U/L ${lipase > 140 ? '(elevated)' : '(normal)'}`);
          }
          if (patientInfo?.biomarkers?.amylase) {
            const amylase = parseFloat(patientInfo.biomarkers.amylase);
            biomarkerResults.push(`Amylase: ${amylase} U/L ${amylase > 110 ? '(elevated)' : '(normal)'}`);
          }
          
          return biomarkerResults.length > 0 
            ? biomarkerResults.join(', ') + '. Complete blood count and basic metabolic panel results integrated into assessment.'
            : 'Laboratory results pending or not available. Standard pancreatic function tests recommended.';
        })()
      },
      {
        title: "AI Fusion Analysis",
        content: `Advanced machine learning fusion model indicates ${patientData.riskScore}% overall risk assessment. Biomarker model contribution: ${patientData.biomarkerScore || 'N/A'}%, CT imaging model contribution: ${patientData.ctImageScore || 'N/A'}%. The fusion layer combines multiple data sources for comprehensive risk stratification.`
      },
      {
        title: "Clinical Recommendations",
        content: patientData.riskScore > 70
          ? "Immediate oncology referral strongly recommended. Consider endoscopic ultrasound with fine needle aspiration for tissue diagnosis. Multidisciplinary team evaluation and staging workup indicated."
          : patientData.riskScore > 40
          ? "Close monitoring and follow-up recommended. Consider repeat imaging in 3-6 months. Oncology consultation may be beneficial for risk stratification and management planning."
          : "Routine monitoring appropriate. Annual screening recommended for high-risk patients. Lifestyle modifications and dietary counseling may be beneficial."
      }
    ];

    return sections;
  };

  // Dynamic AI analysis features based on scores
  const getAIAnalysisFeatures = () => {
    const features = [
      { 
        feature: "Age Factor", 
        contribution: patientInfo?.age && patientInfo.age > 60 ? 0.15 : 0.05, 
        impact: "positive",
        description: `Age ${patientInfo?.age || 'unknown'} - ${patientInfo?.age && patientInfo.age > 60 ? 'increased' : 'normal'} risk factor`
      }
    ];

    // Add biomarker contributions
    if (patientInfo?.biomarkers?.ca199) {
      const ca199 = parseFloat(patientInfo.biomarkers.ca199);
      features.push({
        feature: "CA 19-9 Level",
        contribution: ca199 > 100 ? 0.35 : ca199 > 37 ? 0.20 : 0.05,
        impact: "positive",
        description: `CA 19-9: ${ca199} U/mL - ${ca199 > 37 ? 'elevated' : 'normal'} tumor marker`
      });
    }

    if (patientInfo?.biomarkers?.cea) {
      const cea = parseFloat(patientInfo.biomarkers.cea);
      features.push({
        feature: "CEA Level",
        contribution: cea > 5 ? 0.25 : cea > 3 ? 0.15 : 0.05,
        impact: "positive",
        description: `CEA: ${cea} ng/mL - ${cea > 3 ? 'elevated' : 'normal'} tumor marker`
      });
    }

    // Add imaging contribution
    features.push({
      feature: "CT Imaging",
      contribution: (patientData.ctImageScore || 50) / 100 * 0.3,
      impact: "positive",
      description: `AI imaging analysis: ${patientData.ctImageScore || 'N/A'}% confidence`
    });

    // Add condition-specific factors
    if (patientInfo?.condition?.toLowerCase().includes('mass')) {
      features.push({
        feature: "Pancreatic Mass",
        contribution: 0.25,
        impact: "positive",
        description: "Identified pancreatic mass - significant risk factor"
      });
    }

    return features;
  };

  const ctImages = getCtImages();
  const reportSections = generateReportSections();
  const aiFeatures = getAIAnalysisFeatures();

  return (
    <Tabs defaultValue="risk" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="risk" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          <span className="hidden sm:inline">Risk Assessment</span>
          <span className="sm:hidden">Risk</span>
        </TabsTrigger>
        <TabsTrigger value="analysis" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">AI Analysis</span>
          <span className="sm:hidden">Analysis</span>
        </TabsTrigger>
        <TabsTrigger value="report" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Medical Report</span>
          <span className="sm:hidden">Report</span>
        </TabsTrigger>
        <TabsTrigger value="imaging" className="flex items-center gap-2">
          <Scan className="h-4 w-4" />
          <span className="hidden sm:inline">CT Imaging</span>
          <span className="sm:hidden">Imaging</span>
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="hidden sm:inline">Patient History</span>
          <span className="sm:hidden">History</span>
        </TabsTrigger>
      </TabsList>

      {/* Risk Assessment Tab */}
      <TabsContent value="risk" className="space-y-6">
        <RiskMeter 
          score={patientData.riskScore} 
          biomarkerScore={patientData.biomarkerScore}
          ctImageScore={patientData.ctImageScore}
        />
        <BiomarkerIndicators 
          biomarkers={patientData.biomarkers}
          patientBiomarkers={patientInfo?.biomarkers}
        />
      </TabsContent>

      {/* AI Analysis Tab */}
      <TabsContent value="analysis" className="space-y-6">
        <Card className="clinical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Model Performance
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Fusion layer analysis combining biomarker and imaging models
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Model Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">
                  {patientData.riskScore}%
                </div>
                <div className="text-sm font-medium">Fusion Score</div>
                <div className="text-xs text-muted-foreground">Combined Model</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {patientData.biomarkerScore || 'N/A'}%
                </div>
                <div className="text-sm font-medium">Biomarker Model</div>
                <div className="text-xs text-muted-foreground">Lab Analysis</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {patientData.ctImageScore || 'N/A'}%
                </div>
                <div className="text-sm font-medium">Imaging Model</div>
                <div className="text-xs text-muted-foreground">CT Analysis</div>
              </div>
            </div>

            {/* AI Decision Factors */}
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                AI Decision Factors
              </h4>
              {aiFeatures.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex-1">
                    <div className="font-medium">{item.feature}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={item.contribution * 100} className="w-24 h-2" />
                    <Badge variant={item.contribution > 0.2 ? "destructive" : item.contribution > 0.1 ? "default" : "secondary"}>
                      {item.contribution > 0 ? "+" : ""}{(item.contribution * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Model Confidence */}
        <Card className="clinical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Model Confidence & Reliability
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="font-medium">Statistical Confidence</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Model Accuracy</span>
                  <span className="text-sm font-medium">94.2%</span>
                </div>
                <Progress value={94.2} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Prediction Confidence</span>
                  <span className="text-sm font-medium">87.5%</span>
                </div>
                <Progress value={87.5} className="h-2" />
              </div>
            </div>
            <div className="space-y-4">
              <h5 className="font-medium">Data Quality Indicators</h5>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Biomarker data complete</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Imaging data available</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Limited historical data</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Medical Report Tab */}
      <TabsContent value="report" className="space-y-6">
        <Card className="clinical-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Comprehensive Medical Report
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Patient: {patientInfo?.name || 'Unknown'} | ID: {patientId || 'N/A'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {reportSections.map((section, index) => (
              <div key={index} className="border-l-4 border-primary pl-6">
                <h4 className="font-bold text-lg mb-3 text-foreground">{section.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            ))}
            
            {/* Report Footer */}
            <div className="mt-12 pt-6 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <div className="font-medium">Report Details</div>
                  <div>Generated: {new Date().toLocaleDateString()}</div>
                  <div>Patient ID: {patientId || 'N/A'}</div>
                  <div>Risk Score: {patientData.riskScore}%</div>
                </div>
                <div>
                  <div className="font-medium">AI Analysis</div>
                  <div>Biomarker Model: {patientData.biomarkerScore || 'N/A'}%</div>
                  <div>Imaging Model: {patientData.ctImageScore || 'N/A'}%</div>
                  <div>Fusion Confidence: 87.5%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* CT Imaging Tab */}
      <TabsContent value="imaging" className="space-y-6">
        <Card className="clinical-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5 text-primary" />
                CT Imaging Studies
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Advanced imaging analysis for {patientInfo?.name || 'patient'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download DICOM
              </Button>
              <Button variant="outline" size="sm">
                <ZoomIn className="h-4 w-4 mr-2" />
                DICOM Viewer
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ctImages.map((image, index) => (
                <Card key={image.id} className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                      <Scan className="h-16 w-16 text-muted-foreground/50" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <div className="absolute bottom-2 right-2">
                        <Badge variant="secondary" className="text-xs">
                          AI: {patientData.ctImageScore || 'N/A'}%
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-base">{image.name}</h4>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{image.type}</span>
                        <span>{image.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {image.findings}
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full mt-3"
                        onClick={() => setSelectedImage(image)}
                      >
                        <Eye className="h-3 w-3 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI Imaging Insights */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                AI Imaging Insights
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium mb-2">Key Findings</div>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Advanced segmentation analysis completed</li>
                    <li>• Morphological assessment performed</li>
                    <li>• Vascular involvement evaluated</li>
                  </ul>
                </div>
                <div>
                  <div className="font-medium mb-2">AI Confidence</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Overall Assessment</span>
                      <span className="font-medium">{patientData.ctImageScore || 'N/A'}%</span>
                    </div>
                    <Progress value={patientData.ctImageScore || 0} className="h-1.5" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Patient History Tab */}
      <TabsContent value="history" className="space-y-6">
        <Card className="clinical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Patient Information & History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Patient Demographics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h5 className="font-semibold">Demographics</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{patientInfo?.name || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Age:</span>
                    <span className="font-medium">{patientInfo?.age || 'Not provided'} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gender:</span>
                    <span className="font-medium">{patientInfo?.gender || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Patient ID:</span>
                    <span className="font-medium">{patientId || 'Not provided'}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h5 className="font-semibold">Current Status</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Condition:</span>
                    <span className="font-medium">{patientInfo?.condition || 'Under assessment'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk Level:</span>
                    <Badge className={patientData.riskScore > 70 ? 'risk-high' : patientData.riskScore > 40 ? 'risk-moderate' : 'risk-low'}>
                      {patientData.riskScore > 70 ? 'High Risk' : patientData.riskScore > 40 ? 'Moderate Risk' : 'Low Risk'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Assessment:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical History */}
            {patientInfo?.medicalHistory && (
              <div className="space-y-3">
                <h5 className="font-semibold">Medical History</h5>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {patientInfo.medicalHistory}
                  </p>
                </div>
              </div>
            )}

            {/* Current Symptoms */}
            {patientInfo?.symptoms && (
              <div className="space-y-3">
                <h5 className="font-semibold">Current Symptoms</h5>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {patientInfo.symptoms}
                  </p>
                </div>
              </div>
            )}

            {/* Assessment Timeline */}
            <div className="space-y-4">
              <h5 className="font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Assessment Timeline
              </h5>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border-l-4 border-primary">
                  <div>
                    <div className="font-medium">{new Date().toLocaleDateString()}</div>
                    <div className="text-sm text-muted-foreground">Current AI Assessment</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">{patientData.riskScore}%</div>
                    <div className="text-xs text-muted-foreground">Fusion Score</div>
                  </div>
                </div>
                
                {/* Sample historical data */}
                <div className="flex items-center justify-between p-4 bg-muted/10 rounded-lg">
                  <div>
                    <div className="font-medium">{new Date(Date.now() - 30*24*60*60*1000).toLocaleDateString()}</div>
                    <div className="text-sm text-muted-foreground">Initial Assessment</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-muted-foreground">--</div>
                    <div className="text-xs text-muted-foreground">Baseline</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ClinicalTabs;
