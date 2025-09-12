// "GET /" , main 페이지
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/api';

//const base = process.env.NEXT_PUBLIC_API_BASE || ''; 
//const res = await fetch(`${base}/admin/getHeader`, {credentials: 'include'});
//const json = await res.json();

export default function Home() {
	const router = useRouter();
	const [checking, setChecking] = useState(true); //초기 로그인 체크
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [error, setError] = useState<string | null>(null);
	  
	  async function checkLogin(){
		setChecking(true);
		setError(null);
		try{
			const res = await fetch(apiUrl('/admin/getHeader'),{
				method: 'GET',
				credentials: 'include', //필수, 브라우저가 세션 쿠키를 포함해서 보냄
				headers: { 'Accept' : 'application/json' }
			});
			if (res.status === 204 || res.status === 401) {
				//서버에 로그인 정보 없음
				setIsLoggedIn(false);
			} else if (res.ok) {
				// 로그인 정보가 있을 때: 로그인으로 처리
				const json = await res.json().catch(() => null);
				// 서버가 { user: {...} } 형태로 주는지 혹은 user 객체만 주는지 확인
				const user = json?.user ?? null;
				if (user) {
					setIsLoggedIn(true);
					//필요한 경우 user의 상세정보 작성
					//setUserName(user.userName);
				} else {
					setIsLoggedIn(false);
				}
			} else {
				// 500등 기타 에러: 안전하게 비로그인으로 처리하고 에러 표시
				setIsLoggedIn(false);
				setError(`서버 오류 : ${res.status}`);
			}
		} catch(e) {
			console.error('checkLogin error', e);
			setIsLoggedIn(false);
			setError('네트워크 오류 또는 서버 접속 실패');
		} finally {
			setChecking(false);
		}
	  }
	  useEffect(() => {
	    // 로그인 상태 확인
	    //checkLogin();
		setIsLoggedIn(true);
		//const loginStatus = localStorage.getItem('isLoggedIn');
	    //setIsLoggedIn(loginStatus === 'true');
	  }, []);

	  //로그아웃 핸들러
	  async function handleLogout(){
		try {
			await fetch(apiUrl('/logout'), { 
				method: 'POST', 
				credentials: 'include',
				headers: { 'Accept' : 'application/json' }			
			});
		} catch (e) {
			console.error('logout error', e);
		} finally {
			//로그아웃 후 UI 갱신
			setIsLoggedIn(false);
		}
	  }
	  
	  return (
	    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
	      {/* Header */}
	      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
	        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
	          <div className="flex justify-between items-center h-16">
	            <div className="flex items-center space-x-3">
	              {/* Character Image */}
	              <div className="w-10 h-10 flex items-center justify-center">
	                <img 
	                  src="https://static.readdy.ai/image/8cfbe681cd6be44b8057581fc3cc12d1/30a4d73a30bae5dc0789582636640c3f.png" 
	                  alt="TiumBot Character" 
	                  className="w-10 h-10 object-contain"
	                />
	              </div>
	              <div className="flex-shrink-0">
	                <span className="font-['Pacifico'] text-2xl text-indigo-600">TiumBot</span>
	              </div>
	            </div>
	            <nav className="flex space-x-8">
	              {isLoggedIn ? (
	                <>
	                  <Link href="/chat" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
	                    챗봇 대화
	                  </Link>
	                  <Link href="/admin" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
	                    챗봇 관리
	                  </Link>
					  <button
					    type="button"
					    // 이미 정의된 handleLogout 함수를 사용합니다.
					    onClick={async () => {
					      try {
					        await handleLogout();   // 서버로 로그아웃 요청 (credentials 포함)
					        router.refresh();       // 페이지 데이터 갱신 (또는 router.push('/')로 이동)
					      } catch (e) {
					        console.error(e);
					      }
					  	setIsLoggedIn(false);
					    }}
					    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
					    aria-label="로그아웃"
					  >
	                    로그아웃
	                  </button>
	                </>
	              ) : (
					<>
					<button
					  type="button"
					  // 이미 정의된 handleLogout 함수를 사용합니다.
					  onClick={async () => {
					    try {
					      await handleLogout();   // 서버로 로그아웃 요청 (credentials 포함)
					      router.refresh();       // 페이지 데이터 갱신 (또는 router.push('/')로 이동)
					    } catch (e) {
					      console.error(e);
					    }
						setIsLoggedIn(false);
					  }}
					  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
					  aria-label="로그아웃"
					>
					  로그아웃
					</button>
	                <Link href="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
	                  사용자 로그인
	                </Link>
					</>
	              )}
	            </nav>
	          </div>
	        </div>
	      </header>

	      {/* Hero Section */}
	      <div className="relative overflow-hidden">
	        <div 
	          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
	          style={{
	            backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20AI%20chatbot%20interface%20with%20floating%20chat%20bubbles%20and%20holographic%20elements%2C%20futuristic%20digital%20workspace%20with%20soft%20blue%20and%20purple%20gradients%2C%20clean%20minimalist%20design%20with%20abstract%20geometric%20shapes%2C%20professional%20tech%20atmosphere%20with%20glowing%20particles%20and%20data%20streams&width=1200&height=600&seq=hero-bg&orientation=landscape')`
	          }}
	        >
	          <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-transparent"></div>
	        </div>
	        
	        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
	          <div className="max-w-2xl w-full">
	            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
	              스마트한 AI 챗봇으로
	              <span className="text-indigo-600 block">비즈니스를 혁신하세요</span>
	            </h1>
	            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
	              고객과의 소통을 자동화하고, 24시간 언제든지 빠르고 정확한 답변을 <br/>
				  제공하는 지능형 챗봇 서비스입니다.
	            </p>
	            <div className="flex flex-col sm:flex-row gap-4">
	              {isLoggedIn ? (
	                <>
	                  <Link href="/chat" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer whitespace-nowrap">
	                    <i className="ri-chat-3-line w-5 h-5 flex items-center justify-center mr-2"></i>
	                    챗봇과 대화하기
	                  </Link>
	                  <Link href="/admin" className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
	                    <i className="ri-settings-3-line w-5 h-5 flex items-center justify-center mr-2"></i>
	                    챗봇 관리하기
	                  </Link>
	                </>
	              ) : (
	                <>
	                  <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer whitespace-nowrap">
	                    <i className="ri-login-circle-line w-5 h-5 flex items-center justify-center mr-2"></i>
	                    로그인 후 시작하기
	                  </Link>
	                  <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
	                    <i className="ri-user-line w-5 h-5 flex items-center justify-center mr-2"></i>
	                    사용자 로그인
	                  </Link>
	                </>
	              )}
	            </div>
	          </div>
	        </div>
	      </div>

	      {/* Features Section */}
	      <div className="py-24 bg-white">
	        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
	          <div className="text-center mb-16">
	            <h2 className="text-4xl font-bold text-gray-900 mb-4">왜 TiumBot인가요?</h2>
	            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
	              최신 AI 기술을 바탕으로 한 스마트한 챗봇 솔루션의 <br/>핵심 기능들을 만나보세요
	            </p>
	          </div>
	          
	          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
	            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
	              <div className="w-16 h-16 flex items-center justify-center bg-indigo-100 rounded-full mx-auto mb-6">
	                <i className="ri-robot-line text-2xl text-indigo-600"></i>
	              </div>
	              <h3 className="text-xl font-semibold text-gray-900 mb-4">지능형 대화</h3>
	              <p className="text-gray-600">
	                자연어 처리 기술로 사람과 같은 자연스러운 대화가 가능합니다
	              </p>
	            </div>
	            
	            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
	              <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mx-auto mb-6">
	                <i className="ri-time-line text-2xl text-green-600"></i>
	              </div>
	              <h3 className="text-xl font-semibold text-gray-900 mb-4">24/7 서비스</h3>
	              <p className="text-gray-600">
	                언제든지 고객의 문의에 즉시 응답하여 고객 만족도를 향상시킵니다
	              </p>
	            </div>
	            
	            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100">
	              <div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mx-auto mb-6">
	                <i className="ri-settings-3-line text-2xl text-purple-600"></i>
	              </div>
	              <h3 className="text-xl font-semibold text-gray-900 mb-4">맞춤형 관리</h3>
	              <p className="text-gray-600">
	                비즈니스에 맞게 챗봇의 성격과 응답을 자유롭게 설정할 수 있습니다
	              </p>
	            </div>
	          </div>
	        </div>
	      </div>

	      {/* CTA Section */}
	      <div className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600">
	        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
	          <h2 className="text-4xl font-bold text-white mb-6">
	            지금 시작해보세요
	          </h2>
	          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
	            몇 분만에 나만의 AI 챗봇을 만들고, <br/>고객과의 소통을 혁신적으로 개선해보세요
	          </p>
	          <Link href={isLoggedIn ? "/chat" : "/login"} className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-indigo-600 bg-white hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
	            <i className="ri-rocket-line w-6 h-6 flex items-center justify-center mr-2"></i>
	            {isLoggedIn ? "챗봇과 대화하기" : "무료로 시작하기"}
	          </Link>
	        </div>
	      </div>

	      {/* Footer */}
	      <footer className="bg-gray-900 text-white py-12">
	        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
	          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
	            <div className="col-span-1 md:col-span-2">
	              <div className="flex items-center mb-4">
	                <span className="font-['Pacifico'] text-2xl text-indigo-400">TiumBot</span>
	              </div>
	              <p className="text-gray-400 mb-4 max-w-md">
	                AI 기술로 고객 서비스를 혁신하는 스마트 챗봇 플랫폼입니다. <br/>
	                비즈니스의 성장을 위한 최고의 파트너가 되겠습니다.
	              </p>
	            </div>
	            
	            <div>
	              <h4 className="text-lg font-semibold mb-4">서비스</h4>
	              <ul className="space-y-2 text-gray-400">
	                <li><Link href={isLoggedIn ? "/chat" : "/login"} className="hover:text-white transition-colors cursor-pointer">챗봇 대화</Link></li>
	                <li><Link href={isLoggedIn ? "/admin" : "/login"} className="hover:text-white transition-colors cursor-pointer">챗봇 관리</Link></li>
	                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">API 문서</a></li>
	                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">가격 정보</a></li>
	              </ul>
	            </div>
	            
	            <div>
	              <h4 className="text-lg font-semibold mb-4">지원</h4>
	              <ul className="space-y-2 text-gray-400">
	                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">도움말</a></li>
	                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">문의하기</a></li>
	                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">개발자 가이드</a></li>
	                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">커뮤니티</a></li>
	              </ul>
	            </div>
	          </div>
	          
	          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
	            <p className="text-gray-400">© 2025 TiumBot. All rights reserved.</p>
	          </div>
	        </div>
	      </footer>
	    </div>
	  );
	}
