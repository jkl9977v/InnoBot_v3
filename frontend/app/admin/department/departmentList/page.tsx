//  /admin/department/departmentList
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '../../../../components/AdminSidebar';
import AdminHeader from '../../../../components/AdminHeader';
import { apiUrl } from '@/lib/api';

interface DepartmentDTO {
  departmentId: string;
  departmentName: string;
/*  code: string;
  description: string;
  manager: string;
  memberCount: number;
  isActive: boolean;
  createdDate: Date;*/
}

interface PageResponse<T> {
	page: number;
	limitRow: number;
	startPageNum: number;
	endPageNum: number;
	maxPageNum: number;
	count: number;
	searchWord: string | null;
	kind: string | null;
	//kind2: string | null; //kind2를 사용하는 리스트 페이지에서만 사용
	list: T[];
}

export default function DepartmentListPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('user-management');
  const router = useRouter();
	
  //서버 데이터
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [page, setPage] = useState(1);
  const [limitRow, setLimitRow] = useState(10);
  //const [kind, setKind] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [maxPageNum, setMaxPageNum] = useState(1);
  const [count, setCount] = useState(0);
  const [startPageNum, setStartPageNum] = useState(1);
  const [endPageNum, setEndPageNum] = useState(1);
  //const [kind2, setKind2] = useState('');

  useEffect(() => { //로그인 여부 확인
    /*const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus !== 'true') {
      router.push('/login');
      return;
    }*/
    setIsLoggedIn(true);
    setIsLoading(false);
  }, [router]);
  
  useEffect(() => {
	if(isLoggedIn) fetchList();
  }, [isLoggedIn, page, limitRow, searchWord])
  
  const fetchList = async () => {
	try {
		const params = new URLSearchParams({
			page: String(page),
			limitRow: String(limitRow),
			searchWord: searchWord,
			//kind: kind,
		});
		const url = apiUrl(`/admin/department/departmentList?${params.toString()}`);
		const res = await fetch(url , {
			method: 'GET',
			headers: { Accept: 'application/json' },
			credentials: 'include',
		});
		if(!res.ok) throw new Error('Server error ' + res.status);
		const data: PageResponse<DepartmentDTO> = await res.json();
		
		setDepartments(data.list);
		setMaxPageNum(data.maxPageNum);
		setCount(data.count);
		setStartPageNum(data.startPageNum);
		setEndPageNum(data.endPageNum);
	} catch (e) {
		console.error('list fetch error', e);
	} finally {
		setIsLoading(false);
	}
  };

  const handleToggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR');
  };

  const handleSearch = () => {
    console.log('Searching departments:', searchWord);
  };
  
  //업데이트 페이지 이동 기능
  const handleUpdate = (departmentId: string) => {
	router.push(`/admin/department/departmentUpdate?departmentId=${departmentId}`);
  }
  
  //부서 삭제 기능
  const handleDelete = async (departmentId: string) => {
	if (!confirm('정말 삭제하시겠습니까?')) return;
  	
	try {
		// 1. url 생성
		const url = apiUrl(`/admin/department/departmentDelete?departmentId=${departmentId}`);
		
		// 2. 요청 - 벡엔드가 GET 방식 삭제를 받을 때
		await fetch(url, {
			method: 'GET',
			credentials: 'include',
		});
		
		// 3. 성공 -> 1페이지로 리셋하여 목록 재호출
		fetchList();
	} catch (e) {
		alert('삭제 실패');
		console.error('delete error', e);
	}
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
        <AdminHeader 
          title="사용자 / 부서 / 직급 > 부서 관리"
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">부서 관리</h3>
                <Link href="/admin/department/departmentWrite" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap text-sm">
                  <i className="ri-add-line w-4 h-4 flex items-center justify-center mr-2 inline-flex"></i>
                  부서 생성
                </Link>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  {/*<div className="flex items-center space-x-2">
                    <label>상태:</label>
                    <select className="px-2 py-1 border border-gray-300 rounded text-sm pr-8">
                      <option>전체</option>
                      <option>활성</option>
                      <option>비활성</option>
                    </select>
                  </div>*/}
                  <div className="flex items-center space-x-2">
                    <label>검색:</label>
                    <input
                      type="text"
                      placeholder="부서명 검색"
                      value={searchWord}
                      onChange={(e) => {
						setSearchWord(e.target.value);
						setPage(1);
					}}
                      className="px-2 py-1 border border-gray-300 rounded text-sm w-48"
                    />
                    <button
                      onClick={handleSearch}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm transition-colors cursor-pointer"
                    >
                      검색
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <label>보기:</label>
				  <select 
				  				  name="limitRow"
				  				  value={limitRow}
				  				  onChange={(e) => {setLimitRow(Number(e.target.value)); setPage(1); }}
				  				  className="px-2 py-1 border border-gray-300 rounded text-sm pr-8">
				                      <option value={10}>10</option>
				  					<option value={15}>15</option>
				  					<option value={20}>20</option>
				                      <option value={25}>25</option>
				                      <option value={50}>50</option>
				                    </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      부서명
                    </th>
                    {/*<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      부서코드
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      설명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      부서장
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      인원수
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>*/}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {departments.map((dept) => (
                    <tr key={dept.departmentId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {dept.departmentName}
                      </td>
                      {/*<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {dept.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate">
                        {dept.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {dept.manager}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {dept.memberCount}명
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${dept.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {dept.isActive ? '활성' : '비활성'}
                        </span>
                      </td>*/}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
					  <div className="flex items-center space-x-2">
					                            <button 
					  						  onClick={() => handleUpdate(dept.departmentId)}
					  						  className="text-indigo-600 hover:text-indigo-900 transition-colors cursor-pointer">
					                              수정
					                            </button>
					                            <button 
					  						  onClick={() => handleDelete(dept.departmentId)}
					  						  className="text-red-600 hover:text-red-900 transition-colors cursor-pointer">
					                              삭제
					                            </button>
					                          </div>
                      </td>
                    </tr>
                  ))}
				  {/* 데이터가 하나도 없을 때 */}
				  {(!departments || departments.length === 0) && (
				  	<tr>
				  		<td colSpan={8} className="text-center py-6 text-sm text-gray-500">
				  			검색 결과가 없습니다.
				  		</td>
				  	</tr>
				  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>총 {departments.length}개 항목</span>
                {/*<div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer">이전</button>
                  <span>1 / 1</span>
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer">다음</button>
                </div>*/}
				<ul className="inline-flex items-center space-x-1">
								     {/* 이전 */}
								     <li>
								       <button
								         onClick={() => setPage((p) => Math.max(1, p - 1))}
								         disabled={page <= 1}
								         className="px-3 py-1 border rounded disabled:opacity-40"
								       >
								         이전
								       </button>
								     </li>

								     {/* 페이지 번호 */}
								     {Array.from(
								       { length: endPageNum - startPageNum + 1 },
								       (_, idx) => startPageNum + idx
								     ).map((i) => (
								       <li key={i}>
								         <button
								           onClick={() => setPage(i)}
								           className={`px-3 py-1 border rounded ${
								             i === page ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50'
								           }`}
								         >
								           {i}
								         </button>
								       </li>
								     ))}

								     {/* 다음 */}
								     <li>
								       <button
								         onClick={() => setPage((p) => Math.min(maxPageNum, p + 1))}
								         disabled={page >= maxPageNum}
								         className="px-3 py-1 border rounded disabled:opacity-40"
								       >
								         다음
								       </button>
								     </li>
								   </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}