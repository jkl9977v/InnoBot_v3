
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../../../components/AdminSidebar';
import AdminHeader from '../../../../components/AdminHeader';

interface AccessPolicy {
  id: string;
  name: string;
  type: 'allow' | 'deny';
  target: string;
  description: string;
}

export default function AddAccessRulePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('file-system');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    fileName: '',
    policyName: ''
  });

  const [accessPolicies] = useState<AccessPolicy[]>([
    { id: '1', name: '접근정책', type: 'allow', target: 'admin/*', description: '관리자 전체 권한' },
    { id: '2', name: '접근권한 테스트', type: 'allow', target: 'test/*', description: '테스트 권한' },
    { id: '3', name: '접근권한 테스트2', type: 'deny', target: 'restricted/*', description: '제한된 영역' },
    { id: '4', name: '파일규칙 테스트', type: 'allow', target: 'files/*', description: '파일 접근 권한' },
    { id: '5', name: '0729 규칙테스트', type: 'allow', target: 'temp/*', description: '임시 규칙' },
    { id: '6', name: '0731 테스트', type: 'deny', target: 'legacy/*', description: '레거시 시스템 제한' }
  ]);

  const [filteredPolicies, setFilteredPolicies] = useState<AccessPolicy[]>(accessPolicies);

  useEffect(() => {
    try {
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
      setFilteredPolicies(accessPolicies);
    } else {
      const lower = searchQuery.toLowerCase();
      setFilteredPolicies(
        accessPolicies.filter(
          policy =>
            policy.name.toLowerCase().includes(lower) ||
            policy.description.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchQuery, accessPolicies]);

  const handleToggleSection = (section: string) => {
    setExpandedSection(prev => (prev === section ? null : section));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.fileName.trim() || !formData.policyName.trim()) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    console.log('Creating file access rule:', formData);
    router.push('/admin/file/fileList');
  };

  const handleGoBack = () => {
    router.push('/admin/file/fileList');
  };

  const handleSelectPolicy = (policy: AccessPolicy) => {
    setFormData(prev => ({
      ...prev,
      policyName: policy.name
    }));
    setIsSearchModalOpen(false);
  };

  const handleSearch = () => {
    console.log('Searching policies:', searchQuery);
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
              파일시스템 &gt; 접근권한 설정
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
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                접근권한 설정
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    파일명
                  </label>
                  <input
                    type="text"
                    value={formData.fileName}
                    onChange={e => handleInputChange('fileName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    접근정책
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.policyName}
                      onChange={e => handleInputChange('policyName', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={() => setIsSearchModalOpen(true)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap text-sm"
                    >
                      접근정책 검색
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  설정 저장
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 접근정책 검색 모달 - 크기 더 확대 */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[800px] max-h-[600px] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
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
                <select className="px-3 py-2 border border-gray-300 rounded text-sm pr-8">
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={handleSearch}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      접근정책
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      허용 타입
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      선택
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPolicies.map(policy => (
                    <tr key={policy.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{policy.name}</td>
                      <td className="px-6 py-4 text-gray-600">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            policy.type === 'allow'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {policy.type === 'allow' ? '허용 업읽' : '허용 없음'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleSelectPolicy(policy)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors cursor-pointer"
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
    </div>
  );
}
