// components/AccessRuleSearchModal.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { apiUrl } from '@/lib/api';

export type AccessRuleDTO = {
	accessId: string;
	accessName: string;
	//allowdId: string;
	//allowgId: string;
	accessType: string;
	
	//DepartmentDTO DepartmentDTO;
	//GradeDTO GradeDTO;
}

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
	onSelectAccessRule: (p:AccessRuleDTO) => void;
};

/*
  접근정책 검색 모달 - 크기 더 확대
*/

export default function AccessRuleDTOSearchModal({
	isOpen,
	onClose,
	onSelectAccessRule,
}: Props) {
	
	//1. 상태 선언 (서버 데이터)
	const [accessRules, setAccessRules] = useState<AccessRuleDTO[]>([]);
	const [page, setPage] = useState(1);
	const [limitRow, setLimitRow] = useState(10);
	const [kind, setKind] = useState('');
	const [searchWord, setSearchWord] = useState('');
	const [maxPageNum, setMaxPageNum] = useState(1);
	const [count, setCount] = useState(0);
	const [startPageNum, setStartPageNum] = useState(1);
	const [endPageNum, setEndPageNum] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	
	//2. 목록 불러오기
	const fetchList = async () => { // 목록 가져오기 함수
		try {
			const params = new URLSearchParams({
				page: String(page),
				limitRow: String(limitRow),
				searchWord: searchWord,
				kind: kind,
			});
			const url = apiUrl(`/admin/accessRule/accessList?${params.toString()}`);
			const res = await fetch(url, {
				method: 'GET',
				headers: { Accept: 'application/json' },
				credentials: 'include',
			});
			if(!res.ok) throw new Error('Server error ' + res.status);
			const data: PageResponse<AccessRuleDTO> = await res.json();
			
			setAccessRules(data.list);
			setMaxPageNum(data.maxPageNum);
			//setKind(data.kind);
			setCount(data.count);
			setStartPageNum(data.startPageNum);
			setEndPageNum(data.endPageNum);
		} catch (e) {
			console.error('list fetch error', e);
		} finally {
			setIsLoading(false);
		}
	};
	
	//3. 모달 열릴때마다 호출
	useEffect(() => {
		if (isOpen) fetchList();
		// page, limitRow, searchWord 가 바뀔 때도 재호출
	}, [isOpen, page, limitRow, searchWord, kind]);
	
	//모달이 닫혀있으면 아무것도 렌더하지 않음
	if(!isOpen) return null;
	
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		      <div className="bg-white rounded-lg shadow-lg w-[800px] max-h-[600px] overflow-hidden flex flex-col">
		        <div className="p-6 border-b border-gray-200">
		          <div className="flex items-center justify-between mb-4">
		            <h3 className="text-lg font-semibold text-gray-900">접근정책 검색</h3>
		            <button
		              onClick={onClose}
		              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
		            >
		              <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
		            </button>
		          </div>
		          <div className="flex items-center space-x-2">
				  <select name="kind" 
				  	className="px-2 py-1 border border-gray-300 rounded text-sm pr-8"
				  	value={kind} //선택값 제어
				  	onChange={(e) => { //선택 변경 핸들러
				  		setKind(e.target.value);
				  		setPage(1);		// 검색*페이징 초기화 등 필요하면
				  	}}>
					<option value=""> 허용 타입 전체</option>
				    <option value="허용 안함">허용 안함</option>
				    <option value="모두 허용">모두 허용</option>
					<option value="내부 전체 허용">내부 전체 허용</option>
				  	<option value="일부 부서 허용">일부 부서 허용</option>
				  	<option value="특정 직급 이상 허용">특정 직급 이상 허용</option>
				  	<option value="일부 부서의 특정 직급 이상 허용">일부 부서의 특정 직급 이상 허용</option>
				   </select>
		            <input
		              type="text"
		              placeholder="검색어"
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
		              {accessRules.map(rule => (
		                <tr key={rule.accessId} className="hover:bg-gray-50">
		                  <td className="px-6 py-4 text-gray-900">{rule.accessName}</td>
		                  <td className="px-6 py-4 text-gray-600">
						  	{rule.accessType}
		                    {/*<span
		                      className={`px-2 py-1 rounded-full text-xs ${
		                        rule.accessType === 'allow'
		                          ? 'bg-green-100 text-green-800'
		                          : 'bg-red-100 text-red-800'
		                      }`}
		                    >
		                      {rule.accessType === 'allow' ? '허용 업읽' : '허용 없음'}
		                    </span>*/}
		                  </td>
		                  <td className="px-6 py-4">
		                    <button
		                      onClick={() => onSelectAccessRule(rule)}
		                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors cursor-pointer"
		                    >
		                      선택
		                    </button>
		                  </td>
		                </tr>
		              ))}
					  {/* 데이터가 하나도 없을 때 */}
					  {(!accessRules || accessRules.length === 0) && (
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
		          <div className="text-sm text-gray-600">총 {accessRules.length}개</div>
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
		
	);
}