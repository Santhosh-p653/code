import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause,
  Volume2,
  FileText,
  Save,
  Copy,
  Trash2
} from 'lucide-react';
import { mockVoiceTranscriptions } from '../data/mockData';

const VoiceInput = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [savedTranscriptions, setSavedTranscriptions] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

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
    // Load saved transcriptions from localStorage
    const saved = localStorage.getItem('voiceTranscriptions');
    if (saved) {
      setSavedTranscriptions(JSON.parse(saved));
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

  const saveTranscription = () => {
    if (transcription.trim()) {
      const newTranscription = {
        id: Date.now(),
        text: transcription,
        timestamp: new Date().toLocaleString(),
        duration: recordingTime
      };
      
      const updatedSaved = [newTranscription, ...savedTranscriptions];
      setSavedTranscriptions(updatedSaved);
      localStorage.setItem('voiceTranscriptions', JSON.stringify(updatedSaved));
      
      // Reset current transcription
      setTranscription('');
      setRecordingTime(0);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const deleteTranscription = (id) => {
    const updatedSaved = savedTranscriptions.filter(item => item.id !== id);
    setSavedTranscriptions(updatedSaved);
    localStorage.setItem('voiceTranscriptions', JSON.stringify(updatedSaved));
  };

  const simulatePlayback = () => {
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Voice Input Center 🎤
          </h1>
          <p className="text-lg text-gray-600">
            Record your voice and get instant transcriptions
          </p>
        </div>

        {/* Recording Interface */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="text-center space-y-6">
            {/* Recording Button */}
            <div className="relative">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
                  isRecording 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-2xl animate-pulse' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-xl hover:shadow-2xl'
                }`}
              >
                {isRecording ? (
                  <Square className="w-12 h-12 text-white" />
                ) : (
                  <Mic className="w-12 h-12 text-white" />
                )}
              </button>
              
              {isRecording && (
                <div className="absolute -inset-4 border-4 border-red-300 rounded-full animate-ping"></div>
              )}
            </div>

            {/* Recording Controls */}
            {isRecording && (
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={pauseRecording}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full transition-colors"
                >
                  {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
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
                  Recording in progress...
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
                  Click the microphone to start recording
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Current Transcription */}
        {transcription && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Current Transcription
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={simulatePlayback}
                  disabled={isPlaying}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white p-2 rounded-lg transition-colors"
                  title="Play audio"
                >
                  {isPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => copyToClipboard(transcription)}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={saveTranscription}
                  className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg transition-colors"
                  title="Save transcription"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
              <p className="text-gray-800 leading-relaxed">{transcription}</p>
            </div>
          </div>
        )}

        {/* Saved Transcriptions */}
        {savedTranscriptions.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-green-600" />
              Saved Transcriptions ({savedTranscriptions.length})
            </h3>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {savedTranscriptions.map((item) => (
                <div key={item.id} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm text-gray-500">
                      {item.timestamp} • Duration: {formatTime(item.duration)}
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => copyToClipboard(item.text)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                        title="Copy"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTranscription(item.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-800 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-3">How to use Voice Input:</h4>
          <ul className="text-gray-700 space-y-2 text-sm">
            <li>• Click the microphone button to start recording</li>
            <li>• Use pause/play controls during recording</li>
            <li>• Click stop (square button) to end recording and get transcription</li>
            <li>• Save important transcriptions for later use</li>
            <li>• Copy transcriptions to use in templates or documents</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VoiceInput;