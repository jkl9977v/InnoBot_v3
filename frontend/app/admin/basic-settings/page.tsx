// /admin/basic-settings
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../../components/AdminSidebar';
import AdminHeader from '../../../components/AdminHeader';

interface BotSettings {
  name: string;
  personality: string;
  language: string;
  responseTime: string;
  maxTokens: number;
  temperature: number;
}

export default function BasicSettingsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const router = useRouter();

  const [settings, setSettings] = useState<BotSettings>({
    name: 'TiumBot',
    personality: '친근하고 도움이 되는',
    language: '한국어',
    responseTime: '빠름',
    maxTokens: 2048,
    temperature: 0.7,
  });

  useEffect(() => {
    try {
      /*const loginStatus = localStorage.getItem('isLoggedIn');
      if (loginStatus !== 'true') {
        router.push('/login');
        return;
      }*/
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Failed to read login status:', error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleSettingsChange = (key: keyof BotSettings, value: string | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    console.log('설정이 저장되었습니다:', settings);
  };

  const handleToggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
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
          title="기본 설정"
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-xl border border-gray-200 min-h-full">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">챗봇 기본 설정</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    챗봇 이름
                  </label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => handleSettingsChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    성격 설정
                  </label>
                  <select
                    value={settings.personality}
                    onChange={(e) => handleSettingsChange('personality', e.target.value)}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  >
                    <option value="친근하고 도움이 되는">친근하고 도움이 되는</option>
                    <option value="전문적이고 공식적인">전문적이고 공식적인</option>
                    <option value="유머러스하고 재미있는">유머러스하고 재미있는</option>
                    <option value="차분하고 신중한">차분하고 신중한</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    주요 언어
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingsChange('language', e.target.value)}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  >
                    <option value="한국어">한국어</option>
                    <option value="영어">영어</option>
                    <option value="다국어">다국어</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    응답 속도
                  </label>
                  <div className="flex space-x-4">
                    {['빠름', '보통', '신중함'].map((speed) => (
                      <label key={speed} className="flex items-center">
                        <input
                          type="radio"
                          name="responseTime"
                          value={speed}
                          checked={settings.responseTime === speed}
                          onChange={(e) => handleSettingsChange('responseTime', e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{speed}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    최대 토큰 수: {settings.maxTokens}
                  </label>
                  <input
                    type="range"
                    min="512"
                    max="4096"
                    step="256"
                    value={settings.maxTokens}
                    onChange={(e) => handleSettingsChange('maxTokens', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>512</span>
                    <span>4096</span>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    창의성 수준: {settings.temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.temperature}
                    onChange={(e) => handleSettingsChange('temperature', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>보수적</span>
                    <span>창의적</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={handleSaveSettings}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  설정 저장
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
