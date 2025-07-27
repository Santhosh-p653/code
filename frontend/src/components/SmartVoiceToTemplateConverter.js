import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause,
  Sparkles,
  FileText,
  Send,
  Save,
  RefreshCw,
  Wand2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { mockTemplates, mockVoiceTranscriptions } from '../data/mockData';

const SmartVoiceToTemplateConverter = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [extractedData, setExtractedData] = useState({});
  const [conversionComplete, setConversionComplete] = useState(false);
  const [conversionHistory, setConversionHistory] = useState([]);

  useEffect(() => {
    let interval;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  useEffect(() => {
    // Load conversion history from localStorage
    const saved = localStorage.getItem('voiceToTemplateHistory');
    if (saved) {
      setConversionHistory(JSON.parse(saved));
    }
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordingTime(0);
    setTranscription('');
    setConversionComplete(false);
    setExtractedData({});
    setSelectedTemplate(null);
  };

  const pauseRecording = () => {
    setIsPaused(!isPaused);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    
    // Simulate transcription with mock data
    setTimeout(() => {
      const randomTranscription = mockVoiceTranscriptions[Math.floor(Math.random() * mockVoiceTranscriptions.length)];
      setTranscription(randomTranscription);
    }, 1500);
  };

  const processVoiceToTemplate = () => {
    if (!transcription) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing to match transcription to template
    setTimeout(() => {
      // Smart template matching based on keywords
      let matchedTemplate;
      if (transcription.toLowerCase().includes('lesson plan') || transcription.toLowerCase().includes('calculus') || transcription.toLowerCase().includes('derivatives')) {
        matchedTemplate = mockTemplates.find(t => t.name.includes('Lesson Plan'));
      } else if (transcription.toLowerCase().includes('progress report') || transcription.toLowerCase().includes('student') || transcription.toLowerCase().includes('grade')) {
        matchedTemplate = mockTemplates.find(t => t.name.includes('Progress Report'));
      } else if (transcription.toLowerCase().includes('meeting') || transcription.toLowerCase().includes('attendees') || transcription.toLowerCase().includes('agenda')) {
        matchedTemplate = mockTemplates.find(t => t.name.includes('Meeting Minutes'));
      } else {
        matchedTemplate = mockTemplates[0]; // Default to first template
      }

      setSelectedTemplate(matchedTemplate);

      // Simulate AI extraction of data from transcription
      const simulatedExtraction = {};
      
      if (matchedTemplate.name.includes('Lesson Plan')) {
        simulatedExtraction.subject = extractValue(transcription, ['calculus', 'mathematics', 'algebra', 'statistics'], 'Advanced Calculus');
        simulatedExtraction.grade = extractValue(transcription, ['grade 12', 'grade 11', 'grade 10', 'grade 9'], 'Grade 12');
        simulatedExtraction.topic = extractValue(transcription, ['derivatives', 'chain rule', 'product rule', 'integration'], 'Derivatives and Chain Rule');
        simulatedExtraction.objectives = 'Students will understand and apply the chain rule and product rule for derivatives, and solve practical application problems.';
        simulatedExtraction.duration = extractValue(transcription, ['60 minutes', '90 minutes', '45 minutes'], '60');
        simulatedExtraction.materials = extractValue(transcription, ['graphing calculators', 'textbooks', 'worksheets'], 'Graphing calculators, whiteboard, practice worksheets');
        simulatedExtraction.activities = 'Introduction to chain rule concepts, guided practice problems, group work on real-world applications, individual practice time.';
        simulatedExtraction.assessment = 'Formative assessment through practice problems, exit ticket with 3 derivative problems using chain rule.';
      } else if (matchedTemplate.name.includes('Progress Report')) {
        simulatedExtraction.studentName = extractValue(transcription, ['john smith', 'jane doe', 'alex johnson'], 'John Smith');
        simulatedExtraction.studentId = extractValue(transcription, ['12345', '67890', '11111'], '12345');
        simulatedExtraction.subject = extractValue(transcription, ['mathematics', 'calculus', 'algebra'], 'Mathematics');
        simulatedExtraction.period = extractValue(transcription, ['quarter 2', 'quarter 1', 'semester 1'], 'Quarter 2');
        simulatedExtraction.grade = extractValue(transcription, ['b+', 'a-', 'b', 'a'], 'B+');
        simulatedExtraction.strengths = 'Shows strong analytical and problem-solving skills, actively participates in class discussions.';
        simulatedExtraction.improvements = 'Needs to show more detailed work steps in problem-solving, improve time management during tests.';
        simulatedExtraction.recommendations = 'Continue practicing step-by-step problem solving, consider additional practice with timed exercises.';
      } else if (matchedTemplate.name.includes('Meeting Minutes')) {
        simulatedExtraction.meetingTitle = extractValue(transcription, ['mathematics department', 'staff meeting', 'curriculum review'], 'Mathematics Department Meeting');
        simulatedExtraction.date = new Date().toISOString().split('T')[0];
        simulatedExtraction.time = '14:00';
        simulatedExtraction.attendees = extractValue(transcription, ['dr. johnson', 'mr. peterson', 'ms. chen'], 'Dr. Johnson, Mr. Peterson, Ms. Chen');
        simulatedExtraction.agenda = 'Review of new curriculum standards, implementation of weekly assessments, resource allocation discussion.';
        simulatedExtraction.discussions = 'Detailed discussion on new state curriculum requirements and how to align our current teaching methods.';
        simulatedExtraction.decisions = 'Implement weekly assessments starting next month, allocate budget for new graphing calculators.';
        simulatedExtraction.actionItems = 'Dr. Johnson - prepare assessment schedule, Mr. Peterson - research calculator options, Ms. Chen - draft new lesson plan templates.';
      }

      setExtractedData(simulatedExtraction);
      setConversionComplete(true);
      setIsProcessing(false);
    }, 3000);
  };

  const extractValue = (text, keywords, defaultValue) => {
    const lowerText = text.toLowerCase();
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        return keyword;
      }
    }
    return defaultValue;
  };

  const handleFieldChange = (fieldName, value) => {
    setExtractedData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const saveConversion = () => {
    if (selectedTemplate && Object.keys(extractedData).length > 0) {
      const newConversion = {
        id: Date.now(),
        templateName: selectedTemplate.name,
        originalTranscription: transcription,
        extractedData: { ...extractedData },
        createdAt: new Date().toLocaleString(),
        status: 'saved'
      };
      
      const updatedHistory = [newConversion, ...conversionHistory];
      setConversionHistory(updatedHistory);
      localStorage.setItem('voiceToTemplateHistory', JSON.stringify(updatedHistory));
    }
  };

  const submitForm = () => {
    if (selectedTemplate && Object.keys(extractedData).length > 0) {
      const newConversion = {
        id: Date.now(),
        templateName: selectedTemplate.name,
        originalTranscription: transcription,
        extractedData: { ...extractedData },
        createdAt: new Date().toLocaleString(),
        status: 'submitted'
      };
      
      const updatedHistory = [newConversion, ...conversionHistory];
      setConversionHistory(updatedHistory);
      localStorage.setItem('voiceToTemplateHistory', JSON.stringify(updatedHistory));
      
      // Reset form
      setTranscription('');
      setSelectedTemplate(null);
      setExtractedData({});
      setConversionComplete(false);
      setRecordingTime(0);
    }
  };

  const resetForm = () => {
    setTranscription('');
    setSelectedTemplate(null);
    setExtractedData({});
    setConversionComplete(false);
    setRecordingTime(0);
    setIsRecording(false);
    setIsPaused(false);
  };

  const renderFormField = (field) => {
    const value = extractedData[field.name] || '';
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-vertical"
            placeholder={`AI extracted: ${field.label.toLowerCase()}`}
          />
        );
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select {field.label.toLowerCase()}</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder={`AI extracted: ${field.label.toLowerCase()}`}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Sparkles className="w-10 h-10 mr-3 text-purple-600" />
            AI Voice-to-Template Converter ✨
          </h1>
          <p className="text-lg text-gray-600">
            Speak naturally and watch AI automatically fill your institutional templates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Voice Recording Section */}
          <div className="space-y-6">
            {/* Recording Interface */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="text-center space-y-6">
                {/* Recording Button */}
                <div className="relative">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
                      isRecording 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-2xl animate-pulse' 
                        : 'bg-gradient-to-r from-purple-500 to-indigo-500 shadow-xl hover:shadow-2xl'
                    }`}
                  >
                    {isRecording ? (
                      <Square className="w-8 h-8 text-white" />
                    ) : (
                      <Mic className="w-8 h-8 text-white" />
                    )}
                  </button>
                  
                  {isRecording && (
                    <div className="absolute -inset-4 border-4 border-purple-300 rounded-full animate-ping"></div>
                  )}
                </div>

                {/* Recording Controls */}
                {isRecording && (
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={pauseRecording}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full transition-colors"
                    >
                      {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                    </button>
                    
                    <div className="bg-gray-100 px-4 py-2 rounded-full">
                      <span className="font-mono text-lg font-semibold text-gray-900">
                        {formatTime(recordingTime)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Recording Status */}
                <div className="text-center">
                  {isRecording && !isPaused && (
                    <p className="text-red-600 font-semibold animate-pulse flex items-center justify-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      Recording... Speak your template content
                    </p>
                  )}
                  {isRecording && isPaused && (
                    <p className="text-yellow-600 font-semibold flex items-center justify-center">
                      <Pause className="w-4 h-4 mr-2" />
                      Recording paused
                    </p>
                  )}
                  {!isRecording && (
                    <p className="text-gray-600">
                      Click to start voice recording for AI template conversion
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Transcription Display */}
            {transcription && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Voice Transcription
                  </h3>
                  <button
                    onClick={processVoiceToTemplate}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        <span>Convert to Template</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-gray-800 leading-relaxed">{transcription}</p>
                </div>
              </div>
            )}

            {/* Processing Status */}
            {isProcessing && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto">
                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">AI Processing Your Voice</h3>
                    <p className="text-gray-600">Analyzing content and matching to templates...</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Template Form Section */}
          <div className="space-y-6">
            {conversionComplete && selectedTemplate ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                {/* Template Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                      {selectedTemplate.name}
                    </h2>
                    <p className="text-gray-600">AI-populated from your voice input</p>
                  </div>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-lg transition-colors"
                    title="Reset form"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>

                {/* Auto-filled Form */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedTemplate.fields.map(field => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        {field.label} 
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                        {extractedData[field.name] && (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI-filled
                          </span>
                        )}
                      </label>
                      {renderFormField(field)}
                    </div>
                  ))}
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={saveConversion}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Draft</span>
                  </button>
                  <button
                    onClick={submitForm}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Form</span>
                  </button>
                </div>
              </div>
            ) : !isProcessing && !transcription ? (
              /* Instructions */
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
                <div className="max-w-md mx-auto space-y-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Voice Recording</h3>
                    <p className="text-gray-600 mb-6">
                      Record your voice and let AI automatically detect and fill the appropriate template
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-4 text-left">
                    <h4 className="font-semibold text-gray-900 mb-2">✨ How it works:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Record your voice naturally</li>
                      <li>• AI transcribes and analyzes content</li>
                      <li>• Automatically selects matching template</li>
                      <li>• Pre-fills fields with extracted information</li>
                      <li>• Review and edit before submitting</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              /* Waiting State */
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
                <div className="max-w-md mx-auto">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready for AI Processing</h3>
                  <p className="text-gray-600">
                    Click "Convert to Template" to let AI analyze your transcription and auto-fill the appropriate form
                  </p>
                </div>
              </div>
            )}

            {/* Conversion History */}
            {conversionHistory.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  Recent AI Conversions ({conversionHistory.length})
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {conversionHistory.slice(0, 3).map(conversion => (
                    <div key={conversion.id} className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{conversion.templateName}</h4>
                          <p className="text-sm text-gray-600">{conversion.createdAt}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                            conversion.status === 'submitted' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {conversion.status}
                          </span>
                        </div>
                        <Sparkles className="w-5 h-5 text-purple-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartVoiceToTemplateConverter;