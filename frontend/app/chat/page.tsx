//chat page
'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminHeader from '../../components/AdminHeader';
import { apiUrl } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useLoading } from '@/hooks/useLoading';
import FullPageSpinner from '../../components/FullPageSpinner';

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
  const { isLoggedIn, checking, error, logout, manager } = useAuth(); //훅 호출
  
  const { isLoading, setIsLoading, wrap } = useLoading();
    
  //const [isLoading, setIsLoading] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showChatSettings, setShowChatSettings] = useState(false);
  const [chatSettings2, setChatSettings2] = useState<ChatSettings>({
    responseModel: 'gpt-4',
    searchOption: 'content-only',
    minSimilarityScore: 0.7
  });
  const router = useRouter();
  
  const [inputValue, setInputValue] = useState('');
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  //const messagesEndRef = useRef(null);
  
  // 설정 상태 (localStorage에 저장), 기존 코드
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem('tium_settings');
      return raw ? JSON.parse(raw) : { apiUrl: 'http://192.168.11.146:8080/chat', autoScroll: true };
    } catch {
      return { apiUrl: 'http://192.168.11.146:8080/chat', autoScroll: true };
    }
  });
  const [showSettings, setShowSettings] = useState(false);
  
  //대화
  const [question, setQuestion] = useState('');
  //const [chatHistory, setChatHistory] = useState([]);
  const [chatHistory, setChatHistory] = useState<
    { role: 'user' | 'bot'; message: string; pending?: boolean; id?: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  
  //대화목록: 추후 DB 설계 후 DB에서 정보 가져와서 화면에 보여주는 방식으로 변경하기
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
  
  //const [checking, setChecking] = useState(true); //로그인 체크
  //const [isLoggedIn, setIsLoggedIn] = useState(false);
  //const [error, setError] = useState<string | null>(null);
  
/*  async function checkLogin(){
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
  */
/*  useEffect(() => {
	//로그인 상태 확인
	//checkLogin();
	setIsLoggedIn(true);
  }, []);*/
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '안녕하세요! 티움봇입니다. 무엇을 도와드릴까요?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  
  // 초기 환영 메시지 (한 번만)
  useEffect(() => {
    if (chatHistory.length === 0) {
      setChatHistory([
        {
          role: 'bot',
          message:
            '안녕하세요. 티움봇입니다. 무엇을 도와드릴까요? \n' +
            '1. 이노 스마트 플랫폼 \n' +
            '2. 리자드백업 \n' +
            '3. 엔파우치 \n' +
            '4. 랜섬크런처 \n' +
            '5. 이노마크 \n' +
            '6. 시큐어존 \n' +
            '7. innoECM',
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
	
  // 스크롤 유지 (설정에 따라)
  useEffect(() => {
	if (settings.autoScroll) {
	  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}
  }, [chatHistory, settings.autoScroll]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //제출함수 주석
/*  const handleSendMessage = async () => {
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
  };*/
  
  // 제출 함수
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { role: 'user', message: question };
    setChatHistory((prev) => [...prev, userMessage]);

    const pendingId = 'pending-' + Date.now();
    const pendingBotMsg = { role: 'bot', message: '답변 중...', pending: true, id: pendingId };
    setChatHistory((prev) => [...prev, pendingBotMsg]);

    setQuestion('');
    setLoading(true);

    try {
      const res = await fetch(settings.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage.message }),
      });

      const data = await res.json();
      const answerText = data.answer ?? '응답이 없습니다.';

      setChatHistory((prev) =>
        prev.map((m) => (m.id === pendingId ? { ...m, message: answerText, pending: false, id: undefined } : m))
      );
    } catch (err) {
      console.error(err);
      setChatHistory((prev) =>
        prev.map((m) =>
          m.id === pendingId
            ? { ...m, message: '오류가 발생했습니다. 잠시 후 다시 시도하세요.', pending: false, id: undefined }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // 엔터 제출 (Shift+Enter 줄바꿈)
  /*const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };*/
  const handleKeyPress /*handleKeyDown*/ = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading && question.trim()) handleSubmit();
    }
  };
  
  // 설정 모달 토글
  //const openSettings = () => setShowSettings(true);
  //const closeSettings = () => setShowSettings(false);
  
  // 설정 변경 핸들러
/*  const handleSettingsChange = (patch) => {
    setSettings((prev) => {
      const updated = { ...prev, ...patch };
      localStorage.setItem('tium_settings', JSON.stringify(updated));
      return updated;
    });
  };*/
  
  // 채팅 초기화 (설정에서 제공)
/*  const clearChat = () => {
    setChatHistory([]);
    // 다시 초기 인사 메시지
    setTimeout(() => {
      setChatHistory([
        {
          role: 'bot',
          message:
            '안녕하세요. 티움봇입니다. 무엇을 도와드릴까요? \n' +
            '1. 이노 스마트 플랫폼 \n' +
            '2. 리자드백업 \n' +
            '3. 엔파우치 \n' +
            '4. 랜섬크런처 \n' +
            '5. 이노마크 \n' +
            '6. 시큐어존 \n' +
            '7. innoECM',
        },
      ]);
    }, 50);
  };*/
  
  // ESC로 모달 닫기
/*  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setShowSettings(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);*/

/*  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/');
  };*/

  const handleSettingChange = (field: keyof ChatSettings, value: string | number) => {
    setChatSettings2(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log('챗봇 설정 저장:', chatSettings2);
    setShowChatSettings(false);
    alert('설정이 저장되었습니다.');
  };

  if (isLoading) return <FullPageSpinner />;

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
		{manager === 'y' && (
			<Link href="/admin" className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
			  <i className="ri-settings-3-line w-5 h-5 flex items-center justify-center text-gray-400"></i>
			  <span className="text-sm text-gray-300">챗봇 관리</span>
			</Link>
		)}

		  
		  
          <button 
            onClick={logout}
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
	  <AdminHeader
	    title="챗봇 대화"
	    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
	  />

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
                      <h3 className="text-lg font-medium text-gray-900">챗봇 대화 설정 (개발예정 기능)</h3>
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
                        value={chatSettings2.responseModel}
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
                        value={chatSettings2.searchOption}
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
                        챗봇 유사도 최소 점수: {chatSettings2.minSimilarityScore}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={chatSettings2.minSimilarityScore}
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
          {chatHistory.map((m, idx) => {
			const isUser = m.role === 'user';
			return (
				<div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
				<div
				          className={`flex max-w-[80%] ${
				            isUser ? 'flex-row-reverse' : 'flex-row'
				          } items-start space-x-2`}
				        >
				          {/* 아바타 */}
				          <div
				            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
				              isUser ? 'bg-indigo-600 ml-2' : 'bg-gray-200 mr-2'
				            }`}
				          >
				            <i
				              className={`${
				                isUser ? 'ri-user-line text-white' : 'ri-robot-line text-gray-600'
				              } text-sm`}
				            />
				          </div>

				          {/* 말풍선 */}
				          <div
				            className={`rounded-2xl px-4 py-3 ${
				              isUser
				                ? 'bg-indigo-600 text-white'
				                : 'bg-white border border-gray-200 text-gray-900'
				            }`}
				          >
				            <p className="text-sm leading-relaxed whitespace-pre-wrap">
				              {m.message}
				            </p>

				            {/* pending 이면 타이핑 애니메이션 */}
				            {m.pending && (
				              <div className="flex space-x-1 mt-1">
				                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
				                <div
				                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
				                  style={{ animationDelay: '0.15s' }}
				                />
				                <div
				                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
				                  style={{ animationDelay: '0.3s' }}
				                />
				              </div>
				            )}
				          </div>
				        </div>
				      </div> 
			);
            /*<div
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
            </div>*/
          })}
          
          {isLoading && (
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
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="메시지를 입력하세요..."
                  className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent max-h-32 text-sm"
                  rows={1}
                  style={{ minHeight: '44px' }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!question.trim() || isLoading}
                  className="absolute right-2 bottom-2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 rounded-lg transition-colors cursor-pointer"
                >
                  <i className="ri-send-plane-line w-4 h-4 flex items-center justify-center text-white"></i>
                </button>
              </div>
            </div>
            {/*<p className="text-xs text-gray-500 text-center mt-2">
              Enter로 전송, Shift+Enter로 줄바꿈
            </p>*/}
          </div>
        </div>
      </div>
    </div>
  );
}
