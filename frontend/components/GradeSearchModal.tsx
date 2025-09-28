// components/GradeSearchModal.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { apiUrl } from '@/lib/api';

export type GradeDTO = {
	gradeId:string;
	gradeName: string;
	gradeLevel: number;
};
export type PageResponse<T> = {
	page: number;
	limitRow: number;
	startPageNum: number;
	endPageNum: number;
	count: number;
	searchWord: string | null;
	kind: string | null;
	//kind2: string | null;		//kind2를 사용하는 리스트 페이지에서만 사용
	list: T[];
}

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onSelectGrade: (p: grade) => void;
};

export default function GradeSearchModal({
	isOpen,
	onClose,
	onSelectGrade,
}: Props) {
	//1. 상태 선언
	const [grades, setGrades] = useState<GradeDTO[]>([]);
	const [page, setPage] = useState(1);
	const [limitRow, setLimitRow] = useState(10);
	const [searchWord, setSearchWord] = useState('');
	const [startPageNum, setStartPageNum] = useState(1);
	const [endPageNum, setEndPageNum] = useState(1);
	const [maxPageNum, setMaxPageNum] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	
	//2. 목록 불러오기
	const fetchList = async () => {
		try {
			setIsLoading(true);
			const params = new URLSearchParams({
				page: String(page),
				limitRow: String(limitRow),
				searchWord,
			});
			const url = apiUrl(`/admin/grade/gradeList?${params}`);
			const res= await fetch(url, {
				method: 'GET',
				headers: { Accept: 'application/json' },
				credentials: 'include',
			});
			if (!res.ok) throw new Error('Server error ' + res.status);
			
			const data: PageResponse<GradeDTO> = await res.json();
			setGrades(data.list);
			setStartPageNum(data.startPageNum);
			setEndPageNum(data.endPageNum);
			setMaxPageNum(data.maxPageNum);
		} catch (e) {
			console.error('list fetch error', e);
		} finally {
			setIsLoading(false);
		}
	};
	
	//모달 열릴때마다 호출
	useEffect(() => {
		if (isOpen) fetchList();
	}, [isOpen, page, limitRow, searchWord]);
	
	//모달이 닫혀 있으면 아무것도 렌더하지 않음
	if(!isOpen) return null;
	
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		  <div className="bg-white rounded-lg shadow-lg w-[700px] max-h-[500px] overflow-hidden flex flex-col">
		    <div className="p-4 border-b border-gray-200">
		      <div className="flex items-center justify-between mb-4">
		        <h3 className="text-lg font-semibold text-gray-900">직급 검색</h3>
		        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
		          <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
		        </button>
		      </div>
		      <div className="flex items-center space-x-2">
		        <input
		          type="text"
		          placeholder="직급명 검색"
		          value={searchWord}
		          onChange={(e) => { setSearchWord(e.target.value); setPage(1); }}
		          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
		        />
		        <button 
				/*onClick={onSearch}*/
				onClick={() => setPage(1)} 
				className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm transition-colors cursor-pointer">
		          검색
		        </button>
		      </div>
		    </div>

		    <div className="overflow-y-auto flex-1">
		      <table className="w-full text-sm">
		        <thead className="bg-gray-50 border-b border-gray-200">
		          <tr>
		            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">직급명</th>
		            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">직급레벨</th>
		            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">선택</th>
		          </tr>
		        </thead>
		        <tbody className="divide-y divide-gray-200">
		          {grades.map((grade) => (
		            <tr key={grade.gradeId} className="hover:bg-gray-50">
		              <td className="px-4 py-2 text-gray-900">{grade.gradeName}</td>
		              <td className="px-4 py-2 text-gray-600">{grade.gradeLevel}</td>
		              <td className="px-4 py-2">
		                <button onClick={() => onSelectGrade(grade)} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors cursor-pointer">
		                  선택
		                </button>
		              </td>
		            </tr>
		          ))}
				  {/* 데이터가 하나도 없을 때 */}
				  {(!grades || grades.length === 0) && (
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
						                   <span>총 {grades.length}개 항목</span>
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