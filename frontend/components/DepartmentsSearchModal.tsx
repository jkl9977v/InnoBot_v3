// components/DepartmentsSearchModal.tsx
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
	//startPageNum: number;
	//endPageNum: number;
	//maxPageNum: number;
	count: number;
	searchWord: string | null;
	//kind: string | null;
	//kind2: string | null; //kind2를 사용하는 리스트 페이지에서만 사용
	list: T[];
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  // 최종 선택된 부서 배열을 부모창에 넘김
  onDepartmentsSelect: (list: DepartmentDTO[] /*, checked: boolean*/) => void;
  //mockDepartments: DepartmentDTO[];
  //selectedDepartments: DepartmentDTO[];
  //allSelected: boolean;
  
  //onSelectAll: (checked: boolean) => void;
  //onConfirmSelection: () => void;
};

export default function DepartmentsSearchModal({
  isOpen,
  onClose,
  onDepartmentsSelect,
  //mockDepartments,
  //selectedDepartments,
  //allSelected,
  
  //onSelectAll,
  //onConfirmSelection,
}: Props) {
	//상태 선언1
	const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
	const [selectDepartments, setSelectDepartments] = useState<DepartmentDTO[]>([]);
	const [allSelected, setAllSelected] = useState(false);
	
	//상태 선언2
	const [page, setPage] = useState(0);
	const [limitRow, setLimitRow] = useState(0);
	const [searchWord, setSearchWord] = useState('');
	//const [startPageNum, setStartPageNum] = useState(1);
	//const [endPageNum, setEndPageNum] = useState(1);
	//const [maxPageNum, setMaxPageNum] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	
	useEffect(() => {
		if (isOpen) fetchList();
	}, [isOpen, page, limitRow, searchWord]);
	
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
	  } catch (e) {
	    console.error('list fetch error', e);
	  } finally {
	    setIsLoading(false);
	  }
	};
	
	//체크박스 핸들러
	const handleCheckBox = (d:DepartmentDTO, checked:boolean) => {
		setSelectDepartments( 
			s => checked ? [...s,d]:s.filter(x => x.departmentId !== d.departmentId)
		);
		if(!checked) setAllSelected (false);
	}
	
	const onSelectAll = (checked: boolean) => {
		setAllSelected(checked);
		setSelectDepartments(checked ? departments: [] );
	}
	
	
	
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[600px] max-h-[500px] overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">부서 검색</h3>
            <button onClick={onClose} /*className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"*/
				className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
			>
              {/*<i className="ri-close-line"></i>*/}
			  <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
            </button>
          </div>
		  
		  		  
        </div>

        <div className="p-3">
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

          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
				<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"></th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
				  	{/*체크박스 */}
				    <label className="flex items-center">
				      <input type="checkbox" checked={allSelected} onChange={(e) => onSelectAll(e.target.checked)} className="mr-3" />
				      <span className="text-sm font-medium text-gray-700">전체 선택</span>
				    </label>
				  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">부서명</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"></th>
				  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {departments.map((department) => (
                  <tr key={department.departmentId} className="hover:bg-gray-50">
				  <td className="px-4 py-3 text-sm text-gray-900"></td>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectDepartments.some(d => d.departmentId === department.departmentId)}
                        onChange={(e) => handleCheckBox(department, e.target.checked)}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{department.departmentName}</td>
					<td className="px-4 py-3 text-sm text-gray-900"></td>
					<td className="px-4 py-3 text-sm text-gray-900"></td>
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
        

        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">취소</button>
          <button onClick={() => {
			onDepartmentsSelect(selectDepartments);		//부모페이지로 결과 전달
			onClose();		//모달 닫기
		}} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">선택 완료</button>
        </div>
      </div>
    </div>
  );
}
