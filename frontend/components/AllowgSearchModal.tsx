// components/AllowgSearchModal.tsx
'use client';
import React, {useEffect, useState} from 'react';

interface Allowg {
  id: string;
  name: string;
  targetName: string;
  ruleName: string;
  position: string;
  isActive: boolean;
};

export default function AllowgSearchModal({
	isOpen,
	onClose,
	policies,
	onSelect,
	initialQuery = '',
}: {
	isOpen: boolean;
	onClose: () => void;
	policies: GradePolicy[];
	onSelect: (p:GradeDTO) => void;
	initialQuery?: string;
}) {
	const [query, setQuery] = useState<string>(initialQuery);
	
	useEffect(() => {
		if (isOpen) setQuery(initialQuery ?? '');
	}, [isOpen, initialQuery]);
	
	if(!isOpen) return null;
	
	const lower = query.trim().toLowerCase();
	const filtered = query.trim()
		? policies.filter(
			(policy) => 
				policy.name.toLowerCase().includes(lower) ||
				policy.targetName.toLowerCase().includes(lower) ||
				policy.position.toLowerCase().includes(lower)
		)
		:policies;
		
		return (
			    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			      <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[500px] overflow-hidden flex flex-col">
			        <div className="p-4 border-b border-gray-200">
			          <div className="flex items-center justify-between mb-4">
			            <h3 className="text-lg font-semibold text-gray-900">직급정책 검색</h3>
			            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
			              <i className="ri-close-line w-5 h-5 flex items-center justify-center" />
			            </button>
			          </div>

			          <div className="flex items-center space-x-2">
			            <input
			              type="text"
			              placeholder="직급정책 검색"
			              value={query}
			              onChange={(e) => setQuery(e.target.value)}
			              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
			            />
			            <button
			              onClick={() => {/* 서버 검색 연동시 여기에 로직 */}}
			              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors cursor-pointer"
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
			                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">대상직급</th>
			                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">선택</th>
			              </tr>
			            </thead>
			            <tbody className="divide-y divide-gray-200">
			              {filtered.map((policy) => (
			                <tr key={policy.id} className="hover:bg-gray-50">
			                  <td className="px-4 py-2 text-gray-900">{policy.name}</td>
			                  <td className="px-4 py-2 text-gray-600">{policy.position}</td>
			                  <td className="px-4 py-2">
			                    <button
			                      onClick={() => { onSelect(policy); }}
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
			          <div className="text-sm text-gray-600">총 {filtered.length}개</div>
			        </div>
			      </div>
			    </div>
			  );
			}