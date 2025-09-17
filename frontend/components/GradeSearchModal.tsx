// components/GradeSearchModal.tsx
'use client';
import React from 'react';

interface grade {
	id:string;
	name: string;
	code: string;
	level: number;
	description: string;
}

type Props = {
	isOpen: boolean;
	onClose: () => void;
	searchQuery: string;
	setSearchQuery: (s: string) => void;
	filteredGrades: grade[];
	onSelectGrade: (p: grade) => void;
	onSearch: () => void;
};

export default function GradeSearchModal({
	isOpen,
	onClose,
	searchQuery,
	setSearchQuery,
	filteredGrades,
	onSelectGrade,
	onSearch,
}: Props) {
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
		          value={searchQuery}
		          onChange={(e) => setSearchQuery(e.target.value)}
		          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
		        />
		        <button onClick={onSearch} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors cursor-pointer">
		          검색
		        </button>
		      </div>
		    </div>

		    <div className="overflow-y-auto flex-1">
		      <table className="w-full text-sm">
		        <thead className="bg-gray-50 border-b border-gray-200">
		          <tr>
		            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">직급명</th>
		            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">코드</th>
		            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">레벨</th>
		            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">선택</th>
		          </tr>
		        </thead>
		        <tbody className="divide-y divide-gray-200">
		          {filteredGrades.map(grade => (
		            <tr key={grade.id} className="hover:bg-gray-50">
		              <td className="px-4 py-2 text-gray-900">{grade.name}</td>
		              <td className="px-4 py-2 text-gray-600">{grade.code}</td>
		              <td className="px-4 py-2 text-gray-600">{grade.level}</td>
		              <td className="px-4 py-2">
		                <button onClick={() => onSelectGrade(grade)} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors cursor-pointer">
		                  선택
		                </button>
		              </td>
		            </tr>
		          ))}
		        </tbody>
		      </table>
		    </div>

		    <div className="p-4 border-t border-gray-200 text-center">
		      <div className="text-sm text-gray-600">총 {filteredGrades.length}개</div>
		    </div>
		  </div>
		</div>
	);
}