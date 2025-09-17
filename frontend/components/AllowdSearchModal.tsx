// components/AllowdPolicySearchModal.tsx
'use client';
import React from 'react';

export type Allowd = {
  id: string;
  name: string;
  targetName: string;
  ruleName: string;
  departments: string[];
  isActive: boolean;
};

type Props = {
  isOpen: boolean;
  policies: DepartmentPolicy[];         // 부모가 전달하는 필터된 배열
  onSelect: (policy: DepartmentPolicy) => void;
  onClose: () => void;
};

export default function AllowdSearchModal({ 
	isOpen, 
	policies, 
	onSelect, 
	onClose 
}: Props) {
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
          {/* 검색 입력 UI는 부모에서 관리하거나 여기에 추가 가능 */}
        </div>

        <div className="overflow-y-auto flex-1">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">정책명</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">대상부서</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">선택</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {policies.map((deptPolicy) => (
                <tr key={deptPolicy.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-900">{deptPolicy.name}</td>
                  <td className="px-4 py-2 text-gray-600 text-xs">{deptPolicy.departments.join(', ')}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => onSelect(deptPolicy)}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
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
          <div className="text-sm text-gray-600">총 {policies.length}개</div>
        </div>
      </div>
    </div>
  );
}
