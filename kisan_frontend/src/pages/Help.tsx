import { Phone, MessageCircle, Bot, Volume2, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useState } from 'react';

const EMERGENCY_CONTACTS = [
  {
    title: 'Agricultural Helpline',
    number: '1800-180-1551',
    description: '24/7 support for farming queries',
    icon: Phone,
  },
  {
    title: 'Kisan Call Center',
    number: '1800-180-1551',
    description: 'Expert advice on crops and farming',
    icon: Phone,
  },
  {
    title: 'WhatsApp Support',
    number: '+91-98765-43210',
    description: 'Quick answers via WhatsApp',
    icon: MessageCircle,
  },
];

const QUICK_QUESTIONS = [
  "What's the best time to sow wheat?",
  "How to prevent pest attacks?",
  "Current mandi prices for rice?",
  "Government schemes for small farmers?",
  "Organic farming techniques",
  "Crop insurance information",
];

export default function Help() {
  const [chatMessages, setChatMessages] = useState([
    {
      time: '5:07:03 PM',
      message: "Hello! I'm your farming assistant. How can I help you today?",
      isBot: true,
    },
  ]);

  return (
    <div className="min-h-screen bg-background w-full">
      <main className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
        {/* Weather Alert */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-4 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <Cloud className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Heavy rain expected tomorrow. Prepare for harvesting.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Help & Chat Support</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Emergency Contacts & AI Assistant */}
          <div className="lg:col-span-2 space-y-6">
            {/* Emergency Contacts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Phone className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">Emergency Contacts</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {EMERGENCY_CONTACTS.map((contact, index) => (
                    <motion.div
                      key={contact.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Card className="p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-base">{contact.title}</h3>
                          <contact.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-xl font-bold text-success mb-2">
                          {contact.number}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {contact.description}
                        </p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* AI Farming Assistant */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Bot className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">AI Farming Assistant</h2>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-y-auto space-y-4">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-2 bg-card rounded-lg">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Volume2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm bg-card p-3 rounded-lg shadow-sm">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your question..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button className="bg-success hover:bg-success/90">Send</Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Quick Questions */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 sticky top-6">
                <div className="flex items-center gap-2 mb-5">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">Quick Questions</h2>
                </div>

                <div className="space-y-3">
                  {QUICK_QUESTIONS.map((question, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-all duration-200 hover:shadow-md text-sm"
                      onClick={() => {
                        setChatMessages([
                          ...chatMessages,
                          {
                            time: new Date().toLocaleTimeString('en-IN'),
                            message: question,
                            isBot: false,
                          },
                        ]);
                      }}
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
