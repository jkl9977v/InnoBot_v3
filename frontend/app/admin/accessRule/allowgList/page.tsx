//  /acmin/accessRule/allowgList
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '../../../../components/AdminSidebar';
import AdminHeader from '../../../../components/AdminHeader';
import { apiUrl } from '@/lib/api';

interface AllowgDTO {
  allowgid: string;
  allowgName: string;
  gradeName: string;
  gradeLevel: string;
/*  ruleName: string;
  type: 'allow' | 'deny';
  resource: string;
  description: string;
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

export default function AllowgListPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('policies');

  const router = useRouter();
  
  //서버 데이터
  const [allowgs, setAllowgs] = useState<AllowgDTO[]>([]);
  const [page, setPage] = useState(1);
  const [limitRow, setLimitRow] = useState(10);
  //const [kind, setKind] = useState(''); //옵션 필터
  const [searchWord, setSearchWord] = useState('');
  const [maxPageNum, setMaxPageNum] = useState(1);
  const [count, setCount] = useState(0);
  const [startPageNum, setStartPageNum] = useState(1);
  const [endPageNum, setEndPageNum] = useState(1);

  useEffect(() => { //로그인 여부 확인
	/*
    const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus !== 'true') {
      router.push('/login');
      return;
    }
	*/
    setIsLoggedIn(true);
    setIsLoading(false);
  }, [router]);
  
  useEffect(() => {
	if(isLoggedIn) fetchList();
  }, [isLoggedIn, page, limitRow, searchWord]);
  
  const fetchList = async () => { //목록 가져오기 함수
	try {
		const params = new URLSearchParams({
			page: String(page),
			limitRow: String(limitRow),
			searchWord: searchWord,
			//kind: kind,
		});
		const url = apiUrl(`/admin/accessRule/allowgList?${params.toString()}`);
		const res = await fetch(url, {
			method: 'GET',
			headers: { Accept: 'application/json' },
			credentials: 'include',
		});
		if (!res.ok) throw new Error('Server error ' + res.status);
		const data: PageResponse<AllowgDTO> = await res.json();
		
		setAllowgs(data.list);
		setMaxPageNum(data.maxPageNum);
		setCount(data.count);
		setStartPageNum(data.startPageNum);
		setEndPageNum(data.endPageNum);
	} catch (e) {
		console.error('list fetch error', e);
	} finally {
		setIsLoading(false);
	}
  }

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
  
  const handleUpdate = (allowgId: string) => {
	router.push(`/admin/accessRule/allowgUpdate?allowgId=${allowgId}`);
  }
  
  //정책 삭제 기능
  const handleDelete = async (allowgId: string) => {
	if (!confirm('정말 삭제하시겠습니까?')) return;
	
	try{
		// 1. url 생성
		const url = apiUrl(`/admin/accessRule/allowgDelete?allowgId=${allowgId}`);
		
		//2. 요청
		await fetch(url, {
			method: 'GET',
			credentials: 'include',
		});
		
		//3. 성공: 목록 재호출
		fetchList();
	} catch (e) {
		alert('삭제 실패');
		console.err('delete error', e);
	}
  }

  const handleSearch = () => {
    console.log('Searching position policies:', searchWord);
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
          title="접근정책 > 직급정책 관리"
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">직급정책 목록</h3>
                <Link
                  href="/admin/accessRule/allowgWrite"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap text-sm"
                >
                  <i className="ri-add-line w-4 h-4 flex items-center justify-center mr-2 inline-flex"></i>
                  직급정책 생성
                </Link>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                 {/* <div className="flex items-center space-x-2">
                    <label>직급:</label>
                    <select className="px-2 py-1 border border-gray-300 rounded text-sm pr-8">
                      <option>전체</option>
                      <option>팀장</option>
                      <option>대리</option>
                      <option>연구원</option>
                      <option>인턴</option>
                    </select>
                    <label>유형:</label>
                    <select className="px-2 py-1 border border-gray-300 rounded text-sm pr-8">
                      <option>전체</option>
                      <option>허용</option>
                      <option>거부</option>
                    </select>
                  </div>*/}
                  <div className="flex items-center space-x-2">
                    <label>검색:</label>
                    <input
                      type="text"
                      placeholder="정책명 검색"
                      value={searchWord}
                      onChange={(e) => setSearchWord(e.target.value)}
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
				 	onChange={(e) => { setLimitRow(Number(e.target.value)); setPage(1); }}
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
                    {/*<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      직급명
                    </th>*/}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      정책명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      기준 직급
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      직급 레벨
                    </th>
                    {/*<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      생성일
                    </th>*/}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allowgs.map((rule) => (
                    <tr key={rule.allowgId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <i className="ri-user-star-line text-purple-600"></i>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{rule.allowgName}</span>
                        </div>
                      </td>
					  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
					      <code className="bg-gray-100 px-2 py-1 rounded text-xs">{rule.gradeName}</code>
					  </td>
					  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
					 	  <code className="bg-gray-100 px-2 py-1 rounded text-xs">{rule.gradeLevel}</code>
					  </td>
                      {/*<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rule.ruleName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            rule.type === 'allow' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {rule.type === 'allow' ? '허용' : '거부'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">{rule.resource}</code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {rule.isActive ? '활성' : '비활성'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(rule.createdDate)}
                      </td>*/}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
					  <div className="flex items-center space-x-2">
					  	<button
					  		onClick={() => handleUpdate(rule.allowgId)}
					  		className="text-indigo-600 hover:text-indigo-900 transition-colors cursor-pointer">
					  		수정
					  	</button>
					  	<button
					  		onClick={() => handleDelete(rule.allowgId)}
					  		className="text-red-600 hover:text-red-900 transition-colors cursor-pointer">
					  		삭제
					  	</button>
					  </div>
                      </td>
                    </tr>
                  ))}
				  {/* 데이터가 하나도 없을 때 */}
				  {(!allowgs || allowgs.length === 0) && (
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
                <span>총 {allowgs.length}개 직급정책</span>
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
																className={`px-3 py-1 border rounded ${i === page ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50'
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
