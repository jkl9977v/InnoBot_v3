// /admin/file/fileList
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '../../../../components/AdminSidebar';
import AdminHeader from '../../../../components/AdminHeader';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  lastModified: Date;
  permission: string;
  children?: FileItem[];
}

interface FolderTreeNode {
  id: string;
  name: string;
  children?: FolderTreeNode[];
  isOpen: boolean;
  path: string;
}

export default function FileListPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showFolderTree, setShowFolderTree] = useState(true);
  const [selectedPath, setSelectedPath] = useState('D:/InnoBiot_v3/docs');
  const router = useRouter();

  const [files] = useState<FileItem[]>([
    { id: '1', name: '봇데이터 폴더', type: 'folder', lastModified: new Date('2025-01-02'), permission: '읽기/쓰기' },
    { id: '2', name: '대화 연결 docx', type: 'folder', lastModified: new Date('2025-01-02'), permission: '읽기' },
    { id: '3', name: 'ImoECM_P2.pdf', type: 'file', size: '32227 KB', lastModified: new Date('2025-07-02'), permission: '다운로드' },
    { id: '4', name: 'ImoMark_P2.pdf', type: 'file', size: '17871 KB', lastModified: new Date('2025-07-02'), permission: '다운로드' },
    { id: '5', name: 'LizardBackup_P2.pdf', type: 'file', size: '41974 KB', lastModified: new Date('2025-07-02'), permission: '다운로드' },
    { id: '6', name: 'uPouch_P2.pdf', type: 'file', size: '25451 KB', lastModified: new Date('2025-07-02'), permission: '다운로드' },
    { id: '7', name: 'settings - 복사본.csv', type: 'file', size: '1.1 KB', lastModified: new Date('2025-06-10'), permission: '다운로드' }
  ]);

  const [folderTree, setFolderTree] = useState<FolderTreeNode[]>([
    {
      id: 'root',
      name: 'InnoBiot_v3',
      isOpen: true,
      path: 'D:/InnoBiot_v3',
      children: [
        {
          id: 'docs',
          name: 'docs',
          isOpen: true,
          path: 'D:/InnoBiot_v3/docs',
          children: [
            {
              id: 'botdata',
              name: '봇데이터 폴더',
              isOpen: false,
              path: 'D:/InnoBiot_v3/docs/봇데이터 폴더',
              children: [
                {
                  id: 'training',
                  name: '학습자료',
                  isOpen: false,
                  path: 'D:/InnoBiot_v3/docs/봇데이터 폴더/학습자료'
                },
                {
                  id: 'models',
                  name: '모델파일',
                  isOpen: false,
                  path: 'D:/InnoBiot_v3/docs/봇데이터 폴더/모델파일'
                }
              ]
            },
            {
              id: 'chat-docs',
              name: '대화 연결 docx',
              isOpen: false,
              path: 'D:/InnoBiot_v3/docs/대화 연결 docx',
              children: [
                {
                  id: 'templates',
                  name: '템플릿',
                  isOpen: false,
                  path: 'D:/InnoBiot_v3/docs/대화 연결 docx/템플릿'
                }
              ]
            }
          ]
        },
        {
          id: 'config',
          name: 'config',
          isOpen: false,
          path: 'D:/InnoBiot_v3/config',
          children: [
            {
              id: 'system',
              name: 'system',
              isOpen: false,
              path: 'D:/InnoBiot_v3/config/system'
            }
          ]
        },
        {
          id: 'backup',
          name: 'backup',
          isOpen: false,
          path: 'D:/InnoBiot_v3/backup'
        }
      ]
    }
  ]);

  useEffect(() => {
    /*const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus !== 'true') {
      router.push('/login');
      return;
    }*/
    setIsLoggedIn(true);
    setIsLoading(false);
  }, [router]);

  const handleToggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const handleToggleFolder = (nodeId: string) => {
    const toggleNode = (nodes: FolderTreeNode[]): FolderTreeNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, isOpen: !node.isOpen };
        }
        if (node.children) {
          return { ...node, children: toggleNode(node.children) };
        }
        return node;
      });
    };
    setFolderTree(toggleNode(folderTree));
  };

  const handleSelectFolder = (path: string) => {
    setSelectedPath(path);
  };

  const renderFolderTree = (nodes: FolderTreeNode[], level: number = 0) => {
    return nodes.map(node => (
      <div key={node.id}>
        <div 
          className={`flex items-center cursor-pointer hover:bg-gray-100 px-2 py-1 rounded text-sm ${
            selectedPath === node.path ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
          }`}
          style={{ paddingLeft: `${8 + level * 16}px` }}
          onClick={() => handleSelectFolder(node.path)}
        >
          {node.children && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFolder(node.id);
              }}
              className="w-4 h-4 flex items-center justify-center mr-1 text-gray-500 hover:text-gray-700"
            >
              <i className={`ri-arrow-${node.isOpen ? 'down' : 'right'}-s-line text-xs`}></i>
            </button>
          )}
          <i className={`ri-folder${node.children ? '-open' : ''}-line text-yellow-600 mr-2`}></i>
          <span className="truncate">{node.name}</span>
        </div>
        {node.isOpen && node.children && (
          <div>
            {renderFolderTree(node.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR') + ' ' + date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSearch = () => {
    console.log('Searching files:', searchQuery);
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
          title="파일 시스템"
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className="flex-1 overflow-hidden p-6">
          <div className="bg-white rounded-xl border border-gray-200 h-full flex">
            {/* 폴더 트리 */}
            {showFolderTree && (
              <div className="w-80 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                    <i className="ri-folder-line w-4 h-4 flex items-center justify-center mr-2 text-yellow-600"></i>
                    폴더 구조
                  </h3>
                  <button
                    onClick={() => setShowFolderTree(false)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
                  >
                    <i className="ri-close-line w-4 h-4 flex items-center justify-center"></i>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  {renderFolderTree(folderTree)}
                </div>
              </div>
            )}

            {/* 메인 컨텐츠 */}
            <div className="flex-1 flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {!showFolderTree && (
                      <button
                        onClick={() => setShowFolderTree(true)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-800"
                      >
                        <i className="ri-folder-line w-5 h-5 flex items-center justify-center"></i>
                      </button>
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <i className="ri-folder-line w-5 h-5 flex items-center justify-center mr-2 text-gray-600"></i>
                      {selectedPath}
                    </h3>
                  </div>
                  <Link href="/admin/file/addAccessRule" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap text-sm">
                    <i className="ri-add-line w-4 h-4 flex items-center justify-center mr-2 inline-flex"></i>
                    접근권한 설정
                  </Link>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <label>정렬:</label>
                      <select className="px-2 py-1 border border-gray-300 rounded text-sm pr-8">
                        <option>이름순</option>
                        <option>수정일순</option>
                        <option>크기순</option>
                      </select>
                      <label>확장자:</label>
                      <select className="px-2 py-1 border border-gray-300 rounded text-sm pr-8">
                        <option>전체</option>
                        <option>PDF</option>
                        <option>DOC</option>
                        <option>CSV</option>
                        <option>폴더</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label>검색:</label>
                      <input
                        type="text"
                        placeholder=""
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm w-48"
                      />
                      <button
                        onClick={handleSearch}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm transition-colors cursor-pointer"
                      >
                        검색
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label>보기:</label>
                    <select className="px-2 py-1 border border-gray-300 rounded text-sm pr-8">
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                    </select>
                    <div className="flex items-center space-x-1 ml-4">
                      <button
                        onClick={() => setViewMode('table')}
                        className={`p-2 rounded transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                      >
                        <i className="ri-list-unordered w-4 h-4 flex items-center justify-center"></i>
                      </button>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                      >
                        <i className="ri-grid-line w-4 h-4 flex items-center justify-center"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {viewMode === 'table' ? (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          파일 / 폴더명
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          크기
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          수정일
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          권한
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          작업
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {files.map((file) => (
                        <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <i className={`${file.type === 'folder' ? 'ri-folder-fill text-yellow-500' : 'ri-file-text-fill text-gray-400'} text-lg`}></i>
                              <span className="text-sm font-medium text-gray-900">{file.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {file.size || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(file.lastModified)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
                              {file.permission}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <button className="text-indigo-600 hover:text-indigo-900 transition-colors cursor-pointer">
                                자세히
                              </button>
                              <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                                <i className="ri-more-line w-4 h-4 flex items-center justify-center"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {files.map((file) => (
                        <div key={file.id} className="group cursor-pointer">
                          <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                            <div className="flex flex-col items-center text-center">
                              <i className={`${file.type === 'folder' ? 'ri-folder-fill text-yellow-500' : 'ri-file-text-fill text-gray-400'} text-3xl mb-2`}></i>
                              <p className="text-sm font-medium text-gray-900 truncate w-full">{file.name}</p>
                              <p className="text-xs text-gray-500 mt-1">{file.size || formatDate(file.lastModified)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>총 {files.length}개 항목</span>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer">이전</button>
                    <span>1 / 1</span>
                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer">다음</button>
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
