"use client"

import { useState } from 'react';
import { Plus, FolderOpen, Upload, HardDrive } from 'lucide-react';
import { FileRequest } from '../types';
import RequestCard from '@/components/RequestCard';

interface createRequestType {
  onCreateRequest: () => void
}

export default function Dashboard({ onCreateRequest }: createRequestType) {
  const [requests] = useState<FileRequest[]>([
    {
      id: '1',
      title: 'Project Assets Upload',
      description: 'Upload your design files and assets for the new website project',
      slug: 'project-assets',
      expiryDate: new Date('2024-12-31'),
      uploadCount: 23,
      isActive: true,
      isPasswordProtected: true,
    },
    {
      id: '2',
      title: 'Resume Collection',
      description: 'Submit your resume and cover letter for the developer position',
      slug: 'resume-collection',
      expiryDate: new Date('2024-07-26'),
      uploadCount: 7,
      isActive: true,
      isPasswordProtected: false,
    },
  ]);


  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 p-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">File Requests</h1>
          <p className="text-gray-600">Manage and track your file upload requests</p>
        </div>
        <button
          onClick={onCreateRequest}
          className="cursor-pointer mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Request</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Requests</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Uploads</p>
              <p className="text-2xl font-bold text-gray-900">347</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900">2.4GB</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <HardDrive className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
    </div>
  );
}