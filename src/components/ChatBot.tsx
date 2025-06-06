
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
    console.log('🤖 Processing prompt:', prompt);
    const lowerPrompt = prompt.toLowerCase();
    
    // Clear existing components for new builds
    if (lowerPrompt.includes('create') || lowerPrompt.includes('build') || lowerPrompt.includes('new')) {
      console.log('🧹 Clearing existing components');
      clearComponents();
    }

    const componentsToAdd = [];

    // Enhanced contact form pattern
    if ((lowerPrompt.includes('contact') && lowerPrompt.includes('form')) || 
        lowerPrompt.includes('contact page')) {
      console.log('📝 Creating contact form');
      componentsToAdd.push(
        { type: 'input', props: { label: 'Full name', name: 'full-name', required: true } },
        { type: 'input', props: { label: 'Email address', name: 'email', required: true } },
        { type: 'input', props: { label: 'Phone number', name: 'phone', hint: 'Optional' } },
        { type: 'textarea', props: { label: 'Message', name: 'message', required: true, hint: 'Please provide details of your enquiry' } },
        { type: 'button', props: { text: 'Send message' } }
      );
    }

    // Enhanced feedback form pattern
    else if (lowerPrompt.includes('feedback') || lowerPrompt.includes('survey') || 
             lowerPrompt.includes('satisfaction')) {
      console.log('📊 Creating feedback form');
      componentsToAdd.push(
        { type: 'radios', props: { 
          label: 'How satisfied were you with this service?', 
          name: 'satisfaction', 
          options: ['Very satisfied', 'Satisfied', 'Neither satisfied nor dissatisfied', 'Dissatisfied', 'Very dissatisfied'] 
        }},
        { type: 'textarea', props: { 
          label: 'How could we improve this service?', 
          name: 'improvements', 
          hint: 'Do not include personal or financial information' 
        }},
        { type: 'checkboxes', props: { 
          label: 'What did you use this service for?', 
          name: 'purpose', 
          options: ['Personal use', 'Business use', 'Research', 'Other'] 
        }},
        { type: 'button', props: { text: 'Submit feedback' } }
      );
    }

    // Enhanced application form pattern
    else if ((lowerPrompt.includes('application') && lowerPrompt.includes('form')) ||
             lowerPrompt.includes('apply') || lowerPrompt.includes('registration')) {
      console.log('📄 Creating application form');
      componentsToAdd.push(
        { type: 'input', props: { label: 'First name', name: 'first-name', required: true } },
        { type: 'input', props: { label: 'Last name', name: 'last-name', required: true } },
        { type: 'input', props: { label: 'Date of birth', name: 'date-of-birth', hint: 'For example, 27 3 1980' } },
        { type: 'input', props: { label: 'National Insurance number', name: 'ni-number', hint: 'It\'s on your National Insurance card, benefit letter, payslip or P60' } },
        { type: 'radios', props: { 
          label: 'What is your nationality?', 
          name: 'nationality', 
          options: ['British', 'Irish', 'Citizen of another country'] 
        }},
        { type: 'button', props: { text: 'Continue' } }
      );
    }

    // Individual component patterns with better extraction
    else if (lowerPrompt.includes('button')) {
      console.log('🔘 Creating button');
      const buttonText = extractQuotedText(prompt) || 'Button';
      componentsToAdd.push({ type: 'button', props: { text: buttonText } });
    }

    else if (lowerPrompt.includes('input') || lowerPrompt.includes('text field')) {
      console.log('📝 Creating input field');
      const label = extractQuotedText(prompt) || 'Text input';
      componentsToAdd.push({ 
        type: 'input', 
        props: { 
          label, 
          name: label.toLowerCase().replace(/\s+/g, '-'),
          required: lowerPrompt.includes('required')
        } 
      });
    }

    else if (lowerPrompt.includes('textarea') || lowerPrompt.includes('text area')) {
      console.log('📄 Creating textarea');
      const label = extractQuotedText(prompt) || 'Text area';
      componentsToAdd.push({ 
        type: 'textarea', 
        props: { 
          label, 
          name: label.toLowerCase().replace(/\s+/g, '-'),
          required: lowerPrompt.includes('required')
        } 
      });
    }

    else if (lowerPrompt.includes('radio') || lowerPrompt.includes('single choice')) {
      console.log('🔘 Creating radio buttons');
      const options = extractOptions(prompt) || ['Option 1', 'Option 2', 'Option 3'];
      componentsToAdd.push({ 
        type: 'radios', 
        props: { 
          label: 'Select an option', 
          name: 'radio-group', 
          options
        } 
      });
    }

    else if (lowerPrompt.includes('checkbox') || lowerPrompt.includes('multiple choice')) {
      console.log('☑️ Creating checkboxes');
      const options = extractOptions(prompt) || ['Option 1', 'Option 2', 'Option 3'];
      componentsToAdd.push({ 
        type: 'checkboxes', 
        props: { 
          label: 'Select options', 
          name: 'checkbox-group', 
          options
        } 
      });
    }

    // Add components to the page
    console.log('➕ Adding components to page:', componentsToAdd);
    componentsToAdd.forEach((component, index) => {
      console.log(`Adding component ${index + 1}:`, component);
      addComponent(component);
    });

    // Generate response based on what was created
    let response = '';
    if (componentsToAdd.length > 0) {
      if (componentsToAdd.length === 1) {
        response = `✅ I've added a ${componentsToAdd[0].type} component to your page. You can see it in the preview and customize it using the properties panel.`;
      } else {
        response = `✅ I've created a page with ${componentsToAdd.length} components for you. You can see the preview and customize each component by selecting it.`;
      }
    } else {
      response = "❓ I didn't understand exactly what you'd like to build. Try being more specific, like:\n• 'Create a contact form'\n• 'Add a submit button'\n• 'Build a feedback survey'\n• 'Make an application form'";
    }

    console.log('🤖 Generated response:', response);
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

    console.log('💬 User message:', inputValue);
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
        console.log('✅ Message processing complete');
      }, 800);
    } catch (error) {
      console.error('❌ Error processing message:', error);
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
                  <p className="text-sm">Processing your request...</p>
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
        <p className="text-xs text-gray-500 mt-2">
          Try: "Create a contact form", "Add a feedback survey", or "Build an application form"
        </p>
      </div>
    </div>
  );
};

export default ChatBot;
