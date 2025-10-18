'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Brain, 
  Code, 
  Zap, 
  Target, 
  Gauge, 
  Share, 
  Component, 
  FileText, 
  FileCode, 
  Code2, 
  Coffee, 
  Server, 
  Layout, 
  Database,
  ArrowRight,
  Sparkles,
  Download,
  Copy,
  ChevronRight
} from 'lucide-react';
import { CodeGenerator } from './CodeGenerator';
import { mockFeatures, mockSupportedLanguages, mockTemplates, mockCodeExamples } from '../mock';
import { useRouter } from "next/navigation";
import { useAuth, useClerk } from '@clerk/nextjs';

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import DownloadCodeButton from './ui/DownloadCodeButton';



const iconMap = {
  Brain, Code, Zap, Target, Gauge, Share, Component, FileText, FileCode, Code2, Coffee, Server, Layout, Database
};

export const HomePage = () => {
  const [activeTab, setActiveTab] = useState('generator');

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTabs = () => {
  document.getElementById("tabs-section")?.scrollIntoView({ behavior: "smooth" });
};

const router = useRouter();
const { openSignIn } = useClerk();
 const { isSignedIn } = useUser();

 

    const handleClick = () => {
      if (isSignedIn) {
        // User already signed in → navigate directly
        router.push("/next-page");
      } else {
        // User not signed in → open Clerk modal
        openSignIn({ redirectUrl: "/next-page" });
      }
    };





  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="nav-header">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Code className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              CodeGen AI
            </span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-1">
          <button className="nav-link" onClick={() => {setActiveTab("generator");scrollToTabs();}}>Generator</button>
          <button className="nav-link" onClick={() => {setActiveTab("examples");scrollToTabs();}}>Examples</button>
          <button className="nav-link" onClick={() => {setActiveTab("templates");scrollToTabs();}}>Templates</button>
          <button className="nav-link" onClick={() => {setActiveTab("about");scrollToTabs();}}>About</button>
 
        </div>


        <div className="flex items-center space-x-4">
          {/* <SignInButton mode="modal">
            <Button variant="outline">Sign In</Button>
          </SignInButton>
          <Button size="sm" className="btn-primary">
            Get Started
          </Button> */}
          {!isSignedIn ? (
            <>
              {/* This button will open the sign-in modal */}
              <SignInButton mode="modal">
                <Button variant="outline">Sign In</Button>
              </SignInButton>

              {/* This button will open the sign-up modal */}
              <SignUpButton mode="modal">
                <Button size="sm" className="btn-primary" >Sign Up</Button>
              </SignUpButton>
            </>
          ) : (
            // Show UserButton when signed in
            <UserButton 
      afterSignOutUrl="/"
      appearance={{
        elements: {
          userButtonAvatarBox: {
            width: "2.5rem",
            height: "2.5rem"
          }
        }
      }}
    />
          )}

          
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <Badge variant="secondary" className="px-3 py-1">
                <Sparkles className="h-4 w-4 mr-1" />
                Powered by OpenAI GPT
              </Badge>
            </div>
            <h1 className="heading-1">
              Generate Code with
              <br />
              <span style={{ color: 'var(--accent-text)' }}>AI Precision</span>
            </h1>
            <p className="body-large max-w-2xl mx-auto p-2" style={{ color: 'var(--text-secondary)' }}>
              Transform your ideas into production-ready code instantly. Our AI understands your requirements and generates optimized React, JavaScript, and more.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="btn-primary"
              onClick={handleClick}
            >
              Start Generating
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="btn-secondary"
              onClick={() => {setActiveTab("examples");scrollToTabs();}}
            >
              View Examples
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-center space-x-8 mt-12 text-center">
            <div>
              <div className="heading-3">50K+</div>
              <div className="body-small">Code Snippets Generated</div>
            </div>
            <div>
              <div className="heading-3">8+</div>
              <div className="body-small">Programming Languages</div>
            </div>
            <div>
              <div className="heading-3">99%</div>
              <div className="body-small">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-16">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-center mb-8">
              {/* <TabsList className="grid w-full max-w-md grid-cols-4 p-2">
                <TabsTrigger className="p-1" value="generator">Generator</TabsTrigger>
                <TabsTrigger className="p-1" value="examples">Examples</TabsTrigger>
                <TabsTrigger className="p-1" value="templates">Templates</TabsTrigger>
                <TabsTrigger className="p-1" value="about">About</TabsTrigger>
              </TabsList> */}
            </div>



          {/* //1.Generator Tab */}
          <section id="tabs-section" className="pt-4">
           <div className="container">
            <TabsContent id="generator" value="generator" className="space-y-8">
              {/* <div className="text-center space-y-4 mt-36">
                <h2 className="heading-2">AI Code Generator</h2>
                <p className="body-large max-w-2xl mx-auto p-6" style={{ color: 'var(--text-secondary)' }}>
                  Describe what you want to build, and our AI will generate the perfect code for you.
                </p>
              </div> */}
<div className="text-center space-y-4 mt-36">
  <h2 className="heading-2">AI Code Generator</h2>
  <p
    className="body-large max-w-2xl mx-auto p-6"
    style={{ color: "var(--text-secondary)" }}
  >
    Describe what you want to build, and our AI will generate the perfect code
    for you.
  </p>
  <p className="text-sm text-gray-500 italic">
    You’re viewing a demo version. Sign in to experience the complete generator.
  </p>
</div>

              <CodeGenerator />
            </TabsContent>
            </div>
          </section>


        {/* //2.Examples Tab */}
          <section id="tabs-section" className="py-16">
           <div className="container">
            <TabsContent id="examples" value="examples" className="space-y-8">
              <div className="text-center space-y-4 mt-16 ">
                <h2 className="heading-2">Code Examples</h2>
                <p className="body-large pt-6 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                  See what our AI can generate for you with these real examples.
                </p>
              </div>
              <div className="ai-grid">
  {mockCodeExamples.map((example) => (
    <Card key={example.id} className="product-card h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="heading-3">{example.title}</CardTitle>
          <Badge variant="outline">{example.language.toUpperCase()}</Badge>
        </div>
        <CardDescription className="body-medium">
          {example.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
          <p className="body-small font-medium mb-2">Prompt:</p>
          <p className="body-small text-gray-600 italic">"{example.prompt}"</p>
        </div>
        <div className="code-output max-h-48 overflow-y-auto">
          <pre className="text-xs">
            <code>{example.code.substring(0, 300)}...</code>
          </pre>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="btn-secondary flex-1">
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>

          {/* Dynamic Download Button */}
          <DownloadCodeButton 
            codeString={example.code} 
            filename={`${example.title.replace(/\s+/g, "_")}.txt`} 
          />
        </div>
      </CardContent>
    </Card>
  ))}
</div>

            </TabsContent>
             </div>
         </section>


            {/* //3.Templates Tab */}
          <section id="tabs-section" >
           <div className="container">
            <TabsContent id="templates" value="templates" className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="heading-2">Code Templates</h2>
                <p className="body-large max-w-2xl mx-auto pt-6" style={{ color: 'var(--text-secondary)' }}>
                  Start with pre-built templates for common development patterns.
                </p>
              </div>
              <div className="ai-grid">
                {mockTemplates.map((template) => (
                  <Card key={template.id} className="product-card h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="heading-3">{template.title}</CardTitle>
                        <Badge 
                          variant={template.complexity === 'Beginner' ? 'default' : 
                                 template.complexity === 'Intermediate' ? 'secondary' : 'destructive'}
                        >
                          {template.complexity}
                        </Badge>
                      </div>
                      <CardDescription className="body-medium">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {template.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button className="btn-primary w-full">
                        Use Template
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            </div>
            </section>




            <TabsContent id="features" value="about" className="space-y-6 ">
              {/* Features Section */}
              <div  className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="heading-2">Powerful Features</h2>
                  <p className="body-large max-w-2xl mx-auto pt-6" style={{ color: 'var(--text-secondary)' }}>
                    Everything you need to generate high-quality code with AI assistance.
                  </p>
                </div>
                <div className="ai-grid">
                  {mockFeatures.map((feature) => {
                    const IconComponent = iconMap[feature.icon];
                    return (
                      <Card key={feature.id} className="product-card text-center">
                        <CardHeader>
                          <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                              <IconComponent className="h-6 w-6" style={{ color: 'var(--accent-text)' }} />
                            </div>
                          </div>
                          <CardTitle className="heading-3">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="body-medium">
                            {feature.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Supported Languages */}
              <div id="languages" className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="heading-2">Supported Languages</h2>
                  <p className="body-large pt-6 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                    Generate code in your favorite programming languages and frameworks.
                  </p>
                </div>
                <div className="ai-grid max-w-4xl mx-auto">
                  {mockSupportedLanguages.map((language) => {
                    const IconComponent = iconMap[language.icon];
                    return (
                      <Card key={language.name} className="product-card text-center">
                        <CardHeader>
                          <div className="flex justify-center mb-2">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${language.color}20` }}
                            >
                              <IconComponent 
                                className="h-5 w-5" 
                                style={{ color: language.color }} 
                              />
                            </div>
                          </div>
                          <CardTitle className="heading-3 text-base">{language.name}</CardTitle>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 mt-16" style={{ backgroundColor: '#111111' }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-800 to-blue-500 rounded-lg flex items-center justify-center">
                  <Code className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg" style={{ color: 'var(--text-bottom)' }}>
                  CodeGen AI
                </span>
              </div>
              <p className="body-small">
                Generate production-ready code with AI precision. Built for developers, by developers.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--text-bottom)' }}>Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="body-small hover:text-blue-600 transition-colors">Features</a></li>
                <li><a href="#" className="body-small hover:text-blue-600 transition-colors">Examples</a></li>
                <li><a href="#" className="body-small hover:text-blue-600 transition-colors">Templates</a></li>
                <li><a href="#" className="body-small hover:text-blue-600 transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--text-bottom)' }}>Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="body-small hover:text-blue-600 transition-colors">Documentation</a></li>
                <li><a href="#" className="body-small hover:text-blue-600 transition-colors">API Reference</a></li>
                <li><a href="#" className="body-small hover:text-blue-600 transition-colors">Community</a></li>
                <li><a href="#" className="body-small hover:text-blue-600 transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--text-bottom)' }}>Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="body-small hover:text-blue-600 transition-colors">About</a></li>
                <li><a href="#" className="body-small hover:text-blue-600 transition-colors">Blog</a></li>
                <li><a href="#" className="body-small hover:text-blue-600 transition-colors">Careers</a></li>
                <li><a href="#" className="body-small hover:text-blue-600 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center" style={{ borderColor: 'var(--border-light)' }}>
            <p className="body-small">
              © 2024 CodeGen AI. All rights reserved. Built with ❤️ for developers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};