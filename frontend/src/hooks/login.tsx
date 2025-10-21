// login
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/api';
import { useLoading } from '@/hooks/useLoading';
import FullPageSpinner from '../../components/FullPageSpinner';
import { useAuth } from '@/hooks/useAuth';

export function Login() {
  const router = useRouter();
  const { isLoading, setIsLoading, wrap } = useLoading();
  const { error, setError } = useAuth();
  
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');

/*  const [isLoading, setIsLoading] = useState(false);*/
  const [showPassword, setShowPassword] = useState(false);

  const loginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
	
	try{
		const res = await fetch(apiUrl('/login'), {
			method: 'POST',
			credentials: 'include', //세션 쿠키 받으려면 필요
			headers: {'Content-Type' : 'application/json'},
			body: JSON.stringify({ userId, userPw })
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
	} finally {
		setIsLoading(false);
	}
  };
  
  return {
	error,
	isLoading,
	setIsLoading,
	userId,
	setUserId,
	userPw,
	setUserPw,
	showPassword,
	setShowPassword,
	
	loginSubmit
  }

}
