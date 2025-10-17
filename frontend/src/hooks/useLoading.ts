// 로딩 true/false만 관리하는 훅

'use client'
import { useState } from 'react';

export function useLoading() {
	const [isLoading, setIsLoading] = useState(false);
	
	//비동기 함수를 감싸서 자동으로 로딩 on/off
	const wrap = async <T>(task:() => Promise<T>) => {
		setIsLoaidng(true);
		
		try {
			return await task(); // 실제 작업 실행
		} finally {
			setIsLoading(false);
		}
	};
	
	return { isLoading, setIsLoading, wrap };
}