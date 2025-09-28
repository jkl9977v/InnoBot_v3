//  admin/accessRule/allowgWrite
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../../../components/AdminSidebar';
import AdminHeader from '../../../../components/AdminHeader';
import GradeSearchModal, { GradeDTO } from '../../../../components/GradeSearchModal'; //분리된 모달 
import { apiUrl } from '@/lib/api';

interface GradeDTO {
  gradeId: string;
  gradeName: string;
  gradeLevel: number;
  //code: string;
  //description: string;
}

export default function AllowgWritePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('policies');
  const [isGradeSearchModalOpen, setIsGradeSearchModalOpen] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    allowgName: '',
	allowgId: '',
	gradeId: '',
	gradeName: '',
	gradeLevel: '',
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
	if (!isLoggedIn) return;
  }, [isLoggedIn]);

  const handleToggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
	//필수값 공백 체크
	const required = [
		['allowgName', '직급정책 명'], ['gradeName', '직급명'], ['gradeLevel', '직급 레벨']
	] as const;
	for (const [key, label] of required){
		if (!formData[key]) { alert(`${label}을 입력하세요.`); return; }
	} 
	
	//저장 요청
	const url = apiUrl('/admin/accessRule/allowgWrite')
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type' : 'application/json' },
		credentials: 'include',
		body: JSON.stringify(formData) // 화면에서 입력 받은 모든 값을 JSON 문자열로 묶어서 서버에 전송
	});
	if (!res.ok) { alert('저장 실패'); return; }
	
	alert('직급정책 생성 완료')
    router.push('/admin/accessRule/allowgList');
  };

  const handleGoBack = () => {
    router.push('/admin/accessRule/allowgList');
  };

  const handleSelectGrade = (grade: GradeDTO) => {
  	setFormData(prev => ({ ...prev, gradeId: grade.gradeId }));
    setFormData(prev => ({ ...prev, gradeName: grade.gradeName }));
  	setFormData(prev => ({ ...prev, gradeLevel: grade.gradeLevel }));
    setIsGradeSearchModalOpen(false);
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
    <div className="flex h-screen bg-gray-50" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif' }}>
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
              접근정책 &gt; 직급정책 생성
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
              <h2 className="text-lg font-semibold text-gray-900 mb-6">직급정책 생성</h2>

              <div className="space-y-6">
                {/* 직급정책 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    직급정책
                  </label>
                  <input
                    type="text"
					placeholder="정책 이름"
                    value={formData.allowgName}
                    onChange={e => handleInputChange('allowgName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* 허용 기준 직급 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    허용기준 직급
                  </label>
				  <div className="flex items-center space-x-4">
				  	<input
				      type="text"
				      value={formData.gradeId}
				      onChange={(e) => handleInputChange('gradeId', e.target.value)}
				      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
				      placeholder="직급 ID"
				    hidden readOnly
				    />
				    <input
				      type="text"
				    onClick={() => setIsGradeSearchModalOpen(true)}
				      value={formData.gradeName}
				      onChange={(e) => handleInputChange('gradeName', e.target.value)}
				      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
				      placeholder="직급명"
				    />
				  <input
				    type="text"
				    onClick={() => setIsGradeSearchModalOpen(true)}
				    value={formData.gradeLevel}
				    onChange={(e) => handleInputChange('gradeLevel', e.target.value)}
				    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
				    placeholder="직급레벨"
				  />
				    <button
				      onClick={() => setIsGradeSearchModalOpen(true)}
				      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap text-sm"
				    >
				      직급 검색
				    </button>
				  </div>			  
                </div>


                {/* 활성화 */}
                {/*<div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={e => handleInputChange('isActive', e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">활성화</span>
                  </label>
                </div>*/}
              </div>
		
              <div className="flex justify-end mt-8">
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  직급정책 생성
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

	  {/*분리된 GradeSearchModal 사용: 필요한 상태/핸들러를 Props로 전달하는 형태 */}
	  <GradeSearchModal
	  	isOpen={isGradeSearchModalOpen}
		onClose={() => setIsGradeSearchModalOpen(false)}
		onSelectGrade={handleSelectGrade}
	  />
	 </div>
  );
}
