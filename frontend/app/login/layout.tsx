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
	if(!checking && isLoggedIn) {
		alert('로그인 상태입니다.');
		router.back();
	}
  },[checking, isLoggedIn, router]);


  // 세션 확인 중 : 로딩 스핀
  if (checking) {
    return (
	  <FullPageSpinner/>
    );
  }
  
  return <>{children}</>;
}