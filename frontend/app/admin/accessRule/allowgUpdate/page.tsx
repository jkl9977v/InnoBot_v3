//  admin/accessRule/allowgUpdate
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminSidebar from '../../../../components/AdminSidebar';
import AdminHeader from '../../../../components/AdminHeader_handleGoBack';
import GradeSearchModal, { GradeDTO } from '../../../../components/GradeSearchModal'; //분리된 모달 
import { apiUrl } from '@/lib/api';
import { useLoading } from '@/hooks/useLoading';
import FullPageSpinner from '../../../../components/FullPageSpinner';

interface GradeDTO {
  gradeId: string;
  gradeName: string;
  gradeLevel: number;
  //code: string;
  //description: string;
}

export default function AllowgUpdatePage() {
  const { isLoading, setIsLoading, wrap } = useLoading();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('policies');
  const [isGradeSearchModalOpen, setIsGradeSearchModalOpen] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();
  const allowgId = searchParams.get('allowgId');
  
  const [formData, setFormData] = useState({
    allowgName: '',
	allowgId: '',
	gradeId: '',
	gradeName: '',
	gradeLevel: '',
  });
  
  useEffect(() => {
	if (!allowgId) return;
	setIsLoading(false);
	fetchDetail();
  }, [allowgId]);
 
  const fetchDetail = async () => {
	try {
		const url = apiUrl(`/admin/accessRule/allowgDetail?allowgId=${allowgId}`)
		const res = await fetch(url, {
			method: 'GET',
			headers: { Accept: 'application/json' },
			credentials: 'include'
		});
		if (!res.ok) throw new Error('detail fetch error ' + res.status);
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
	const url = apiUrl(`/admin/accessRule/allowgUpdate?allowgId=${allowgId}`)
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type' : 'application/json' },
		credentials: 'include',
		body: JSON.stringify(formData) // 화면에서 입력 받은 모든 값을 JSON 문자열로 묶어서 서버에 전송
	});
	if (!res.ok) { alert('저장 실패'); return; }
	
	alert('직급정책 수정 완료');
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

  return (
    <div className="flex h-screen bg-gray-50" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif' }}>
      <AdminSidebar 
        isSidebarOpen={isSidebarOpen} 
        expandedSection={expandedSection}
        onToggleSection={handleToggleSection}
      />

      <div className="flex-1 flex flex-col">
	  <AdminHeader
	    title="직급정책 > 직급정책 수정"
	  	handleGoBack={() => handleGoBack()}
	    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
	  />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-xl border border-gray-200 min-h-full">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">직급정책 수정</h2>

              <div className="space-y-6">
                {/* 직급정책 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    직급정책 명 *
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
                    허용기준 직급 *
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
					  readOnly
				    />
				  <input
				    type="text"
				    onClick={() => setIsGradeSearchModalOpen(true)}
				    value={formData.gradeLevel}
				    onChange={(e) => handleInputChange('gradeLevel', e.target.value)}
				    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
				    placeholder="직급레벨"
					readOnly
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
                  직급정책 수정
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
