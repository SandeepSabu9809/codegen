'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Copy, Download, Play, Loader2 } from 'lucide-react';
import { mockGenerateCode } from '../mock';

export const CodeGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('jsx');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [explanation, setExplanation] = useState('');

  const languages = [
    { value: 'jsx', label: 'React/JSX' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'html', label: 'HTML/CSS' }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setGeneratedCode('');
    setExplanation('');
    
    try {
      const result = await mockGenerateCode(prompt, selectedLanguage);
      setGeneratedCode(result.code);
      setExplanation(result.explanation);
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    // In a real app, you'd show a toast notification here
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `generated-code.${selectedLanguage === 'jsx' ? 'jsx' : selectedLanguage}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="heading-3">Describe Your Code</CardTitle>
          <CardDescription className="body-medium p-2">
            Tell our AI what kind of code you want to generate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <Textarea
                placeholder="e.g., Create a React component with a form that validates email input..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
            <div className="space-y-3">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleGenerate} 
                disabled={!prompt.trim() || isGenerating}
                className="btn-primary w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Generate Code
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Output Section */}
      {(generatedCode || isGenerating) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="heading-3">Generated Code</CardTitle>
                {explanation && (
                  <CardDescription className="body-medium mt-2">
                    {explanation}
                  </CardDescription>
                )}
              </div>
              {generatedCode && (
                <div className="flex space-x-2">
                  <Badge variant="secondary">{selectedLanguage.toUpperCase()}</Badge>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCopy}
                    className="btn-secondary"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDownload}
                    className="btn-secondary"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="code-output">
              {isGenerating ? (
                <div className="flex items-center justify-center py-8">
                  <div className="loading-spinner"></div>
                  <span className="ml-2 body-medium">Generating your code...</span>
                </div>
              ) : (
                <pre className="text-sm overflow-x-auto">
                  <code>{generatedCode}</code>
                </pre>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};