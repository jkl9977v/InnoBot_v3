//  components/DepartmentSearchModal.tsx
'use client';
import React from 'react';

export type DepartmentDTO = {
	id: string;
	name: string;
	code: string;
	description?: string;
};

type Props ={
	isOpen: boolean;
	onClose: () => void;
	searchQuery: string;
	setSearchQuery: (s: string) => void;
	filteredDepartments: DepartmentDTO[];
	onSelectDepartment: (d: DepartmentDTO) => void;
	onSearch: () => void;
}

/*
  이 컴포넌트는 원래 페이지에 있던 '부서 검색' 모달을 분리한 것 입니다.
  - 부모가 검색어 상태와 필터된 목록을 관리합니다 (props로 전달).
  - UI/주석/구조는 원본 모달을 그대로 따릅니다.
*/

export default function DepartmentSearchModal({
	isOpen,
	onClose,
	searchQuery,
	setSearchQuery,
	filteredDepartments,
	onSelectedDepartment,
	onSearch,
}: Props) {
	if(!isOpen) return null;
	
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
		             value={searchQuery}
		             onChange={(e) => setSearchQuery(e.target.value)}
		             className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
		           />
		           <button
		             onClick={onSearch}
		             className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors cursor-pointer"
		           >
		             검색
		           </button>
		         </div>
		       </div>

		       <div className="overflow-y-auto flex-1">
		         <table className="w-full text-sm">
		           <thead className="bg-gray-50 border-b border-gray-200">
		             <tr>
		               <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">부서명</th>
		               <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">코드</th>
		               <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">선택</th>
		             </tr>
		           </thead>
		           <tbody className="divide-y divide-gray-200">
		             {filteredDepartments.map((dept) => (
		               <tr key={dept.id} className="hover:bg-gray-50">
		                 <td className="px-4 py-2 text-gray-900">{dept.name}</td>
		                 <td className="px-4 py-2 text-gray-600">{dept.code}</td>
		                 <td className="px-4 py-2">
		                   <button
		                     onClick={() => onSelectedDepartment(dept)}
		                     className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors cursor-pointer"
		                   >
		                     선택
		                   </button>
		                 </td>
		               </tr>
		             ))}
		           </tbody>
		         </table>
		       </div>

		       <div className="p-4 border-t border-gray-200 text-center">
		         <div className="text-sm text-gray-600">총 {filteredDepartments.length}개</div>
		       </div>
		     </div>
		   </div>
	);
}