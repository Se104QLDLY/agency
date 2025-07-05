import React from 'react';
import { User, Mail, Phone, MapPin, BadgeDollarSign, Loader2, Building, Type, Code, XCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getAgencyById } from '../../api/agency.api';
import type { Agency } from '../../types/agency.types';
import type { ReactNode } from 'react';

// --- Reusable UI Components ---

interface InfoFieldProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | number | null;
  valueClassName?: string;
}
const InfoField = ({ icon: Icon, label, value, valueClassName = 'text-blue-900 font-bold' }: InfoFieldProps) => (
  <div>
    <label className="text-sm font-semibold text-blue-700 flex items-center gap-2 mb-1">
      <Icon className="h-4 w-4 text-blue-400" />
      {label}
    </label>
    <div className={`px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg shadow-sm flex items-center gap-2 ${valueClassName}`}>
      {value || '---'}
    </div>
  </div>
);

interface ProfileCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: ReactNode;
}
const ProfileCard = ({ title, icon: Icon, children }: ProfileCardProps) => (
  <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-xl h-full">
    <h2 className="text-xl font-bold text-blue-700 flex items-center gap-3 mb-6">
      <Icon className="h-6 w-6 text-blue-500" />
      {title}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      {children}
    </div>
  </div>
);

interface ProfileHeaderProps {
  user: { full_name?: string; id: number; account_role?: string; agency_id?: number };
}
const ProfileHeader = ({ user }: ProfileHeaderProps) => (
  <div className="flex flex-col items-center gap-4 mb-8">
    <div className="relative">
      <div className="w-28 h-28 bg-blue-100 rounded-full flex items-center justify-center ring-2 ring-blue-400 shadow-lg">
        <User className="h-16 w-16 text-blue-500" />
      </div>
    </div>
    <div className="text-center">
      <h1 className="text-3xl font-bold text-blue-800 drop-shadow mb-1">
        {user.full_name}
      </h1>
      <div className="flex items-center justify-center gap-3 mt-2">
        <span className="bg-blue-50 text-blue-700 text-xs font-mono px-3 py-1 rounded-full border border-blue-200">
          User ID: {user.id}
        </span>
        {user.account_role === 'agent' && user.agency_id && (
          <span className="bg-green-50 text-green-700 text-xs font-mono px-3 py-1 rounded-full border border-green-200">
            Agency ID: {user.agency_id}
          </span>
        )}
      </div>
    </div>
  </div>
);

const LoadingSpinner: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
    </div>
);

interface ErrorMessageProps {
  title: string;
  message: string;
}
const ErrorMessage = ({ title, message }: ErrorMessageProps) => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center text-center p-4">
        <div>
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-600">{title}</h1>
            <p className="text-gray-600 mt-2">{message}</p>
        </div>
    </div>
);


// --- Main Page Component ---
const AgencyProfilePage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [agency, setAgency] = React.useState<Agency | null>(null);
  const [agencyLoading, setAgencyLoading] = React.useState(false);
  const [agencyError, setAgencyError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user?.agency_id) {
      setAgencyLoading(true);
      getAgencyById(user.agency_id)
        .then(setAgency)
        .catch(() => setAgencyError('Không thể tải thông tin đại lý.'))
        .finally(() => setAgencyLoading(false));
    } else {
      setAgency(null);
    }
  }, [user?.agency_id]);

  if (isLoading || agencyLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <ErrorMessage title="Không Thể Tải Hồ Sơ" message="Vui lòng đăng nhập để xem thông tin." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-blue-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <ProfileHeader user={user} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* User Profile Card */}
          <div className="lg:col-span-2">
            <ProfileCard title="HỒ SƠ TÀI KHOẢN" icon={User}>
              <div className="md:col-span-2">
                  <InfoField icon={User} label="Tên đăng nhập" value={user.username} />
              </div>
              <InfoField icon={Mail} label="Email" value={user.email} />
              <InfoField icon={Phone} label="Số điện thoại" value={user.phone_number} />
              <div className="md:col-span-2">
                <InfoField icon={MapPin} label="Địa chỉ" value={user.address} />
              </div>
              <div className="md:col-span-2">
                <InfoField icon={BadgeDollarSign} label="Vai trò" value={user.account_role || 'Chưa xác định'} />
              </div>
            </ProfileCard>
          </div>

          {/* Agency Profile Card */}
          <div className="lg:col-span-3">
             <ProfileCard title="HỒ SƠ ĐẠI LÝ" icon={Building}>
                {agencyError && <div className="md:col-span-2 text-red-600 font-semibold"><XCircle className="inline h-5 w-5 mr-2"/>{agencyError}</div>}
                {agency ? (
                    <>
                        <InfoField icon={Building} label="Tên đại lý" value={agency.name} />
                        <InfoField icon={Code} label="Mã đại lý" value={agency.code} valueClassName="font-mono text-amber-500"/>
                        <InfoField icon={Type} label="Loại đại lý" value={agency.type} />
                        <InfoField icon={Mail} label="Email đại lý" value={agency.email} />
                        <div className="md:col-span-2">
                             <InfoField icon={MapPin} label="Địa chỉ đại lý" value={agency.address} />
                        </div>
                        <InfoField icon={Phone} label="SĐT đại lý" value={agency.phone} />
                        <InfoField icon={BadgeDollarSign} label="Hạn mức nợ" value={`${agency.debt_limit?.toLocaleString() || '0'} VNĐ`} />
                        <InfoField icon={BadgeDollarSign} label="Nợ hiện tại" value={`${agency.current_debt?.toLocaleString() || '0'} VNĐ`} valueClassName="text-red-500 font-bold" />
                        <div className="md:col-span-2">
                             <label className="text-sm font-semibold text-blue-700 flex items-center gap-2 mb-1">
                                <CheckCircle className="h-4 w-4 text-blue-400" />
                                Trạng thái
                            </label>
                            <div className={`mt-1 flex items-center gap-2 font-semibold text-lg px-4 py-2 rounded-lg border ${
                                agency.is_active 
                                ? 'bg-green-50 border-green-200 text-green-700' 
                                : 'bg-red-50 border-red-200 text-red-700'
                            }`}>
                                {agency.is_active ? <CheckCircle className="h-5 w-5"/> : <XCircle className="h-5 w-5"/>}
                                <span>{agency.is_active ? 'Đang hoạt động' : 'Ngừng hoạt động'}</span>
                            </div>
                        </div>
                    </>
                ) : (
                    !agencyError && <div className="md:col-span-2 text-gray-400">Không có thông tin đại lý liên kết.</div>
                )}
            </ProfileCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyProfilePage;