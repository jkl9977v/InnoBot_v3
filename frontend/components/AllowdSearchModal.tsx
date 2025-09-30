// components/AllowdPolicySearchModal.tsx
'use client';
import React, {useEffect, useState} from 'react';
import { apiUrl } from '@/lib/api';

export type DepartmentDTO = {
	allowdId: string;
	allowdName: string;
	departmentId: string;
	departmentName: string;
	
/*  id: string;
  name: string;
  targetName: string;
  ruleName: string;
  departments: string[];
  isActive: boolean;*/
};

export type PageResponse<T> = {
	page: number;
	limitRow: number;
	startPageNum: number;
	endPageNum: number;
	maxPageNum: number;
	count: number;
	searchWord: stirng | null;
	kind: string | null;
	// kind2 : string | null; // kind2를 사용하는 리스트 페이지에서만 사용
	list: T[];
}

type Props = {
  isOpen: boolean;
  //policies: DepartmentPolicy[];         // 부모가 전달하는 필터된 배열
  onClose: () => void;
  onSelectAllowd: (p: allowd) => void;
};

export default function AllowdSearchModal({ 
	isOpen, 
	//policies, 
	onSelectAllowd, 
	onClose 
}: Props) {
	//1. 상태 선언
	const [allowd, setAllowd] = useState<DepartmentDTO[]>([]);
	const [page, setPage] = useState(1);
	const [limitRow, setLimitRow] = useState(10);
	const [searchWord, setSearchWord] = useState('');
	const [startPageNum, setStartPageNum] = useState(1);
	const [endPageNum, setEndPageNum] = useState(1);
	const [maxPageNum, setMaxPageNum] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	
	const fetchList = async () => {
		try { 
			setIsLoading(true);
			const params = new URLSearchParams({
				page: String(page),
				limitRow: String(limitRow),
				searchWord,
			});
			const url = apiUrl(`/admin/accessRule/allowdList?${params}`);
			const res = await fetch(url, {
				method: 'GET',
				headers: { Accept: 'application/json'},
				credentials: 'include',
			});
			if (!res.ok) throw new Error('Server error ' + res.status);
			
			const data: PageResponse<DepartmentDTO> = await res.json();
			
			setAllowd(data.list);
			setStartPageNum(data.startPageNum);
			setEndPageNum(data.endPageNum);
			setMaxPageNum(data.maxPageNum);
		} catch (e) {
			console.error('list fetch error', e);
		} finally {
			setIsLoading(false);
		}
	}
	
	//모달 열릴때마다 호출
	useEffect(() => {
		if(isOpen) fetchList();
	}, [isOpen, page, limitRow, searchWord]);
	
	
	
	 
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[500px] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">부서정책 검색</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
            </button>
          </div>

		  <div className="flex items-center space-x-2">
		    <input
		      type="text"
		      placeholder="직급정책 검색"
		      value={searchWord}
		      onChange={(e) => {setSearchWord(e.target.value); setPage(1); }}
		      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
		    />
		    <button
		      onClick={() => setPage(1)}
		      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm transition-colors cursor-pointer"
		    >
		      검색
		    </button>
		  </div>
        </div>

        <div className="overflow-y-auto flex-1">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">정책명</th>
                {/*<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">대상부서</th>*/}
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">선택</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {allowd.map((allowd) => (
                <tr key={allowd.allowdId} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-900">{allowd.allowdName}</td>
                  {/*<td className="px-4 py-2 text-gray-600 text-xs">{allowd.departments.join(', ')}</td>*/}
                  <td className="px-4 py-2">
                    <button
                      onClick={() => onSelectAllowd(allowd)}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                    >
                      선택
                    </button>
                  </td>
                </tr>
              ))}
			  {/* 데이터가 하나도 없을 때 */}
			  {(!allowd || allowd.length === 0) && (
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
							<span>총 {allowd.length}개 항목</span>
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
