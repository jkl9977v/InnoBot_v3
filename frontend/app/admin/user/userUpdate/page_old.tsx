//  admin/user/userWrite
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../../../components/AdminSidebar';
import AdminHeader from '../../../../components/AdminHeader';

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
}

interface Position {
  id: string;
  name: string;
  code: string;
  level: number;
  description: string;
}

export default function UserWritePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('user-management');
  const [isDepartmentSearchModalOpen, setIsDepartmentSearchModalOpen] = useState(false);
  const [isPositionSearchModalOpen, setIsPositionSearchModalOpen] = useState(false);
  const [departmentSearchQuery, setDepartmentSearchQuery] = useState('');
  const [positionSearchQuery, setPositionSearchQuery] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    id: '',
    password: '',
    department: '',
    position: '',
    isAdmin: false
  });

  const [departments] = useState<Department[]>([
    { id: '1', name: '개발팀', code: 'DEV', description: '소프트웨어 개발' },
    { id: '2', name: '디자인팀', code: 'DES', description: 'UI/UX 디자인' },
    { id: '3', name: '마케팅팀', code: 'MKT', description: '마케팅 및 홍보' },
    { id: '4', name: '영업팀', code: 'SALES', description: '영업 및 고객관리' },
    { id: '5', name: '인사팀', code: 'HR', description: '인사 관리' },
    { id: '6', name: '재무팀', code: 'FIN', description: '재무 및 회계' }
  ]);

  const [positions] = useState<Position[]>([
    { id: '1', name: '팀장', code: 'TL', level: 5, description: '팀 관리 및 운영' },
    { id: '2', name: '대리', code: 'AL', level: 4, description: '업무 담당자' },
    { id: '3', name: '연구원', code: 'RS', level: 3, description: '연구 및 개발' },
    { id: '4', name: '인턴', code: 'IN', level: 1, description: '실습생' },
    { id: '5', name: '과장', code: 'MG', level: 6, description: '중간 관리자' },
    { id: '6', name: '부장', code: 'GM', level: 7, description: '고급 관리자' }
  ]);

  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>(departments);
  const [filteredPositions, setFilteredPositions] = useState<Position[]>(positions);

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
    if (departmentSearchQuery.trim() === '') {
      setFilteredDepartments(departments);
    } else {
      const lower = departmentSearchQuery.toLowerCase();
      setFilteredDepartments(
        departments.filter(
          dept =>
            dept.name.toLowerCase().includes(lower) ||
            dept.code.toLowerCase().includes(lower) ||
            dept.description.toLowerCase().includes(lower)
        )
      );
    }
  }, [departmentSearchQuery, departments]);

  useEffect(() => {
    if (positionSearchQuery.trim() === '') {
      setFilteredPositions(positions);
    } else {
      const lower = positionSearchQuery.toLowerCase();
      setFilteredPositions(
        positions.filter(
          position =>
            position.name.toLowerCase().includes(lower) ||
            position.code.toLowerCase().includes(lower) ||
            position.description.toLowerCase().includes(lower)
        )
      );
    }
  }, [positionSearchQuery, positions]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('사용자 생성:', formData);
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

  const handleSelectDepartment = (department: Department) => {
    setFormData(prev => ({ ...prev, department: department.name }));
    setIsDepartmentSearchModalOpen(false);
  };

  const handleSelectPosition = (position: Position) => {
    setFormData(prev => ({ ...prev, position: position.name }));
    setIsPositionSearchModalOpen(false);
  };

  const handleDepartmentSearch = () => {
    console.log('Searching departments:', departmentSearchQuery);
  };

  const handlePositionSearch = () => {
    console.log('Searching positions:', positionSearchQuery);
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
              사용자 / 부서 / 직급 {'>'} 사용자 생성
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
              <h2 className="text-lg font-semibold text-gray-900 mb-6">사용자 생성</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사용자 이름
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    placeholder="사용자 이름"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사용자 ID
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => handleInputChange('id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    placeholder="사용자 ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사용자 PW
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
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
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      placeholder="부서명"
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
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      placeholder="직급명"
                    />
                    <button
                      onClick={() => setIsPositionSearchModalOpen(true)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap text-sm"
                    >
                      직급 검색
                    </button>
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isAdmin}
                      onChange={(e) => handleInputChange('isAdmin', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">관리자 여부</span>
                  </label>
                </div>

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

      {/* 부서 검색 모달 */}
      {isDepartmentSearchModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[500px] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">부서 검색</h3>
                <button
                  onClick={() => setIsDepartmentSearchModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="부서명 검색"
                  value={departmentSearchQuery}
                  onChange={(e) => setDepartmentSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={handleDepartmentSearch}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors cursor-pointer"
                >
                  검색
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      부서명
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      코드
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      선택
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDepartments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-900">{dept.name}</td>
                      <td className="px-4 py-2 text-gray-600">{dept.code}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleSelectDepartment(dept)}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors cursor-pointer"
                        >
                          선택
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-200 text-center">
              <div className="text-sm text-gray-600">총 {filteredDepartments.length}개</div>
            </div>
          </div>
        </div>
      )}

      {/* 직급 검색 모달 */}
      {isPositionSearchModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[500px] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">직급 검색</h3>
                <button
                  onClick={() => setIsPositionSearchModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="직급명 검색"
                  value={positionSearchQuery}
                  onChange={(e) => setPositionSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={handlePositionSearch}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors cursor-pointer"
                >
                  검색
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      직급명
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      코드
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      레벨
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      선택
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPositions.map((position) => (
                    <tr key={position.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-900">{position.name}</td>
                      <td className="px-4 py-2 text-gray-600">{position.code}</td>
                      <td className="px-4 py-2 text-gray-600">{position.level}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleSelectPosition(position)}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors cursor-pointer"
                        >
                          선택
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-200 text-center">
              <div className="text-sm text-gray-600">총 {filteredPositions.length}개</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
