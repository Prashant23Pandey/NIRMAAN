import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  Search,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Camera,
  FileCheck,
} from 'lucide-react';
import { api, API_BASE_URL } from '../../services/api';
import { useApp } from '../../context/AppContext';

export const AdminUsersPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || '';

  const { showToast } = useApp();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [selectedStatus, setSelectedStatus] = useState('');

  const getPhotoUrl = (photoPath?: string) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
      return photoPath;
    }
    const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '');
    return `${baseUrl}/${photoPath.replace(/^\//, '')}`;
  };

  const fetchUsers = () => {
    setLoading(true);
    setError(null);
    api
      .get('admin/users.php', {
        search,
        role: selectedRole,
        status: selectedStatus,
      })
      .then((res: any) => {
        if (res.success && Array.isArray(res.users)) {
          setUsers(res.users);
        } else {
          setUsers([]);
        }
      })
      .catch((err) => {
        console.warn('Users API error:', err.message);
        setError('Failed to fetch live users from MySQL database. Please verify backend connection.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRole, selectedStatus]);

  const handleAction = async (userId: number, action: 'suspend' | 'activate' | 'verify') => {
    try {
      await api.post('admin/users.php', { user_id: userId, action });
      showToast(`User status updated: ${action}`, 'success');
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || `Failed to perform action: ${action}`, 'warning');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
            User Directory & Platform Roles
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Live database records from <code className="font-mono text-primary font-bold">nirmaan_db.users</code>. Shows authentic Registration IDs, credentials, and photos.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-charcoal text-xs font-bold shadow-xs hover:border-primary transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Database</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchUsers}
            className="px-3 py-1 rounded-lg bg-white border border-red-300 text-red-700 font-bold hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-soft flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
            placeholder="Search by Registration ID, full name, phone, or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-semibold text-charcoal focus:outline-hidden focus:border-primary"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-charcoal cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="worker">Workers</option>
            <option value="employee">Employees</option>
            <option value="client">Clients / Homeowners</option>
            <option value="contractor">Contractors</option>
            <option value="admin">Administrators</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-charcoal cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-soft overflow-hidden">
        <div className="p-4 bg-[#FAF8F2] border-b border-stone-200 flex items-center justify-between text-xs">
          <span className="font-extrabold text-[#17211F] uppercase tracking-wider text-[11px]">
            Live User Records
          </span>
          <span className="font-mono font-bold text-[#176B5B] bg-[#176B5B]/10 px-2.5 py-0.5 rounded-full">
            {users.length} Users
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[10px] font-extrabold tracking-wider">
              <tr>
                <th className="p-4">Registration ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Profile Photo</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.length === 0 && !loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-stone-400">
                    No users found matching your criteria in MySQL database.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const photoSrc = getPhotoUrl(u.profile_photo || u.avatar);
                  const regId = u.registration_id || u.nirmaan_id || `USR-${u.id}`;
                  const displayName = u.full_name || u.name;
                  const roleStr = (u.role || u.role_slug || '').toUpperCase();

                  return (
                    <tr key={u.id} className="hover:bg-stone-50/80 transition-colors">
                      {/* 1. Registration ID */}
                      <td className="p-4">
                        <span className="font-mono text-xs font-black text-[#176B5B] bg-[#176B5B]/10 px-2.5 py-1 rounded-lg border border-[#176B5B]/20 inline-block">
                          {regId}
                        </span>
                      </td>

                      {/* 2. Name */}
                      <td className="p-4">
                        <span className="font-bold text-charcoal block">{displayName}</span>
                        {u.profession_name && (
                          <span className="text-[10px] text-stone-400 font-semibold block">
                            {u.profession_name}
                          </span>
                        )}
                        {u.document_url && (
                          <a
                            href={u.document_url.startsWith('http') ? u.document_url : `http://localhost/nirmaan/backend/${u.document_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-[#176B5B] hover:underline font-bold mt-1 bg-emerald-50 px-2 py-0.5 rounded-md"
                          >
                            <FileCheck size={11} /> View {u.document_type || 'KYC Document'}
                          </a>
                        )}
                      </td>

                      {/* 3. Role */}
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            roleStr === 'SUPER_ADMIN' || roleStr === 'ADMIN'
                              ? 'bg-amber-100 text-amber-900'
                              : roleStr === 'WORKER'
                              ? 'bg-emerald-100 text-emerald-900'
                              : roleStr === 'EMPLOYEE'
                              ? 'bg-indigo-100 text-indigo-900'
                              : roleStr === 'CONTRACTOR'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-stone-200 text-stone-800'
                          }`}
                        >
                          {u.role_name || roleStr}
                        </span>
                      </td>

                      {/* 4. Email */}
                      <td className="p-4 text-stone-600 font-medium">
                        {u.email ? (
                          <span>{u.email}</span>
                        ) : (
                          <span className="text-stone-300 italic text-[11px]">None</span>
                        )}
                      </td>

                      {/* 5. Phone */}
                      <td className="p-4 font-mono text-[11px] text-charcoal font-semibold">
                        {u.phone}
                      </td>

                      {/* 6. Profile Photo */}
                      <td className="p-4">
                        <div className="w-9 h-9 rounded-xl border border-stone-200 overflow-hidden bg-stone-100 flex items-center justify-center shrink-0">
                          {photoSrc ? (
                            <img
                              src={photoSrc}
                              alt={displayName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="font-black text-xs text-[#176B5B]">
                              {displayName?.charAt(0) || 'U'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 7. Status */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            u.status === 'active'
                              ? 'bg-emerald-50 text-emerald-800'
                              : u.status === 'pending'
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-red-50 text-red-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.status === 'active'
                                ? 'bg-emerald-600'
                                : u.status === 'pending'
                                ? 'bg-amber-500'
                                : 'bg-red-600'
                            }`}
                          />
                          {u.status}
                        </span>
                      </td>

                      {/* 8. Created Date */}
                      <td className="p-4 text-stone-500 text-[11px] font-mono">
                        {u.created_at ? u.created_at.substring(0, 10) : (u.joined_date || '—')}
                      </td>

                      {/* 9. Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {u.status === 'active' ? (
                            <button
                              onClick={() => handleAction(u.id, 'suspend')}
                              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-red-50 hover:text-red-700 text-charcoal font-bold text-[10px] transition-colors cursor-pointer"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAction(u.id, 'activate')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[10px] transition-colors cursor-pointer"
                            >
                              Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
