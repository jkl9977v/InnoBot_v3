// app/admin/accessRule/allowdWrite/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../../../components/AdminSidebar';
import AdminHeader from '../../../../components/AdminHeader';
import DepartmentsSearchModal, { DepartmentDTO } from '../../../../components/DepartmentsSearchModal'; //검색창 모달
import { apiUrl } from '@/lib/api';

interface DepartmentDTO {
	departmentId: string;
	departmentName: string;
};

export default function allowdWritePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('policies');
  const [showDepartmentsSearchModal, setShowDepartmentsSearchModal] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<Department[]>([]);		// 최종 선택 결과 보관
  //const [allSelected, setAllSelected] = useState(false);
  
  //const [departments, setDepartments] = useState<DepartmentDTO[]>([]);

  const router = useRouter();

  const [formData, setFormData] = useState({
	allowdId: '',
	allowdName: '',
	departmentId: '',
	departmentName: ''
    //departents: [] as DepartmentDTO[] //배열
  });

  useEffect(() => {
    /* 로그인 체크 생략(데모) */
    setIsLoggedIn(true);
    setIsLoading(false);
  }, [router]);
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
/*  const openDepartmentsSearchModal = () => { 
	setShowDepartmentsSearchModal(true);
  }
  
  const closeDepartmentsSearchModal = () => {
	setShowDepartmentsSearchModal(false);
  }*/
  
/*  const handleDepartmentSearch = () => {
    //setSelectedDepartments([...formData.departments]);
    setShowDepartmentsSearchModal(true);
  };*/

/*  const handleSelectAll = (checked: boolean) => {
    setAllSelected(checked);
    if (checked) {
      setSelectedDepartments([...mockDepartments]);
    } else {
      setSelectedDepartments([]);
    }
  };*/

/*  const handleConfirmSelection = () => { // 값 입력
    setFormData(prev => ({ ...prev, departments: selectedDepartments }));
    setShowDepartmentsSearchModal(false);
  };*/
  
  const handleSubmit = async () => {
	//필수값 공백 체크
	const required = [
		['allowdName', '부서정책 명'], ['departmentName', '부서명']
	] as const ;
	for (const [key, label] of required) {
		if (!formData[key]) { alert(`${label}을 입력하세요.`); return; }
	}
	
	//저장 요청
	const url = apiUrl('/admin/accessRule/allowdWrite');
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type' : 'application/json' },
		credentials: 'include',
		body: JSON.stringify(formData) // 화면에서 입력 받은 모든 값을 JSON 문자열로 묶어서 서버에 전송
	});
	if (!res.ok) { alert('저장 실패'); return; }
	
	alert('부서정책 생성 완료');
	router.push('/admin/accessRule/allowdList');
  };
  
  const handleToggleSection = (section: string) => {
	  if (expendedSectgion === section ) {
	  	setExpandedSection(null);
	  } else {
	  	setExpandedSection(section);
	  }
    //setExpandedSection(prev => (prev === section ? null : section));
  };
  
  const handleSelectDepartments = (list: DepartmentDTO[]) => {
	setSelectedDepartments(list);
	if (list.length) {
		setFormData(p => ({ ...p,
			departmentId: list.map(d => d.departmentId)/*.join(',')*/,
			departmentName: list.map(d => d.departmentName)/*.join(',')*/
		}));
	}
	setShowDepartmentsSearchModal(false);
  }

  const handleBack = () => {
    router.push('/admin/accessRule/allowdList');
  };

/*  const handleDepartmentsSelect = (department: DepartmentDTO, checked: boolean) => {
    if (checked) {
      setSelectedDepartments(prev => {
        // 중복 방지
        if (prev.some(d => d.departmentId === department.departmentId)) return prev;
        return [...prev, department];
      });
    } else {
      setSelectedDepartments(prev => prev.filter(d => d.departmentId !== department.departmentId));
      setAllSelected(false);
    }
  };*/

/*  const handleRemoveDepartment = (departmentId: number) => { 
    setFormData(prev => ({ ...prev, departments: prev.departments.filter(d => d.departmentId !== departmentId) }));
  };*/

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar isSidebarOpen={isSidebarOpen} expandedSection={expandedSection} onToggleSection={handleToggleSection} />

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
              <i className="ri-menu-line w-5 h-5 flex items-center justify-center text-gray-600"></i>
            </button>
            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
              <i className="ri-arrow-left-line w-5 h-5 flex items-center justify-center text-gray-600"></i>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">부서정책 생성</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-xl border border-gray-200 min-h-full">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">부서정책 생성</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">부서정책</label>
                  <input type="text" value={formData.allowdName} 
				  placeholder="정책 이름" 
				  onChange={(e) => handleInputChange('allowdName', e.target.value)} 
				  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">허용할 부서</label>
				  <div className="flex">
                  	<input type="text" value={formData.departmentName}
					 onClick={() => setShowDepartmentsSearchModal(true)} 
					 placeholder="부서명" 
					 onChange={(e) => handleInputChange('departmentName', e.target.value)} 
					 className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
				  	<button onClick={() => setShowDepartmentsSearchModal(true)} 
					className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap text-sm">부서 검색</button>
				  </div>                
				</div>
				
				{/* 여기 오류 있음 */}
                {/*<div>
                  {formData.departments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {formData.departments.map((department) => (
                        <div key={department.departentId} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                          <span className="text-sm">{department.departmentName} ({department.code})</span>
                          <button onClick={() => handleRemoveDepartment(department.departentId)} className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-red-500">
                            <i className="ri-close-line"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>*/}
				
				{/* 선택된 부서 뱃지/삭제 표시 */}
				{/*selectedDepartments.map(d => (
				  <span key={d.departmentId} className="mr-2 bg-gray-100 px-2 rounded">
				    {d.departmentName}
				    <i onClick={() =>
				        setSelectedDepartments(s=>s.filter(x=>x.departmentId!==d.departmentId))
				     } className="ri-close-line cursor-pointer ml-1" />
				  </span>
				))*/}				

                {/*<div>
                  <label className="flex items-center">
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => handleInputChange('isActive', e.target.checked)} className="mr-3" />
                    <span className="text-sm text-gray-700">활성화</span>
                  </label>
                </div>*/}
              </div>

              <div className="flex justify-end mt-8">
                <button onClick={handleSubmit} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">생성</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 분리된 모달 컴포넌트를 사용 - prop 이름과 타입을 일치시켰습니다 */}
      <DepartmentsSearchModal
        isOpen={showDepartmentsSearchModal}
		onClose={() => setShowDepartmentsSearchModal(false)}
        //mockDepartments={mockDepartments}
        //selectedDepartments={selectedDepartments}
        //allSelected={allSelected}
        
        //onSelectAll={handleSelectAll}                 // <- 이름 일치
        onDepartmentsSelect={handleSelectDepartments}
        //onConfirmSelection={handleConfirmSelection}   // <- 이름 일치
      />
    </div>
  );
}

