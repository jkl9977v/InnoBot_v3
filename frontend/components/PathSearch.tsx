// app/admin/embedding-setting/page.tsx
'use client';
import React, { useEffect, useState } from 'react';

// PathItem 타입
export type PathItem = { id:string; path:string };

type Props = {
	onSelect: (path:string) => void;
	onClose?: () => void;
	//optional : 서버에서 검색/목록을 가져올 api
	fetchUrl?: string;
	//optional: 초기 더미 리스트(서버 미구현시 사용)
	initialList?: PathItem[];
}



// =======================
// 하단: 모달 및 경로검색 컴포넌트 (정리)
// =======================
/*function PathSearchModal({ isOpen, onClose, onSelect }: { isOpen: boolean; onClose: () => void; onSelect: (p: string) => void; }) {
  if (!isOpen) return null;
  return <Modal title="경로 검색" onClose={onClose} width="720px"><PathSearchInner onSelect={onSelect} /></Modal>;
}*/

function PathSearchInner({ onSelect }: { onSelect: (p: string) => void }) {
  const [query, setQuery] = useState<string>('');
  const [list, setList] = useState<PathItem[]>(initialLIst);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
	//초기 리스트 세팅
    setList([
      { id: '1', path: 'D:/InnoBot_v3/docs' },
      { id: '2', path: 'D:/InnoBot_v3/docs/폴더생성 테스트' },
      { id: '3', path: 'D:/InnoBot_v3/docs/폴더생성 테스트/테스트 폴더' },
      { id: '4', path: 'D:/InnoBot_v3/docs/폴더생성 테스트/테스트 폴더/depth=3' },
      { id: '5', path: 'D:/InnoBot_v3/docs/매뉴얼 docx' },
    ]);
  }, []);

  const filtered = list.filter(it => it.path.toLowerCase().includes(query.trim().toLowerCase()));
  
  //새로 추가된 부분
  const doSearch = async () => {
	if (!fetchUrl){
		//백엔드 API가 없으면 로컬 필터만 사용
		return;
	}
	setIsLoading(true);
	try {
		const url=`${fetchUrl}?q=${encodeURIComponent(query)}`;
		const res = await fetch(url, { credentials: 'include' });
		if (!res.ok) throw new Error('검색 실패: ' + res.status);
		const data = await res.json();
		//기대: data.items 또는 바로 배열 반환 - 프로젝트에 맞게 조정 가능
		if(Array.isArray(data)) setList (data);
		else if(Array.isArray((data as any).items)) setLIst((data as any).items);
		else setLIst([]);
	} catch (e) {
		console.error(e);
		setList([]);
	} finally {
		setIsLoading(false);
	}
  };
  
  return (
    <>
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <input type="text" placeholder="부서/경로 검색" value={query} onChange={(e) => setQuery(e.target.value)} className="px-3 py-2 border rounded w-full" />
          <button onClick={() => { /* 서버 검색 연동시 이곳에 fetch */ }} className="px-4 py-2 bg-indigo-600 text-white rounded">검색</button>
        </div>
      </div>

      <div className="border rounded overflow-hidden">
        <div className="px-4 py-3 bg-white border-b">
          <div className="grid grid-cols-12">
            <div className="col-span-10 text-sm font-medium text-gray-600">경로</div>
            <div className="col-span-2 text-sm font-medium text-gray-600 text-right">선택</div>
          </div>
        </div>

		
          {filtered.length === 0 ? <div className="p-4 text-sm text-gray-500">검색 결과가 없습니다.</div> : filtered.map(item => (
            <div key={item.id} className="px-4 py-3 border-b flex items-center">
              <div className="flex-1 text-sm text-gray-800">{item.path}</div>
              <div className="w-28 text-right">
                <button onClick={() => onSelect(item.path)} className="px-3 py-1 border border-indigo-500 text-indigo-600 rounded">선택</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-600">총 {filtered.length}개</div>
    </>
  );
}

/*<div className="max-h-[360px] overflow-y-auto bg-white">
		          {isLoading ? (
		            <div className="p-4 text-sm text-gray-500">로딩중...</div>
		          ) : list.length === 0 ? (
		            <div className="p-4 text-sm text-gray-500">검색 결과가 없습니다.</div>
		          ) : (
		            list.map((item) => (
		              <div key={item.id} className="px-4 py-3 border-b flex items-center">
		                <div className="flex-1 text-sm text-gray-800">{item.path}</div>
		                <div className="w-28 text-right">
		                  <button
		                    onClick={() => {
		                      onSelect(item.path);
		                      if (onClose) onClose(); // 선택과 동시에 모달 닫기 원하면 onClose 전달
		                    }}
		                    className="px-3 py-1 border border-indigo-500 text-indigo-600 rounded text-sm"
		                  >
		                    선택
		                  </button>
		                </div>
		              </div>
		            ))
		          )}
		        </div>
		      </div>*/

/*// Modal 재사용 컴포넌트
function Modal({ title, children, onClose, width = '720px' }: { title?: string; children: React.ReactNode; onClose: () => void; width?: string; }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ width }} onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="ri-close-line w-5 h-5" /></button>
        </div>
        <div className="p-4 max-h-[520px] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}*/

