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

  return (
    <Layout>
      {currentPage === 'dashboard' && (
        <Dashboard onCreateRequest={() => setCurrentPage('create')} />
      )}

      {currentPage === 'create' && (
        <CreateRequestForm
          onBack={() => setCurrentPage('dashboard')}
        />
      )}

      {currentPage === 'upload' && (
        <UploadPage
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