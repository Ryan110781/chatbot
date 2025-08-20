import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Settings, Send, Bot, User, Key } from 'lucide-react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // 從 Cookies 載入 API Key
  useEffect(() => {
    const savedApiKey = getCookie('gemini_api_key')
    if (savedApiKey) {
      setApiKey(savedApiKey)
    } else {
      setShowSettings(true)
    }
  }, [])

  // 自動滾動到最新訊息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Cookie 操作函數
  const setCookie = (name, value, days = 30) => {
    const expires = new Date()
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
  }

  const getCookie = (name) => {
    const nameEQ = name + "="
    const ca = document.cookie.split(';')
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }

  // 儲存 API Key
  const saveApiKey = () => {
    if (apiKey.trim()) {
      setCookie('gemini_api_key', apiKey.trim())
      setShowSettings(false)
    }
  }

  // 發送訊息到 Gemini API
  const sendMessage = async () => {
    if (!inputMessage.trim() || !apiKey.trim()) return

    const userMessage = { role: 'user', content: inputMessage.trim() }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: inputMessage.trim()
            }]
          }]
        })
      })

      if (!response.ok) {
        throw new Error(`API 錯誤: ${response.status}`)
      }

      const data = await response.json()
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '抱歉，我無法回應這個問題。'
      
      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }])
    } catch (error) {
      console.error('發送訊息錯誤:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `錯誤: ${error.message}。請檢查您的 API Key 是否正確。` 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // 處理 Enter 鍵發送
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 標題列 */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">Gemini Chat Bot</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            設定
          </Button>
        </div>
      </div>

      {/* API Key 設定區域 */}
      {showSettings && (
        <div className="border-b border-border bg-muted/50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Key className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-medium">Gemini API Key 設定</h3>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="請輸入您的 Gemini API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={saveApiKey} disabled={!apiKey.trim()}>
                    儲存
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  您的 API Key 將安全地儲存在瀏覽器的 Cookies 中，不會傳送到其他伺服器。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* 聊天訊息區域 */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Bot className="w-16 h-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-medium text-foreground mb-2">歡迎使用 Gemini Chat Bot</h2>
                <p className="text-muted-foreground max-w-md">
                  開始與 AI 對話吧！請在下方輸入您的問題。
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div key={index} className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-primary-foreground" />
                      </div>
                    )}
                    <div className={`max-w-[70%] ${message.role === 'user' ? 'order-first' : ''}`}>
                      <Card className={message.role === 'user' ? 'bg-primary text-primary-foreground' : ''}>
                        <CardContent className="p-4">
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.content}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          <span className="ml-2 text-sm">思考中...</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 輸入區域 */}
      <div className="border-t border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <Input
              placeholder="輸入您的訊息..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!apiKey.trim() || isLoading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!inputMessage.trim() || !apiKey.trim() || isLoading}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {!apiKey.trim() && (
            <p className="text-sm text-muted-foreground mt-2">
              請先設定您的 Gemini API Key 才能開始對話。
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

