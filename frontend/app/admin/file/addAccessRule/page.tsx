// admin/file/addAccessRule
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../../../components/AdminSidebar';
import AdminHeader from '../../../../components/AdminHeader';
import AccessRuleSearchModal from '../../../../components/AccessRuleSearchModal';
import { apiUrl } from '@/lib/api';
 
interface AccessRuleDTO {
	accessId: string;
	accessName: string;
	accessType: string;
}

interface FilePathDTO {
	pathId: string;
	path: string;
	depth: number;
	parentId: string;
	parentPath: string;
	accessId: string | null;
}

export default function AddAccessRulePage() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [expandedSection, setExpandedSection] = useState<string | null>('file-system');
	const [isAccessRuleSearchModalOpen, setIsAccessRuleSearchModalOpen] = useState(false);
	const router = useRouter();
	
	//서버 데이터
	const [filePathDTO, setFilePathDTO] = useState<FilePathDTO[]>([]);
	const [accessRuleDTO, setAccessRuleDTO] = useState<AccessRuleDTO[]>([]);

	const [formData, setFormData] = useState({
		pathId: '',
		path: '',
		depth: '',
		parentId: '',
		parentPath: '',
		accessId: '',
		accessName: '',
		accessType: '',
	});
	
	const [selectedAccessRule, setSelectedAccessRule] = useState<AccessRuleDTO | null>(null);

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
	
	useEffect (() => {
		if(isLoggedIn) return; //fetchDetail;
	}); // ,[isLoggedIn, page, limitRow, searchWord, kind]
	
	const fetchDetail = async () => { //filePathDetail 함수
		try {
			const params = new URLSearchParams({
				pathId: pathId,
			});
			const url = apiUrl(`/admin/file/addAccessRule${params.toString()}`);
			const res = await fetch (url, {
				method: 'GET',
				headers: { Accetp: 'application/json' },
				credentials: 'include',
			});
			if(!res.ok) throw new Error('Server error ' + res.status);
			const data: filePathDTO = await res.json();
			
			/*setAccessRules(data.list);
			setMaxPageNum(data.maxPageNum);
			setCount(data.count);
			setStartPageNum(data.startPageNum);
			setEndPageNum(data.endPageNum);*/
		} catch (e) {
			console.error('list fetch error', e);
		} finally {
			setIsLoading(false);
		}
	};

	const handleToggleSection = (section: string) => {
		setExpandedSection(prev => (prev === section ? null : section));
	};

	const handleInputChange = (field: string, value: string ) => {
		setFormData(prev => ({...prev, [field]: value }));
	};

	const handleSubmit = async () => {
		//저장 요청 
		const url = apiUrl('/admin/file/addAccessRule');
		const res = await fetch(url, {
			method: 'POST',
			headers: { 'contentType' : 'application/json' },
			credentials: 'include',
			body: JSON.stringify(formData) // 홤녀에서 입력 받은 모든 값을 JSON 문자여로 묶어서 서버에 전송
		});
		if (!res.ok) { alert('저장 실패'); return; }
		
		alert('저장 완료'); 
		router.push('/admin/file/fileList');
	};

	const handleGoBack = () => {
		router.push('/admin/file/fileList');
	};

	const handleSelectAccessRule = (accessRule: AccessRuleDTO) => {
		setFormData(prev => ({...prev, accessId: accessRule.accessId}));
		setFormData(prev => ({...prev, accessName: accessRule.accessName}));
		setFormData(prev => ({...prev, accessType: accessRule.accessType}));
		setIsAccessRuleSearchModalOpen(false);
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
					<div className="bg-white rounded-xl border border-gray-200 min-h-full flex">
						<div className="flex-1 p-6 border-r border-gray-200">
							<h2 className="text-lg font-semibold text-gray-900 mb-6">
								접근권한 설정
							</h2>

							<h4 className="text-md font-semibold text-gray-900 mb-6"> 현재 경로 정보 </h4>
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<div >
									<label className="block text-sm font-medium text-gray-700 mb-2">
										현재 경로
									</label>
									<input
										type="text"
										value={formData.path}
										placeholder="현재 경로"
										onChange={e => handleInputChange('path', e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
									/>
									<input
										type="text"
										value={formData.pathId}
										onChange={e => handleInputChange('pathId', e.target.value)}
										hidden readOnly
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										계층
									</label>
									<input type="number" placeholder="계층" 
									value={formData.depth}
									onChange={e => handleInputChange('depth', e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" />
								</div>
								<div className="lg:col-span-2">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										상위 경로
									</label>
									<div className="flex space-x-2">
										<input
											type="text"
											placeholder="상위경로"
											value={formData.parentPath}
											onChange={e => handleInputChange('parentPath', e.target.value)}
											className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
										/>
										<input
											type="text"
											value={formData.parentId}
											onChange={e => handleInputChange('parentId', e.target.value)}
											hidden readOnly
											className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
										/>
									</div>
								</div>
								<hr className="lg:col-span-2"/>

								<div className="lg:col-span-2">
									<h4 className="text-md font-semibold text-gray-900 mb-6"> 접근권한 설정 </h4>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										접근정책
									</label>
									<div className="flex space-x-2">
										<input
											type="text"
											placeholder="정책명"
											value={formData.accessName}
											onChange={e => handleInputChange('accessName', e.target.value)}
											onClick={() => setIsAccessRuleSearchModalOpen(true)}
											className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
										/>
										<input
											type="text"
											value={formData.accessId}
											onChange={e => handleInputChange('accessId', e.target.value)}
											onClick={() => setIsAccessRuleSearchModalOpen(true)}
											hidden readOnly
											className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
										/>
										<button
											onClick={() => setIsAccessRuleSearchModalOpen(true)}
											className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap text-sm"
										>
											접근정책 검색
										</button>
									</div>
								</div>
								<div className="lg:col-span-2">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										허용타입
									</label>
									<div className="flex space-x-2">
										<input
											type="text"
											placeholder="허용타입"
											value={formData.accessType}
											onChange={e => handleInputChange('accessType', e.target.value)}
											className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
										/>
									</div>
								</div>
								<hr className="lg:col-span-2"/>
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

						            {/* 오른쪽 박스 - 상세 정보 */}
						            <div className="w-96 flex flex-col">
						              {/* 부서정책 상세 정보 */}
						              <div className="flex-1 p-6 border-b border-gray-200">
						                <h3 className="text-sm font-semibold text-gray-900 mb-4">부서정책 상세 정보 (미구현 기능)</h3>
						                <div className="overflow-y-auto" style={{ maxHeight: '200px' }}>
						                  {selectedAccessRule ? (
						                    <div className="space-y-3 text-sm">
						                      <div>
						                        <span className="font-medium text-gray-700">정책명:</span>
						                        <div className="text-gray-900">{/*selectedAllowd.allowdName*/}</div>
						                      </div>
						                      { /*<div>
						                        <span className="font-medium text-gray-700">타겟명:</span>
						                        <div className="text-gray-900">{selectedAllowd.targetName}</div>
						                      </div>
						                      <div>
						                        <span className="font-medium text-gray-700">규칙명:</span>
						                        <div className="text-gray-900">{selectedAllowd.ruleName}</div>
						                      </div>*/}
						                      <div>
						                        <span className="font-medium text-gray-700">대상부서:</span>  배열처리 코드 적용 필요함 (미완성)
						                        {/*<div className="text-gray-900">{selectedAllowd.departmentName.join(', ')}</div>*/}
						                      </div>
						                      {/*<div>
						                        <span className="font-medium text-gray-700">상태:</span>
						                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${selectedAllowd.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
						                          {selectedAllowd.isActive ? '활성' : '비활성'}
						                        </div>
						                      </div>*/}
						                    </div>
						                  ) : (
						                    <div className="text-sm text-gray-500 text-center py-4">
						                      접근정책을 선택하면 상세 정보가 표시됩니다.
						                    </div>
						                  )}
						                </div>
						              </div>

						              {/* 직급정책 상세 정보 */}
						              <div className="flex-1 p-6">
						                <h3 className="text-sm font-semibold text-gray-900 mb-4">직급정책 상세 정보 (미구현 기능)</h3>
						                <div className="overflow-y-auto" style={{ maxHeight: '200px' }}>
						                  {selectedAccessRule ? (
						                    <div className="space-y-3 text-sm">
						                      <div>
						                        <span className="font-medium text-gray-700">정책명:</span>
						                        <div className="text-gray-900">{/*selectedAllowg.allowgName*/}</div>
						                      </div>
						                      {/*<div>
						                        <span className="font-medium text-gray-700">타겟명:</span>
						                        <div className="text-gray-900">{selectedAllowg.targetName}</div>
						                      </div>
						                      <div>
						                        <span className="font-medium text-gray-700">규칙명:</span>
						                        <div className="text-gray-900">{selectedAllowg.ruleName}</div>
						                      </div>*/ }
						                      <div>
						                        <span className="font-medium text-gray-700">기준직급:</span>
						                        <div className="text-gray-900">{/*selectedAllowg.gradeName*/}</div>
						                      </div>
											  <div>
											    <span className="font-medium text-gray-700">직급 레벨:</span>
											    <div className="text-gray-900">{/*selectedAllowg.gradeLevel*/}</div>
											  </div>
						                      {/*<div>
						                        <span className="font-medium text-gray-700">상태:</span>
						                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${selectedAllowg.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
						                          {selectedAllowg.isActive ? '활성' : '비활성'}
						                        </div>
						                      </div>*/}
						                    </div>
						                  ) : (
						                    <div className="text-sm text-gray-500 text-center py-4">
						                      접근정책을 선택하면 상세 정보가 표시됩니다.
						                    </div>
						                  )}
						                </div>
						              </div>
						            </div>						
						
					</div>
				</div>
			</div>

			{/*접근정책 검색 모달 분리 컴포넌트 사용 */}
			<AccessRuleSearchModal
				isOpen={isAccessRuleSearchModalOpen}
				onClose={() => setIsAccessRuleSearchModalOpen(false)}
				onSelectAccessRule={handleSelectAccessRule}
			/>

		</div>
	);
}
