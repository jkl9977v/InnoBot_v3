// app/admin/layout.tsx 
//admin 하위 페이지 전체 보호 코드
'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, checking } = useAuth(); // 훅 호출
  const router = useRouter();
  
  useEffect(() => {
	if(!checking && !isLoggedIn) {
		router.replace('/login'); // 렌더 끝난 뒤 실행 -> 경고 사라짐
	}
  },[checking, isLoggedIn, router]);

  // 세션 확인 중 : 로딩 스핀
  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
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