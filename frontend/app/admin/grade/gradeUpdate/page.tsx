//  admin/grade/gradeUpdate
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminSidebar from '../../../../components/AdminSidebar';
import AdminHeader from '../../../../components/AdminHeader_handleGoBack';
import { apiUrl } from '@/lib/api';
import { useLoading } from '@/hooks/useLoading';
import FullPageSpinenr from '../../../../components/FullPageSpinner';

export default function GradeUpdatePage() {
  const { isLoading, setIsLoading, wrap } = useLoading();
  //const [isLoggedIn, setIsLoggedIn] = useState(false);
  //const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('user-management');
  
  const [gradeLevel, setGradeLevel] = useState<number>(1); //초기값 조정
  const options = Array.from({ length: 20 }, (_,i) => i+1); //[1,2,...,20]
  
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const gradeId = searchParams.get('gradeId'); //null 체크 필요

  const [formData, setFormData] = useState({
	gradeId: '',
    gradeName: '',
	gradeLevel: ''
/*    gradeCode: '',
    level: '',
    description: '',
    salary: '',
    permissions: [] as string[]*/
  });
  
  useEffect(() => {
	if(!gradeId) return;
	fetchDetail();
	setIsLoading(false);
  }, [gradeId]);
  
  const fetchDetail = async () => {
	try {
		const url = apiUrl(`/admin/grade/gradeDetail?gradeId=${gradeId}`)
		const res = await fetch(url, {
			method: 'GET',
			headers: { Accept: 'application/json' },
			credentails: 'include'
		});
		if (!res.ok) throw new Error('detail fetch error '+ res.status);
		const dto = await res.json();
		setFormData(dto);
	} catch (e) {
		alert('데이터를 불러오지 못했습니다.');
		console.error(e);
	}
  }

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
	const url = apiUrl(`/admin/grade/gradeUpdate?gradeId=${gradeId}`)
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type' : 'application/json' },
		credentails: 'include',
		body: JSON.stringify(formData) // 화면에서 입력 받은 모든 값을 JSON 문자열로 묶어서 서버에 전송
	});
	if (!res.ok) { alert('저장 실패'); return; }
	
	alert('직급 수정 완료');
    //console.log('Creating grade:', formData);
    router.push('/admin/grade/gradeList');
  };

  const handleGoBack = () => {
    router.push('/admin/grade/gradeList');
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar 
        isSidebarOpen={isSidebarOpen} 
        expandedSection={expandedSection}
        onToggleSection={handleToggleSection}
      />

      <div className="flex-1 flex flex-col">
	  <AdminHeader
	    title="사용자 / 부서 / 직급 > 직급 수정"
	  	handleGoBack={() => handleGoBack()}
	    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
	  />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-xl border border-gray-200 min-h-full">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">직급 수정</h2>

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
					<input
					   type="text"
					   value={formData.gradeId}
					   onChange={(e) => handleInputChange('gradeId', e.target.value)}
					   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
					   hidden readOnly
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
                  직급 수정
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
