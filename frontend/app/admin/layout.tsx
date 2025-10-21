// app/admin/layout.tsx 
//admin 하위 페이지 전체 보호 코드
'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/hooks/useLoading';
import FullPageSpinner from '../../components/FullPageSpinner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, setIsLoading, wrap } = useLoading();
  const { isLoggedIn, checking, manager } = useAuth(); // 훅 호출
  const router = useRouter();
  
  useEffect(() => {
	if(!checking && !isLoggedIn) {
		alert('로그인 후 이용하세요');
		router.replace('/login'); // 렌더 끝난 뒤 실행 -> 경고 사라짐
	}
  },[checking, isLoggedIn, router]);
  
  useEffect(() => {
	if (!checking && isLoggedIn && manager !== 'y') {
		alert('접근할 수 없는 페이지 입니다.');
		router.back();
	}
  }, [checking, isLoggedIn, manager, router]);

  // 세션 확인 중 : 로딩 스핀
  if (checking) {
    return (
/*      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>*/
	  <FullPageSpinner/>
    );
  }

  // 인증되지 않음 -> 로그인으로 보냄
  if (!isLoggedIn) {
    return null;
  }

  // 로그인되어 있으면 admin 하위 페이지 렌더
  return <>{children}</>;
}

//개발용
/*
import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
*/