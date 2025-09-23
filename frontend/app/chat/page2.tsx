//chat page
'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/api';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface ChatSettings {
  responseModel: string;
  searchOption: string;
  minSimilarityScore: number;
}

export default function ChatPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showChatSettings, setShowChatSettings] = useState(false);
  const [chatSettings, setChatSettings] = useState<ChatSettings>({
    responseModel: 'gpt-4',
    searchOption: 'content-only',
    minSimilarityScore: 0.7
  });
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '안녕하세요! 티움봇입니다. 무엇을 도와드릴까요?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: '새로운 대화',
      lastMessage: '안녕하세요! 티움봇입니다.',
      timestamp: new Date()
    },
    {
      id: '2',
      title: '제품 문의',
      lastMessage: '제품에 대해 더 자세히 알려주세요.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      id: '3',
      title: '가격 정보',
      lastMessage: '가격표를 확인해드릴게요.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
    }
  ]);
  
  const [checking, setChecking] = useState(true); //로그인 체크
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  async function checkLogin(){
	setChecking(true);
	setError(null);
	try {
		const res = await fetch(apiUrl('/admin/getHeader'),{
			method: 'GET',
			credentials: 'include', //필수, 브라우저가 세션 쿠키를 포함해서 보냄
			headers: { 'Accept' : 'application/json'}
		});
		if(res.status === 204 || res.status === 401) {
			//서버에 로그인 정보 없음
			setIsLoggedIn(false);
		} else if (res.ok){
			//로그인 정보가 있을 때 : 로그인 상태 처리
			const json = await res.json().catch(() => null);
			//서버가 {user: {...} }형태로 주는지 혹은 user 객체만 주는지 확인
			const user = json?.user ?? null;
			if (user){
				setIsLoggedIn(true);
				//필요한 경우 user의 상세정보 작성
				//setUserName(user.userName);
			} else {
				setIsLoggedIn(false);
			}
		} else {
			//500 기타 에러: 비로그인 상태 처리하고 에러 표시
			setIsLoggedIn(false);
			setError(`서버 오류 : ${res.status}`);
		}
	} catch(e){
		console.err('checkLogin error', e);
		//setIsLoggedIn(false);
		setIsLoggedIn(true); //임시로 로그인 처리
		setError('네트워크 오류 또는 서버 접속 실패');
	} finally {
		setChecking(false);
	}
  }
  
  useEffect(() => {
	//로그인 상태 확인
	//checkLogin();
	setIsLoggedIn(true);
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsMessageLoading(true);

    // 봇 응답 시뮬레이션
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `네, "${inputValue}"에 대해 답변드리겠습니다. 더 구체적인 정보가 필요하시면 언제든 말씀해주세요!`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsMessageLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/');
  };

  const handleSettingChange = (field: keyof ChatSettings, value: string | number) => {
    setChatSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log('챗봇 설정 저장:', chatSettings);
    setShowChatSettings(false);
    alert('설정이 저장되었습니다.');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-gray-900 text-white flex flex-col overflow-hidden`}>
        <div className="p-4 border-b border-gray-700">
          <Link href="/" className="flex items-center space-x-2 mb-4">
            {/* Character Image */}
            <div className="w-8 h-8 flex items-center justify-center">
              <img 
                src="https://static.readdy.ai/image/8cfbe681cd6be44b8057581fc3cc12d1/30a4d73a30bae5dc0789582636640c3f.png" 
                alt="TiumBot Character" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="font-['Pacifico'] text-xl text-indigo-400">TiumBot</span>
          </Link>
          <button className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-add-line w-4 h-4 flex items-center justify-center mr-2"></i>
            새 대화
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {session.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-1">
                      {session.lastMessage}
                    </p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition-all cursor-pointer">
                    <i className="ri-more-line w-4 h-4 flex items-center justify-center text-gray-400"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 space-y-2">
          <Link href="/admin" className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
            <i className="ri-settings-3-line w-5 h-5 flex items-center justify-center text-gray-400"></i>
            <span className="text-sm text-gray-300">챗봇 관리</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
          >
            <i className="ri-logout-circle-line w-5 h-5 flex items-center justify-center text-gray-400"></i>
            <span className="text-sm text-gray-300">로그아웃</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Admin Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <i className="ri-menu-line w-5 h-5 flex items-center justify-center text-gray-600"></i>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">챗봇 대화</h1>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600 relative">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <i className="ri-user-line text-indigo-600"></i>
              </div>
              <span className="text-sm text-gray-700">사용자</span>
              <i className="ri-arrow-down-s-line w-4 h-4 flex items-center justify-center text-gray-400"></i>
            </div>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>서울Tip:</strong> 1234</div>
                    <div><strong>이름:</strong> 천지</div>
                    <div><strong>부서:</strong> DevOps</div>
                    <div><strong>직급:</strong> 연구원</div>
                  </div>
                </div>
                <div className="p-2 space-y-1">
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-sm text-gray-700">
                    내 정보 수정
                  </button>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-sm text-gray-700">
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <i className="ri-robot-line text-indigo-600"></i>
            </div>
            <span className="font-medium text-gray-900">TiumBot</span>
            <span className="text-xs text-green-500 bg-green-100 px-2 py-1 rounded-full">온라인</span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
              <i className="ri-refresh-line w-5 h-5 flex items-center justify-center text-gray-600"></i>
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowChatSettings(!showChatSettings)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <i className="ri-more-line w-5 h-5 flex items-center justify-center text-gray-600"></i>
              </button>
              
              {showChatSettings && (
                <div className="absolute right-0 top-10 bg-white rounded-lg border border-gray-200 shadow-lg w-80 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">챗봇 대화 설정</h3>
                      <button
                        onClick={() => setShowChatSettings(false)}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
                      >
                        <i className="ri-close-line"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        답변 모델 선택
                      </label>
                      <select
                        value={chatSettings.responseModel}
                        onChange={(e) => handleSettingChange('responseModel', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm pr-8"
                      >
                        <option value="gpt-4">GPT-4</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        <option value="claude-3">Claude-3</option>
                        <option value="gemini-pro">Gemini Pro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        답변 옵션 선택
                      </label>
                      <select
                        value={chatSettings.searchOption}
                        onChange={(e) => handleSettingChange('searchOption', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm pr-8"
                      >
                        <option value="content-only">내용만 검색</option>
                        <option value="title-and-content">파일 제목과 내용 동시 검색</option>
                        <option value="title-then-content">파일 제목 → 내용 순차적 검색</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        챗봇 유사도 최소 점수: {chatSettings.minSimilarityScore}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={chatSettings.minSimilarityScore}
                        onChange={(e) => handleSettingChange('minSimilarityScore', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0.0</span>
                        <span>1.0</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        정해진 점수 이하의 내용은 검색이 되어도 답변에 참고하지 않습니다.
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowChatSettings(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap text-sm"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleSaveSettings}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap text-sm"
                    >
                      저장
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.isUser ? 'bg-indigo-600 ml-2' : 'bg-gray-200 mr-2'}`}>
                  {message.isUser ? (
                    <i className="ri-user-line text-white text-sm"></i>
                  ) : (
                    <i className="ri-robot-line text-gray-600 text-sm"></i>
                  )}
                </div>
                <div className={`rounded-2xl px-4 py-3 ${message.isUser ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-900'}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.isUser ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isMessageLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                  <i className="ri-robot-line text-gray-600 text-sm"></i>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="메시지를 입력하세요..."
                  className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent max-h-32 text-sm"
                  rows={1}
                  style={{ minHeight: '44px' }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isMessageLoading}
                  className="absolute right-2 bottom-2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 rounded-lg transition-colors cursor-pointer"
                >
                  <i className="ri-send-plane-line w-4 h-4 flex items-center justify-center text-white"></i>
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Enter로 전송, Shift+Enter로 줄바꿈
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
