//  admin/department/departmentUpdate
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminSidebar from '../../../../components/AdminSidebar';
import AdminHeader from '../../../../components/AdminHeader';
import { apiUrl } from '@/lib/api';

export default function DepartmentUpdatePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('user-management');
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const departmentId = searchParams.get('departmentId'); //null 체크 필요

  const [formData, setFormData] = useState({
	departmentId: '',
	departmentName: '',
    /*name: '',
    code: '',
    description: '',
    manager: '',
    isActive: true*/
  });

  useEffect(() => {
    /*const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus !== 'true') {
      router.push('/login');
      return;
    }*/
    setIsLoggedIn(true);
    setIsLoading(false);
  }, [router]);
  
  useEffect(() => {
	if (!isLoggedIn || !departmentId) return;
	fetchDetail();
  }, [isLoggedIn, departmentId]);
  
  const fetchDetail = async () => {
	try {
		const url = apiUrl(`/admin/department/departmentDetail?departmentId=${departmentId}`)
		const res = await fetch(url, {
			method: 'GET',
			headers: { Accept: 'application/json' },
			credentials: 'include'
		});
		if (!res.ok) throw new error('detail fetch error ' + res.status);
		const dto = await res.json();
		setFormData(dto);
	} catch (e) {
		alert('데이터를 불러오지 못했습니다.') ;
		console.error(e);
	}
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
	// 필수값 공백 체크
	const required = [
		['departmentName', '부서명']
	] as const;
	for (const [key, label] of required) {
		if(!formData[key]) { alert(`${label}을 입력하세요.`); return; }
	}
	
	//저장 요청
	const url = apiUrl('/admin/department/departmentUpdate')
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type' : 'application/json' },
		credentials: 'include',
		body: JSON.stringify(formData) // 화면에서 입력 받은 모든 값을 JSON 문자열로 묶어서 서버에 전송 
	});
	if (!res.ok) { alert('저장 실패'); return; }
	
	alert('부서 수정 완료');
	router.push('/admin/department/departmentList');
  };

  const handleToggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const handleGoBack = () => {
    router.push('/admin/department/departmentList');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar 
        isSidebarOpen={isSidebarOpen} 
        expandedSection={expandedSection}
        onToggleSection={handleToggleSection}
      />

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
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
              사용자 / 부서 / 직급 &#62; 부서 수정
            </h1>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600 relative">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <i className="ri-user-line text-indigo-600"></i>
              </div>
              <span className="text-sm text-gray-700">관리자</span>
              <i className="ri-arrow-down-s-line w-4 h-4 flex items-center justify-center text-gray-400"></i>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-xl border border-gray-200 min-h-full">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">부서 수정</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    부서명 *
                  </label>
                  <input
                    type="text"
                    value={formData.departmentName}
                    onChange={(e) => handleInputChange('departmentName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    placeholder="부서명을 입력하세요"
                  />
                </div>

              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  부서 수정
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
<div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   부서 코드
                 </label>
                 <input
                   type="text"
                   value={formData.code}
                   onChange={(e) => handleInputChange('code', e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                   placeholder="부서 코드를 입력하세요 (예: DEV, HR)"
                 />
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   부서 설명
                 </label>
                 <textarea
                   value={formData.description}
                   onChange={(e) => handleInputChange('description', e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm h-24 resize-none"
                   placeholder="부서의 역할과 업무를 설명하세요"
                 />
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   부서장
                 </label>
                 <div className="flex items-center space-x-2">
                   <input
                     type="text"
                     value={formData.manager}
                     onChange={(e) => handleInputChange('manager', e.target.value)}
                     className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                     placeholder="부서장 이름"
                   />
                   <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap text-sm">
                     사용자 검색
                   </button>
                 </div>
               </div>



			    <div>
			      <label className="flex items-center">
			        <input
			          type="checkbox"
			          checked={formData.isActive}
			          onChange={(e) => handleInputChange('isActive', e.target.checked)}
			          className="mr-2"
			        />
			        <span className="text-sm text-gray-700">활성 상태</span>
			      </label>
			    </div>
 */
