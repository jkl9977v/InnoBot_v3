//  admin/grade/gradeWrite
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../../../components/AdminSidebar';
import AdminHeader from '../../../../components/AdminHeader';
import { apiUrl } from '@/lib/api';

export default function GradeWritePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('user-management');
  
  const [gradeLevel, setGradeLevel] = useState<number>(1); //초기값 조정
  const options = Array.from({ length: 20 }, (_,i) => i+1); //[1,2,...,20]
  
  const router = useRouter();

  const [formData, setFormData] = useState({
    gradeName: '',
	gradeLevel: ''
/*    gradeCode: '',
    level: '',
    description: '',
    salary: '',
    permissions: [] as string[]*/
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

  const handleToggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
	//필수값 공백 체크
	const required = [
		['gradeName', '직급명'], ['gradeLevel', '직급레벨']
	] as const;
	for (const [key, label] of required) {
		if  (!formData[key]) { alert(`${label}를 입력하세요.`); return; }
	}
	
	//저장 요청
	const url = apiUrl('/admin/grade/gradeWrite')
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type' : 'application/json' },
		credentials: 'include',
		body: JSON.stringify(formData) // 화면에서 입력 받은 모든 값을 JSON 문자열로 묶어서 서버에 전송
	});
	if (!res.ok) { alert('저장 실패'); return; }
	
	alert('직급 생성 완료');
    //console.log('Creating grade:', formData);
    router.push('/admin/grade/gradeList');
  };

  const handleGoBack = () => {
    router.push('/admin/grade/gradeList');
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
              사용자 / 부서 / 직급 {'>'} 직급 생성
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
              <h2 className="text-lg font-semibold text-gray-900 mb-6">직급 생성</h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      직급명 *
                    </label>
                    <input
                      type="text"
                      value={formData.gradeName}
                      onChange={(e) => handleInputChange('gradeName', e.target.value)}
                      placeholder="직급명을 입력하세요"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    />
                  </div>

                  
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      직급 레벨 *
                    </label>
                    <select
						value={formData.gradeLevel}
                      //value={formData.level}
                      onChange={(e) => handleInputChange('gradeLevel',Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm pr-8"
                    >
                      {options.map((i) => (
						<option key={i} value={i}>
							{i}
						</option>
					  ))}
                    </select>
                  </div>

                 
                </div>


              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  직급 생성
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
                      직급 코드 *
                    </label>
                    <input
                      type="text"
                      value={formData.gradeCode}
                      onChange={(e) => handleInputChange('gradeCode', e.target.value)}
                      placeholder="예: MGR, DEV, INT"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    />
                  </div>
				  
				  <div>
				                     <label className="block text-sm font-medium text-gray-700 mb-2">
				                       기본 급여
				                     </label>
				                     <input
				                       type="number"
				                       value={formData.salary}
				                       onChange={(e) => handleInputChange('salary', e.target.value)}
				                       placeholder="기본 급여 (원)"
				                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
				                     />
				                   </div>
								   
								   <div>
								     <label className="block text-sm font-medium text-gray-700 mb-2">
								       설명
								     </label>
								     <textarea
								       value={formData.description}
								       onChange={(e) => handleInputChange('description', e.target.value)}
								       placeholder="직급에 대한 설명을 입력하세요"
								       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm h-24 resize-none"
								     />
								   </div>

								   <div>
								     <label className="block text-sm font-medium text-gray-700 mb-3">
								       기본 권한
								     </label>
								     <div className="grid grid-cols-2 gap-2">
								       {[
								         '파일 업로드',
								         '파일 다운로드',
								         '사용자 정보 조회',
								         '프로젝트 생성',
								         '보고서 작성',
								         '시스템 설정',
								         '사용자 관리',
								         '부서 관리'
								       ].map((permission) => (
								         <label key={permission} className="flex items-center">
								           <input
								             type="checkbox"
								             checked={formData.permissions.includes(permission)}
								             onChange={(e) => {
								               if (e.target.checked) {
								                 handleInputChange('permissions', [...formData.permissions, permission]);
								               } else {
								                 handleInputChange('permissions', formData.permissions.filter(p => p !== permission));
								               }
								             }}
								             className="mr-2"
								           />
								           <span className="text-sm text-gray-700">{permission}</span>
								         </label>
								       ))}
								     </div>
								   </div>
*/
