// components/DepartmentsSearchModal.tsx
'use client';
import React from 'react';

export type DepartmentDTO = {
  id: number;
  name: string;
  code: string;
};

type Props = {
  isOpen: boolean;
  mockDepartments: DepartmentDTO[];
  selectedDepartments: DepartmentDTO[];
  allSelected: boolean;
  onClose: () => void;
  onSelectAll: (checked: boolean) => void;
  onDepartmentSelect: (department: DepartmentDTO, checked: boolean) => void;
  onConfirmSelection: () => void;
};

export default function DepartmentsSearchModal({
  isOpen,
  mockDepartments,
  selectedDepartments,
  allSelected,
  onClose,
  onSelectAll,
  onDepartmentSelect,
  onConfirmSelection,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[600px] max-h-[500px] overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">부서 검색</h3>
            <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600">
              <i className="ri-close-line"></i>
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <label className="flex items-center">
              <input type="checkbox" checked={allSelected} onChange={(e) => onSelectAll(e.target.checked)} className="mr-3" />
              <span className="text-sm font-medium text-gray-700">전체 선택</span>
            </label>
          </div>

          <div className="max-h-80 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">선택</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">부서명</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">코드</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockDepartments.map((department) => (
                  <tr key={department.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedDepartments.some(d => d.id === department.id)}
                        onChange={(e) => onDepartmentSelect(department, e.target.checked)}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{department.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{department.code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">취소</button>
          <button onClick={onConfirmSelection} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">선택 완료</button>
        </div>
      </div>
    </div>
  );
}
