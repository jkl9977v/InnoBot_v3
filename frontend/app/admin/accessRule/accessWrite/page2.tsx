//  admin/accessRule/accessWrite
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../../../components/AdminSidebar';


interface DepartmentDTO {
  id: string;
  name: string;
  targetName: string;
  ruleName: string;
  departments: string[];
  isActive: boolean;
}

interface GradeDTO {
  id: string;
  name: string;
  targetName: string;
  ruleName: string;
  position: string;
  isActive: boolean;
}

export default function AccessWritePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('policies');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isDepartmentDTOSearchModalOpen, setIsDepartmentDTOSearchModalOpen] = useState(false);
  const [isGradeDTOSearchModalOpen, setIsGradeDTOSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptdtoSearchQuery, setDeptdtoSearchQuery] = useState('');
  const [GradeDTOSearchQuery, setGradeDTOSearchQuery] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    targetName: '',
    ruleName: '',
    dtoName: '',
    DepartmentDTO: '',
    GradeDTO: '',
    isActive: true
  });
  
  const [selectedDepartmentDTO, setSelectedDepartmentDTO] = useState<DepartmentDTO | null>(null);
  const [selectedGradeDTO, setSelectedGradeDTO] = useState<GradeDTO | null>(null);


  const [departmentPolicies] = useState<DepartmentDTO[]>([
    { id: '1', name: '개발팀 정책', targetName: 'dev-target', ruleName: 'dev-rule', departments: ['開발팀'], isActive: true },
    { id: '2', name: '디자인팀 정책', targetName: 'design-target', ruleName: 'design-rule', departments: ['設計チーム'], isActive: true },
    { id: '3', name: '마케팅영업 정책', targetName: 'sales-target', ruleName: 'sales-rule', departments: ['マーケティング', '営業'], isActive: true },
    { id: '4', name: '관리부서 정책', targetName: 'admin-target', ruleName: 'admin-rule', departments: ['人事', '財務'], isActive: true }
  ]);

  const [positionPolicies] = useState<GradeDTO[]>([
    { id: '1', name: '팀장 政策', targetName: 'manager-target', ruleName: 'manager-rule', position: '팀장', isActive: true },
    { id: '2', name: '대리 政策', targetName: 'assistant-target', ruleName: 'assistant-rule', position: '대리', isActive: true },
    { id: '3', name: '연구원 政策', targetName: 'researcher-target', ruleName: 'researcher-rule', position: '연구원', isActive: true },
    { id: '4', name: '관리직 政策', targetName: 'executive-target', ruleName: 'executive-rule', position: '과장', isActive: true }
  ]);

  //const [filteredPolicies, setFilteredPolicies] = useState<Accessdto[]>(accessPolicies);
  const [filteredDepartmentPolicies, setFilteredDepartmentPolicies] = useState<DepartmentDTO[]>(departmentPolicies);
  const [filteredPositionPolicies, setFilteredPositionPolicies] = useState<GradeDTO[]>(positionPolicies);

  useEffect(() => {
    try {
		//로그인 처리 로직
		/*
      const loginStatus = localStorage.getItem('isLoggedIn');
      if (loginStatus !== 'true') {
        router.push('/login');
        return;
      }
	  */
      setIsLoggedIn(true);
    } catch (e) {
      console.error('Failed to read login status:', e);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      /*setFilteredPolicies(accessPolicies);*/
    } else {
      const lower = searchQuery.toLowerCase();
      setFilteredPolicies(
        accessPolicies.filter(
          dto =>
            dto.name.toLowerCase().includes(lower) ||
            dto.description.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchQuery, /*accessPolicies*/]);

  useEffect(() => {
    if (deptdtoSearchQuery.trim() === '') {
      setFilteredDepartmentPolicies(departmentPolicies);
    } else {
      const lower = deptdtoSearchQuery.toLowerCase();
      setFilteredDepartmentPolicies(
        departmentPolicies.filter(
          dto =>
            dto.name.toLowerCase().includes(lower) ||
            dto.targetName.toLowerCase().includes(lower) ||
            dto.departments.some(dept => dept.toLowerCase().includes(lower))
        )
      );
    }
  }, [deptdtoSearchQuery, departmentPolicies]);

  useEffect(() => {
    if (GradeDTOSearchQuery.trim() === '') {
      setFilteredPositionPolicies(positionPolicies);
    } else {
      const lower = GradeDTOSearchQuery.toLowerCase();
      setFilteredPositionPolicies(
        positionPolicies.filter(
          dto =>
            dto.name.toLowerCase().includes(lower) ||
            dto.targetName.toLowerCase().includes(lower) ||
            dto.position.toLowerCase().includes(lower)
        )
      );
    }
  }, [GradeDTOSearchQuery, positionPolicies]);

  const handleToggleSection = (section: string) => {
    setExpandedSection(prev => (prev === section ? null : section));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.targetName.trim() || !formData.ruleName.trim() || !formData.dtoName.trim()) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    console.log('Creating access rule:', formData);
    router.push('/admin/accessRule/accessList');
  };

  const handleGoBack = () => {
    router.push('/admin/accessRule/accessList');
  };

  const handleSelectdto = (dto: Accessdto) => {
    setFormData(prev => ({ ...prev, dtoName: dto.name }));
    setIsSearchModalOpen(false);
  };

  const handleSearch = () => {
    console.log('Searching policies:', searchQuery);
  };

  const handleSelectDepartmentDTO = (dto: DepartmentDTO) => {
    setFormData(prev => ({ ...prev, DepartmentDTO: dto.name }));
    setSelectedDepartmentDTO(dto);
    setIsDepartmentDTOSearchModalOpen(false);
  };

  const handleSelectGradeDTO = (dto: GradeDTO) => {
    setFormData(prev => ({ ...prev, GradeDTO: dto.name }));
    setSelectedGradeDTO(dto);
    setIsGradeDTOSearchModalOpen(false);
  };

  const handleDepartmentDTOSearch = () => {
    console.log('Searching department policies:', deptdtoSearchQuery);
  };

  const handleGradeDTOSearch = () => {
    console.log('Searching position policies:', GradeDTOSearchQuery);
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
              접근정책 &gt; 접근정책 생성
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
          <div className="bg-white rounded-xl border border-gray-200 min-h-full flex">
            {/* 왼쪽 박스 - 접근정책 정보 */}
            <div className="flex-1 p-6 border-r border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                접근정책 생성
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    접근정책
                  </label>
                  <input
                    type="text"
                    value={formData.targetName}
                    onChange={e => handleInputChange('targetName', e.target.value)}
                    placeholder="접근정책"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    허용 타입
                  </label>
				  <select type="text" name="accessType" className="px-2 py-1 border border-gray-300 rounded text-sm pr-8">
				  						<option value="허용 안함" selected>허용 안함</option>
				  						<option value="모두 허용" >모두 허용</option>
				  						<option value="내부 전체 허용" >내부 전체 허용</option>
				  						<option value="일부 부서 허용" >일부 부서 허용</option>
				  						<option value="특정 직급 이상 허용" >특정 직급 이상 허용</option>
				  						<option value="일부 부서의 특정 직급 이상 허용" >일부 부서의 특정 직급 이상 허용</option>
				  					</select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    부서정책
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.DepartmentDTO}
                      onChange={e => handleInputChange('DepartmentDTO', e.target.value)}
                      placeholder=""
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={() => setIsDepartmentDTOSearchModalOpen(true)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap text-sm"
                    >
                      부서정책 검색
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    직급정책
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.GradeDTO}
                      onChange={e => handleInputChange('GradeDTO', e.target.value)}
                      placeholder=""
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={() => setIsGradeDTOSearchModalOpen(true)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap text-sm"
                    >
                      직급정책 검색
                    </button>
                  </div>
                </div>

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
                  정책 생성
                </button>
              </div>
            </div>

            {/* 오른쪽 박스 - 상세 정보 */}
            <div className="w-96 flex flex-col">
              {/* 부서정책 상세 정보 */}
              <div className="flex-1 p-6 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">부서정책 상세 정보</h3>
                <div className="overflow-y-auto" style={{ maxHeight: '200px' }}>
                  {selectedDepartmentDTO ? (
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">정책명:</span>
                        <div className="text-gray-900">{selectedDepartmentDTO.name}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">타겟명:</span>
                        <div className="text-gray-900">{selectedDepartmentDTO.targetName}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">규칙명:</span>
                        <div className="text-gray-900">{selectedDepartmentDTO.ruleName}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">대상부서:</span>
                        <div className="text-gray-900">{selectedDepartmentDTO.departments.join(', ')}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">상태:</span>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${selectedDepartmentDTO.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {selectedDepartmentDTO.isActive ? '활성' : '비활성'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 text-center py-4">
                      부서정책을 선택하면 상세 정보가 표시됩니다.
                    </div>
                  )}
                </div>
              </div>

              {/* 직급정책 상세 정보 */}
              <div className="flex-1 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">직급정책 상세 정보</h3>
                <div className="overflow-y-auto" style={{ maxHeight: '200px' }}>
                  {selectedGradeDTO ? (
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">정책명:</span>
                        <div className="text-gray-900">{selectedGradeDTO.name}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">타겟명:</span>
                        <div className="text-gray-900">{selectedGradeDTO.targetName}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">규칙명:</span>
                        <div className="text-gray-900">{selectedGradeDTO.ruleName}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">대상직급:</span>
                        <div className="text-gray-900">{selectedGradeDTO.position}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">상태:</span>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${selectedGradeDTO.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {selectedGradeDTO.isActive ? '활성' : '비활성'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 text-center py-4">
                      직급정책을 선택하면 상세 정보가 표시됩니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ... 기존 모달들은 그대로 유지 ... */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[500px] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">접근정책 검색</h3>
                <button
                  onClick={() => setIsSearchModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <select className="px-2 py-1 border border-gray-300 rounded text-sm pr-8">
                  <option>전체</option>
                  <option>접근정책</option>
                  <option>부서정책</option>
                  <option>직급정책</option>
                </select>
                <input
                  type="text"
                  placeholder="검색어"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={handleSearch}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors cursor-pointer"
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
                      접근정책
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      허용 타입
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      선택
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPolicies.map(dto => (
                    <tr key={dto.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-900">{dto.name}</td>
                      <td className="px-4 py-2 text-gray-600">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            dto.type === 'allow'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {dto.type === 'allow' ? '허용 업읽' : '허용 없음'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleSelectdto(dto)}
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
              <div className="text-sm text-gray-600">총 {filteredPolicies.length}개</div>
            </div>
          </div>
        </div>
      )}

      {isDepartmentDTOSearchModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[500px] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">부서정책 검색</h3>
                <button
                  onClick={() => setIsDepartmentDTOSearchModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="부서정책 검색"
                  value={deptdtoSearchQuery}
                  onChange={e => setDeptdtoSearchQuery(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={handleDepartmentDTOSearch}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors cursor-pointer"
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
                      정책명
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      대상부서
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      선택
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDepartmentPolicies.map(dto => (
                    <tr key={dto.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-900">{dto.name}</td>
                      <td className="px-4 py-2 text-gray-600 text-xs">
                        {dto.departments.join(', ')}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleSelectDepartmentDTO(dto)}
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
              <div className="text-sm text-gray-600">총 {filteredDepartmentPolicies.length}개</div>
            </div>
          </div>
        </div>
      )}

      {isGradeDTOSearchModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[500px] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">직급정책 검색</h3>
                <button
                  onClick={() => setIsGradeDTOSearchModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="직급정책 검색"
                  value={GradeDTOSearchQuery}
                  onChange={e => setGradeDTOSearchQuery(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={handleGradeDTOSearch}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors cursor-pointer"
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
                      정책명
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      대상직급
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      선택
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPositionPolicies.map(dto => (
                    <tr key={dto.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-900">{dto.name}</td>
                      <td className="px-4 py-2 text-gray-600">{dto.position}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleSelectGradeDTO(dto)}
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
              <div className="text-sm text-gray-600">총 {filteredPositionPolicies.length}개</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
