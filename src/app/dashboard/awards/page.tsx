'use client'

import { useState, useRef, useEffect } from 'react'

type Message = {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

export default function WageChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hello! I'm your Fair Work & Awards specialist. I can help you understand modern award rates, leave entitlements, and compliance obligations. What would you like to know today?",
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!input.trim()) return

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsTyping(true)

        // Simulating AI thinking/response
        setTimeout(() => {
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: generateMockResponse(userMsg.content),
                timestamp: new Date()
            }
            setMessages(prev => [...prev, botResponse])
            setIsTyping(false)
        }, 1500)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen bg-slate-950">
            {/* Header */}
            <header className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-xl">
                    🤖
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white">Wage & Award Chat</h1>
                    <p className="text-xs text-slate-400">Powered by Fair Work data (v2.1)</p>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar" ref={scrollRef}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] md:max-w-[60%] rounded-2xl p-4 shadow-sm ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
                            }`}>
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                            <div className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-500'}`}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-none p-4 flex items-center gap-1">
                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-900 border-t border-slate-800">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about award rates, penalties, or leave..."
                        className="flex-1 bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-xl font-medium transition-colors flex items-center"
                    >
                        Send
                    </button>
                </form>
                <p className="text-center text-[10px] text-slate-600 mt-2">
                    AI can make mistakes. Always verify wage rates with the Fair Work Ombudsman.
                </p>
            </div>
        </div>
    )
}

function generateMockResponse(query: string): string {
    const q = query.toLowerCase()

    if (q.includes('clerk') || q.includes('admin')) {
        return "Under the Clerks - Private Sector Award 2020 [MA000002]:\n\n• Level 1 Ordinary Rate: $24.10/hr\n• Saturday Penalty: 125%\n• Sunday Penalty: 200%\n\nWould you like me to calculate the weekly wage for a specific classification?"
    }

    if (q.includes('hospitality') || q.includes('cafe')) {
        return "For the Hospitality Industry (General) Award 2020 [MA000009]:\n\n• Level 2 (Food & Bev) Rate: $25.20/hr\n• Casual Loading: 25%\n• Public Holiday: 225%\n\nAre you employing casuals or full-time staff?"
    }

    if (q.includes('leave') || q.includes('sick')) {
        return "Full-time employees are entitled to 10 days of paid personal/carer's leave (sick leave) per year. This accumulates year to year. Casual employees are entitled to 2 days of unpaid carer's leave per occasion."
    }

    return "I can help with that. Could you specify which Industry Award applies to your business? (e.g., Clerks Private Sector, Manufacturing, Hospitality). Typically, I need to know the employee's level and age to provide an exact rate."
}
