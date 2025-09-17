// /app/admin/embedding-setting/page.tsx 또는 기존 파일 경로에 붙여넣기
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../../components/AdminSidebar';
import AdminHeader from '../../../components/AdminHeader';
import { apiUrl } from '@/lib/api';

type ChatbotDTO = {
  path?: string | null;
  hour?: number | null;
  min?: number | null;
};

type SelectHourMinProps = {
  hour: number;
  min: number;
  setHour: (h: number) => void;
  setMin: (m: number) => void;
};


/**
 * 한 파일 안에 Modal(팝업) 컴포넌트와 PathSearch UI까지 모두 포함한 EmbeddingSettingPage
 * - 외부 컴포넌트 추가 파일 없이 그대로 붙여넣어 사용 가능
 * - 모달 닫기(백드롭/Esc/닫기버튼) 모두 처리
 * - 선택된 경로는 selectedPath 상태로 관리되어 입력필드에 반영됨
 */

/* --------------------------
   작은 재사용 컴포넌트들 (파일 내부)
   -------------------------- */

// 공통 Modal (백드롭, Esc 닫기, 내부 클릭 전파 차단)
function Modal({
  title,
  children,
  onClose,
  width = '720px',
}: {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  width?: string;
}) {
  // Esc 키로 닫기 처리
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    // backdrop: 클릭 시 onClose 호출
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* 내부 박스: 클릭 전파 차단해서 내부 클릭 시 모달이 닫히지 않게 함 */}
      <div
        className="bg-white rounded-lg shadow-lg overflow-hidden"
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="ri-close-line w-5 h-5"></i>
          </button>
        </div>

        <div className="p-4 max-h-[520px] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

/* --------------------------
   모달 내부: 경로 검색 / 리스트 UI
   -------------------------- */

type PathItem = { id: string; path: string };

/**
 * PathSearch UI (모달 내부에 들어가는 부분)
 * - parent에서 open 상태/닫기/선택 콜백을 관리
 * - 현재는 더미 데이터(요청하신 사진 내용) 사용
 * - 실제로 서버 검색을 연결하려면 fetch 주석 참고
 */
function PathSearchContent({ onSelect }: { onSelect: (p: string) => void; }) {
  // 검색어, 리스트 상태
  const [query, setQuery] = useState('');
  const [list, setList] = useState<PathItem[]>([]);

  // 초기 더미 데이터 세팅 (사진 내용과 동일한 항목)
  useEffect(() => {
    setList([
      { id: '1', path: 'D:/InnoBot_v3/docs' },
      { id: '2', path: 'D:/InnoBot_v3/docs/폴더생성 테스트' },
      { id: '3', path: 'D:/InnoBot_v3/docs/폴더생성 테스트/테스트 폴더' },
      { id: '4', path: 'D:/InnoBot_v3/docs/폴더생성 테스트/테스트 폴더/depth=3' },
      { id: '5', path: 'D:/InnoBot_v3/docs/매뉴얼 docx' },
    ]);
  }, []);

  // 검색 필터 (간단 포함 검색)
  const filtered = list.filter((it) => it.path.toLowerCase().includes(query.trim().toLowerCase()));

  // 선택 핸들러
  const handleSelect = (p: string) => {
    onSelect(p);
  };

  // (옵션) 실제 서버 연동 예시 (주석)
  // 1) 검색 버튼 클릭 시 서버에 query 보내기
  // fetch(`/api/paths?q=${encodeURIComponent(query)}`, { credentials: 'include' })
  //   .then(res => res.json())
  //   .then(data => setList(data.items))
  //   .catch(e => console.error(e));
  //
  // 2) 보안 필요 시 인증 헤더 추가 (JWT 등)
  //
  // 위 코드는 백엔드에 경로 목록을 반환하는 API가 준비되어 있을 때 사용하세요.

  return (
    <>
      {/* 검색영역 */}
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="검색어"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded w-full text-sm"
          />
          <button
            onClick={() => {
              // 현재는 로컬 필터만 사용하므로 아무 동작 필요 없음
              // 서버 연동 시 위 fetch 예시를 여기에 넣으세요.
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm"
          >
            검색
          </button>
        </div>
      </div>

      {/* 테이블 스타일 리스트 */}
      <div className="border rounded-lg overflow-hidden">
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
            filtered.map((item) => (
              <div key={item.id} className="px-4 py-3 border-b last:border-b-0 flex items-center">
                <div className="flex-1 text-sm text-gray-800">{item.path}</div>
                <div className="w-28 text-right">
                  <button
                    onClick={() => handleSelect(item.path)}
                    className="px-3 py-1 border border-blue-500 text-blue-600 rounded hover:bg-blue-50 text-sm transition-colors"
                  >
                    선택
                  </button>
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

/* --------------------------
   실제 페이지 컴포넌트 : EmbeddingSettingPage
   -------------------------- */

export default function EmbeddingSettingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const router = useRouter();

  // 팝업 관련 상태 + 선택된 경로 상태
  const [isPathModalOpen, setIsPathModalOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState(''); // 서버에서 받아온 값으로 초기화
  const [hour , setHour] = useState('');
  const [min, setMin] = useState('');
  
  //확장자 체크박스
  /*
  const [extTxt, setExtTxt] = useState(false);
  const [extPdf, setExtPdf] = useState(true);
  const [extDocx, setExtDocx] = useState(false);
  const [extXlsx, setExtXlsx] = useState(false);
  const [extPptx, setExtPptx] = useState(true);
  const [extHtml, setExtHtml] = useState(false);
  const [extCsv, setExtCsv] = useState(false);
  */

  useEffect(() => {
    // (실습용) 로그인 검사 대신 바로 allow
    setIsLoggedIn(true);
    setIsLoading(false);
  
  fetch(apiUrl('/admin/chatbot-setting'), {
	method: 'GET',
	headers : { 'Accept' : 'application/json' },
	credentials : 'include' //세션 인증
  })
  	.then(res => {  //오류 발생 시
		if(!res.ok) throw new Error('설정 불러오기 실패: '+ res.status);
		return res.json();
	})
	.then((dto) => { //dto:DtoType
		//서버에서 받은 dto값을 상태에 저장(초기화) 함
		setSelectedPath(dto.path ?? ''); //값이 없을 시 빈칸을 보여준다.
		setHour(dto.hour != null ? String(dto.hour) : '1' ); //값이 없을 시 1 출력
		setMin(dto.min != null ? String(dto.min) : '1'); //값이 없을 시 1 출력
		
		/*
		// 확장자 값이 boolean 혹은 "Y"/"N" 등으로 저장되어 있다면 여기에 맞춰 변환
		setExtTxt(Boolean(dto.txt));
		setExtPdf(Boolean(dto.pdf));
		setExtDocx(Boolean(dto.docx));
		setExtXlsx(Boolean(dto.xlsx));
		setExtPptx(Boolean(dto.pptx));
		setExtHtml(Boolean(dto.html));
		setExtCsv(Boolean(dto.cvs || dto.csv));
		*/
	})
	.catch((e) => {
		console.error(e);
		//실패 시 기본값 유지
	})
	.finally(() =>  setIsLoading(false));
  }, []);
  
/*  useEffect(() => {
	if(onChange) onChange(hour, min);
  }, [hour, min]);*/
  
  const hours = Array.from({ length: 25 }, (_, i) => i); //25 -> 0..24
  const mins = Array.from({ length: 61 }, (_, i) => i); //61 -> 0..60
  
  //저장 버튼 클릭 시 서버에 설정 저장 (POST JSON)
  const handleSave = () => {
	// 전송할 body형태 (ChatbotCommmad)
	const ChatbotCommand = {
		//settingId : settingId,
		path: path,
		hour: hour,
		min: min
		
		/*
		// 확장자: boolean 또는 서버가 기대하는 형식으로 맞춤
		,txt: extTxt,
		pdf: extPdf,
		docx: extDocx,
		xlsx: extXlsx,
		pptx: extPptx,
		html: extHtml,
		cvs: extCsv
		*/
	}
	
	fetch(url, {
		method:'POST',
		headers: {'Content-Type':'application/json'},
		credentials: 'include', //세선 체크하기 위해 필요함
		body: JSON.stringify(ChatbotCommand),
	})
	.then(res => {if(!res.ok) throw new Error()} )
  }
  const handleToggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  // 모달에서 경로 선택 시 호출되는 콜백
  const handlePathSelect = (path: string) => {
    // 초급 개발자용 주석:
    //  - 여기서 선택된 경로를 상태에 저장해서 입력란에 표시합니다.
    //  - 서버에 저장하려면 이 함수에서 fetch로 저장 API를 호출하세요.
    setSelectedPath(path);
    setIsPathModalOpen(false); // 모달 닫기 (안해도 모달 내부에서 닫을 수 있음)
  };
  
  
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        expandedSection={expandedSection}
        onToggleSection={handleToggleSection}
      />

      <div className="flex-1 flex flex-col">
        <AdminHeader title="임베딩 설정" onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-xl border border-gray-200 min-h-full">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">임베딩 설정</h2>
              <p className="text-gray-600 mb-6">
                텍스트 임베딩과 추출에서 DB에 저장하기 위한 기본 옵션을 설정합니다.
              </p>

              <div className="space-y-6">
                {/* 기본 경로 입력 + 팝업 트리거 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">기본 경로</label>
                  <div className="flex">
                    <input
                      type="text" name="path" value={selectedPath} readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-gray-600 text-sm"
                    />
                    <button
                      onClick={() => setIsPathModalOpen(true)} // 팝업 열기
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg transition-colors cursor-pointer whitespace-nowrap text-sm"
                    >
                      경로 검색
                    </button>
                  </div>
                </div>

                {/* 임베딩 주기 (기존 UI 그대로) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">임베딩 주기</label>
                  <div className="flex items-center space-x-4">
                    <select name="hour" value={hour} onChange={(e) => setHour(Number(e.target.value))}
					className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm pr-8">
						{hours.map((h) => (
							<option key={h} value={h}> {h} </option>
						))}                      
                    </select>
					<span className="text-sm text-gray-600">시간</span>
                    {/*<select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm pr-8">
                      <option value="시간">시간</option>
                      <option value="일">일</option>
                      <option value="주">주</option>
                      <option value="월">월</option>
                    </select>*/}
                    <select name="min" value={min} onChange={(e) => setMin(Number(e.target.value))} 
					className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm pr-8">
                    	{mins.map((m) => (
							<option key={m} value={m}> {m} </option>
						))}  
                    </select>
                    <span className="text-sm text-gray-600">분</span>
                  </div>
                </div>

                {/* 파일 확장자 체크박스 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">텍스트 임베딩 할 확장자</label>
                  <div className="grid grid-cols-4 gap-4">
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /><span className="text-sm text-gray-700">txt</span></label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /><span className="text-sm text-gray-700">pdf</span></label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /><span className="text-sm text-gray-700">docx</span></label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /><span className="text-sm text-gray-700">xlsx</span></label>
                    <label className="flex items-center"><input type="checkbox" defaultChecked className="mr-2" /><span className="text-sm text-blue-600">pptx</span></label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /><span className="text-sm text-gray-700">html</span></label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /><span className="text-sm text-gray-700">csv</span></label>
                    <label className="flex items-center"><input type="checkbox" className="mr-2" /><span className="text-sm text-gray-700">기타</span></label>
                  </div>
                </div>

                {/* 수동 임베딩 */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-3">수동 임베딩</h3>
                  <p className="text-sm text-gray-600 mb-4">버튼을 클릭하면 설정된 경로를 임베딩합니다.</p>
                  <button
                    onClick={() => {
                      // 여기에 임베딩 실행 API 호출 추가 가능
                      // 예: fetch('/api/embed', { method: 'POST', body: JSON.stringify({ path: selectedPath }) })
                      alert(`임베딩 실행 (경로: ${selectedPath})`);
                    }}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    임베딩 실행
                  </button>
                </div>

                {/* 상태 관리 */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-3">상태 관리</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">현재 상태: <span className="text-green-600 font-medium">대기 중</span></div>
                    <div className="text-sm text-gray-600 mt-1">마지막 임베딩: 2025-01-08 14:30:25</div>
                    <div className="text-sm text-gray-600 mt-1">다음 임베딩: 2025-01-08 15:30:25</div>
                  </div>
                </div>

              </div>

              <div className="flex justify-end mt-8">
                <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap">
                  설정 저장
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ------------------------
          경로 검색 모달 (한 파일 안에서 렌더)
         ------------------------ */}
      {isPathModalOpen && (
        <Modal title="경로 검색" onClose={() => setIsPathModalOpen(false)} width="720px">
          <PathSearchInner onSelect={(p) => handlePathSelect(p)} />
        </Modal>
      )}
    </div>
  );
}

/* --------------------------
   내부용 PathSearchInner (페이지 내부에 위치)
   - 분리해 놓은 이유: 위에서 Modal에 children으로 넣기 위해
   -------------------------- */
   /*
function PathSearchInner({ onSelect }: { onSelect: (p: string) => void }) {
  // 여기 내용은 PathSearchContent와 동일 (중복 제거 위해 분리)
  const [query, setQuery] = useState('');
  const [list, setList] = useState<PathItem[]>([]);

  useEffect(() => {
    setList([
      { id: '1', path: 'D:/InnoBot_v3/docs' },
      { id: '2', path: 'D:/InnoBot_v3/docs/폴더생성 테스트' },
      { id: '3', path: 'D:/InnoBot_v3/docs/폴더생성 테스트/테스트 폴더' },
      { id: '4', path: 'D:/InnoBot_v3/docs/폴더생성 테스트/테스트 폴더/depth=3' },
      { id: '5', path: 'D:/InnoBot_v3/docs/매뉴얼 docx' },
    ]);
  }, []);

  const filtered = list.filter((it) => it.path.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <>
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="검색어"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded w-full text-sm"
          />
          <button
            onClick={() => { /* 서버 연동 시 검색 수행 */ /*}}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm"
          >
            검색
          </button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
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
            filtered.map((item) => (
              <div key={item.id} className="px-4 py-3 border-b last:border-b-0 flex items-center">
                <div className="flex-1 text-sm text-gray-800">{item.path}</div>
                <div className="w-28 text-right">
                  <button
                    onClick={() => onSelect(item.path)}
                    className="px-3 py-1 border border-blue-500 text-blue-600 rounded hover:bg-blue-50 text-sm transition-colors"
                  >
                    선택
                  </button>
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
*/
