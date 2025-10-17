//  admin/user/userWrite
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../../../components/AdminSidebar';
import AdminHeader from '../../../../components/AdminHeader_handleGoBack';
import DepartmentSearchModal, { DepartmentDTO } from '../../../../components/DepartmentSearchModal';
import GradeSearchModal, { GradeDTO } from '../../../../components/GradeSearchModal';
import { apiUrl } from '@/lib/api';
import { useLoading } from '@/hooks/useLoading';
import FullPageSpinner from '../../../../components/FullPageSpinner';

interface DepartmentDTO {
  departmentId: string;
  departmentName: string;
/*  code: string;
  description: string;*/
}

interface GradeDTO {
  gradeId: string;
  gradeName: string;
  gradeLevel: number;
  //code: string;
  //description: string;
}

/*interface userDTO {
	userNum: string,
	userName: string,
	userId: string,
	userPw: string,
	departmentId: string,
	departmentName: string,
	gradeId: string,
	gradeName: string,
	gradeLevel: number,
	manager: boolean,
}*/

export default function UserWritePage() {
  const { isLoading, setIsLoading, wrap } = useLoading();
  //const [isLoggedIn, setIsLoggedIn] = useState(false);
  //const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('user-management');
  const [isDepartmentSearchModalOpen, setIsDepartmentSearchModalOpen] = useState(false);
  const [isGradeSearchModalOpen, setIsGradeSearchModalOpen] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
	userNum: '',
    userName: '',
    userId: '',
    userPw: '',
    departmentId: '',
	departmentName: '',
    gradeId: '',
	gradeName: '',
	gradeLevel: '',
    manager: ''
  });
  
  useEffect(() => {
	setIsLoading(false);
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
	//필수값 공백 체크
	const required = [
		['userName', '이름'], ['userId', 'ID'], ['userPw', 'PW']
	] as const ;
	for (const [key, label] of required) {
		if (!formData[key]) { alert(`${label}을 입력하세요.`); return; }
	}
	
	//저장 요청
	const url = apiUrl('/admin/user/userWrite')
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(formData)		//화면에서 입력 받은 모든 값을 JSON 문자열로 묶어서 서버에 전송
	});
	if (!res.ok) { alert('저장 실패'); return; }
	
	alert('사용자 생성 완료');
	router.push('/admin/user/userList');
  };

  const handleToggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const handleGoBack = () => {
    router.push('/admin/user/userList');
  };

  const handleSelectDepartment = (department: DepartmentDTO) => {
    setFormData(prev => ({ ...prev, departmentId: department.departmentId }));
	setFormData(prev => ({ ...prev, departmentName: department.departmentName }));
    setIsDepartmentSearchModalOpen(false);
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
	    title="사용자 / 부서 / 직급 > 사용자 생성"
	  	handleGoBack={() => handleGoBack()}
	    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
	  />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-xl border border-gray-200 min-h-full">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">사용자 생성</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사용자 이름 *
                  </label>
                  <input
                    type="text"
                    value={formData.userName}
                    onChange={(e) => handleInputChange('userName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    placeholder="사용자 이름"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사용자 ID *
                  </label>
                  <input
                    type="text"
                    value={formData.userId}
                    onChange={(e) => handleInputChange('userId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    placeholder="사용자 ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사용자 PW * 
                  </label>
                  <input
                    type="password"
                    value={formData.userPw}
                    onChange={(e) => handleInputChange('userPw', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    placeholder="비밀번호"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    소속 부서
                  </label>
                  <div className="flex items-center space-x-2">
				  	<input
						type="text"
				  		value={formData.departmentId}
				  		onChange={(e) => handleInputChange('departmentId', e.target.value)}
				  		className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
				  		placeholder="부서Id"
				  		hidden readOnly
				  	/>
                    <input
                      type="text"
                      value={formData.departmentName}
                      onChange={(e) => handleInputChange('departmentName', e.target.value)}
					  onClick={() => setIsDepartmentSearchModalOpen(true)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      placeholder="부서명"
					  readOnly
                    />
					
                    <button
                      onClick={() => setIsDepartmentSearchModalOpen(true)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap text-sm"
                    >
                      부서 검색
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사용자 직급
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

                <div>
                  <label className="flex items-center space-x-4">
				  <span className="block text-sm font-medium text-gray-700 mb-2">관리자 여부  </span>
                    
				  <input
				     type="checkbox"
				     checked={formData.manager === 'y'}
				     onChange={(e) => handleInputChange('manager', e.target.checked ? 'y' : '')}
				     className="mr-2"
				  />
                  </label>
				  
                </div>
				<hr/>
                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    사용자 생성
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
	  
	  {/*분리된 부서검색 모달 사용*/}
	  <DepartmentSearchModal
	  	isOpen={isDepartmentSearchModalOpen}
		onClose={() => setIsDepartmentSearchModalOpen(false)}
		onSelectDepartment={handleSelectDepartment}
	  />
	
	  {/*직급검색 모달 */}
	  <GradeSearchModal
	  	isOpen={isGradeSearchModalOpen}
		onClose={() => setIsGradeSearchModalOpen(false)}
		onSelectGrade={handleSelectGrade}
	  />
    </div>
  );
}
