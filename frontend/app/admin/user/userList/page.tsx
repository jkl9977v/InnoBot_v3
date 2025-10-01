//  admin/user/userList
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '../../../../components/AdminSidebar';
import AdminHeader from '../../../../components/AdminHeader';
import { apiUrl } from '@/lib/api';

interface UserListResponse {
	users: PageResponse<UserDTO>;
	departments: DepartmentDTO[];
	grades: GradeDTO[];
}

interface UserDTO {
  userNum: string;
  userName: string;
  userId: string;
  gradeId: string;
  gradeDTO: string;
  departmentId: string;
  departmentDTO: string;
  manager: string;
/*  isActive: boolean;
  lastAccess: Date;*/
}

interface DepartmentDTO {
	departmentId: string;
	departmentName: string;
}

interface GradeDTO {
	gradeId: string;
	gradeName: string;
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
	kind2: string | null;
	list: T[];
}

export default function UserListPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('user-management');
  const router = useRouter();

  // 서버 데이터
  const [users, setUsers] = useState<UserDTO[]>([
    /*{ id: '1', name: '김민수', username: 'kim123', department: '개발팀', position: '대리', isAdmin: false, isActive: true, lastAccess: new Date('2025-01-08') },
    { id: '2', name: '이수진', username: 'lee456', department: '기획팀', position: '주임', isAdmin: false, isActive: true, lastAccess: new Date('2025-01-07') },
    { id: '3', name: '박준호', username: 'park789', department: '마케팅팀', position: '팀장', isAdmin: true, isActive: true, lastAccess: new Date('2025-01-06') },
    { id: '4', name: '최영희', username: 'choi111', department: '인사팀', position: '과장', isAdmin: false, isActive: false, lastAccess: new Date('2025-01-03') },
    { id: '5', name: '정철수', username: 'jung222', department: '개발팀', position: '선임', isAdmin: false, isActive: true, lastAccess: new Date('2025-01-05') },
    { id: '6', name: '한미래', username: 'han333', department: '디자인팀', position: '사원', isAdmin: false, isActive: true, lastAccess: new Date('2025-01-04') }*/
  ]);
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [grades, setGrades] = useState<GradeDTO[]>([]);
  const [page, setPage] = useState(1);
  const [limitRow, setLimitRow] = useState(10);
  const [kind, setKind] = useState(''); // 허용 타입 필터
  const [kind2, setKind2] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [maxPageNum, setMaxPageNum] = useState(1);
  const [count, setCount] = useState(0);
  const [startPageNum, setStartPageNum] = useState(1);
  const [endPageNum, setEndPageNum] = useState(1);
  

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
  }, [isLoggedIn, page, limitRow, searchWord, kind, kind2]);
  
  const fetchList = async () => { //목록 가져오기 함수
	try {
		const params = new URLSearchParams({
			page: String(page),
			limitRow: String(limitRow),
			searchWord: searchWord,
			//kind: kind,
			//kind2: kind2,
		});
		const url = apiUrl(`/admin/user/userList?${params.toString()}`);
		const res = await fetch(url, {
			method: 'GET',
			headers: { Accept: 'application/json' },
			credentials: 'include',
		});
		if(!res.ok) throw new Error('Server error ' + res.status );
		const data: UserListResponse = await res.json();
		
		setUsers(data.users.list);
		setMaxPageNum(data.users.maxPageNum);
		setCount(data.users.count);
		setStartPageNum(data.users.startPageNum);
		setEndPageNum(data.users.endPageNum);
		
		//옵션
		setDepartments(data.departments);
		setGrades(data.grades);
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

  const handleSearch = () => {
    console.log('Searching users:', searchWord);
  };
  
  // 유저 수정 기능
  const handleUpdate = (userNum : string) => {
	router.push(`/admin/user/userUpdate?userNum=${userNum}`);
  };
  
  // 유저 삭제 기능
  const handleDelete = async (userNum: string) => {
	if(!confirm('정말 삭제하시겠습니까?')) return;
	
	try {
		//1. URL 생성
		const url = apiUrl(`/admin/user/userList?userNum=${userNum}`);
		
		//2. 요청 - 백엔드가 GET 방식 삭제를 받을 때
		await fetch(url, {
			method: 'GET',
			credentials: 'include',
		});
		
		//3. 성공 -> 1페이지로 리셋하여 목록 재호출
		fetchList();
	} catch (e) {
		alert('삭제 실패');
		console.error('delete error', e);
	}
  }

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
          title="사용자 / 부서 / 직급 > 사용자 관리"
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">사용자 관리</h3>
                <Link href="/admin/user/userWrite" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap text-sm">
                  <i className="ri-add-line w-4 h-4 flex items-center justify-center mr-2 inline-flex"></i>
                  사용자 생성
                </Link>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <label>부서:</label>
                    <select name="kind"
					value={kind}
					onChange={(e) => { //선택 변경 핸들러
						setKind(e.target.value);
						setPage(1);
					}} 
					className="px-2 py-1 border border-gray-300 rounded text-sm pr-8">
                      <option value="" >전체</option>
					  {departments.map((dept) => (
                      <option key={dept.departmentId} value="${dept.departmentId}"> {dept.departmentName}</option>
                      ))}
                    </select>
                    <label>직급:</label>
                    <select name="kind2" 
					value={kind2}
					onChange={(e) => { //선택 변경 핸들러
						setKind(e.target.value);
						setPage(1);
					}}
					className="px-2 py-1 border border-gray-300 rounded text-sm pr-8">
                      <option value="" >전체</option>
					  {grades.map((grade) => (
						<option key={grade.gradeId} value="${grade.gradeId}">{grade.gradeName}</option>
					  ))}
                     
                      {/*<option>주임</option>
                      <option>대리</option>
                      <option>과장</option>
                      <option>선임</option>
                      <option>팀장</option>*/}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label>검색:</label>
                    <input
                      type="text"
                      placeholder="이름, 아이디 검색"
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
                      이름
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      아이디
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      부서
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      직급
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      관리자 여부
                    </th>
                    {/*<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      사용여부
                    </th>*/}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.userNum} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.userName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.departmentDTO.departmentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.gradeDTO.gradeName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.manager === 'y' ? 'O' : 'X'}
                      </td>
                      {/*<td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {user.isActive ? '활성' : '비활성'}
                        </span>
                      </td>*/}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
						<button 
												  onClick={() => handleUpdate(user.userNum)}
												  className="text-indigo-600 hover:text-indigo-900 transition-colors cursor-pointer">
						                            수정
						                          </button>
						                          <button 
												  onClick={() => handleDelete(user.userNum)}
												  className="text-red-600 hover:text-red-900 transition-colors cursor-pointer">
						                            삭제
						                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
				  
				  {/* 데이터가 하나도 없을 때 */}
				  {(!users || users.length === 0) && (
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
                <span>총 {users.length}개 항목</span>
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