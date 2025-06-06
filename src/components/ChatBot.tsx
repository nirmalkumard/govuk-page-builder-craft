
import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
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
  const { addComponent, clearComponents } = usePageStore();

  const processPrompt = (prompt: string) => {
    const lowerPrompt = prompt.toLowerCase();
    
    // Clear existing components for new builds
    if (lowerPrompt.includes('create') || lowerPrompt.includes('build') || lowerPrompt.includes('new')) {
      clearComponents();
    }

    const components = [];

    // Contact form pattern
    if (lowerPrompt.includes('contact') && lowerPrompt.includes('form')) {
      components.push(
        { type: 'input', props: { label: 'Full name', name: 'full-name', required: true } },
        { type: 'input', props: { label: 'Email address', name: 'email', required: true } },
        { type: 'input', props: { label: 'Phone number', name: 'phone', hint: 'Optional' } },
        { type: 'textarea', props: { label: 'Message', name: 'message', required: true, hint: 'Please provide details of your enquiry' } },
        { type: 'button', props: { text: 'Send message' } }
      );
    }

    // Feedback form pattern
    if (lowerPrompt.includes('feedback') || lowerPrompt.includes('survey')) {
      components.push(
        { type: 'radios', props: { label: 'How satisfied were you with this service?', name: 'satisfaction', options: ['Very satisfied', 'Satisfied', 'Neither satisfied nor dissatisfied', 'Dissatisfied', 'Very dissatisfied'] } },
        { type: 'textarea', props: { label: 'How could we improve this service?', name: 'improvements', hint: 'Do not include personal or financial information' } },
        { type: 'checkboxes', props: { label: 'What did you use this service for?', name: 'purpose', options: ['Personal use', 'Business use', 'Research', 'Other'] } },
        { type: 'button', props: { text: 'Submit feedback' } }
      );
    }

    // Application form pattern
    if (lowerPrompt.includes('application') && lowerPrompt.includes('form')) {
      components.push(
        { type: 'input', props: { label: 'First name', name: 'first-name', required: true } },
        { type: 'input', props: { label: 'Last name', name: 'last-name', required: true } },
        { type: 'input', props: { label: 'Date of birth', name: 'date-of-birth', hint: 'For example, 27 3 1980' } },
        { type: 'input', props: { label: 'National Insurance number', name: 'ni-number', hint: 'It\'s on your National Insurance card, benefit letter, payslip or P60' } },
        { type: 'radios', props: { label: 'What is your nationality?', name: 'nationality', options: ['British', 'Irish', 'Citizen of another country'] } },
        { type: 'button', props: { text: 'Continue' } }
      );
    }

    // Simple patterns for individual components
    if (lowerPrompt.includes('button')) {
      const buttonText = prompt.match(/button.*?["'](.+?)["']/i)?.[1] || 'Button';
      components.push({ type: 'button', props: { text: buttonText } });
    }

    if (lowerPrompt.includes('input') || lowerPrompt.includes('text field')) {
      const label = prompt.match(/(?:input|field).*?["'](.+?)["']/i)?.[1] || 'Text input';
      components.push({ type: 'input', props: { label, name: label.toLowerCase().replace(/\s+/g, '-') } });
    }

    if (lowerPrompt.includes('textarea') || lowerPrompt.includes('text area')) {
      const label = prompt.match(/(?:textarea|text area).*?["'](.+?)["']/i)?.[1] || 'Text area';
      components.push({ type: 'textarea', props: { label, name: label.toLowerCase().replace(/\s+/g, '-') } });
    }

    if (lowerPrompt.includes('radio') || lowerPrompt.includes('single choice')) {
      components.push({ 
        type: 'radios', 
        props: { 
          label: 'Select an option', 
          name: 'radio-group', 
          options: ['Option 1', 'Option 2', 'Option 3'] 
        } 
      });
    }

    if (lowerPrompt.includes('checkbox') || lowerPrompt.includes('multiple choice')) {
      components.push({ 
        type: 'checkboxes', 
        props: { 
          label: 'Select options', 
          name: 'checkbox-group', 
          options: ['Option 1', 'Option 2', 'Option 3'] 
        } 
      });
    }

    // Add components to the page
    components.forEach(component => {
      addComponent(component);
    });

    // Generate response based on what was created
    let response = '';
    if (components.length > 0) {
      if (components.length === 1) {
        response = `I've added a ${components[0].type} component to your page. You can see it in the preview and customize it using the properties panel.`;
      } else {
        response = `I've created a page with ${components.length} components for you. You can see the preview and customize each component by selecting it.`;
      }
    } else {
      response = "I didn't understand exactly what you'd like to build. Try being more specific, like 'Create a contact form' or 'Add a submit button'.";
    }

    return response;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Process the prompt and generate bot response
    const botResponse = processPrompt(inputValue);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: botResponse,
      sender: 'bot',
      timestamp: new Date(),
    };

    setTimeout(() => {
      setMessages(prev => [...prev, botMessage]);
    }, 500);

    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
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
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
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
          />
          <Button onClick={handleSendMessage} size="sm">
            <Send className="w-4 h-4" />
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
