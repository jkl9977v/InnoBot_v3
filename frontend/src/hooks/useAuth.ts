/*// hooks/useAuth.ts (로그인 확인)

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
//import { apiUrl } from '@/lib/api';

type AuthResult = {
	checking : boolean;
	isLoogedIn: boolean;
	error: string | null;
};

*
 * useAuth - 재사용 가능한 로그인 확인 훅
 * - url: 세션 검증을 위한 API (예: /admin/getHeader)
 * - returns: checking, isLoggedIn, error
 
export function useAuth(apiUrl: string = '/admin/getHeader'): AuthResult{
	const [checking, setChecking] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter;
	
	useEffect(() => {
		let mounted = true;
		(async () => {
			setChecking(true);
			setError(null);
			try {
				const res = await fetch(apiUrl, {
					method: 'GET',
					credentials: 'include',
					headers: { 'Accept' : 'application/json' }
				});
				
				if (!mounted) return;
				if (res.status === 204 || res.status === 401 ){
					setIsLoggedIn(false);
				} else if (res.ok) {
					const json = await res.json().catch(() => null);
					const user = josn?.user ?? null;
					setIsLoggedIn(Boolean(user));
				} else {
					setIsLoggedIn(false);
					setError(`서버 오류: ${res.status}`);
				}
			} catch (e) {
				console.eror('useAuth error', e);
				setIsLoggedIn(false);
				setError('네트워크 오류');
			} finally {
				 if (mounted) setChecking(false);
			}
		})();
		
		return () => { mounted = false; };
	}, [apiUrl, router]);
	
	return {checking, isLoggedIn, error };
}*/