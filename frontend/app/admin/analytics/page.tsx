
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../../components/AdminSidebar';
import AdminHeader from '../../../components/AdminHeader';

interface AnalyticsData {
  totalConversations: number;
  avgResponseTime: string;
  userSatisfaction: number;
  activeUsers: number;
}

export default function AnalyticsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const router = useRouter();

  const [analytics] = useState<AnalyticsData>({
    totalConversations: 1247,
    avgResponseTime: '1.2초',
    userSatisfaction: 4.8,
    activeUsers: 89,
  });

  useEffect(() => {
    // Guard against environments where localStorage is not available
    try {
/*      const loginStatus = localStorage.getItem('isLoggedIn');
      if (loginStatus !== 'true') {
        router.push('/login');
        return;
      }*/
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Failed to access localStorage:', error);
      // Fallback: treat as not logged in
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleToggleSection = (section: string) => {
    setExpandedSection(prev => (prev === section ? null : section));
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
        <AdminHeader
          title="분석 및 통계"
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-xl border border-gray-200 min-h-full">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">분석 및 통계</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">총 대화 수</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {analytics.totalConversations.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="ri-chat-3-line text-blue-600 text-xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">평균 응답 시간</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.avgResponseTime}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <i className="ri-time-line text-green-600 text-xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">사용자 만족도</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.userSatisfaction}/5</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <i className="ri-star-line text-yellow-600 text-xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">활성 사용자</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.activeUsers}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <i className="ri-user-line text-purple-600 text-xl"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">최근 대화 동향</h3>
                  <div className="text-center py-8">
                    <i className="ri-line-chart-line text-4xl text-gray-400 mb-2"></i>
                    <p className="text-gray-500">차트 데이터가 곧 추가될 예정입니다</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">사용자 활동</h3>
                  <div className="text-center py-8">
                    <i className="ri-bar-chart-line text-4xl text-gray-400 mb-2"></i>
                    <p className="text-gray-500">활동 분석이 곧 추가될 예정입니다</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}
