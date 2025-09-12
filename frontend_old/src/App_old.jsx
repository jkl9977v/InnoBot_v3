import { useState, useRef, useEffect } from 'react';
import './App.css';
import botIcon from './image/tiumBot1.png';

function App() {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 1) 초기 환영 메시지는 렌더 중 setState 하지 말고 useEffect로 한 번만 넣기
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
  }, []); // 빈 deps로 컴포넌트 마운트 시 1회 실행

  // 스크롤 유지
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // 제출 함수: 이벤트 객체가 없어도 동작하도록 유연하게 처리
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // 공백만 있으면 제출 안 함
    if (!question.trim()) return;

    // 사용자 메시지 추가
    const userMessage = { role: 'user', message: question };
    setChatHistory((prev) => [...prev, userMessage]);

    // 로딩표시용 '답변 중...' 말풍선 추가 (고유 id로 나중에 대체)
    const pendingId = 'pending-' + Date.now();
    const pendingBotMsg = { role: 'bot', message: '답변 중...', pending: true, id: pendingId };
    setChatHistory((prev) => [...prev, pendingBotMsg]);

    // 입력 초기화 및 로딩 flag
    setQuestion('');
    setLoading(true);

    try {
      const res = await fetch('http://192.168.11.146:8080/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage.message }),
      });

      const data = await res.json();
      const answerText = data.answer ?? '응답이 없습니다.';

      // pending 말풍선(같은 id)을 실제 응답으로 교체
      setChatHistory((prev) =>
        prev.map((m) =>
          m.id === pendingId
            ? { ...m, message: answerText, pending: false, id: undefined } // id 제거하거나 유지해도 됨
            : m
        )
      );
    } catch (err) {
      console.error(err);
      // 실패 시 pending 메시지를 실패 메시지로 교체
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

  // 엔터 키 처리: Enter => 제출, Shift+Enter => 줄바꿈
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 줄바꿈 방지
      // 제출 함수 호출 (폼 제출 이벤트가 없으므로 handleSubmit(null) 허용하게 구현)
      if (!loading && question.trim()) {
        handleSubmit(); // 이벤트 객체 없이 호출
      }
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <div className="chat-header">
          <img src={botIcon} alt="Bot" className="bot-avatar" />
          <span>TiumBot</span>
        </div>

        <div className="chat-messages">
          {chatHistory.map((chat, idx) => (
            <div key={idx} className={`chat-bubble ${chat.role === 'user' ? 'user' : 'bot'}`}>
              {/*
                각 메시지의 줄바꿈(\n) 유지해서 출력.
                pending 플래그가 있어도 같은 구조로 보임(추가 스타일을 줄 수도 있음).
              */}
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

        <form
          className="chat-input-area"
          onSubmit={handleSubmit} // 혹시 폼 제출 시 엔터 동작을 잡기 위해 남겨둠
          action=""
        >
          <textarea
            className="chat-textarea"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown} // Enter 키를 여기서 제어
            rows={1}
            placeholder="질문을 입력하세요"
          />
          <button type="button" onClick={handleSubmit} disabled={loading || !question.trim()}>
            {loading ? '답변 중...' : '전송'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
