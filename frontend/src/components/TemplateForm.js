import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Save, 
  Send, 
  Eye,
  Edit3,
  Plus,
  X,
  CheckCircle
} from 'lucide-react';
import { mockTemplates } from '../data/mockData';

const TemplateForm = () => {
  const [templates, setTemplates] = useState(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [savedForms, setSavedForms] = useState([]);

  useEffect(() => {
    // Load saved forms from localStorage
    const saved = localStorage.getItem('savedTemplateForms');
    if (saved) {
      setSavedForms(JSON.parse(saved));
    }
  }, []);

  const categories = ['all', ...new Set(templates.map(t => t.category))];
  
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    const initialFormData = {};
    template.fields.forEach(field => {
      initialFormData[field.name] = '';
    });
    setFormData(initialFormData);
    setIsPreviewMode(false);
  };

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSaveForm = () => {
    if (selectedTemplate && Object.values(formData).some(value => value.trim())) {
      const newSavedForm = {
        id: Date.now(),
        templateName: selectedTemplate.name,
        templateId: selectedTemplate.id,
        data: { ...formData },
        savedAt: new Date().toLocaleString(),
        status: 'draft'
      };
      
      const updatedSaved = [newSavedForm, ...savedForms];
      setSavedForms(updatedSaved);
      localStorage.setItem('savedTemplateForms', JSON.stringify(updatedSaved));
    }
  };

  const handleSubmitForm = () => {
    if (selectedTemplate && Object.values(formData).some(value => value.trim())) {
      const newSavedForm = {
        id: Date.now(),
        templateName: selectedTemplate.name,
        templateId: selectedTemplate.id,
        data: { ...formData },
        savedAt: new Date().toLocaleString(),
        status: 'submitted'
      };
      
      const updatedSaved = [newSavedForm, ...savedForms];
      setSavedForms(updatedSaved);
      localStorage.setItem('savedTemplateForms', JSON.stringify(updatedSaved));
      
      // Reset form
      setSelectedTemplate(null);
      setFormData({});
    }
  };

  const loadSavedForm = (savedForm) => {
    const template = templates.find(t => t.id === savedForm.templateId);
    if (template) {
      setSelectedTemplate(template);
      setFormData(savedForm.data);
      setIsPreviewMode(false);
    }
  };

  const deleteSavedForm = (formId) => {
    const updatedSaved = savedForms.filter(form => form.id !== formId);
    setSavedForms(updatedSaved);
    localStorage.setItem('savedTemplateForms', JSON.stringify(updatedSaved));
  };

  const renderFormField = (field) => {
    const value = formData[field.name] || '';
    
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            required={field.required}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            required={field.required}
          />
        );
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required={field.required}
          >
            <option value="">Select {field.label.toLowerCase()}</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            required={field.required}
            min="0"
          />
        );
      
      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required={field.required}
          />
        );
      
      case 'time':
        return (
          <input
            type="time"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required={field.required}
          />
        );
      
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            required={field.required}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Template Forms 📋
          </h1>
          <p className="text-lg text-gray-600">
            Fill out institutional templates quickly and efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Selection */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search and Filter */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Template List */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Available Templates</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredTemplates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      selectedTemplate?.id === template.id
                        ? 'bg-blue-50 border-blue-300 shadow-md'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                        <p className="text-sm text-gray-500">{template.category}</p>
                      </div>
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Forms */}
            {savedForms.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Saved Forms ({savedForms.length})</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {savedForms.slice(0, 5).map(form => (
                    <div key={form.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{form.templateName}</h4>
                          <p className="text-xs text-gray-500">{form.savedAt}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                            form.status === 'submitted' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {form.status}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => loadSavedForm(form)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                            title="Load"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteSavedForm(form.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                            title="Delete"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Area */}
          <div className="lg:col-span-2">
            {selectedTemplate ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                {/* Form Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedTemplate.name}</h2>
                    <p className="text-gray-600">{selectedTemplate.category}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                        isPreviewMode 
                          ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      <span>{isPreviewMode ? 'Edit' : 'Preview'}</span>
                    </button>
                  </div>
                </div>

                {/* Form Content */}
                {isPreviewMode ? (
                  /* Preview Mode */
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Preview</h3>
                      {selectedTemplate.fields.map(field => (
                        <div key={field.name} className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            {formData[field.name] || <span className="text-gray-400 italic">No data entered</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Edit Mode */
                  <form className="space-y-6">
                    {selectedTemplate.fields.map(field => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {renderFormField(field)}
                      </div>
                    ))}
                  </form>
                )}

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSaveForm}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Draft</span>
                  </button>
                  <button
                    onClick={handleSubmitForm}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Form</span>
                  </button>
                </div>
              </div>
            ) : (
              /* No Template Selected */
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Template</h3>
                  <p className="text-gray-600 mb-6">
                    Choose a template from the sidebar to start filling out your form
                  </p>
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      💡 <strong>Tip:</strong> Use the search and filter options to quickly find the template you need
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateForm;