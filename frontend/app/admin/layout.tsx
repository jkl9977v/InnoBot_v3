// app/admin/layout.tsx 
//admin 하위 페이지 전체 보호 코드
/*'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { checking, isLoggedIn } = useAuth('/admin/getHeader');
  const router = useRouter();

  // 로딩 스핀
  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 인증되지 않음 -> 로그인으로 보냄
  if (!isLoggedIn) {
    // replace로 history 쌓지 않음
    router.replace('/login');
    return null;
  }

  // 로그인되어 있으면 admin 하위 페이지 렌더
  return <>{children}</>;
}*/

/*
// app/admin/layout.tsx  <-- 파일명 반드시 layout.tsx (오타 주의)
// admin 하위 페이지 전체 보호 코드
'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { checking, isLoggedIn } = useAuth('/admin/getHeader');
  const router = useRouter();

  // 1) 로딩 스핀(검사 중)
  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2) 검사 끝났고 로그인 안된 상태라면, 렌더 단계에서 바로 push/replace 하지 말고 useEffect에서 수행
  useEffect(() => {
    // checking이 false인 상태에서만 실행되도록 안전하게 조건 검사
    if (!checking && !isLoggedIn) {
      // router.replace는 effect 안에서 호출해야 안전
      router.replace('/login');
    }
    // router, checking, isLoggedIn을 의존성으로 넣음
  }, [checking, isLoggedIn, router]);

  // 3) 여기는 검사 끝난 후 렌더 부분.
  // 만약 아직 비로그인 상태라면(redirect가 진행 중) null 반환하여 아무 UI도 렌더링하지 않음.
  if (!isLoggedIn) {
    return null;
  }

  // 4) 로그인 상태일 때만 자식 렌더
  return <>{children}</>;
}
*/

//개발용
import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}