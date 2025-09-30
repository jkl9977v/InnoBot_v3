	//  admin/accessRule/accessWrite
	'use client';
	import { useState, useEffect } from 'react';
	import { useRouter } from 'next/navigation';
	import AdminSidebar from '../../../../components/AdminSidebar';
	import AdminHeader from '../../../../components/AdminHeader';
	import AllowdSearchModal from '../../../../components/AllowdSearchModal'; //분리된 모달
	import AllowgSearchModal from '../../../../components/AllowgSearchModal'; //모달
	import { apiUrl } from '@/lib/api';
	
	
	interface DepartmentDTO {
		allowdId: string;
		allowdName: string;
		departmentId: string;
		departmentName: string;
	}
	
	interface GradeDTO {
	  allowgId: string;
	  allowgName: string;
	  gradeId: string;
	  gradeName: string;
	  gradeLevel: number;
	}
	
	export default function AccessWritePage() {
	  const [isLoggedIn, setIsLoggedIn] = useState(false);
	  const [isLoading, setIsLoading] = useState(true);
	  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	  const [expandedSection, setExpandedSection] = useState<string | null>('policies');
	  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
	  const [isAllowdSearchModalOpen, setIsAllowdSearchModalOpen] = useState(false);
	  const [isAllowgSearchModalOpen, setIsAllowgSearchModalOpen] = useState(false);

	  const router = useRouter();
	
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
	  const [selectedAllowg, setselectedAllowg] = useState<GradeDTO | null>(null);
	
	
	  const [allowd, setAllowd] = useState<DepartmentDTO[]>([]);
	
	  const [allowg, setAllowg] = useState<GradeDTO[]>([]);
	
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
	      console.error('Failed to  login status:', e);
	      router.push('/login');
	    } finally {
	      setIsLoading(false);
	    }
	  }, [router]);
	  
	  useEffect(() => {
		if (!isLoggedIn) return;
	  }, [isLoggedIn]);
	
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
		
		//저장 요청
		const url = apiUrl('/admin/accessRule/accessWrite')
		const res = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type' : 'application/json' },
			credentials: 'include',
			body: JSON.stringify(formData) //화면에서 입력 받은 모든 값을 JSON 문자열로 묶어서 서버에 전송
		});
		if(!res.ok) { alert('저장 실패'); return; }
		
	    //console.log('Creating access rule:', formData);
		alert('접근정책 생성 완료');
	    router.push('/admin/accessRule/accessList');
	  };
	
	  const handleGoBack = () => {
	    router.push('/admin/accessRule/accessList');
	  };
	
	  const handleSelectAllowd = (dto: DepartmentDTO) => {
		setFormData(prev => ({ ...prev, allowdId: dto.allowdId}));
		setFormData(prev => ({ ...prev, allowdName: dto.allowdName}));
		setFormData(prev => ({ ...prev, departmentId: dto.departmentId}));
	    setFormData(prev => ({ ...prev, departmentName: dto.departmentName }));
	    setSelectedAllowd(dto);
	    setIsAllowdSearchModalOpen(false);
	  };
	
	  const handleSelectAllowg = (dto: GradeDTO) => {
		setFormData(prev => ({ ...prev, allowgId: dto.allowgId}));
		setFormData(prev => ({ ...prev, allowgName: dto.allowgName}));
		setFormData(prev => ({ ...prev, gradeId: dto.gradeId}));
	    setFormData(prev => ({ ...prev, gradeName: dto.gradeName }));
		setFormData(prev => ({ ...prev, gradeLevel: dto.gradeLevel }));
	    setselectedAllowg(dto);
	    setIsAllowgSearchModalOpen(false);
	  };
		
	  const showAllowd = ['일부 부서 허용', '일부 부서의 특정 직급 이상 허용']
	  					.includes(formData.accessType);
						
	  const showAllowg = ['특정 직급 이상 허용', '일부 부서의 특정 직급 이상 허용']
	  					.includes(formData.accessType);
	  
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
	                    접근정책 명
	                  </label>
	                  <input
	                    type="text"
	                    value={formData.accessName}
	                    onChange={e => handleInputChange('accessName', e.target.value)}
	                    placeholder="접근정책 명"
	                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
	                  />
	                </div>
	
	                <div>
	                  <label className="block text-sm font-medium text-gray-700 mb-2">
	                    허용 타입
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
						    부서정책
						  </label>
						  <div className="flex space-x-2">
						    <input
						      type="text"
						      value={formData.allowdName}
						      onChange={(e) => handleInputChange('allowdName', e.target.value)}
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
	
	
					{/*직급정책 입력 블록 */}
					{showAllowg && (
						<div>
						   <label className="block text-sm font-medium text-gray-700 mb-2">
						     직급정책
						   </label>
						   <div className="flex space-x-2">
						     <input
						       type="text"
						       value={formData.allowgName}
						       onChange={(e) => handleInputChange('allowgName', e.target.value)}
						       placeholder="직급정책 명"
						       className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
						     />
							<input
							  type="text"
							  value={formData.allowgId}
							  onChange={(e) => handleInputChange('allowgId', e.target.value)}
							  Only hidden
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
	
