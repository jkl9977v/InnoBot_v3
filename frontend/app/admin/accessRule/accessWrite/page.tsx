// app/admin/accessRule/accessWrite/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../../../components/AdminSidebar';
import AllowdSearchModal from '../../../../components/AllowdSearchModal';
import AllowgSearchModal from '../../../../components/AllowgSearchModal';

interface Allowd {
  id: string;
  name: string;
  targetName: string;
  ruleName: string;
  departments: string[];
  isActive: boolean;
}

interface Allowg {
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
  const [isAllowdSearchModalOpen, setIsAllowdSearchModalOpen] = useState(false);
  const [isAllowgSearchModalOpen, setIsAllowgSearchModalOpen] = useState(false);
  const [deptPolicySearchQuery, setDeptPolicySearchQuery] = useState('');
  const [AllowgSearchQuery, setAllowgSearchQuery] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    targetName: '',
    ruleName: '',
    policyName: '',
    Allowd: '',
    Allowg: '',
    isActive: true
  });

  const [selectedAllowd, setSelectedAllowd] = useState<Allowd | null>(null);
  const [selectedAllowg, setSelectedAllowg] = useState<Allowg | null>(null);

  const [Allowd] = useState<Allowd[]>([
    { id: '1', name: '개발팀 정책', targetName: 'dev-target', ruleName: 'dev-rule', departments: ['開発팀'], isActive: true },
    { id: '2', name: '디자인팀 정책', targetName: 'design-target', ruleName: 'design-rule', departments: ['設計チーム'], isActive: true },
    { id: '3', name: '마케팅영업 정책', targetName: 'sales-target', ruleName: 'sales-rule', departments: ['マーケティング', '営業'], isActive: true },
    { id: '4', name: '관리부서 정책', targetName: 'admin-target', ruleName: 'admin-rule', departments: ['人事', '財務'], isActive: true }
  ]);

  const [Allowg] = useState<Allowg[]>([
    { id: '1', name: '팀장 정책', targetName: 'manager-target', ruleName: 'manager-rule', position: '팀장', isActive: true },
    { id: '2', name: '대리 정책', targetName: 'assistant-target', ruleName: 'assistant-rule', position: '대리', isActive: true },
    { id: '3', name: '연구원 정책', targetName: 'researcher-target', ruleName: 'researcher-rule', position: '연구원', isActive: true },
    { id: '4', name: '관리직 정책', targetName: 'executive-target', ruleName: 'executive-rule', position: '과장', isActive: true }
  ]);

  const [filteredAllowd, setFilteredAllowd] = useState<Allowd[]>(Allowd);
  const [filteredAllowg, setFilteredAllowg] = useState<Allowg[]>(Allowg);

  useEffect(() => {
    try {
      // 로그인 체크 자리(샘플)
      setIsLoggedIn(true);
    } catch (e) {
      console.error('Failed to read login status:', e);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (deptPolicySearchQuery.trim() === '') {
      setFilteredAllowd(Allowd);
    } else {
      const lower = deptPolicySearchQuery.toLowerCase();
      setFilteredAllowd(
        Allowd.filter(
          policy =>
            policy.name.toLowerCase().includes(lower) ||
            policy.targetName.toLowerCase().includes(lower) ||
            policy.departments.some(dept => dept.toLowerCase().includes(lower))
        )
      );
    }
  }, [deptPolicySearchQuery, Allowd]);

  useEffect(() => {
    if (AllowgSearchQuery.trim() === '') {
      setFilteredAllowg(Allowg);
    } else {
      const lower = AllowgSearchQuery.toLowerCase();
      setFilteredAllowg(
        Allowg.filter(
          policy =>
            policy.name.toLowerCase().includes(lower) ||
            policy.targetName.toLowerCase().includes(lower) ||
            policy.position.toLowerCase().includes(lower)
        )
      );
    }
  }, [AllowgSearchQuery, Allowg]);

  const handleToggleSection = (section: string) => {
    setExpandedSection(prev => (prev === section ? null : section));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.targetName.trim() || !formData.ruleName.trim() || !formData.policyName.trim()) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    console.log('Creating access rule:', formData);
    router.push('/admin/accessRule/accessList');
  };

  const handleGoBack = () => {
    router.push('/admin/accessRule/accessList');
  };

  const handleSelectAllowd = (policy: Allowd) => {
    setFormData(prev => ({ ...prev, Allowd: policy.name }));
    setSelectedAllowd(policy);
    setIsAllowdSearchModalOpen(false);
  };

  const handleSelectAllowg = (policy: Allowg) => {
    setFormData(prev => ({ ...prev, Allowg: policy.name }));
    setSelectedAllowg(policy);
    setIsAllowgSearchModalOpen(false);
  };

  const handleAllowdSearch = (q?: string) => {
    // 페이지 레벨에서 검색어를 전달해 모달 내부의 목록(또는 API)을 업데이트하고 싶다면 사용.
    setDeptPolicySearchQuery(q ?? deptPolicySearchQuery);
    console.log('Searching department policies:', q ?? deptPolicySearchQuery);
  };

  const handleAllowgSearch = (q?: string) => {
    setAllowgSearchQuery(q ?? AllowgSearchQuery);
    console.log('Searching position policies:', q ?? AllowgSearchQuery);
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">접근정책</label>
                  <input
                    type="text"
                    value={formData.targetName}
                    onChange={e => handleInputChange('targetName', e.target.value)}
                    placeholder="접근정책"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">허용 타입</label>
                  <select name="accessType" className="px-2 py-1 border border-gray-300 rounded text-sm pr-8">
                    <option value="none">허용 안함</option>
                    <option value="all">모두 허용</option>
                    <option value="internal">내부 전체 허용</option>
                    <option value="departments">일부 부서 허용</option>
                    <option value="positionAbove">특정 직급 이상 허용</option>
                    <option value="deptAndPosition">일부 부서의 특정 직급 이상 허용</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">부서정책</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.Allowd}
                      onChange={e => handleInputChange('Allowd', e.target.value)}
                      placeholder=""
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={() => setIsAllowdSearchModalOpen(true)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap text-sm"
                    >
                      부서정책 검색
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">직급정책</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.Allowg}
                      onChange={e => handleInputChange('Allowg', e.target.value)}
                      placeholder=""
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={() => setIsAllowgSearchModalOpen(true)}
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
                  {selectedAllowd ? (
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">정책명:</span>
                        <div className="text-gray-900">{selectedAllowd.name}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">타겟명:</span>
                        <div className="text-gray-900">{selectedAllowd.targetName}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">규칙명:</span>
                        <div className="text-gray-900">{selectedAllowd.ruleName}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">대상부서:</span>
                        <div className="text-gray-900">{selectedAllowd.departments.join(', ')}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">상태:</span>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${selectedAllowd.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {selectedAllowd.isActive ? '활성' : '비활성'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 text-center py-4">부서정책을 선택하면 상세 정보가 표시됩니다.</div>
                  )}
                </div>
              </div>

              {/* 직급정책 상세 정보 */}
              <div className="flex-1 p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">직급정책 상세 정보</h3>
                <div className="overflow-y-auto" style={{ maxHeight: '200px' }}>
                  {selectedAllowg ? (
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">정책명:</span>
                        <div className="text-gray-900">{selectedAllowg.name}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">타겟명:</span>
                        <div className="text-gray-900">{selectedAllowg.targetName}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">규칙명:</span>
                        <div className="text-gray-900">{selectedAllowg.ruleName}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">대상직급:</span>
                        <div className="text-gray-900">{selectedAllowg.position}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">상태:</span>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${selectedAllowg.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {selectedAllowg.isActive ? '활성' : '비활성'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 text-center py-4">직급정책을 선택하면 상세 정보가 표시됩니다.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 분리된 모달 컴포넌트 사용 */}
      <AllowdSearchModal
        isOpen={isAllowdSearchModalOpen}
        onClose={() => setIsAllowdSearchModalOpen(false)}
        policies={Allowd}
        onSelect={handleSelectAllowd}
        initialQuery={deptPolicySearchQuery}
      />

      <AllowgSearchModal
        isOpen={isAllowgSearchModalOpen}
        onClose={() => setIsAllowgSearchModalOpen(false)}
        policies={Allowg}
        onSelect={handleSelectAllowg}
        initialQuery={AllowgSearchQuery}
      />
    </div>
  );
}
