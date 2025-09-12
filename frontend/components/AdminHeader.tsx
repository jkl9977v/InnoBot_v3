//adminHeader.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
  title: string;
  onToggleSidebar: () => void;
}

export default function AdminHeader({ title, onToggleSidebar }: AdminHeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/');
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        >
          <i className="ri-menu-line w-5 h-5 flex items-center justify-center text-gray-600"></i>
        </button>
        <h1 className="text-xl font-semibold text-gray-900">
          {title}
        </h1>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600 relative">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <i className="ri-user-line text-indigo-600"></i>
          </div>
          <span className="text-sm text-gray-700">관리자</span>
          <i className="ri-arrow-down-s-line w-4 h-4 flex items-center justify-center text-gray-400"></i>
        </div>

        {isUserMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200">
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>서울Tip:</strong> 1234</div>
                <div><strong>이름:</strong> 천지</div>
                <div><strong>부서:</strong> DevOps</div>
                <div><strong>직급:</strong> 연구원</div>
              </div>
            </div>
            <div className="p-2 space-y-1">
              <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-sm text-gray-700">
                내 정보 수정
              </button>
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-sm text-gray-700">
                로그아웃
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}