
import React, { useState } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePageStore } from '../store/pageStore';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your GOV.UK page builder assistant. Tell me what kind of page you'd like to build, and I'll help you create it. For example, you can say 'Create a contact form' or 'Add a feedback survey'.",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { addComponent, clearComponents, components } = usePageStore();

  const processPrompt = (prompt: string) => {
    console.log('🤖 ChatBot: Processing prompt:', prompt);
    const lowerPrompt = prompt.toLowerCase().trim();
    
    // Clear existing components for new builds
    if (lowerPrompt.includes('create') || lowerPrompt.includes('build') || lowerPrompt.includes('new')) {
      console.log('🧹 ChatBot: Clearing existing components');
      clearComponents();
    }

    const componentsToAdd = [];

    // Enhanced pattern matching with more specific checks
    if (lowerPrompt.includes('contact form') || lowerPrompt.includes('contact page')) {
      console.log('📝 ChatBot: Creating contact form');
      componentsToAdd.push(
        { type: 'input' as const, props: { label: 'Full name', name: 'full-name', required: true, placeholder: 'Enter your full name' } },
        { type: 'input' as const, props: { label: 'Email address', name: 'email', required: true, placeholder: 'Enter your email address' } },
        { type: 'input' as const, props: { label: 'Phone number', name: 'phone', hint: 'Optional', placeholder: 'Enter your phone number' } },
        { type: 'textarea' as const, props: { label: 'Message', name: 'message', required: true, hint: 'Please provide details of your enquiry', placeholder: 'Enter your message' } },
        { type: 'button' as const, props: { text: 'Send message', variant: 'primary' } }
      );
    }
    else if (lowerPrompt.includes('feedback') || lowerPrompt.includes('survey') || lowerPrompt.includes('satisfaction')) {
      console.log('📊 ChatBot: Creating feedback form');
      componentsToAdd.push(
        { type: 'radios' as const, props: { 
          label: 'How satisfied were you with this service?', 
          name: 'satisfaction', 
          required: true,
          options: ['Very satisfied', 'Satisfied', 'Neither satisfied nor dissatisfied', 'Dissatisfied', 'Very dissatisfied'] 
        }},
        { type: 'textarea' as const, props: { 
          label: 'How could we improve this service?', 
          name: 'improvements', 
          hint: 'Do not include personal or financial information',
          placeholder: 'Enter your suggestions'
        }},
        { type: 'checkboxes' as const, props: { 
          label: 'What did you use this service for?', 
          name: 'purpose', 
          options: ['Personal use', 'Business use', 'Research', 'Other'] 
        }},
        { type: 'button' as const, props: { text: 'Submit feedback', variant: 'primary' } }
      );
    }
    else if (lowerPrompt.includes('application form') || lowerPrompt.includes('application') || lowerPrompt.includes('apply') || lowerPrompt.includes('registration')) {
      console.log('📄 ChatBot: Creating application form');
      componentsToAdd.push(
        { type: 'input' as const, props: { label: 'First name', name: 'first-name', required: true, placeholder: 'Enter your first name' } },
        { type: 'input' as const, props: { label: 'Last name', name: 'last-name', required: true, placeholder: 'Enter your last name' } },
        { type: 'input' as const, props: { label: 'Date of birth', name: 'date-of-birth', hint: 'For example, 27 3 1980', placeholder: 'DD MM YYYY' } },
        { type: 'input' as const, props: { label: 'National Insurance number', name: 'ni-number', hint: 'It\'s on your National Insurance card, benefit letter, payslip or P60', placeholder: 'QQ 12 34 56 C' } },
        { type: 'radios' as const, props: { 
          label: 'What is your nationality?', 
          name: 'nationality',
          required: true, 
          options: ['British', 'Irish', 'Citizen of another country'] 
        }},
        { type: 'button' as const, props: { text: 'Continue', variant: 'primary' } }
      );
    }
    else if (lowerPrompt.includes('submit button') || lowerPrompt.includes('add button') || lowerPrompt.includes('button')) {
      console.log('🔘 ChatBot: Creating button');
      const buttonText = extractQuotedText(prompt) || 'Submit';
      componentsToAdd.push({ type: 'button' as const, props: { text: buttonText, variant: 'primary' } });
    }
    else if (lowerPrompt.includes('input') || lowerPrompt.includes('text field')) {
      console.log('📝 ChatBot: Creating input field');
      const label = extractQuotedText(prompt) || 'Text input';
      componentsToAdd.push({ 
        type: 'input' as const, 
        props: { 
          label, 
          name: label.toLowerCase().replace(/\s+/g, '-'),
          required: lowerPrompt.includes('required'),
          placeholder: `Enter ${label.toLowerCase()}`
        } 
      });
    }
    else if (lowerPrompt.includes('textarea') || lowerPrompt.includes('text area')) {
      console.log('📄 ChatBot: Creating textarea');
      const label = extractQuotedText(prompt) || 'Text area';
      componentsToAdd.push({ 
        type: 'textarea' as const, 
        props: { 
          label, 
          name: label.toLowerCase().replace(/\s+/g, '-'),
          required: lowerPrompt.includes('required'),
          placeholder: `Enter ${label.toLowerCase()}`
        } 
      });
    }
    else if (lowerPrompt.includes('radio') || lowerPrompt.includes('single choice')) {
      console.log('🔘 ChatBot: Creating radio buttons');
      const options = extractOptions(prompt) || ['Option 1', 'Option 2', 'Option 3'];
      componentsToAdd.push({ 
        type: 'radios' as const, 
        props: { 
          label: 'Select an option', 
          name: 'radio-group', 
          options
        } 
      });
    }
    else if (lowerPrompt.includes('checkbox') || lowerPrompt.includes('multiple choice')) {
      console.log('☑️ ChatBot: Creating checkboxes');
      const options = extractOptions(prompt) || ['Option 1', 'Option 2', 'Option 3'];
      componentsToAdd.push({ 
        type: 'checkboxes' as const, 
        props: { 
          label: 'Select options', 
          name: 'checkbox-group', 
          options
        } 
      });
    }

    // Add components with a small delay to ensure proper state updates
    console.log('➕ ChatBot: Adding components to page:', componentsToAdd.length);
    
    if (componentsToAdd.length > 0) {
      componentsToAdd.forEach((component, index) => {
        setTimeout(() => {
          console.log(`Adding component ${index + 1}/${componentsToAdd.length}:`, component);
          addComponent(component);
        }, index * 50); // Small delay between additions
      });
    }

    // Generate response based on what was created
    let response = '';
    if (componentsToAdd.length > 0) {
      const componentTypes = componentsToAdd.map(c => c.type).join(', ');
      if (componentsToAdd.length === 1) {
        response = `✅ I've added a ${componentsToAdd[0].type} component to your page. You can see it in the preview and customize it using the properties panel.`;
      } else {
        response = `✅ I've created a page with ${componentsToAdd.length} components (${componentTypes}) for you. You can see the preview and customize each component by selecting it.`;
      }
    } else {
      response = `❓ I didn't understand exactly what you'd like to build. Try one of these specific commands:

• "Create a contact form" - Builds a complete contact form
• "Build a feedback survey" - Creates a satisfaction survey  
• "Make an application form" - Builds a government application form
• "Add a submit button" - Adds a single button

Or try being more specific about individual components like "add an input field" or "create radio buttons".`;
    }

    console.log('🤖 ChatBot: Generated response:', response);
    return response;
  };

  // Helper function to extract quoted text
  const extractQuotedText = (text: string): string | null => {
    const matches = text.match(/["']([^"']+)["']/);
    return matches ? matches[1] : null;
  };

  // Helper function to extract options from text
  const extractOptions = (text: string): string[] | null => {
    const optionMatches = text.match(/options?:\s*\[([^\]]+)\]/i);
    if (optionMatches) {
      return optionMatches[1].split(',').map(opt => opt.trim().replace(/["']/g, ''));
    }
    return null;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    console.log('💬 ChatBot: User message:', inputValue);
    setIsProcessing(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Process the prompt and generate bot response
    try {
      const botResponse = processPrompt(inputValue);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsProcessing(false);
        console.log('✅ ChatBot: Message processing complete');
      }, 1000); // Increased delay to allow components to be added
    } catch (error) {
      console.error('❌ ChatBot: Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "❌ Sorry, I encountered an error while processing your request. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, errorMessage]);
        setIsProcessing(false);
      }, 500);
    }

    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isProcessing) {
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-300 bg-white">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">AI Page Builder</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">Tell me what page you'd like to build</p>
        <p className="text-xs text-gray-500 mt-1">Components on page: {components.length}</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === 'bot' && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
                  {message.sender === 'user' && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p className="text-sm">Creating your page components...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-300 bg-white">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your request here..."
            className="flex-1"
            disabled={isProcessing}
          />
          <Button 
            onClick={handleSendMessage} 
            size="sm"
            disabled={isProcessing || !inputValue.trim()}
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
        <div className="mt-2 space-y-1">
          <p className="text-xs text-gray-500">
            Try these exact commands:
          </p>
          <div className="flex flex-wrap gap-1">
            {['Create a contact form', 'Build a feedback survey', 'Make an application form', 'Add a submit button'].map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInputValue(prompt)}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border text-gray-700"
                disabled={isProcessing}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
