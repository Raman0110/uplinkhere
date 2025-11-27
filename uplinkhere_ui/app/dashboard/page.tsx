"use client"

import { useEffect, useState } from 'react';
import { Plus, FolderOpen, Upload, HardDrive } from 'lucide-react';
import { FileRequest } from '../types';
import RequestCard from '@/components/RequestCard';
import toast from 'react-hot-toast';
import axios from 'axios';
import { formatFileSize } from '@/lib/utils';
import Link from 'next/link';

interface createRequestType {
  onCreateRequest: () => void
}

export default function Dashboard({ onCreateRequest }: createRequestType) {


  const [requests, setRequests] = useState<FileRequest[]>([]);
  const [totalCount, setTotalCount] = useState({
    totalUploads: 0, totalFileSize: 0
  });

  useEffect(() => {
    async function fetchFileRequests() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/file-request/getFileRequests`);
        setRequests(response.data.requests);
        setTotalCount({
          totalUploads: response.data.totalUploads,
          totalFileSize: response.data.totalFileSize
        });
      } catch (error) {
        console.error(error);
      }
    }
    fetchFileRequests();
  }, [])


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
              <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
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
              <p className="text-2xl font-bold text-gray-900">{totalCount.totalUploads}</p>
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
              <p className="text-2xl font-bold text-gray-900">{totalCount.totalFileSize ? formatFileSize(totalCount.totalFileSize) : 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <HardDrive className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {requests && requests?.map((request) => (
          <Link href={`/file-request/${request.slug}`} key={request.slug}>
            <RequestCard key={request.id} request={request} />
          </Link>
        ))}
      </div>
    </div>
  );
}