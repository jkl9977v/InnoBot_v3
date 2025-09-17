//  admin/accessRule/allowgWrite
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../../../components/AdminSidebar';
import AdminHeader from '../../../../components/AdminHeader';
import GradeSearchModal from '../../../../components/GradeSearchModal'; //분리된 모달 

interface grade {
  id: string;
  name: string;
  code: string;
  level: number;
  description: string;
}

export default function AllowgWritePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('policies');
  const [isGradeSearchModalOpen, setIsGradeSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    targetName: '',
    ruleName: '',
    gradeName: '',
    isActive: true
  });

  const [grades] = useState<grade[]>([
    { id: '1', name: '팀장', code: 'TL', level: 5, description: '팀 관리 및 운영' },
    { id: '2', name: '대리', code: 'AL', level: 4, description: '업무 담당자' },
    { id: '3', name: '연구원', code: 'RS', level: 3, description: '연구 및 개발' },
    { id: '4', name: '인턴', code: 'IN', level: 1, description: '실습생' },
    { id: '5', name: '과장', code: 'MG', level: 6, description: '중간 관리자' },
    { id: '6', name: '부장', code: 'GM', level: 7, description: '고급 관리자' }
  ]);

  const [filteredGrades, setFilteredGrades] = useState<grade[]>(grades);

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
    if (searchQuery.trim() === '') {
      setFilteredGrades(grades);
    } else {
      const lower = searchQuery.toLowerCase();
      setFilteredGrades(
        grades.filter(
          grade =>
            grade.name.toLowerCase().includes(lower) ||
            grade.code.toLowerCase().includes(lower) ||
            grade.description.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchQuery, grades]);

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

  const handleSubmit = () => {
    console.log('Creating grade policy:', formData);
    router.push('/admin/accessRule/allowgList');
  };

  const handleGoBack = () => {
    router.push('/admin/accessRule/allowgList');
  };

  const handleSelectGrade = (grade: grade) => {
    setFormData(prev => ({
      ...prev,
      gradeName: grade.name
    }));
    setIsGradeSearchModalOpen(false);
  };

  const handleSearch = () => {
    console.log('Searching grades:', searchQuery);
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
                    value={formData.targetName}
                    onChange={e => handleInputChange('targetName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* 허용 기준 직급 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    허용기준 직급
                  </label>
                  <input
				  onClick={() => setIsGradeSearchModalOpen(true)}
                    type="text"
					placeholder="직급명"
                    value={formData.gradeName}
                    onChange={e => handleInputChange('gradeName', e.target.value)}
                    className="flex-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
				  <input
				  onClick={() => setIsGradeSearchModalOpen(true)}
				    type="text"
					placeholder="직급 레벨"
				    value={formData.gradeLevel}
				    onChange={e => handleInputChange('gradeLevel', e.target.value)}
				    className="flex-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
				  />
				  <button
				     onClick={() => setIsGradeSearchModalOpen(true)}
				     className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap text-sm"
				  >
				     직급 검색
				  </button>				  
                </div>


                {/* 활성화 */}
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={e => handleInputChange('isActive', e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">활성화</span>
                  </label>
                </div>
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
		searchQuery={searchQuery}
		setSearchQuery={setSearchQuery}
		filteredGrades={filteredGrades}
		onSelectGrade={handleSelectGrade}
		onSearch={handleSearch}
	  />
	 </div>
  );
}
