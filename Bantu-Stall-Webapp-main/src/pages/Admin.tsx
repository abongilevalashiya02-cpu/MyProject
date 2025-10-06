
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminTabs from '@/components/admin/AdminTabs';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const Admin = () => {
  const { isAdmin } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('experiences');

  return (
    <AdminLayout isAdmin={isAdmin} isLoading={isAdmin === null}>
      <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </AdminLayout>
  );
};

export default Admin;
