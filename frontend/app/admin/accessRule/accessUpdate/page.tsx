	//  admin/accessRule/accessUpdate
	'use client';
	import { useState, useEffect } from 'react';
	import { useRouter, useSearchParams } from 'next/navigation';
	import AdminSidebar from '../../../../components/AdminSidebar';
	import AdminHeader from '../../../../components/AdminHeader_handleGoBack';
	import AllowdSearchModal from '../../../../components/AllowdSearchModal'; //분리된 모달
	import AllowgSearchModal from '../../../../components/AllowgSearchModal'; //모달
	import { apiUrl } from '@/lib/api';
	import { useLoading } from '@/hooks/useLoading';
	import FullPageSpinner from '../../../../components/FullPageSpinner';
	
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
	
	interface AccessRuleDTO {
		accessId: string;
		accessName: string;
		accessType: string;
		
		allowdId: string | null;
		allowgId: string | null;
		
		departmentDTO: DepartmentDTO | null;
		gradeDTO: GradeDTO | null;
	}
	
	export default function AccessWritePage() {
	  //const [isLoggedIn, setIsLoggedIn] = useState(false);
	  //const [isLoading, setIsLoading] = useState(true);
	  const { isLoading, setIsLoading, wrap} = useLoading();
	  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	  const [expandedSection, setExpandedSection] = useState<string | null>('policies');
	  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
	  const [isAllowdSearchModalOpen, setIsAllowdSearchModalOpen] = useState(false);
	  const [isAllowgSearchModalOpen, setIsAllowgSearchModalOpen] = useState(false);

	  const router = useRouter();
	  
	  const searchParams = useSearchParams();
	  const accessId = searchParams.get('accessId'); //null 체크 필요
	
	  const [formData, setFormData] = useState({
		accessId: '',
		accessName: '',
		accessType: '',
		allowdId: '',
		allowdName: '',
		allowgId: '',
		allowgName: '',

	  });
	  
	  const [selectedAllowd, setSelectedAllowd] = useState<DepartmentDTO | null>(null);
	  const [selectedAllowg, setSelectedAllowg] = useState<GradeDTO | null>(null);
	
	  const [allowd, setAllowd] = useState<DepartmentDTO[]>([]);
	  const [allowg, setAllowg] = useState<GradeDTO[]>([]);
	  
	  useEffect(() => {
		if (!accessId) return;
		fetchDetail();
		setIsLoading(false);
	  }, [accessId]);
	  
	  const fetchDetail = async () => {
		try {
			const url = apiUrl(`/admin/accessRule/accessDetail?accessId=${accessId}`);
			const res = await fetch(url, {
				method: 'GET',
				headers: { Accept: 'application/json' },
				credentials: 'include'
			});
			if (!res.ok) throw new Error('detail fetch error ' + res.status);
			const dto: AccessRuleDTO = await res.json();
			setFormData({ //서버 값으로 폼 초기화
				accessId: dto.accessId,
				accessName: dto.accessName,
				accessType: dto.accessType,
				
				allowdId: dto.allowdId ?? '',
				allowdName: dto.departmentDTO?.allowdName ?? '', // 꺼내서 주입
				allowgId: dto.allowgId ?? '',
				allowgName: dto.gradeDTO?.allowgName ?? '',
				
			});		
			
			console.log(dto);
			
/*			if (dto.allowdId) {
				setSelectedAllowd({
					allowdId: dto.DepartmentDTO.allowdId,
					allowdName: dto.DepartmentDTO.allowdName,
					departmentId: dto.DepartmentDTO.departmentId,
					departmentName: dto.DepartmentDTO.departmentName
				});
			}
			if (dto.allowgId) {
				setSelectedAllowg({
					allowgId: dto.GradeDTO.allowgId,
					allowgName: dto.GradeDTO.allowgName,
					gradeId: dto.GradeDTO.gradeId,
					gradeName: dto.GradeDTO.gradeName,
					gradeLevel: dto.GradeDTO.gradeLevel
				})
			}*/
			
			if(dto.allowdId) {
				const rows = await fetchAllowdDetail(dto.allowdId); 
				if(rows.length) {
					setSelectedAllowd({
						allowdId: rows[0].allowdId,
						allowdName: rows[0].allowdName,
						departmentId: rows.map(r => r.departmentId),
						departmentName: rows.map(r => r.departmentName),
					});
				} else {
					setSelectedAllowd(null);
				}
			}
			
			if (dto.allowgId) {
				const allowg = await fetchAllowgDetail(dto.allowgId);
				setSelectedAllowg(allowg);
			} else {
				setSelectedAllowg(null);
			}
		} catch (e) {
			alert('데이터를 불러오지 못했습니다.');
			console.error(e);
		}
	  };
	
	  const handleToggleSection = (section: string) => {
	    if (expandedSection === section) {
			setExpandedSection(null);
		} else {
			setExpandedSection(section);
		}
		//setExpandedSection(prev => (prev === section ? null : section));
	  };
	
	  const handleInputChange = (field: string, value: any) => {
	    setFormData(prev => ({ ...prev, [field]: value }));
	  };
	
	  const handleSubmit = async () => {
		// 필수값 공백 체크
		const required = [
			['accessName', '접근정책 명'], ['accessType', '접근정책 타입']
		] as const;
		
		if (showAllowd) required.push(['allowdId', '부서정책']);
		if (showAllowg) required.push(['allowgId', '직급정책']);
		
		for (const [key, label] of required){
			if(!formData[key]) { alert(`${label}을 입력하세요`); return; }
		}
		try {
			//저장 요청
			const url = apiUrl(`/admin/accessRule/accessUpdate?accessId=${accessId}`)
			const res = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type' : 'application/json' },
				credentials: 'include',
				body: JSON.stringify(formData) //화면에서 입력 받은 모든 값을 JSON 문자열로 묶어서 서버에 전송
			});
			if(!res.ok) { alert('수정 실패'); return; } // throw new Error
					
			alert('접근정책 수정 완료');
			router.push('/admin/accessRule/accessList');
		} catch (e) {
			alert('수정 실패');
			console.error(e);
		}
		
	  };
	
	  const handleGoBack = () => {
	    router.push('/admin/accessRule/accessList');
	  };
	  
	  const handleSelectAllowd = async ({allowdId, allowdName} : {allowdId: string; allowdName: string}) =>{
		  //1. form - id / name만 저장
		  setFormData(prev => ({
		  	...prev,
		  	allowdId,
		  	allowdName,
		  }));
		
		  //2. 상세정보 Ajax 호출
		  try {
		  	const list = await fetchAllowdDetail(allowdId);
		  	
		  	if (list.length === 0 ) throw new Error('empty');
		  	
		  	const departmentId = list.map(d => d.departmentId);
		  	const departmentName = list.map(d => d.departmentName);
		  	
		  	setSelectedAllowd({ // 패널에 뿌릴 전체 정보
		  		allowdId,
		  		allowdName,
		  		departmentId: list.map(r => r.departmentId),
		  		departmentName: list.map(r => r.departmentName),
		  	});
		  	
		  	console.log(list);
		  } catch(e) {
		  	console.error(e);
		  	alert('부서정책 상세 정보를 가져오지 못했습니다.');
		  	setSelectedAllowd(null);
		  }
		  setIsAllowdSearchModalOpen(false);
	  }
	
	  const handleSelectAllowg = (dto: GradeDTO) => {
		setFormData(prev => ({ ...prev, allowgId: dto.allowgId}));
		setFormData(prev => ({ ...prev, allowgName: dto.allowgName}));
		setFormData(prev => ({ ...prev, gradeId: dto.gradeId}));
	    setFormData(prev => ({ ...prev, gradeName: dto.gradeName }));
		setFormData(prev => ({ ...prev, gradeLevel: dto.gradeLevel }));
	    setSelectedAllowg(dto);
	    setIsAllowgSearchModalOpen(false);
	  };
		
	  const showAllowd = ['일부 부서 허용', '일부 부서의 특정 직급 이상 허용']
	  					.includes(formData.accessType);
						
	  const showAllowg = ['특정 직급 이상 허용', '일부 부서의 특정 직급 이상 허용']
	  					.includes(formData.accessType);
						
	  const fetchAllowdDetail = async (allowdId: string ): Promise<AllowdRowDTO[]> => {
		try {
			console.log(allowdId);
			const url = apiUrl(`/admin/accessRule/allowdDetail?allowdId=${allowdId}`)
			const res = await fetch(url, {
				method: 'GET',
				headers: { Accept: 'application/json'},
				credentials: 'include',
			});
			if (!res.ok) throw new Error ('Server error ' + res.status );
			
			return res.json(); // 값을 반환, 배열 그대로 리턴
		} catch (e) {
			console.error('list fetch error', e); 
		} finally {
			setIsLoading(false);
		}
	  }
	  
	  const fetchAllowgDetail = async (allowgId: string) => {
		try {
			console.log(allowgId);
			const url = apiUrl(`/admin/accessRule/allowgDetail?allowgId=${allowgId}`)
			const res = await fetch(url, {
				method: 'GET',
				headers: { Accept: 'application/json' },
				credentials: 'include', 
			});
			if(!res.ok) throw new Error ('Server error ' + res.status );
			
			return res.json(); // 값을 반환
		} catch (e) {
			console.error('list fetch error', e);
		} finally {
			setIsLoading(false);
		}
	  }
	  
	  return (
	    <div className="flex h-screen bg-gray-50" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif' }}>
	      <AdminSidebar
	        isSidebarOpen={isSidebarOpen}
	        expandedSection={expandedSection}
	        onToggleSection={handleToggleSection}
	      />
	
	      <div className="flex-1 flex flex-col">
		  <AdminHeader
		    title="접근정책 > 접근정책 수정"
		  	handleGoBack={() => handleGoBack()}
		    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
		  />
	
	        <div className="flex-1 overflow-y-auto p-6">
	          <div className="bg-white rounded-xl border border-gray-200 min-h-full flex">
	            {/* 왼쪽 박스 - 접근정책 정보 */}
	            <div className="flex-1 p-6 border-r border-gray-200">
	              <h2 className="text-lg font-semibold text-gray-900 mb-6">
	                접근정책 수정
	              </h2>
	
	              <div className="space-y-6">
	                <div>
	                  <label className="block text-sm font-medium text-gray-700 mb-2">
	                    접근정책 명 *
	                  </label>
	                  <input
	                    type="text"
	                    value={formData.accessName}
	                    onChange={e => handleInputChange('accessName', e.target.value)}
	                    placeholder="정책 이름"
	                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
	                  />
	                </div>
	
	                <div>
	                  <label className="block text-sm font-medium text-gray-700 mb-2">
	                    허용 타입 *
	                  </label>
					  <select type="text" name="accessType"
					  value = { formData.accessType }
					  onChange={e => handleInputChange('accessType', e.target.value)}
					   className="px-2 py-1 border border-gray-300 rounded text-sm pr-8">
					  	<option defaultValue="허용 안함" >허용 안함</option>
					  	<option value="모두 허용" >모두 허용</option>
					  	<option value="내부 전체 허용" >내부 전체 허용</option>
					  	<option value="일부 부서 허용" >일부 부서 허용</option>
					  	<option value="특정 직급 이상 허용" >특정 직급 이상 허용</option>
					  	<option value="일부 부서의 특정 직급 이상 허용" >일부 부서의 특정 직급 이상 허용</option>
					  </select>
	                </div>
					
					{/* 부서정책 입력 블록 */}
					{showAllowd && (
						<div>
						  <label className="block text-sm font-medium text-gray-700 mb-2">
						    부서정책 *
						  </label>
						  <div className="flex space-x-2">
						    <input
						      type="text"
						      value={formData.allowdName}
						      onChange={(e) => handleInputChange('allowdName', e.target.value)}
							  onClick={() => setIsAllowdSearchModalOpen(true)}
							  readOnly
						      placeholder="부서정책 명"
						      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
						    />
							<input
							  type="text"
							  value={formData.allowdId}
							  readOnly hidden
							  onChange={(e) => handleInputChange('allowdId', e.target.value)}
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
					)}
	
	
					{/* 직급정책 입력 블록 */}
					{showAllowg && (
						<div>
						   <label className="block text-sm font-medium text-gray-700 mb-2">
						     직급정책 *
						   </label>
						   <div className="flex space-x-2">
						     <input
						       type="text"
						       value={formData.allowgName}
						       onChange={(e) => handleInputChange('allowgName', e.target.value)}
						       placeholder="직급정책 명"
							   onClick={() => setIsAllowgSearchModalOpen(true)}
							   readOnly
						       className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
						     />
							<input
							  type="text"
							  value={formData.allowgId}
							  onChange={(e) => handleInputChange('allowgId', e.target.value)}
							  readOnly hidden
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
					)}
	 
	
	                { /*<div>
	                  <label className="flex items-center space-x-2">
	                    <input
	                      type="checkbox"
	                      checked={formData.isActive}
	                      onChange={e => handleInputChange('isActive', e.target.checked)}
	                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
	                    />
	                    <span className="text-sm font-medium text-gray-700">활성화</span>
	                  </label>
	                </div>*/ }
	              </div>
	
	              <div className="flex justify-end mt-8">
	                <button
	                  onClick={handleSubmit}
	                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap"
	                >
	                  정책 수정
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
	                      부서정책을 선택하면 상세 정보가 표시됩니다.
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
	                      직급정책을 선택하면 상세 정보가 표시됩니다.
	                    </div>
	                  )}
	                </div>
	              </div>
	            </div>
				
	          </div>
	        </div>
	      </div>
		  
		  {/*분리된 AllowgSearchModal 사용: 필요한 상태/핸들러를 Props로 전달하는 형태 */}
		  <AllowgSearchModal
		  	 isOpen={isAllowgSearchModalOpen}
		  	 onClose={() => setIsAllowgSearchModalOpen(false)}
		  	 onSelectAllowg={handleSelectAllowg}
		  />	 
		  {/*분리된 AllowdSearchModal 사용: 필요한 상태/핸들러를 Props로 전달하는 형태 */}
		  <AllowdSearchModal
		  	 isOpen={isAllowdSearchModalOpen}
		  	 onClose={() => setIsAllowdSearchModalOpen(false)}
		  	 onSelectAllowd={handleSelectAllowd}
		  /> 
		      </div>
		    );
		  }
	
