
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useUserRoles } from './hooks/useUserRoles';
import RoleAssignmentForm from './RoleAssignmentForm';
import UserRolesList from './UserRolesList';

const AdminRoles = () => {
  const { users, loading, fetchUsers } = useUserRoles();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">User Roles Management</h2>
            <p className="text-gray-600 mb-6">
              Assign roles to users to grant them specific permissions. Admins have full access to manage content.
            </p>
          </div>
          
          {/* Add Role Form */}
          <RoleAssignmentForm onRoleAssigned={fetchUsers} />
          
          {/* Users List */}
          <UserRolesList 
            users={users} 
            loading={loading} 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onRefresh={fetchUsers}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRoles;
