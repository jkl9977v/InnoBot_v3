//admin sidebar page
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface AdminSidebarProps {
  isSidebarOpen: boolean;
  expandedSection?: string | null;
  onToggleSection?: (section: string) => void;
}

export default function AdminSidebar({ isSidebarOpen, expandedSection, onToggleSection }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/');
  };

  const sidebarItems = [
    { id: 'analytics', icon: 'ri-bar-chart-line', label: '분석 및 통계', href: '/admin/analytics' },
    {
      id: 'policies',
      icon: 'ri-shield-line',
      label: '접근정책',
      hasSubmenu: true,
      submenu: [
        { id: 'access-policy', label: '접근정책', href: '/admin/accessRule/accessList' },
        { id: 'department-policy', label: '부서정책', href: '/admin/accessRule/allowdList' },
        { id: 'position-policy', label: '직급정책', href: '/admin/accessRule/allowgList' }
      ]
    },
    {
      id: 'user-management',
      icon: 'ri-user-line',
      label: '사용자 / 부서 / 직급',
      hasSubmenu: true,
      submenu: [
        { id: 'users', label: '사용자 관리', href: '/admin/user/userList' },
        { id: 'departments', label: '부서 관리', href: '/admin/department/departmentList' },
        { id: 'positions', label: '직급 관리', href: '/admin/grade/gradeList' }
      ]
    },
    { id: 'files', icon: 'ri-folder-line', label: '파일 시스템', href: '/admin/file/fileList' },
    { id: 'training', icon: 'ri-brain-line', label: '학습 데이터', href: '/admin/training-data' },
    { id: 'embedding', icon: 'ri-code-s-slash-line', label: '임베딩 설정', href: '/admin/embedding-setting' },
    { id: 'settings', icon: 'ri-settings-3-line', label: '기본 설정', href: '/admin/basic-settings' }
  ];

  const isCurrentPage = (href: string) => {
    return pathname === href;
  };

  const isSubmenuActive = (submenu: any[]) => {
    return submenu.some(item => pathname === item.href);
  };

  return (
    <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-gray-900 text-white flex flex-col overflow-hidden`}>
      <div className="p-4 border-b border-gray-700">
        <Link href="/" className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 flex items-center justify-center">
            <img
              src="https://static.readdy.ai/image/8cfbe681cd6be44b8057581fc3cc12d1/30a4d73a30bae5dc0789582636640c3f.png"
              alt="TiumBot Character"
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="font-['Pacifico'] text-xl text-indigo-400">TiumBot</span>
        </Link>
        <div className="text-sm text-gray-400">관리자 대시보드</div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <div key={item.id}>
              {item.hasSubmenu ? (
                <button
                  onClick={() => {
                    if (onToggleSection) {
                      onToggleSection(item.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                    isSubmenuActive(item.submenu || []) ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <i className={`${item.icon} w-5 h-5 flex items-center justify-center`}></i>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <i className={`ri-arrow-${expandedSection === item.id ? 'up' : 'down'}-s-line w-4 h-4 flex items-center justify-center`}></i>
                </button>
              ) : (
                <Link 
                  href={item.href || '#'}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                    isCurrentPage(item.href || '') ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <i className={`${item.icon} w-5 h-5 flex items-center justify-center`}></i>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )}

              {item.hasSubmenu && expandedSection === item.id && item.submenu && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.submenu.map((subItem) => (
                    <Link
                      key={subItem.id}
                      href={subItem.href}
                      className={`w-full text-left p-2 rounded-lg transition-colors cursor-pointer text-sm block ${
                        isCurrentPage(subItem.href) ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-700 space-y-2">
        <Link href="/chat" className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
          <i className="ri-chat-3-line w-5 h-5 flex items-center justify-center text-gray-400"></i>
          <span className="text-sm text-gray-300">챗봇 테스트</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
        >
          <i className="ri-logout-circle-line w-5 h-5 flex items-center justify-center text-gray-400"></i>
          <span className="text-sm text-gray-300">로그아웃</span>
        </button>
      </div>
    </div>
  );
}
