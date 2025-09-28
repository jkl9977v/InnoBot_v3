//  components/DepartmentSearchModal.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { apiUrl } from '@/lib/api';

export type DepartmentDTO = {
	departmentId: string;
	departmentName: string;
};

export type PageResponse<T> = {
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

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onSelectDepartment: (d: DepartmentDTO) => void;
}

/*
  이 컴포넌트는 원래 페이지에 있던 '부서 검색' 모달을 분리한 것 입니다.
  - UI/주석/구조는 원본 모달을 그대로 따릅니다.
*/

export default function DepartmentSearchModal({
	isOpen,
	onClose,
	onSelectDepartment,
}: Props) {
	
	
	/* ───────────────────────────── ① 상태 선언 ──────────────────────────── */
	  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
	  const [page, setPage] = useState(1);
	  const [limitRow, setLimitRow] = useState(10);
	  const [searchWord, setSearchWord] = useState('');
	  const [startPageNum, setStartPageNum] = useState(1);
	  const [endPageNum, setEndPageNum] = useState(1);
	  const [maxPageNum, setMaxPageNum] = useState(1);
	  const [isLoading, setIsLoading] = useState(false);

	  /* ───────────────────────────── ② 목록 불러오기 ────────────────────────── */
	  const fetchList = async () => {
	    try {
	      setIsLoading(true);
	      const params = new URLSearchParams({
	        page: String(page),
	        limitRow: String(limitRow),
	        searchWord,
	      });
	      const url = apiUrl(`/admin/department/departmentList?${params}`);
	      const res = await fetch(url, {
	        method: 'GET',
	        headers: { Accept: 'application/json' },
	        credentials: 'include',
	      });
	      if (!res.ok) throw new Error('Server error ' + res.status);

	      const data: PageResponse<DepartmentDTO> = await res.json();
	      setDepartments(data.list);
	      setStartPageNum(data.startPageNum);
	      setEndPageNum(data.endPageNum);
	      setMaxPageNum(data.maxPageNum);
	    } catch (e) {
	      console.error('list fetch error', e);
	    } finally {
	      setIsLoading(false);
	    }
	  };

	  /* ──────────────────────── ③ 모달 열릴 때마다 호출 ─────────────────────── */
	  useEffect(() => {
	    if (isOpen) fetchList();          // isOpen true → 첫 로드
	    // page, limitRow, searchWord 가 바뀔 때도 재호출
	  }, [isOpen, page, limitRow, searchWord]);

	  /* 모달이 닫혀 있으면 아무것도 렌더하지 않음 */
	  if (!isOpen) return null;
	
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		     <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[500px] overflow-hidden flex flex-col">
		       <div className="p-4 border-b border-gray-200">
		         <div className="flex items-center justify-between mb-4">
		           <h3 className="text-lg font-semibold text-gray-900">부서 검색</h3>
		           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
		             <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
		           </button>
		         </div>

		         <div className="flex items-center space-x-2">
		           <input
		             type="text"
		             placeholder="부서명 검색"
		             value={searchWord}
		             onChange={(e) => { setSearchWord(e.target.value); setPage(1); }}
		             className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
		           />
		           <button
		             onClick={() => setPage(1)}
		             className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm transition-colors cursor-pointer"
		           >
		             검색
		           </button>
		         </div>
		       </div>
			   
			   {/* 테이블 */}
		       <div className="overflow-y-auto flex-1">
		         <table className="w-full text-sm">
		           <thead className="bg-gray-50 border-b border-gray-200">
		             <tr>
		               <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">부서명</th>
		               {/*<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">코드</th>*/}
		               <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">선택</th>
		             </tr>
		           </thead>
		           <tbody className="divide-y divide-gray-200">
		             {departments.map((dept) => (
		               <tr key={dept.departmentId} className="hover:bg-gray-50">
		                 <td className="px-4 py-2 text-gray-900">{dept.departmentName}</td>
		                 {/*<td className="px-4 py-2 text-gray-600">{dept.code}</td>*/}
		                 <td className="px-4 py-2">
		                   <button
		                     onClick={() => onSelectDepartment(dept)}
		                     className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors cursor-pointer"
		                   >
		                     선택
		                   </button>
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

		       <div className="p-4 border-t border-gray-200 text-center">
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
	);
}