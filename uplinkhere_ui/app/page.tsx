"use client";

import { useState } from 'react';
import Layout from '../components/Layout';
import CreateRequestForm from '../components/CreateRequestForm';
import Dashboard from './dashboard/page';
import UploadPage from './r/[slug]/page';
import SuccessPage from './success/page';

type Page = 'dashboard' | 'create' | 'upload' | 'success';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const mockRequest = {
    title: 'Project Assets Upload',
    description: 'Upload your design files and assets for the new website project',
    isPasswordProtected: true,
  };

  return (
    <Layout>
      {currentPage === 'dashboard' && (
        <Dashboard onCreateRequest={() => setCurrentPage('create')} />
      )}

      {currentPage === 'create' && (
        <CreateRequestForm
          onBack={() => setCurrentPage('dashboard')}
          onSubmit={(data) => {
            console.log('Form submitted:', data);
            setCurrentPage('dashboard');
          }}
        />
      )}

      {currentPage === 'upload' && (
        <UploadPage
          request={mockRequest}
          onSuccess={() => setCurrentPage('success')}
        />
      )}

      {currentPage === 'success' && (
        <SuccessPage
          onUploadMore={() => setCurrentPage('upload')}
          onClose={() => setCurrentPage('dashboard')}
        />
      )}
    </Layout>
  );
}