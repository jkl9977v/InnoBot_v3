// hooks/useAuth.ts (로그인 확인 / 로그아웃)

'use client';
import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/api';

// 커스텀 훅
export function useAuth() {
	const router = useRouter();
	const pathname = usePathname(); 
	//상태값
	const [checking, setChecking] = useState(true); //서버에 로그인 되어있는지 확인
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [error, setError] = useState<string | null>(null);
	
	// 로그인 여부 확인
	const checkLogin = useCallback(async () => {
		setChecking(true);
		setError(null);
		try {
			const res = await fetch(apiUrl('/admin/getHeader'),{
				method: 'GET',
				credentials: 'include',			//세션 쿠키 포함
				headers: { Accept: 'application/json' },
			});
			
			if (res.status === 204 || res.status === 401 ){
				//로그인 세션 없음
				setIsLoggedIn(false);
			} else if (res.ok) {
				// {user: {...}} 형태라면 user 객체가 있는지 확인
				const json = await res.json().catch(() => null);
				const user = json?.user ?? null;
				setIsLoggedIn(Boolean(user));
			} else {
				setIsLoggedIn(false);
				setError(`서버 오류 : ${res.status}`);
			}
		} catch (e) {
			console.error('checkLogin error', e);
			setIsLoggedIn(false);
			setError('네트워크 오류 또는 서버접속 실패');
		} finally {
			setChecking(false);
		}
	}, []);
	
	// 로그아웃
	const logout = useCallback(async () => {
		try {
			const res = await fetch(apiUrl('/logout'), {
				method: 'POST',
				credentials: 'include',
				headers: { Accept: 'application/json' },
			});
			
			// 2xx 또는 3xx -> 성공 처리
			if (res.ok || (res.status >= 300 && res.status < 400)) {
				// 응답이  JSON일 땐 참고용으로 읽기 (필수 아님)
				try {
					const contentType = res.headers.get('content-type') ?? '';
					if (contentType.includes('application/json')) await res.json();
				} catch {}
			}
		} catch (e) {
			console.error('logout error ', e);
		} finally {
			router.push('/');
			setIsLoggedIn(false); //클라이언트 상태 초기화
		}
	}, [router]);
	
	// 첫 마운트 시 한번 실행
	useEffect(() => {
		checkLogin();
	}, [checkLogin]);
	
	useEffect(() => {
		//아직 서버 확인중이면 아무것도 하지 않음
		if (checking) return;
		
		//로그인아 안되어있고, 현재 경로가 "/"가 아니면
		
		if(!isLoggedIn && pathname !== '/') {
			router.replace('/login'); 
		}
	},[checking, isLoggedIn, pathname, router]);
	
	return {
		isLoggedIn,		// true / false
		checking,		// 로딩 중
		error, 			// 오류 메시지
		checkLogin,		// 수동으로 재조회할 때 사용
		logout,			// 로그아웃 함수
	}
}