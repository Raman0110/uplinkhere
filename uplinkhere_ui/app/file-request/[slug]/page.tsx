"use client";

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Download,
  Eye,
  Trash2,
  Share2,
  Copy,
  Calendar,
  Upload,
  FileText,
  Image,
  File,
  Archive,
  Video,
  Music,
  MoreVertical,
  Filter,
  Search,
  Grid3X3,
  List
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { formatFileSize } from '@/lib/utils';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  uploaderName?: string;
  uploaderEmail?: string;
}

export interface Upload {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadedAt: string; // or use Date if parsing
}

export interface User {
  id: string;
  email: string;
  clerkId: string;
}

export interface FileRequest {
  id: string;
  title: string;
  slug: string;
  description: string;
  passwordHash: string;
  expiresAt: string | null; // or Date | null
  user: User;
  uploads: Upload[];
}



export default function FileRequestDetail() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [filerequestDetail, setFileRequestDetail] = useState<FileRequest | null>(null);
  const params = useParams();

  useEffect(() => {
    async function fetchRequestDetail() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/file-request/getFileRequestsFromSlug/${params.slug}`)
        setFileRequestDetail(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchRequestDetail();
  }, [params.slug]);

  const totalUploadSize = filerequestDetail?.uploads.reduce((total, upload) => total + upload.fileSize, 0) ?? 0;


  // Mock data
  const requestData = {
    id: '1',
    title: 'Project Assets Upload',
    description: 'Upload your design files and assets for the new website project',
    slug: 'project-assets',
    expiryDate: new Date('2024-12-31'),
    isPasswordProtected: true,
    createdAt: new Date('2024-07-01'),
    totalUploads: 24,
    totalSize: 156.8
  };

  const uploadedFiles: UploadedFile[] = [
    {
      id: '1',
      name: 'website-mockup-v2.figma',
      size: 15600000,
      type: 'application/octet-stream',
      uploadedAt: new Date('2024-07-20'),
      uploaderName: 'Sarah Johnson',
      uploaderEmail: 'sarah@company.com'
    },
    {
      id: '2',
      name: 'hero-image.png',
      size: 3200000,
      type: 'image/png',
      uploadedAt: new Date('2024-07-19'),
      uploaderName: 'Mike Chen',
      uploaderEmail: 'mike@company.com'
    },
    {
      id: '3',
      name: 'brand-guidelines.pdf',
      size: 8900000,
      type: 'application/pdf',
      uploadedAt: new Date('2024-07-18'),
      uploaderName: 'Emma Davis',
      uploaderEmail: 'emma@company.com'
    },
    {
      id: '4',
      name: 'logo-assets.zip',
      size: 25600000,
      type: 'application/zip',
      uploadedAt: new Date('2024-07-17'),
      uploaderName: 'Alex Rodriguez',
      uploaderEmail: 'alex@company.com'
    },
    {
      id: '5',
      name: 'product-demo.mp4',
      size: 45200000,
      type: 'video/mp4',
      uploadedAt: new Date('2024-07-16'),
      uploaderName: 'Lisa Wang',
      uploaderEmail: 'lisa@company.com'
    },
    {
      id: '6',
      name: 'wireframes-final.sketch',
      size: 12800000,
      type: 'application/octet-stream',
      uploadedAt: new Date('2024-07-15'),
      uploaderName: 'David Kim',
      uploaderEmail: 'david@company.com'
    }
  ];


  const getFileIcon = (type: string) => {
    if (type === "jpeg" || type === "png" || type === "jpg") return Image;
    if (type === "pdf") return FileText;
    if (type.includes('zip') || type.includes('rar')) return Archive;
    return File;
  };

  const getFileColor = (type: string) => {
    if (type === "jpeg" || type === "png" || type === "jpg") return 'bg-green-100 text-green-600';
    if (type === "pdf") return 'bg-red-100 text-red-600';
    return 'bg-blue-100 text-blue-600';
  };

  const filteredFiles = uploadedFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.uploaderName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyShareLink = () => {
    navigator.clipboard.writeText(`https://uplinkhere.com/upload/${requestData.slug}`);
    // In a real app, show a toast notification here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className=" backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <button
                className="cursor-pointer inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
            </Link>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                <Download className="w-4 h-4" />
                <span>Download All</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Request Info Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{filerequestDetail && filerequestDetail.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{filerequestDetail && filerequestDetail.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {filerequestDetail?.expiresAt ?
                  <span className="flex items-center space-x-1 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{`Expires: ${new Date(filerequestDetail?.expiresAt).toLocaleDateString()}`}</span>
                  </span>
                  : null}
                <span className="flex items-center space-x-1 text-blue-600">
                  <Upload className="w-4 h-4" />
                  <span>{filerequestDetail?.uploads.length} files uploaded</span>
                </span>
                <span className="text-gray-500">{formatFileSize(totalUploadSize)} total</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">{filerequestDetail?.uploads.length}</div>
                <div className="text-sm text-blue-600">Total Files</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-green-700">{formatFileSize(totalUploadSize)}</div>
                <div className="text-sm text-green-600">Total Size</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search files or uploaders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-white/80"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>

              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Files Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filerequestDetail?.uploads.map((file) => {
              const FileIcon = getFileIcon(file.filePath.slice(file.filePath.lastIndexOf('.') + 1));
              return (
                <div key={file.id} className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6 hover:shadow-xl transition-all duration-200 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getFileColor(file.filePath.slice(file.filePath.lastIndexOf('.') + 1))}`}>
                      <FileIcon className="w-6 h-6" />
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 truncate" title={file.fileName}>
                    {file.fileName}
                  </h3>

                  <div className="text-sm text-gray-500 space-y-1 mb-4">
                    <div>{formatFileSize(file.fileSize)}</div>
                    <div>{new Date(file.uploadedAt).toLocaleDateString()}</div>
                    {/* {file.uploaderName && (
                      <div className="truncate">{file.uploaderName}</div>
                    )} */}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button className="p-2 text-gray-500 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => {
                        window.open(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${file.filePath}`, "_blank");
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">File</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Uploaded By</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  {filerequestDetail?.uploads.map((file) => {
                    const FileIcon = getFileIcon(file.filePath.slice(file.filePath.lastIndexOf(".") + 1));
                    return (
                      <tr key={file.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileColor(file.filePath.slice(file.filePath.lastIndexOf(".") + 1))}`}>
                              <FileIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{file.fileName}</div>
                              <div className="text-sm text-gray-500">{file.filePath.slice(file.filePath.lastIndexOf(".") + 1)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatFileSize(file.fileSize)}
                        </td>
                        <td className="px-6 py-4">
                          {/* <div className="text-sm text-gray-900">{file.uploaderName}</div>
                          <div className="text-sm text-gray-500">{file.uploaderEmail}</div> */}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => {
                                window.open(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${file.filePath}`, '_blank')
                              }}
                              className="cursor-pointer p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Share File Request</h3>
            <p className="text-gray-600 mb-6">Share this link to allow others to upload files</p>

            <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-xl mb-6">
              <input
                type="text"
                value={`https://uplinkhere.com/upload/${requestData.slug}`}
                readOnly
                className="flex-1 bg-transparent outline-none text-sm text-gray-600"
              />
              <button
                onClick={copyShareLink}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={copyShareLink}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}