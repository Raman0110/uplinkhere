"use client"

import { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { UploadedFile } from '@/app/types';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

type fileRequestDetail = {
  title: string,
  description: string,
  passwordHash: string | null,
} | null;

export default function UploadPage() {
  const params = useParams();
  const router = useRouter();

  const [request, setRequest] = useState<fileRequestDetail>(null);
  const [passwordProtected, setPasswordProtected] = useState(request?.passwordHash === "" ? false : true);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [password, setPassword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    async function fetchFileRequest() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/file-request/getFileRequestsFromSlug/${params.slug}`)
        setRequest(response.data);
        setPasswordProtected(response.data.passwordHash !== "");
      } catch (error) {
        console.error(error);
      }
    }
    fetchFileRequest();
  }, [params])


  const handleFileSelect = (selectedFiles: FileList) => {
    const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    console.log(files)
    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    files.forEach(file => {
      if (file.file && typeof file.file === 'object' && 'name' in file.file) {
        formData.append('files', file.file, file.name);
      } else {
        console.warn("Invalid file object", file);
      }
    });

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload/${params?.slug}`, formData);
      setUploadProgress(100);
      toast.success("File uploaded successfully");
      router.push("/");
    } catch (error) {
      toast.error("Unable to upload files");
    } finally {
      clearInterval(interval);
      setUploading(false);
    }
  };


  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


  const handlePasswordVerification = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/file-request/checkRequestPassword`, {
        slug: params.slug,
        password: password
      })
      if (response.data.success) {
        setPasswordProtected(false);
      }
    } catch (error) {
      toast.error("Invalid Access Password");
    }
  }

  if (passwordProtected) {
    return (
      <div className="max-w-md mx-auto mt-38">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Password Required</h1>
          <p className="text-gray-600">This upload request is password protected</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Enter Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="outline-none w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={handlePasswordVerification}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Verify Password
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <UploadCloud className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{request && request.title}</h1>
        <p className="text-gray-600">{request && request.description}</p>
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        {/* Drag & Drop Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFileSelect(e.dataTransfer.files);
          }}
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
        >
          <div className="w-12 h-12 bg-gray-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 transition-colors">
            <UploadCloud className="w-6 h-6 text-gray-500 group-hover:text-blue-500 transition-colors" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop files here or click to browse</h3>
          <p className="text-gray-500 text-sm">Support for JPG, PNG, PDF, ZIP files up to 10MB each</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          />
        </div>

        {/* File Preview Area */}
        {files.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Selected Files</h4>
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        <div className="mt-8">
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Uploading...</span>
              <span className="text-sm text-gray-500">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}