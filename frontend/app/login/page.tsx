//login.page
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  
  //const [username, setUsername] = useState('');
  //const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  //const [showPassword, setShowPassword] = useState(false);
/*  const res = await fetch('http://localhost:8080/admin/getHeader', {
	mothod: 'GET',
	credntials: 'include'
  });
  const data = await res.json();*/

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
	
	try{
		const res = await fetch(apiUrl('/login'), {
			method: 'POST',
			credentials: 'include', //세션 쿠키 받으려면 필요
			headers: {'Content-Type' : 'application/json'},
			body: JSON.stringify({ userId, userPw})
		});
		
		const data= await res.json().catch(() => null);
		
		if(res.ok && data && data.success){
			router.push('/');
		}else {
			setError((data && data.message) || '로그인 실패')
		}
	} catch(err){
		console.error(err);
		setError('네트워크 오류');
	}
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center space-x-3 mb-2">
              {/* Character Image */}
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src="https://static.readdy.ai/image/8cfbe681cd6be44b8057581fc3cc12d1/30a4d73a30bae5dc0789582636640c3f.png" 
                  alt="TiumBot Character" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <span className="font-['Pacifico'] text-3xl text-indigo-600">TiumBot</span>
            </div>
          </Link>
          <p className="text-gray-600 mt-2">사용자 로그인</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                아이디
              </label>
              <div className="relative">
                <input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-sm"
                  placeholder="아이디를 입력하세요"
                  //disabled={isLoading}
                />
                <i className="ri-user-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

            <div>
              <label htmlFor="userPw" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="userPw"
                  type="password"
                  value={userPw}
                  onChange={(e) => setUserPw(e.target.value)}
                  className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-sm"
                  placeholder="비밀번호를 입력하세요"
                  //disabled={isLoading}
                />
                <i className="ri-lock-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <button
                  type="button"
                  //onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <i className="ri-eye-off-line" /*"ri-eye-line"*/></i>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                <i className="ri-error-warning-line text-red-500"></i>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              //disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>로그인 중...</span>
                </>
              ) : (
                <>
                  <i className="ri-login-circle-line w-5 h-5 flex items-center justify-center"></i>
                  <span>로그인</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <a href="#" className="hover:text-indigo-600 transition-colors cursor-pointer">
                비밀번호를 잊으셨나요?
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link href="/" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer">
            ← 홈페이지로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
