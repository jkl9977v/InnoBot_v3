//adminHeader.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/api';

interface UserDTO {
	userNum: string;
	userId: string;
	userPw: string;
	userName: string;
	
	gradeId: string | null;
	departmentId: string | null;
}

interface DepartmentDTO {
	departmentId: string;
	departmentName: string;
}

interface GradeDTO {
	gradeId: string;
	gradeName: string;
	gradeLevel: number;
}

interface AdminHeaderProps {
  title: string;
  onToggleSidebar: () => void;
  handleGoBack: () => void;
}

export default function AdminHeader({ title, onToggleSidebar, handleGoBack }: AdminHeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(false);
  
  //서버에서 가져온 유저 정보 저장
  const [userNum, setUserNum] = useState('');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  
  const [gradeId, setGradeId] = useState('');
  const [gradeName, setGradeName] = useState('');
  const [gradeLevel, setGradeLevel] = useState<number | null>(null);
  
  const [departmentId, setDepartmentId] = useState('');
  const [departmentName, setDepartmentName] = useState('');
	
  const router = useRouter();
  
  const checkLogin = async () => {
	setChecking(true);
	try {
		const url = apiUrl('/admin/getHeader')
		const res = await fetch(url, {
			method: 'GET',
			credentials: 'include',
			headers: { Accept : 'application/json' }
		});
		if (res.status === 204 || res.status === 401 ) {
			//서버에 로그인 정보 없음
			setIsLoggedIn(false);
		} else if (res.ok) {
			//로그인 정보가 있을 때 : 로그인으로 처리
			const json = await res.json().catch(() => null);
			//서버가 {user: {...}} 형태로 주는지 혹은 user 객체만 주는지 확인
			const user = json?.user ?? null;
			console.log(user);
			if(user) {
				setIsLoggedIn(true);
				// 필요한 경우 user의 상세정보 작성
				setUserNum(user.userNum);
				setUserName(user.userName);
				setUserId(user.userId);
				
				const gradeDTO = user.gradeDTO ?? {};
				setGradeId(gradeDTO.gradeId ?? '');
				setGradeName(gradeDTO.gradeName ?? '');
				setGradeLevel(gradeDTO.gradeLevel ?? '');
				
				const departmentDTO = user.departmentDTO ?? {};
				setDepartmentId(departmentDTO.departmentId ?? '');
				setDepartmentName(departmentDTO.departmentName ?? '');
			} else {
				setIsLoggedIn(false);
			}
		} else {
			// 500등 기타 에러: 안전하게 비로그인으로 처리하고 에러 표시
			setIsLoggedIn(false);
			setError(`서버오류 : ${res.status}`)
		}
	} catch (e) {
		console.error('checkLogin error ', e);
		setIsLoggedIn(false);
		setError('네트워크 오류 또는 서버 접속 실패');
	} finally {
		setChecking(false);
	}
  }

  const handleLogout = async () => {  //로그아웃 코드 지우고 공통 코드 가져다쓰기
	try {
		await fetch(apiUrl('/logout'), {
			method: 'POST',
			credentials: 'include',
			headers: { 
				/*'X-CSRF-TOKEN' : csrf,*/
				'Accept' : 'application/json'
			}
		});
	} catch (e) {
		console.error('logout error ', e);
	} finally {
		//로그아웃 후 UI 갱신
		setIsLoggedIn(false);
	}
    router.push('/');
  };
  
  const userUpdate = () => {
	//내용 추가하기
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        >
          <i className="ri-menu-line w-5 h-5 flex items-center justify-center text-gray-600"></i>
        </button>
		
		<button
		  onClick={handleGoBack}
		  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
		>
		  <i className="ri-arrow-left-line w-5 h-5 flex items-center justify-center text-gray-600"></i>
		</button>	
        <h1 className="text-xl font-semibold text-gray-900">
          {title}
        </h1>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600 relative">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <i className="ri-user-line text-indigo-600"></i>
          </div>
          <span className="text-sm text-gray-700">{userName}</span>
          <i className="ri-arrow-down-s-line w-4 h-4 flex items-center justify-center text-gray-400"></i>
        </div>

        {isUserMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200">
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>ID:</strong>{userId}</div>
                <div><strong>이름:</strong> {userName}</div>
                <div><strong>부서:</strong> {departmentName}</div>
                <div><strong>직급:</strong> {gradeName}</div>
              </div>
            </div>
            <div className="p-2 space-y-1">
              <button 
			  onClick={() => userUpdate(userNum)}
			  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-sm text-gray-700">
                내 정보 수정
              </button>
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-sm text-gray-700">
                로그아웃
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}