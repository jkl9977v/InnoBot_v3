// admin/file/addAccessRule
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminSidebar from '../../../../components/AdminSidebar';
import AdminHeader from '../../../../components/AdminHeader_handleGoBack';
import AccessRuleSearchModal from '../../../../components/AccessRuleSearchModal';
import { apiUrl } from '@/lib/api';
import { useLoading } from '@/hooks/useLoading';
 
interface AccessRuleDTO {
	accessId: string;
	accessName: string;
	accessType: string;
	
	allowdId: string | null;
	allowgId: string | null;
	
	departmentDTO: DepartmentDTO | null;
	gradeDTO : GradeDTO | null;
}

interface AllowdRowDTO {
	allowdId: string;
	allowdName: string;
	departmentId: string;
	departmentName: string;
}

interface DepartmentDTO {
	allowdId: string;
	allowdName: string;
	departmentId: string[];
	departmentName: string[];
}

interface GradeDTO {
	allowgId: string;
	allowgName: string;
	gradeId: string;
	gradeName: string;
	gradeLevel: number;
}

interface FilePathDTO {
	pathId: string;
	path: string;
	depth: number;
	parentId: string | null;
	parentPath: string | null;
	accessId: string | null;
}

export default function AddAccessRulePage() {
	const { isLoading, setIsLoading, wrap } = useLoading();
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [expandedSection, setExpandedSection] = useState<string | null>('file-system');
	const [isAccessRuleSearchModalOpen, setIsAccessRuleSearchModalOpen] = useState(false);
	
	const router = useRouter();
	
	const searchParams = useSearchParams();
	const pathId = searchParams.get('pathId'); // null 체크 필요함
	
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
	const [selectedAllowd, setSelectedAllowd] = useState<DepartmentDTO | null>(null);
	const [selectedAllowg, setSelectedAllowg] = useState<GradeDTO | null>(null);
	
	useEffect (() => {
		if(pathId) fetchPathDetail(); //fetchDetail;
		setIsLoading(false);
	},[pathId]);
	
	useEffect (() => {
		if(!formData.accessId) return;
		
		(async () => {	
			try {
				const accessRuleDTO = await fetchAccessRuleDetail(formData.accessId);
					
				setFormData(prev => ({
					...prev,
					accessId: formData.accessId,
					accessName: accessRuleDTO.accessName,
					accessType: accessRuleDTO.accessType,
				}));
				
				console.log(formData.accessId)
				
				if(accessRuleDTO.allowdId !== null && accessRuleDTO.allowdId !== '') 
					await fetchAllowdDetail(accessRuleDTO.allowdId);
				if(accessRuleDTO.allowgId !== null && accessRuleDTO.allowgId !== '') 
					await fetchAllowgDetail(accessRuleDTO.allowgId);
			} catch (e) {
				console.error('extra detail fetch error ', e);
			}
			
		})();
		
	},[formData.accessId]);
	
	const fetchPathDetail = async () => { //filePathDetail 함수
		try {
			const url = apiUrl(`/admin/file/addAccessRule?pathId=${pathId}`);
			const res = await fetch(url, {
				method: 'GET',
				headers: { Accept: 'application/json' },
				credentials: 'include',
			});
			if(!res.ok) throw new Error('Server error ' + res.status);
			const filePathDTO: FilePathDTO = await res.json();
			
			setFormData({
				pathId: filePathDTO.pathId,
				path: filePathDTO.path,
				depth: filePathDTO.depth,
				parentId: filePathDTO.parentId,
				parentPath: filePathDTO.parentPath,
				accessId: filePathDTO.accessId,
			});
			
			console.log(filePathDTO);
		} catch (e) {
			console.error('list fetch error', e);
		} finally {
			setIsLoading(false);
		}
	};
	
	const fetchAccessRuleDetail = async (accessId: string ) => {
		console.log(accessId);
		try {
			const url = apiUrl(`/admin/accessRule/accessDetail?accessId=${accessId}`);
			const res = await fetch(url, {
				method: 'GET',
				headers: { Accept: 'application/json' },
				credentials: 'include'
			});
			if(!res.ok) throw new Error('detail fetch error ' + res.status);
			const accessRuleDTO: AccessRuleDTO = await res.json();
			
			return accessRuleDTO;
			/*setFormData({ //서버 값으로 폼 초기화
				accessId: dto.accessId,
				acessName: dto.accessName,
				accessType: dto.accessType,
				
			});*/
			console.log(accessRuleDTO);
		} catch (e) {
			alert('데이터를 불러오지 못했습니다.');
			console.error(e);
		}
	}
	
	const fetchAllowdDetail = async (allowdId: string ): Promise<AllowdRowDTO[]> => {
		try {
			console.log(allowdId);
			const url = apiUrl(`/admin/accessRule/allowdDetail?allowdId=${allowdId}`)
			const res = await fetch(url, {
				method: 'GET',
				headers: { Accept : 'application/json'},
				credentials: 'include',
			});
			if (!res.ok) throw new Error ('Server error ' + res.status);
			
			const rows = await res.json();
			if(rows.length) {
				setSelectedAllowd({
					allowdId: rows[0].allowdId,
					allowdName: rows[0].allowdName,
					departmentId: rows.map(r => r.departmentId),
					departmentName: rows.map(r => r.departmentName),
				});
			}
			
		} catch (e) {
			console.error('list fetch error ', e);
		} finally {
			setIsLoading(false);
		}
	}
	
	const fetchAllowgDetail = async (allowgId: string ) => {
		try {
			console.log(allowgId);
			const url = apiUrl(`/admin/accessRule/allowgDetail?allowgId=${allowgId}`)
			const res = await fetch(url, {
				method: 'GET',
				headers: { Accept : 'application/json'},
				credentials: 'include',
			});
			if (!res.ok) throw new Error('Server error ' + res.status);
			
			const allowg = await res.json();
			setSelectedAllowg(allowg);
			
			//return res.json();
		} catch (e) {
			console.error('list fetch error ', e);
		} finally {
			setIsLoading(false);
		}
	}

	const handleToggleSection = (section: string) => {
		setExpandedSection(prev => (prev === section ? null : section));
	};

	const handleInputChange = (field: string, value: string ) => {
		setFormData(prev => ({...prev, [field]: value }));
	};

	const handleSubmit = async () => {
		//저장 요청 
		const url = apiUrl(`/admin/file/addAccessRule`);
		const res = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type' : 'application/json' },
			credentials: 'include',
			body: JSON.stringify(formData) // 화면에서 입력 받은 모든 값을 JSON 문자열로 묶어서 서버에 전송
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

	return (
		<div className="flex h-screen bg-gray-50" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif' }}>
			<AdminSidebar
				isSidebarOpen={isSidebarOpen}
				expandedSection={expandedSection}
				onToggleSection={handleToggleSection}
			/>

			<div className="flex-1 flex flex-col">
			<AdminHeader
			  title="파일 시스템 > 접근권한 설정"
			  handleGoBack={() => handleGoBack()}
			  onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
			/>

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
										readOnly
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
									readOnly
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
											value={formData.parentPath || ''}
											readOnly
											onChange={e => handleInputChange('parentPath', e.target.value)}
											className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
										/>
										<input
											type="text"
											value={formData.parentId || ''}
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
											value={formData.accessName || ''}
											readOnly
											onChange={e => handleInputChange('accessName', e.target.value)}
											onClick={() => setIsAccessRuleSearchModalOpen(true)}
											className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
										/>
										<input
											type="text"
											value={formData.accessId || ''}
											readOnly
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
											value={formData.accessType || ''}
											readOnly
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
						                <h3 className="text-sm font-semibold text-gray-900 mb-4">부서정책 상세 정보</h3>
						                <div className="overflow-y-auto" style={{ maxHeight: '250px' }}>
						                  {selectedAllowd ? (
						                    <div className="space-y-3 text-sm">
						                      <div>
						                        <span className="font-medium text-gray-700">정책명:</span>
						                        <div className="text-gray-900">{selectedAllowd.allowdName}</div>
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
											    <span className="font-medium text-gray-700">대상부서:</span>  
											    {selectedAllowd.departmentName && selectedAllowd.departmentName.length > 0 ? (
											  	selectedAllowd.departmentName.map((name, idx) => (
											  		<div key={idx} className="text-gray-900">{name}</div> // 한줄에 하나씩
											  	))
											  ) : (
											  	<div className="text-gray-500" align="center"> 대상 부서가 없습니다.</div>
											  )}
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
						                <h3 className="text-sm font-semibold text-gray-900 mb-4">직급정책 상세 정보</h3>
						                <div className="overflow-y-auto" style={{ maxHeight: '200px' }}>
						                  {selectedAllowg ? (
						                    <div className="space-y-3 text-sm">
						                      <div>
						                        <span className="font-medium text-gray-700">정책명:</span>
						                        <div className="text-gray-900">{selectedAllowg.allowgName}</div>
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
						                        <div className="text-gray-900">{selectedAllowg.gradeName}</div>
						                      </div>
											  <div>
											    <span className="font-medium text-gray-700">직급 레벨:</span>
											    <div className="text-gray-900">{selectedAllowg.gradeLevel}</div>
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
