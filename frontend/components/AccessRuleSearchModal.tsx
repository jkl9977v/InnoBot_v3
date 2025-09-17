// components/AccessRuleSearchModal.tsx
'use client';
import React from 'react';

interface AccessRuleDTO {
	id: string;
	name: string;
	type: 'allow' | 'deny';
	target: string;
	description: string;
}

type Props = {
	isOpen: boolean;
	onClose: () => void;
	searchQuery: string;
	setSearchQuery: (s: string) => void;
	filteredPolicies: AccessPolicy[];
	onSelectPolicy: (p:AccessPolicy) => void;
	onSearch: () => void;
};

/*
  접근정책 검색 모달 - 크기 더 확대
  원본 페이지에서 사용하던 HTML/주석 구조를 그대로 가져왔습니다.
  부모 페이지가 상태(searchQuery, filteredPolicies 등)를 관리하고,
  이 컴포넌트는 UI만 담당합니다.
*/

export default function AccessPolicySearchModal({
	isOpen,
	onClose,
	searchQuery,
	setSearchQuery,
	filteredPolicies,
	onSelectPolicy,
	onSearch,
}: Props) {
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
		            <select className="px-3 py-2 border border-gray-300 rounded text-sm pr-8">
		              <option>전체</option>
		              <option>접근정책</option>
		              <option>부서정책</option>
		              <option>직급정책</option>
		            </select>
		            <input
		              type="text"
		              placeholder="검색어"
		              value={searchQuery}
		              onChange={e => setSearchQuery(e.target.value)}
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
		              {filteredPolicies.map(policy => (
		                <tr key={policy.id} className="hover:bg-gray-50">
		                  <td className="px-6 py-4 text-gray-900">{policy.name}</td>
		                  <td className="px-6 py-4 text-gray-600">
		                    <span
		                      className={`px-2 py-1 rounded-full text-xs ${
		                        policy.type === 'allow'
		                          ? 'bg-green-100 text-green-800'
		                          : 'bg-red-100 text-red-800'
		                      }`}
		                    >
		                      {policy.type === 'allow' ? '허용 업읽' : '허용 없음'}
		                    </span>
		                  </td>
		                  <td className="px-6 py-4">
		                    <button
		                      onClick={() => onSelectPolicy(policy)}
		                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors cursor-pointer"
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
		          <div className="text-sm text-gray-600">총 {filteredPolicies.length}개</div>
		        </div>
		      </div>
		    </div>
		
	);
}