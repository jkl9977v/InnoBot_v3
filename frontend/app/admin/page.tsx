// admim main page
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/api';

export default function AdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(false); //로그인 체크
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [error, setError ] = useState<string | null>(null);
  
  async function checkLogin(){
	setChecking(true);
	setError(null);
	try {
		const res = await fetch(apiUrl('/admin/getHeader'), {
			method: 'GET',
			credentials: 'include', //필수, 브라우저가 세션 쿠키를 포함해서 보냄
			headers: { 'Accept' : 'application/json' }
		});
		if(res.status === 204 || res.status === 401){
			//서버에 로그인 정보 없음
			setIsLoggedIn(false);
		} else if (res.ok) {
			//로그인 정보가 있을 때 : 로그인 상태 처리
			const json = await res.json().catch(() => null );
			//서버가 {user : {...} } 형태로 주는지 혹은 user 객체만 주는지 확인
			const user = json?.user ?? null;
			if (user) {
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
	} catch (e){
		console.err('checkLogin error', e);
		setIsLoggedIn(false);
		setError('네트워크 오류 또는 서버 접속 실패');
	} finally {
		setChecking(false);
	}
  }

  useEffect(() => {
	//로그인 상태 확인
	//checkLogin();
	setIsLoggedIn(true);
    // 관리자 페이지 접속 시 자동으로 분석 및 통계로 리다이렉트
    router.push('/admin/analytics');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
