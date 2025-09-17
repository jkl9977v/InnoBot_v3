//  /admin/accessRule/allowdWrite
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../../../components/AdminSidebar';
import AdminHeader from '../../../../components/AdminHeader';

interface Department {
  id: number;
  name: string;
  code: string;
}

export default function DepartmentPolicyWritePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('policies');
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<Department[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    targetName: '',
    ruleName: '',
    departments: [] as Department[],
    isActive: false
  });

  const mockDepartments = [
    { id: 1, name: '경영지원팀', code: 'MGMT001' },
    { id: 2, name: '인사팀', code: 'HR001' },
    { id: 3, name: '재무팀', code: 'FIN001' },
    { id: 4, name: '마케팅팀', code: 'MKT001' },
    { id: 5, name: '개발팀', code: 'DEV001' },
    { id: 6, name: '디자인팀', code: 'DSN001' },
    { id: 7, name: '영업팀', code: 'SALES001' },
    { id: 8, name: '고객지원팀', code: 'CS001' }
  ];

  useEffect(() => {
/*    const loginStatus = localStorage.getItem('isLoggedIn');
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

  const handleBack = () => {
    router.push('/admin/accessRule/allowdList');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDepartmentSearch = () => {
    setSelectedDepartments([...formData.departments]);
    setShowDepartmentModal(true);
  };

  const handleSelectAll = (checked: boolean) => {
    setAllSelected(checked);
    if (checked) {
      setSelectedDepartments([...mockDepartments]);
    } else {
      setSelectedDepartments([]);
    }
  };

  const handleDepartmentSelect = (department: Department, checked: boolean) => {
    if (checked) {
      setSelectedDepartments(prev => [...prev, department]);
    } else {
      setSelectedDepartments(prev => prev.filter(d => d.id !== department.id));
      setAllSelected(false);
    }
  };

  const handleConfirmSelection = () => {
    setFormData(prev => ({
      ...prev,
      departments: selectedDepartments
    }));
    setShowDepartmentModal(false);
  };

  const handleRemoveDepartment = (departmentId: number) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.filter(d => d.id !== departmentId)
    }));
  };

  const handleSubmit = () => {
    console.log('부서정책 생성:', formData);
    alert('부서정책이 생성되었습니다.');
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
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-line w-5 h-5 flex items-center justify-center text-gray-600"></i>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">부서정책 생성</h1>
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
              <h2 className="text-lg font-semibold text-gray-900 mb-6">부서정책 생성</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    타겟명
                  </label>
                  <input
                    type="text"
                    value={formData.targetName}
                    onChange={(e) => handleInputChange('targetName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    규칙명
                  </label>
                  <input
                    type="text"
                    value={formData.ruleName}
                    onChange={(e) => handleInputChange('ruleName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    부서명
                  </label>
                  <div className="flex">
                    <button
                      onClick={handleDepartmentSearch}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-r-lg transition-colors cursor-pointer whitespace-nowrap text-sm"
                    >
                      부서 검색
                    </button>
                  </div>
                  
                  {formData.departments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {formData.departments.map((department) => (
                        <div key={department.id} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                          <span className="text-sm">{department.name} ({department.code})</span>
                          <button
                            onClick={() => handleRemoveDepartment(department.id)}
                            className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <i className="ri-close-line"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">활성화</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  생성
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDepartmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[600px] max-h-[500px] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">부서 검색</h3>
                <button
                  onClick={() => setShowDepartmentModal(false)}
                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="mr-3"
                  />
                  <span className="text-sm font-medium text-gray-700">전체 선택</span>
                </label>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">선택</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">부서명</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">코드</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockDepartments.map((department) => (
                      <tr key={department.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedDepartments.some(d => d.id === department.id)}
                            onChange={(e) => handleDepartmentSelect(department, e.target.checked)}
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{department.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{department.code}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowDepartmentModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                취소
              </button>
              <button
                onClick={handleConfirmSelection}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                선택 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
