//  admin/file/fileDetail
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminSidebar from '../../../../components/AdminSidebar';
import AdminHeader  from '../../../../components/AdminHeader_handleGoBack';
import { apiUrl }  from '@/lib/api';
import { formatDate }  from '../../../../utils/DateTimeFormat';
import { useLoading } from '@/hooks/useLoading';
import FullPageSpinner from '../../../../components/FullPageSpinner';

export default function FileDetailPage() {
  /* ─────────────────────── 상태 ─────────────────────── */
  const { isLoading, setIsLoading, wrap } = useLoading();
  //const [isLoggedIn, setIsLoggedIn]   = useState(false);
  //const [isLoading,  setIsLoading]    = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('file-system');
  
  const router = useRouter();

  const searchParams = useSearchParams();
  const fileId = searchParams.get('fileId');

  const [formData, setFormData] = useState({
	fileId: '',
    fileName:   '',
    extension:  '',
	pathId: '',
	hash: '',
	size: '',
    updateTime: '',    // ‘마지막 수정일자’
	path: '',
  });
  
  useEffect(() => {
	if(!fileId) return;
	fetchDetail();
	setIsLoading();
  }, [fileId]);

  /* ─────────────────────── 헬퍼 ─────────────────────── */
  const handleInputChange = (field: keyof typeof formData, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleToggleSection = (section: string) =>
    setExpandedSection(prev => (prev === section ? null : section));

  const handleGoBack = () => {
	router.back();
  }
  
  const fetchDetail = async () => {
	try {
		const url = apiUrl(`/admin/file/fileDetail?fileId=${fileId}`)
		const res = await fetch(url, {
			method: 'GET',
			headers: { Accept: 'application/json' },
			credentials: 'include'
		});
		if (!res.ok) throw new Error ('detail fetch error ' + res.status);
		const dto = await res.json();
		setFormData(dto);
		console.log(dto);
	} catch (e) {
		alert('데이터를 불러오지 못했습니다.');
		console.error(e);
	}
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ────────── 사이드바 ────────── */}
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        expandedSection={expandedSection}
        onToggleSection={handleToggleSection}
      />

      {/* ────────── 본문 영역 ────────── */}
      <div className="flex-1 flex flex-col">
        <AdminHeader
          title="파일 시스템 > 파일 정보"
		  handleGoBack={() => handleGoBack()}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-xl border border-gray-200 min-h-full">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">파일 정보</h2>

              {/* ────────── 입력 폼 ────────── */}
              <div className="space-y-6">
                {/* 파일명 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    파일명 *
                  </label>
                  <input
                    type="text"
                    value={formData.fileName}
					readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* 확장자 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    확장자 *
                  </label>
                  <input
                    type="text"
                    value={formData.extension}
					readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* 파일 위치 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    파일 위치 *
                  </label>
                  <input
                    type="text"
                    value={formData.path}
					readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* 파일크기 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    파일크기 *
                  </label>
                  <input
                    type="text"
                    value={formData.size}
					readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* 마지막 수정일자 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    마지막 수정일자 *
                  </label>
                  <input
                    type="text"
                    value={formatDate(formData.updateTime)}
					readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* ────────── 버튼 ────────── */}
              <div className="flex justify-end mt-8">
                <button
					onClick={handleGoBack}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
