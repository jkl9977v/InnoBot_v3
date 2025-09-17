// app/admin/embedding-setting/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../../components/AdminSidebar';
import AdminHeader from '../../../components/AdminHeader';
import { apiUrl } from '@/lib/api'; // 프로젝트에 있다면 사용, 없으면 빈 문자열로 대체

// =======================
// 타입 (TSX 전용)
// =======================
type ChatbotDTO = {
  path?: string | null;
  hour?: number | null;
  min?: number | null;
  // 확장자 필드는 서버 구조에 따라 다름: boolean 필드(txt/pdf/...) 또는 csv 문자열(fileExtensions) 등
  txt?: boolean | string | null;
  pdf?: boolean | string | null;
  docx?: boolean | string | null;
  xlsx?: boolean | string | null;
  pptx?: boolean | string | null;
  html?: boolean | string | null;
  cvs?: boolean | string | null; // cvs/csv naming 불확실성 대비
  fileExtensions?: string | null; // ex: ".pdf,.txt"
};

// =======================
// 작은 자식 컴포넌트 (시간/분 선택기) - controlled
// =======================
type SelectHourMinProps = {
  hour: number;
  min: number;
  setHour: (h: number) => void;
  setMin: (m: number) => void;
};

function SelectHourMin({ hour, min, setHour, setMin }: SelectHourMinProps) {
  const hours = Array.from({ length: 25 }, (_, i) => i); // 0..24
  const mins = Array.from({ length: 61 }, (_, i) => i); // 0..60

  return (
    <div className="flex items-center gap-3">
      <select
        value={hour}
        onChange={(e) => setHour(Number(e.target.value))}
        className="px-3 py-2 border rounded"
      >
        {hours.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <span className="text-sm text-gray-700">시간</span>

      <select
        value={min}
        onChange={(e) => setMin(Number(e.target.value))}
        className="px-3 py-2 border rounded"
      >
        {mins.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <span className="text-sm text-gray-700">분</span>
    </div>
  );
}

// =======================
// 임베딩 설정 페이지 (부모) - 확장자 포함 전체
// =======================
export default function EmbeddingSettingPage(): JSX.Element {
  const router = useRouter();

  // UI 상태
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // 부모 상태: server dto를 여기서 보관 (source of truth)
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [hour, setHour] = useState<number>(1);
  const [min, setMin] = useState<number>(1);

  // 확장자 상태들 (boolean)
  /* const [extTxt, setExtTxt] = useState<boolean>(false);
  const [extPdf, setExtPdf] = useState<boolean>(false);
  const [extDocx, setExtDocx] = useState<boolean>(false);
  const [extXlsx, setExtXlsx] = useState<boolean>(false);
  const [extPptx, setExtPptx] = useState<boolean>(false);
  const [extHtml, setExtHtml] = useState<boolean>(false);
  const [extCsv, setExtCsv] = useState<boolean>(false);*/

  // 팝업 상태
  const [isPathModalOpen, setIsPathModalOpen] = useState<boolean>(false);

  // 수동 임베딩 부분
  const [isEmbeddingRunning, setIsEmbeddingRunning] = useState<boolean>(false);
  const [embeddingResultMessage, setEmbeddingResultMessage] = useState<string>('');

  // -----------------------
  // B. 페이지 로드 시: GET -> 부모 상태 채우기 (dto 포함 확장자 초기화)
  // -----------------------
  useEffect(() => {
    setIsLoggedIn(true); // 실제 로그인 체크 필요 시 대체

    fetch(apiUrl('/admin/chatbot-setting'), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('설정 불러오기 실패: ' + res.status);
        return res.json();
      })
      .then((dto: ChatbotDTO) => {
        console.log('서버 dto:', dto);
        setSelectedPath(dto.path ?? '');
        setHour(dto.hour ?? 1);
        setMin(dto.min ?? 1);

        // 확장자 초기화 헬퍼 호출
        //parseExtensions(dto);
      })
      .catch((err) => {
        console.error('설정 로드 에러', err);
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  // -----------------------
  // E. 저장: 부모 상태 -> 서버 POST (개별 booleans + fileExtensions CSV 포함)
  // -----------------------
  const handleSave = () => {
    // fileExtensions CSV 만들기 (백엔드가 csv string을 기대할 수도 있으므로 같이 보냄)
    /* const selectedExts = [];
    if (extPdf) selectedExts.push('.pdf');
    if (extTxt) selectedExts.push('.txt');
    if (extDocx) selectedExts.push('.docx');
    if (extXlsx) selectedExts.push('.xlsx');
    if (extPptx) selectedExts.push('.pptx');
    if (extHtml) selectedExts.push('.html');
    if (extCsv) selectedExts.push('.csv');
    const fileExtensionsCsv = selectedExts.join(',');*/

    const payload = {
      path: selectedPath,
      hour: hour,
      min: min,
      // 개별 boolean들 (백엔드가 boolean을 기대하면 이걸 사용)
      /* txt: extTxt,
      pdf: extPdf,
      docx: extDocx,
      xlsx: extXlsx,
      pptx: extPptx,
      html: extHtml,
      cvs: extCsv,
      // csv 문자열도 함께 전송(백엔드 매퍼가 csv->list 처리하는 경우 대비)
      fileExtensions: fileExtensionsCsv,*/
    };

    fetch(apiUrl('/admin/chatbot-setting'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error('저장 실패: ' + res.status);
        return res.text();
      })
      .then(() => alert('설정 저장 성공'))
      .catch((err) => {
        console.error('저장 에러', err);
        alert('저장 실패(콘솔 확인)');
      });
  };

  const handleToggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  // Path 선택 콜백 (모달에서 호출)
  const handlePathSelect = (path: string) => {
    setSelectedPath(path);
    setIsPathModalOpen(false);
  };

  // 로딩 / 로그인 처리 뷰
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

  // 수동 임베딩 부분
  // 함수 : 임베딩 실행 (파일 내부 정의)
  async function runEmbedding() {
    // 이미 실행중이면 중복 실행 방지(추가 방어)
    if (isEmbeddingRunning) return;

    setIsEmbeddingRunning(true);
    setEmbeddingResultMessage('요청 중...');

    try {
      const body = {
        path: selectedPath, // 부모 상태에서 온 값
        // 필요하면 다른 설정 값도 포함
      };

      const res = await fetch(apiUrl('/admin/embedding/run'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      // 성공/실패 처리: 서버가 JSON 또는 문자열을 보낼 수 있으므로 안전하게 처리
      const text = await res.text();
      let data: any = text;

      try {
        // 텍스트가 JSON이면 파싱
        data = text ? JSON.parse(text) : text;
      } catch (e) {
        // JSON 파싱 실패하면 그냥 문자열로 둠
        data = text;
      }

      if (!res.ok) {
        // 실패: 상태 코드와 메시지 함께 표시
        const errMsg = typeof data === 'string' ? data : JSON.stringify(data);
        setEmbeddingResultMessage(`요청 실패: ${res.status} ${errMsg}`);
        console.error('임베딩 실패', res.status, data);
      } else {
        // 성공 : 서버가 준 응답을 표시
        const successText = typeof data === 'string' ? data : JSON.stringify(data);
        setEmbeddingResultMessage(`요청 성공: ${successText}`);
      }
    } catch (err: any) {
      console.error('임베딩 요청 에러', err);
      setEmbeddingResultMessage(`요청 에러 : ${err?.message ?? String(err)}`);
    } finally {
      setIsEmbeddingRunning(false);
    }
  }

  // Render UI (상단: 임베딩 설정, 하단: 모달 렌더)
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        expandedSection={expandedSection}
        onToggleSection={handleToggleSection}
      />

      <div className="flex-1 flex flex-col">
        <AdminHeader
          title="텍스트 임베딩 설정"
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-xl border border-gray-200 min-h-full">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">텍스트 임베딩 설정</h2>
              <p className="text-gray-600 mb-6">
                파일의 텍스트를 추출해서 DB에 저장하기 위한 기본 설정을 합니다.
              </p>

              <div className="space-y-6">
                {/* 기본 경로 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">기본 경로</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={selectedPath}
                      readOnly
                      className="flex-1 px-3 py-2 border rounded-l bg-gray-50"
                    />
                    <button
                      onClick={() => setIsPathModalOpen(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-r"
                    >
                      경로 검색
                    </button>
                  </div>
                </div>

                {/* 임베딩 주기 (시간/분) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">임베딩 주기</label>
                  <div className="flex items-center space-x-4">
                    <SelectHourMin hour={hour} min={min} setHour={setHour} setMin={setMin} />
                  </div>
                </div>

                {/* 확장자 체크박스 (원래 UI 복원) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    텍스트 임베딩 할 확장자 (미구현 기능)
                  </label>
                  <div className="grid grid-cols-4 gap-4">
                    <label className="flex items-center">
                      <input type="checkbox" /*checked={extTxt} onChange={(e) => setExtTxt(e.target.checked)}*/ className="mr-2" />
                      <span className="text-sm">txt</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" /*checked={extPdf} onChange={(e) => setExtPdf(e.target.checked)}*/ className="mr-2" />
                      <span className="text-sm">pdf</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" /*checked={extDocx} onChange={(e) => setExtDocx(e.target.checked)}*/ className="mr-2" />
                      <span className="text-sm">docx</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" /*checked={extXlsx} onChange={(e) => setExtXlsx(e.target.checked)}*/ className="mr-2" />
                      <span className="text-sm">xlsx</span>
                    </label>

                    <label className="flex items-center">
                      <input type="checkbox" /*checked={extPptx} onChange={(e) => setExtPptx(e.target.checked)}*/ className="mr-2" />
                      <span className="text-sm">pptx</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" /*checked={extHtml} onChange={(e) => setExtHtml(e.target.checked)}*/ className="mr-2" />
                      <span className="text-sm">html</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" /*checked={extCsv} onChange={(e) => setExtCsv(e.target.checked)}*/ className="mr-2" />
                      <span className="text-sm">csv</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">기타</span>
                    </label>
                  </div>
                </div>

                <hr />

                {/* 수동 임베딩 */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-3">수동 임베딩</h3>
                  <p className="text-sm text-gray-600 mb-4">버튼을 클릭하면 텍스트 임베딩이 실행됩니다.</p>
                  <div className="flex item-center space-x-4">
                    <button
                      onClick={runEmbedding}
                      disabled={isEmbeddingRunning}
                      className="px-6 py-2 bg-indigo-600 text-white rounded disabled:opacity-60"
                    >
                      {isEmbeddingRunning ? '요청 중...' : '임베딩 실행'}
                    </button>

                    <div id="embeddingResult" className="text-sm text-gray-700" aria-live="polite">
                      {embeddingResultMessage}
                    </div>
                  </div>
                </div>

                {/* 상태 관리 */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-3">상태 관리 (미구현 기능)</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">
                      현재 상태: <span className="text-green-600 font-medium">대기 중</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">마지막 임베딩: 2025-01-08 14:30:25</div>
                    <div className="text-sm text-gray-600 mt-1">다음 임베딩: 2025-01-08 15:30:25</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 text-white rounded">
                  설정 저장
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모달 렌더 (하단에 정의된 PathSearchModal 사용) */}
      {isPathModalOpen && (
        <PathSearchModal isOpen={isPathModalOpen} onClose={() => setIsPathModalOpen(false)} onSelect={handlePathSelect} />
      )}
    </div>
  );
}

// =======================
// 하단: 모달 및 경로검색 컴포넌트 (정리)
// =======================
function PathSearchModal({
  isOpen,
  onClose,
  onSelect,
}: {
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

type PathItem = { id: string; path: string };

function PathSearchInner({ onSelect }: { onSelect: (p: string) => void }) {
  const [query, setQuery] = useState<string>('');
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
            placeholder="부서/경로 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-2 border rounded w-full"
          />
          <button onClick={() => { /* 서버 검색 연동시 이곳에 fetch */ }} className="px-4 py-2 bg-indigo-600 text-white rounded">
            검색
          </button>
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
            filtered.map((item) => (
              <div key={item.id} className="px-4 py-3 border-b flex items-center">
                <div className="flex-1 text-sm text-gray-800">{item.path}</div>
                <div className="w-28 text-right">
                  <button onClick={() => onSelect(item.path)} className="px-3 py-1 border border-indigo-500 text-indigo-600 rounded">
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

// Modal 재사용 컴포넌트
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
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ width }} onClick={(e) => e.stopPropagation()}>
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
