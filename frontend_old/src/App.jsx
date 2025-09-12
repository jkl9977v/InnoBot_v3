import { useState, useRef, useEffect } from 'react';
import './App.css';
import './App_ChatSetting.css';
import botIcon from './image/tiumBot1.png';

function App() {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 설정 상태 (localStorage에 저장)
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem('tium_settings');
      return raw ? JSON.parse(raw) : { apiUrl: 'http://192.168.11.146:8080/chat', autoScroll: true };
    } catch {
      return { apiUrl: 'http://192.168.11.146:8080/chat', autoScroll: true };
    }
  });
  const [showSettings, setShowSettings] = useState(false);

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
      setLoading(false);
    }
  };

  // 엔터 제출 (Shift+Enter 줄바꿈)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading && question.trim()) handleSubmit();
    }
  };

  // 설정 모달 토글
  const openSettings = () => setShowSettings(true);
  const closeSettings = () => setShowSettings(false);

  // 설정 변경 핸들러
  const handleSettingsChange = (patch) => {
    setSettings((prev) => {
      const updated = { ...prev, ...patch };
      localStorage.setItem('tium_settings', JSON.stringify(updated));
      return updated;
    });
  };

  // 채팅 초기화 (설정에서 제공)
  const clearChat = () => {
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
  };

  // ESC로 모달 닫기
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setShowSettings(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-header-left">
            <img src={botIcon} alt="Bot" className="bot-avatar" />
            <span>TiumBot</span>
          </div>

          {/* 우측 상단 설정 버튼 */}
          <div className="chat-header-right">
            <button
              className="settings-button"
              onClick={openSettings}
              aria-label="설정 열기"
              title="설정"
              type="button"
            >
              ⚙
            </button>
          </div>
        </div>

        <div className="chat-messages">
          {chatHistory.map((chat, idx) => (
            <div key={idx} className={`chat-bubble ${chat.role === 'user' ? 'user' : 'bot'} ${chat.pending ? 'pending' : ''}`}>
              {chat.message.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-area" onSubmit={handleSubmit} action="">
          <textarea
            className="chat-textarea"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="질문을 입력하세요"
          />
          <button type="button" onClick={handleSubmit} disabled={loading || !question.trim()}>
            {loading ? '답변 중...' : '전송'}
          </button>
        </form>
      </div>

      {/* 설정 모달 */}
      {showSettings && (
        <div className="settings-modal-overlay" onMouseDown={closeSettings}>
          <div className="settings-modal" onMouseDown={(e) => e.stopPropagation()}>
            <h3>대화 설정</h3>

            <label className="setting-row">
              <span>서버 URL</span>
              <input
                type="text"
                value={settings.apiUrl}
                onChange={(e) => handleSettingsChange({ apiUrl: e.target.value })}
                style={{ width: '100%' }}
              />
            </label>

            <label className="setting-row">
              <span>자동 스크롤</span>
              <input
                type="checkbox"
                checked={!!settings.autoScroll}
                onChange={(e) => handleSettingsChange({ autoScroll: e.target.checked })}
              />
            </label>

            <div className="setting-actions">
              <button
                type="button"
                onClick={() => {
                  clearChat();
                  closeSettings();
                }}
              >
                채팅 초기화
              </button>

              <div>
                <button type="button" onClick={closeSettings}>
                  취소
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // 저장은 handleSettingsChange에서 이미 localStorage에 저장됨
                    closeSettings();
                  }}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
