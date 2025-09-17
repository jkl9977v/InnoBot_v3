// components/PathSearchModal.tsx
'use client';
import React, { useEffect, useState } from 'react';

export type PathItem = { id: string; path: string };

export default function PathSearchModal({ isOpen, onClose, onSelect }: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (p: string) => void;
}) {
  if (!isOpen) return null;

  return (
    <Modal title="경로 검색" onClose={onClose} width="720px">
      <PathSearchInner onSelect={onSelect} />
    </Modal>
  );
}

function PathSearchInner({ onSelect }: { onSelect: (p: string) => void }) {
  const [query, setQuery] = useState<string>('');
  const [list, setList] = useState<PathItem[]>([]);

  useEffect(() => {
    // 더미 데이터 — 실제로는 API 호출로 목록을 불러오세요.
    setList([
      { id: '1', path: 'D:/InnoBot_v3/docs' },
      { id: '2', path: 'D:/InnoBot_v3/docs/폴더생성 테스트' },
      { id: '3', path: 'D:/InnoBot_v3/docs/폴더생성 테스트/테스트 폴더' },
      { id: '4', path: 'D:/InnoBot_v3/docs/폴더생성 테스트/테스트 폴더/depth=3' },
      { id: '5', path: 'D:/InnoBot_v3/docs/매뉴얼 docx' },
    ]);
  }, []);

  const filtered = list.filter(it => it.path.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <>
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <input type="text" placeholder="부서/경로 검색" value={query} onChange={(e)=>setQuery(e.target.value)} className="px-3 py-2 border rounded w-full" />
          <button onClick={() => {/* 실제 서버 검색시 fetch 호출 */}} className="px-4 py-2 bg-indigo-600 text-white rounded">검색</button>
        </div>
      </div>

      <div className="border rounded overflow-hidden">
        <div className="px-4 py-3 bg-white border-b">
          <div className="grid grid-cols-12">
            <div className="col-span-10 text-sm font-medium text-gray-600">경로</div>
            <div className="col-span-2 text-sm font-medium text-gray-600 text-right">선택</div>
          </div>
        </div>

        <div className="max-h-[360px] overflow-y-auto bg-white">
          {filtered.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">검색 결과가 없습니다.</div>
          ) : (
            filtered.map(item => (
              <div key={item.id} className="px-4 py-3 border-b flex items-center">
                <div className="flex-1 text-sm text-gray-800">{item.path}</div>
                <div className="w-28 text-right">
                  <button onClick={() => onSelect(item.path)} className="px-3 py-1 border border-indigo-500 text-indigo-600 rounded">선택</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-600">총 {filtered.length}개</div>
    </>
  );
}

/** 재사용 가능한 Modal (간단 구현) */
function Modal({ title, children, onClose, width = '720px' }: {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  width?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ width }} onClick={(e)=>e.stopPropagation()}>
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="ri-close-line w-5 h-5" />
          </button>
        </div>
        <div className="p-4 max-h-[520px] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
