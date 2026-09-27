import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  HardHat,
  Home,
  Building2,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Phone,
  Mail,
  User,
  MapPin,
  Camera,
  X,
  Copy,
  Check,
  Building,
  UploadCloud,
  FileText,
  FileCheck,
} from 'lucide-react';
import { Button, Input, Select, Badge, Alert, Avatar } from '../components/ui';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

type RegistrationRole = 'select' | 'worker' | 'employee' | 'homeowner' | 'contractor';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRoleParam = searchParams.get('role');

  const { setRole, showToast, refreshAuthUser } = useApp();

  const [selectedRole, setSelectedRole] = useState<RegistrationRole>(
    initialRoleParam === 'worker'
      ? 'worker'
      : initialRoleParam === 'employee'
      ? 'employee'
      : initialRoleParam === 'homeowner'
      ? 'homeowner'
      : initialRoleParam === 'contractor'
      ? 'contractor'
      : 'select'
  );

  // Success State for Real Backend-Generated ID
  const [createdUser, setCreatedUser] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Profile Photo State per role
  const [workerPhoto, setWorkerPhoto] = useState<File | null>(null);
  const [workerPhotoPreview, setWorkerPhotoPreview] = useState<string | null>(null);

  // Document / KYC Upload State for Worker
  const [workerDocumentFile, setWorkerDocumentFile] = useState<File | null>(null);
  const [workerDocumentPreview, setWorkerDocumentPreview] = useState<string | null>(null);
  const [workerDocumentName, setWorkerDocumentName] = useState<string>('');

  const [employeePhoto, setEmployeePhoto] = useState<File | null>(null);
  const [employeePhotoPreview, setEmployeePhotoPreview] = useState<string | null>(null);

  const [homeownerPhoto, setHomeownerPhoto] = useState<File | null>(null);
  const [homeownerPhotoPreview, setHomeownerPhotoPreview] = useState<string | null>(null);

  const [contractorPhoto, setContractorPhoto] = useState<File | null>(null);
  const [contractorPhotoPreview, setContractorPhotoPreview] = useState<string | null>(null);
  const [contractorDocumentFile, setContractorDocumentFile] = useState<File | null>(null);
  const [contractorDocumentName, setContractorDocumentName] = useState<string>('');

  // Worker 7-Step State
  const [workerStep, setWorkerStep] = useState(1);
  const [workerData, setWorkerData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    profession_id: 1,
    profession_slug: 'mason',
    skill_ids: [] as number[],
    years_experience: 5,
    expected_daily_wage: 850,
    city: 'Noida NCR',
    work_radius_km: 15,
    document_type: 'Aadhaar Card',
    document_number: '',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=400&q=80',
  });

  // Employee State
  const [employeeData, setEmployeeData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Site Governance & Quality',
    designation: 'Field Inspection Engineer',
    employee_code: '',
    city: 'Noida NCR',
  });

  // Homeowner State
  const [homeownerData, setHomeownerData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: 'Noida NCR',
    address: '',
    project_title: '',
    project_category: 'Renovation',
    project_budget: 50000,
  });

  // Contractor State
  const [contractorData, setContractorData] = useState({
    name: '',
    company_name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    gst_number: '',
    license_number: '',
    city: 'Delhi NCR',
    team_size: 15,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Taxonomy from MySQL
  const [professions, setProfessions] = useState<any[]>([]);
  const [availableSkills, setAvailableSkills] = useState<any[]>([]);

  useEffect(() => {
    // Load professions from backend
    api
      .get<{ professions: any[] }>('professions/list.php')
      .then((res) => {
        if (res.professions && res.professions.length > 0) {
          setProfessions(res.professions);
        }
      })
      .catch(() => {
        setProfessions([
          { id: 1, name: 'Mason', slug: 'mason' },
          { id: 2, name: 'Electrician', slug: 'electrician' },
          { id: 3, name: 'Plumber', slug: 'plumber' },
          { id: 4, name: 'Carpenter', slug: 'carpenter' },
          { id: 5, name: 'Painter', slug: 'painter' },
          { id: 6, name: 'Tile Worker', slug: 'tile-worker' },
          { id: 7, name: 'Welder', slug: 'welder' },
          { id: 8, name: 'HVAC Technician', slug: 'hvac' },
          { id: 9, name: 'Roofer', slug: 'roofer' },
          { id: 10, name: 'Flooring Worker', slug: 'flooring' },
          { id: 11, name: 'General Helper', slug: 'helper' },
        ]);
      });
  }, []);

  // When profession changes, load its skills
  useEffect(() => {
    if (selectedRole === 'worker' && workerData.profession_id) {
      api
        .get<{ skills: any[] }>(`skills/list.php?profession_id=${workerData.profession_id}`)
        .then((res) => {
          if (res.skills) {
            setAvailableSkills(res.skills);
            setWorkerData((prev) => ({
              ...prev,
              skill_ids: res.skills.slice(0, 3).map((s: any) => s.id),
            }));
          }
        })
        .catch(() => {
          setAvailableSkills([
            { id: 1, name: 'General Trade Work' },
            { id: 2, name: 'Surface Preparation' },
            { id: 3, name: 'Precision Assembly' },
          ]);
        });
    }
  }, [selectedRole, workerData.profession_id]);

  // Photo change helper with validation
  const handlePhotoSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
    setPreview: (url: string | null) => void
  ) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5 MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Profile photo exceeds maximum allowed size of 5 MB.');
      e.target.value = '';
      return;
    }

    // Validate image format
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a JPG, JPEG, PNG, or WEBP image.');
      e.target.value = '';
      return;
    }

    setFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const handleCopyId = () => {
    if (createdUser?.registration_id) {
      navigator.clipboard.writeText(createdUser.registration_id);
      setCopiedId(true);
      showToast('Registration ID copied to clipboard!', 'success');
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  // Worker Submission
  const handleWorkerSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('role', 'worker');
      formData.append('full_name', workerData.name);
      formData.append('phone', workerData.phone);
      formData.append('email', workerData.email);
      formData.append('password', workerData.password);
      formData.append('profession_id', String(workerData.profession_id));
      formData.append('years_experience', String(workerData.years_experience));
      formData.append('expected_daily_wage', String(workerData.expected_daily_wage));
      formData.append('city', workerData.city);
      formData.append('document_type', workerData.document_type);
      formData.append('document_number', workerData.document_number);

      workerData.skill_ids.forEach((sid) => {
        formData.append('skills[]', String(sid));
      });

      if (workerPhoto) {
        formData.append('profile_photo', workerPhoto);
      }

      if (workerDocumentFile) {
        formData.append('document_file', workerDocumentFile);
      }

      const res = await api.post<any>('auth/register.php', formData);

      if (res.token) api.setToken(res.token);
      if (res.user) {
        localStorage.setItem('nirmaan_user', JSON.stringify(res.user));
        setCreatedUser(res.user);
        await refreshAuthUser();
      }

      setRole('worker');
      showToast('🎉 Your Nirmaan Work Passport is ready!', 'success');
      setWorkerStep(7); // Show congratulation / registration ID screen
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Employee Submission
  const handleEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeData.password !== employeeData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('role', 'employee');
      formData.append('full_name', employeeData.name);
      formData.append('phone', employeeData.phone);
      formData.append('email', employeeData.email);
      formData.append('password', employeeData.password);
      formData.append('department', employeeData.department);
      formData.append('designation', employeeData.designation);
      formData.append('employee_code', employeeData.employee_code);
      formData.append('city', employeeData.city);

      if (employeePhoto) {
        formData.append('profile_photo', employeePhoto);
      }

      const res = await api.post<any>('auth/register.php', formData);

      if (res.token) api.setToken(res.token);
      if (res.user) {
        localStorage.setItem('nirmaan_user', JSON.stringify(res.user));
        setCreatedUser(res.user);
      }

      setRole('admin');
      showToast('Employee account registered successfully!', 'success');
    } catch (err: any) {
      setError(err.message || 'Employee registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Homeowner Submission
  const handleHomeownerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (homeownerData.password !== homeownerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('role', 'client');
      formData.append('full_name', homeownerData.name);
      formData.append('phone', homeownerData.phone);
      formData.append('email', homeownerData.email);
      formData.append('password', homeownerData.password);
      formData.append('city', homeownerData.city);
      formData.append('address', homeownerData.address);
      formData.append('project_title', homeownerData.project_title);
      formData.append('project_category', homeownerData.project_category);
      formData.append('project_budget', String(homeownerData.project_budget));

      if (homeownerPhoto) {
        formData.append('profile_photo', homeownerPhoto);
      }

      const res = await api.post<any>('auth/register.php', formData);

      if (res.token) api.setToken(res.token);
      if (res.user) {
        localStorage.setItem('nirmaan_user', JSON.stringify(res.user));
        setCreatedUser(res.user);
      }

      setRole('homeowner');
      showToast('Welcome to Nirmaan! Your homeowner account is active.', 'success');
    } catch (err: any) {
      setError(err.message || 'Homeowner registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Contractor Submission
  const handleContractorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contractorData.password !== contractorData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('role', 'contractor');
      formData.append('full_name', contractorData.name);
      formData.append('company_name', contractorData.company_name);
      formData.append('phone', contractorData.phone);
      formData.append('email', contractorData.email);
      formData.append('password', contractorData.password);
      formData.append('gst_number', contractorData.gst_number);
      formData.append('license_number', contractorData.license_number);
      formData.append('city', contractorData.city);
      formData.append('team_size', String(contractorData.team_size));

      if (contractorPhoto) {
        formData.append('profile_photo', contractorPhoto);
      }

      if (contractorDocumentFile) {
        formData.append('document_file', contractorDocumentFile);
      }

      const res = await api.post<any>('auth/register.php', formData);

      if (res.token) api.setToken(res.token);
      if (res.user) {
        localStorage.setItem('nirmaan_user', JSON.stringify(res.user));
        setCreatedUser(res.user);
      }

      setRole('contractor');
      showToast('Contractor account created successfully!', 'success');
    } catch (err: any) {
      setError(err.message || 'Contractor registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Component: Optional Profile Photo Upload with Image Preview
  const ProfilePhotoUpload: React.FC<{
    file: File | null;
    preview: string | null;
    onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
  }> = ({ file, preview, onSelect, onClear }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
      <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-stone-200">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-[#17211F] flex items-center gap-1.5">
            <Camera size={15} className="text-[#176B5B]" />
            <span>Profile Picture</span>
          </label>
          <span className="text-[11px] font-semibold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
            Optional
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl border-2 border-dashed border-stone-300 flex items-center justify-center bg-white overflow-hidden shrink-0 shadow-2xs">
            {preview ? (
              <img src={preview} alt="Profile preview" className="w-full h-full object-cover" />
            ) : (
              <Camera size={22} className="text-stone-300" />
            )}
          </div>

          <div className="flex-1 space-y-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={onSelect}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:border-[#176B5B] text-[#17211F] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                {preview ? 'Change Image' : 'Choose Image'}
              </button>
              {preview && (
                <button
                  type="button"
                  onClick={onClear}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Remove image"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            <p className="text-[10px] text-stone-400">
              Allowed: JPG, PNG, WEBP (Max 5 MB)
            </p>
          </div>
        </div>
      </div>
    );
  };

  // SUCCESS SCREEN (Visible when createdUser is set)
  if (createdUser) {
    const isWorker = createdUser.role_normalized === 'worker' || createdUser.role === 'WORKER';
    const isHomeowner = createdUser.role_normalized === 'client' || createdUser.role === 'HOMEOWNER';
    const isContractor = createdUser.role_normalized === 'contractor' || createdUser.role === 'CONTRACTOR';

    return (
      <div className="min-h-screen bg-[#F7F5EF] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto w-full bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-elevated text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#2E8B57] flex items-center justify-center mx-auto shadow-soft">
            <CheckCircle2 size={44} />
          </div>

          <div>
            <span className="text-[11px] font-black tracking-widest text-[#176B5B] uppercase block mb-1">
              NATIONAL WORKFORCE REGISTRY
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#17211F] tracking-tight">
              Registration Successful!
            </h2>
            <p className="text-sm text-stone-600 mt-1 font-medium">
              Welcome, <strong className="text-[#17211F]">{createdUser.full_name || createdUser.name}</strong>.
            </p>
          </div>

          {/* REAL Registration ID Box */}
          <div className="p-6 bg-[#FAF8F2] rounded-2xl border-2 border-[#176B5B]/30 space-y-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
              Your Official Registration ID
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#176B5B] tracking-wider select-all">
              {createdUser.registration_id}
            </div>
            <button
              type="button"
              onClick={handleCopyId}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-300 text-xs font-bold text-[#17211F] hover:border-[#176B5B] hover:text-[#176B5B] shadow-2xs transition-colors cursor-pointer"
            >
              {copiedId ? (
                <>
                  <Check size={14} className="text-[#2E8B57]" />
                  <span className="text-[#2E8B57]">ID Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Registration ID</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-stone-500 font-medium">
              Please save this ID for future login and official verification.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => {
                if (isWorker) {
                  navigate(`/worker/${createdUser.profession_slug || 'mason'}`);
                } else if (isHomeowner) {
                  navigate('/homeowner/home');
                } else if (isContractor) {
                  navigate('/contractor/dashboard');
                } else {
                  navigate('/admin/dashboard');
                }
              }}
            >
              Proceed to Dashboard
            </Button>

            <Link
              to="/login"
              className="block text-center text-xs font-bold text-stone-500 hover:text-[#176B5B] pt-1"
            >
              Sign In to Another Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Return to Home link */}
      <div className="max-w-3xl mx-auto w-full mb-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-[#176B5B] flex items-center justify-center text-[#F4B942] font-black text-sm group-hover:scale-105 transition-transform">
            N
          </div>
          <span className="font-black text-lg tracking-tight text-[#17211F]">NIRMAAN</span>
        </Link>
        <Link
          to="/login"
          className="text-xs font-bold text-[#176B5B] hover:underline flex items-center gap-1"
        >
          <span>Already registered? Log In</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="max-w-3xl mx-auto w-full bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-elevated">
        {error && (
          <Alert variant="error" className="mb-6" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* SCREEN 1: Role Selection ("What are you looking for?") */}
        {selectedRole === 'select' && (
          <div className="space-y-8">
            <div className="text-center max-w-lg mx-auto">
              <span className="text-xs font-black tracking-widest text-[#176B5B] uppercase block mb-1">
                JOIN THE NATIONAL REGISTRY
              </span>
              <h2 className="text-3xl font-black text-[#17211F] tracking-tight">
                What are you looking for?
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-2 font-medium">
                Select your role to start your customized registration experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Option 1: Worker */}
              <div
                onClick={() => setSelectedRole('worker')}
                className="p-5 rounded-2xl border-2 border-stone-200 hover:border-[#176B5B] bg-[#FAF8F2] hover:bg-white hover:shadow-soft transition-all duration-200 cursor-pointer text-center group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#176B5B]/10 text-[#176B5B] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <HardHat size={24} />
                  </div>
                  <span className="text-[10px] font-black tracking-wider uppercase text-stone-400 block mb-0.5">
                    WORK
                  </span>
                  <h3 className="text-base font-black text-[#17211F] mb-1">Skilled Worker</h3>
                  <p className="text-xs text-stone-500 font-medium leading-relaxed">
                    Build a verified digital Work Passport & find jobs.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-200 text-xs font-bold text-[#176B5B] flex items-center justify-center gap-1">
                  <span>Create Passport</span>
                  <ArrowRight size={13} />
                </div>
              </div>

              {/* Option 2: Employee */}
              <div
                onClick={() => setSelectedRole('employee')}
                className="p-5 rounded-2xl border-2 border-stone-200 hover:border-[#176B5B] bg-[#FAF8F2] hover:bg-white hover:shadow-soft transition-all duration-200 cursor-pointer text-center group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Briefcase size={24} />
                  </div>
                  <span className="text-[10px] font-black tracking-wider uppercase text-stone-400 block mb-0.5">
                    OPERATIONS
                  </span>
                  <h3 className="text-base font-black text-[#17211F] mb-1">Employee</h3>
                  <p className="text-xs text-stone-500 font-medium leading-relaxed">
                    Manage platform operations, site inspection & KYC.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-200 text-xs font-bold text-[#176B5B] flex items-center justify-center gap-1">
                  <span>Join Operations</span>
                  <ArrowRight size={13} />
                </div>
              </div>

              {/* Option 3: Homeowner */}
              <div
                onClick={() => setSelectedRole('homeowner')}
                className="p-5 rounded-2xl border-2 border-stone-200 hover:border-[#176B5B] bg-[#FAF8F2] hover:bg-white hover:shadow-soft transition-all duration-200 cursor-pointer text-center group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#17211F]/10 text-[#17211F] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Home size={24} />
                  </div>
                  <span className="text-[10px] font-black tracking-wider uppercase text-stone-400 block mb-0.5">
                    HIRE
                  </span>
                  <h3 className="text-base font-black text-[#17211F] mb-1">Homeowner</h3>
                  <p className="text-xs text-stone-500 font-medium leading-relaxed">
                    Hire verified artisans for home building & repair.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-200 text-xs font-bold text-[#176B5B] flex items-center justify-center gap-1">
                  <span>Start Project</span>
                  <ArrowRight size={13} />
                </div>
              </div>

              {/* Option 4: Contractor */}
              <div
                onClick={() => setSelectedRole('contractor')}
                className="p-5 rounded-2xl border-2 border-stone-200 hover:border-[#176B5B] bg-[#FAF8F2] hover:bg-white hover:shadow-soft transition-all duration-200 cursor-pointer text-center group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Building2 size={24} />
                  </div>
                  <span className="text-[10px] font-black tracking-wider uppercase text-stone-400 block mb-0.5">
                    MANAGE TEAMS
                  </span>
                  <h3 className="text-base font-black text-[#17211F] mb-1">Contractor</h3>
                  <p className="text-xs text-stone-500 font-medium leading-relaxed">
                    Manage site crews, muster rolls & milestone jobs.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-200 text-xs font-bold text-[#176B5B] flex items-center justify-center gap-1">
                  <span>Manage Crew</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WORKER REGISTRATION (7-STEP EXPERIENCE) */}
        {selectedRole === 'worker' && (
          <div className="space-y-6">
            {/* Header with back button */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <button
                type="button"
                onClick={() => {
                  if (workerStep > 1) setWorkerStep(workerStep - 1);
                  else setSelectedRole('select');
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-[#176B5B] cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
              <div className="text-right">
                <span className="text-xs font-black text-[#176B5B]">
                  STEP {workerStep} OF 6
                </span>
                <span className="text-[10px] text-stone-400 block">Artisan Onboarding</span>
              </div>
            </div>

            {/* Step 1: Basic Information + Optional Photo */}
            {workerStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-[#17211F]">Basic Information</h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Your official name and details will appear on your verified Nirmaan Work Passport.
                  </p>
                </div>

                <Input
                  label="Full Name (As per Aadhaar)"
                  value={workerData.name}
                  onChange={(e) => setWorkerData({ ...workerData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  icon={<User size={16} />}
                  required
                />

                <Input
                  label="Mobile Number (Used for Login & Site Alerts)"
                  value={workerData.phone}
                  onChange={(e) => setWorkerData({ ...workerData, phone: e.target.value })}
                  placeholder="e.g. 9876543210"
                  icon={<Phone size={16} />}
                  required
                />

                <Input
                  label="Email Address (Optional)"
                  type="email"
                  value={workerData.email}
                  onChange={(e) => setWorkerData({ ...workerData, email: e.target.value })}
                  placeholder="e.g. ramesh@gmail.com"
                  icon={<Mail size={16} />}
                />

                {/* Optional Profile Photo */}
                <ProfilePhotoUpload
                  file={workerPhoto}
                  preview={workerPhotoPreview}
                  onSelect={(e) => handlePhotoSelect(e, setWorkerPhoto, setWorkerPhotoPreview)}
                  onClear={() => {
                    setWorkerPhoto(null);
                    setWorkerPhotoPreview(null);
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Create Password"
                    type="password"
                    value={workerData.password}
                    onChange={(e) => setWorkerData({ ...workerData, password: e.target.value })}
                    placeholder="Min 6 characters"
                    icon={<Lock size={16} />}
                    required
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    value={workerData.confirmPassword}
                    onChange={(e) =>
                      setWorkerData({ ...workerData, confirmPassword: e.target.value })
                    }
                    placeholder="Repeat password"
                    icon={<Lock size={16} />}
                    required
                  />
                </div>

                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  disabled={!workerData.name || !workerData.phone || !workerData.password}
                  onClick={() => {
                    if (workerData.password !== workerData.confirmPassword) {
                      setError('Passwords do not match');
                      return;
                    }
                    setError(null);
                    setWorkerStep(2);
                  }}
                >
                  Continue to Profession Selection
                </Button>
              </div>
            )}

            {/* Step 2: Profession Selection */}
            {workerStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-[#17211F]">Select Your Primary Trade</h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Your trade determines matching job alerts, wage benchmarks, and client discovery.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
                  {professions.map((p) => {
                    const isSelected = workerData.profession_id === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() =>
                          setWorkerData({
                            ...workerData,
                            profession_id: p.id,
                            profession_slug: p.slug,
                          })
                        }
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#176B5B] bg-[#176B5B]/10 font-bold text-[#176B5B]'
                            : 'border-stone-200 bg-[#FAF8F2] hover:bg-white text-[#17211F]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black">{p.name}</span>
                          {isSelected && <CheckCircle2 size={16} className="text-[#176B5B]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Button variant="primary" size="md" fullWidth onClick={() => setWorkerStep(3)}>
                  Continue to Trade Skills
                </Button>
              </div>
            )}

            {/* Step 3: Trade Skills */}
            {workerStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-[#17211F]">
                    Select Your Verified Skills
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Select the micro-skills you have hands-on site mastery in.
                  </p>
                </div>

                <div className="space-y-2">
                  {availableSkills.map((s) => {
                    const isChecked = workerData.skill_ids.includes(s.id);
                    return (
                      <label
                        key={s.id}
                        className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'border-[#176B5B] bg-[#176B5B]/5 text-[#176B5B] font-bold'
                            : 'border-stone-200 hover:bg-stone-50 text-[#17211F]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setWorkerData({
                                  ...workerData,
                                  skill_ids: [...workerData.skill_ids, s.id],
                                });
                              } else {
                                setWorkerData({
                                  ...workerData,
                                  skill_ids: workerData.skill_ids.filter((id) => id !== s.id),
                                });
                              }
                            }}
                            className="rounded text-[#176B5B] focus:ring-[#176B5B]"
                          />
                          <span className="text-sm">{s.name}</span>
                        </div>
                        <Badge variant="outline" size="sm">
                          Verified Skill
                        </Badge>
                      </label>
                    );
                  })}
                </div>

                <Button variant="primary" size="md" fullWidth onClick={() => setWorkerStep(4)}>
                  Continue to Experience & Wages
                </Button>
              </div>
            )}

            {/* Step 4: Experience & Wages */}
            {workerStep === 4 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-[#17211F]">Experience & Rates</h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Set your fair daily wage expectation and operating city.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Years of Experience"
                    type="number"
                    value={workerData.years_experience}
                    onChange={(e) =>
                      setWorkerData({ ...workerData, years_experience: Number(e.target.value) })
                    }
                    min={1}
                    max={40}
                    required
                  />

                  <Input
                    label="Expected Daily Wage (₹ / Day)"
                    type="number"
                    value={workerData.expected_daily_wage}
                    onChange={(e) =>
                      setWorkerData({ ...workerData, expected_daily_wage: Number(e.target.value) })
                    }
                    min={400}
                    max={3000}
                    required
                  />
                </div>

                <Input
                  label="Primary City / Operating District"
                  value={workerData.city}
                  onChange={(e) => setWorkerData({ ...workerData, city: e.target.value })}
                  placeholder="e.g. Noida / Greater Noida"
                  icon={<MapPin size={16} />}
                  required
                />

                <Button variant="primary" size="md" fullWidth onClick={() => setWorkerStep(5)}>
                  Continue to Verification Documents
                </Button>
              </div>
            )}

            {/* Step 5: Verification Documents */}
            {workerStep === 5 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-[#17211F]">KYC & Verification</h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Verification earns you the green trust shield and unlocks direct homeowner contracts.
                  </p>
                </div>

                <Select
                  label="Identification Document Type"
                  options={[
                    { value: 'Aadhaar Card', label: 'Aadhaar Card (National ID)' },
                    { value: 'Voter ID', label: 'Election Commission Voter ID' },
                    { value: 'Labour Card', label: 'State Building & Construction Labour Card' },
                    { value: 'ITI Certificate', label: 'ITI / Skill India Trade Certificate' },
                  ]}
                  value={workerData.document_type}
                  onChange={(e) =>
                    setWorkerData({ ...workerData, document_type: e.target.value })
                  }
                />

                <Input
                  label="Document / ID Number"
                  value={workerData.document_number}
                  onChange={(e) =>
                    setWorkerData({ ...workerData, document_number: e.target.value })
                  }
                  placeholder="e.g. 5482 9912 3410"
                />

                {/* Upload KYC Document / File */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-700">
                      Upload Document Proof (Photo or PDF)
                    </label>
                    <span className="text-[11px] font-semibold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                      Optional • Stored in Database
                    </span>
                  </div>

                  {!workerDocumentFile ? (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-stone-300 hover:border-[#176B5B] rounded-xl p-4 bg-stone-50/70 hover:bg-[#176B5B]/5 cursor-pointer transition-all group">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              showToast('Document file exceeds 5MB limit', 'warning');
                              return;
                            }
                            setWorkerDocumentFile(file);
                            setWorkerDocumentName(file.name);
                            if (file.type.startsWith('image/')) {
                              const reader = new FileReader();
                              reader.onloadend = () => setWorkerDocumentPreview(reader.result as string);
                              reader.readAsDataURL(file);
                            } else {
                              setWorkerDocumentPreview(null);
                            }
                          }
                        }}
                      />
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#176B5B] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <UploadCloud size={20} />
                      </div>
                      <span className="text-xs font-bold text-stone-800">
                        Choose {workerData.document_type || 'ID document'} file to upload
                      </span>
                      <span className="text-[11px] text-stone-500 mt-0.5">
                        JPG, PNG, WEBP or PDF (up to 5 MB) • Stored securely in database
                      </span>
                    </label>
                  ) : (
                    <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {workerDocumentPreview ? (
                          <img
                            src={workerDocumentPreview}
                            alt="Document Preview"
                            className="w-12 h-12 rounded-lg object-cover border border-emerald-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-emerald-100 text-[#176B5B] flex items-center justify-center">
                            <FileText size={24} />
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-stone-900 truncate max-w-[220px]">
                            {workerDocumentName || workerDocumentFile.name}
                          </p>
                          <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                            <CheckCircle2 size={12} /> Ready to save in database • {(workerDocumentFile.size / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setWorkerDocumentFile(null);
                          setWorkerDocumentPreview(null);
                          setWorkerDocumentName('');
                        }}
                        className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove document"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <Button variant="primary" size="md" fullWidth onClick={() => setWorkerStep(6)}>
                  Preview My Work Passport
                </Button>
              </div>
            )}

            {/* Step 6: Profile Preview */}
            {workerStep === 6 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-black text-[#17211F]">Work Passport Preview</h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    This is what clients and contractors will see when viewing your verified credentials.
                  </p>
                </div>

                <div className="p-6 bg-[#FAF8F2] rounded-2xl border border-stone-200 space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar
                      src={workerPhotoPreview || workerData.avatar}
                      name={workerData.name}
                      size="lg"
                      verified
                    />
                    <div>
                      <h4 className="text-lg font-black text-[#17211F]">
                        {workerData.name || 'Artisan Name'}
                      </h4>
                      <div className="text-xs font-bold text-[#176B5B] uppercase">
                        {workerData.profession_slug} • {workerData.city}
                      </div>
                      <div className="text-xs text-stone-500 mt-1">
                        {workerData.years_experience} Years Experience • ₹
                        {workerData.expected_daily_wage}/day
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200">
                    <span className="text-[11px] font-bold text-stone-500 uppercase block mb-1">
                      Active Micro-Skills
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {workerData.skill_ids.map((id) => (
                        <Badge key={id} variant="primary" size="sm">
                          ✓ Skill #{id}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-stone-500 uppercase block">
                        Government / Identity Proof
                      </span>
                      <span className="text-xs font-bold text-[#17211F]">
                        {workerData.document_type} {workerData.document_number ? `(${workerData.document_number})` : ''}
                      </span>
                    </div>
                    {workerDocumentFile ? (
                      <span className="text-[11px] font-bold text-[#176B5B] bg-[#176B5B]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <FileCheck size={12} /> Document Attached
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                        Manual ID Entered
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  onClick={handleWorkerSubmit}
                >
                  Create My Work Passport & Submit to MySQL
                </Button>
              </div>
            )}
          </div>
        )}

        {/* EMPLOYEE REGISTRATION */}
        {selectedRole === 'employee' && (
          <form onSubmit={handleEmployeeSubmit} className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <button
                type="button"
                onClick={() => setSelectedRole('select')}
                className="inline-flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-[#176B5B] cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
              <Badge variant="primary">Employee Portal</Badge>
            </div>

            <div>
              <h3 className="text-xl font-black text-[#17211F]">Employee Registration</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Register as an operational engineer, site quality inspector, or governance admin.
              </p>
            </div>

            <Input
              label="Full Name"
              value={employeeData.name}
              onChange={(e) => setEmployeeData({ ...employeeData, name: e.target.value })}
              placeholder="e.g. Anil Saxena"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Mobile Number"
                value={employeeData.phone}
                onChange={(e) => setEmployeeData({ ...employeeData, phone: e.target.value })}
                placeholder="e.g. 9811122299"
                required
              />
              <Input
                label="Email"
                type="email"
                value={employeeData.email}
                onChange={(e) => setEmployeeData({ ...employeeData, email: e.target.value })}
                placeholder="e.g. anil@nirmaan.local"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Department"
                value={employeeData.department}
                onChange={(e) => setEmployeeData({ ...employeeData, department: e.target.value })}
                placeholder="e.g. Field Operations"
                required
              />
              <Input
                label="Designation / Title"
                value={employeeData.designation}
                onChange={(e) => setEmployeeData({ ...employeeData, designation: e.target.value })}
                placeholder="e.g. Senior Site Engineer"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Employee Code (Optional)"
                value={employeeData.employee_code}
                onChange={(e) => setEmployeeData({ ...employeeData, employee_code: e.target.value })}
                placeholder="Auto-generated if left blank"
              />
              <Input
                label="Operating City / Region"
                value={employeeData.city}
                onChange={(e) => setEmployeeData({ ...employeeData, city: e.target.value })}
                placeholder="e.g. Noida / Delhi NCR"
                required
              />
            </div>

            {/* Optional Profile Photo */}
            <ProfilePhotoUpload
              file={employeePhoto}
              preview={employeePhotoPreview}
              onSelect={(e) => handlePhotoSelect(e, setEmployeePhoto, setEmployeePhotoPreview)}
              onClear={() => {
                setEmployeePhoto(null);
                setEmployeePhotoPreview(null);
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Create Password"
                type="password"
                value={employeeData.password}
                onChange={(e) => setEmployeeData({ ...employeeData, password: e.target.value })}
                placeholder="Min 6 characters"
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                value={employeeData.confirmPassword}
                onChange={(e) =>
                  setEmployeeData({ ...employeeData, confirmPassword: e.target.value })
                }
                placeholder="Repeat password"
                required
              />
            </div>

            <Button variant="primary" size="md" fullWidth type="submit" loading={loading}>
              Create Employee Profile in MySQL
            </Button>
          </form>
        )}

        {/* HOMEOWNER REGISTRATION */}
        {selectedRole === 'homeowner' && (
          <form onSubmit={handleHomeownerSubmit} className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <button
                type="button"
                onClick={() => setSelectedRole('select')}
                className="inline-flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-[#176B5B] cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
              <Badge variant="primary">Homeowner Account</Badge>
            </div>

            <div>
              <h3 className="text-xl font-black text-[#17211F]">Homeowner Registration</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Register to hire verified artisans, track milestones, and approve photo proofs.
              </p>
            </div>

            <Input
              label="Full Name"
              value={homeownerData.name}
              onChange={(e) => setHomeownerData({ ...homeownerData, name: e.target.value })}
              placeholder="e.g. Priya Sharma"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Mobile Number"
                value={homeownerData.phone}
                onChange={(e) => setHomeownerData({ ...homeownerData, phone: e.target.value })}
                placeholder="e.g. 9812345678"
                required
              />
              <Input
                label="Email"
                type="email"
                value={homeownerData.email}
                onChange={(e) => setHomeownerData({ ...homeownerData, email: e.target.value })}
                placeholder="e.g. priya@gmail.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="City / Region"
                value={homeownerData.city}
                onChange={(e) => setHomeownerData({ ...homeownerData, city: e.target.value })}
                required
              />
              <Input
                label="Address / Sector"
                value={homeownerData.address}
                onChange={(e) => setHomeownerData({ ...homeownerData, address: e.target.value })}
                placeholder="e.g. Sector 62, Noida"
              />
            </div>

            {/* Optional Profile Photo */}
            <ProfilePhotoUpload
              file={homeownerPhoto}
              preview={homeownerPhotoPreview}
              onSelect={(e) => handlePhotoSelect(e, setHomeownerPhoto, setHomeownerPhotoPreview)}
              onClear={() => {
                setHomeownerPhoto(null);
                setHomeownerPhotoPreview(null);
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Create Password"
                type="password"
                value={homeownerData.password}
                onChange={(e) => setHomeownerData({ ...homeownerData, password: e.target.value })}
                placeholder="Min 6 characters"
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                value={homeownerData.confirmPassword}
                onChange={(e) =>
                  setHomeownerData({ ...homeownerData, confirmPassword: e.target.value })
                }
                placeholder="Repeat password"
                required
              />
            </div>

            {/* Optional Project creation */}
            <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-stone-200 space-y-3 mt-2">
              <span className="text-xs font-bold text-[#17211F] block">
                What are you planning to build or repair? (Optional)
              </span>
              <Input
                label="Project Title"
                value={homeownerData.project_title}
                onChange={(e) =>
                  setHomeownerData({ ...homeownerData, project_title: e.target.value })
                }
                placeholder="e.g. Bathroom Renovation & Anti-Skid Tiling"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="Category"
                  options={[
                    { value: 'Renovation', label: 'Bathroom / Kitchen Renovation' },
                    { value: 'New Construction', label: 'New Room / Floor Construction' },
                    { value: 'Electrical Repair', label: 'Electrical Wiring / DB Setup' },
                    { value: 'Plumbing', label: 'Plumbing & Concealed Piping' },
                    { value: 'Painting', label: 'Full Interior / Exterior Painting' },
                  ]}
                  value={homeownerData.project_category}
                  onChange={(e) =>
                    setHomeownerData({ ...homeownerData, project_category: e.target.value })
                  }
                />
                <Input
                  label="Estimated Budget (₹)"
                  type="number"
                  value={homeownerData.project_budget}
                  onChange={(e) =>
                    setHomeownerData({
                      ...homeownerData,
                      project_budget: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <Button variant="primary" size="md" fullWidth type="submit" loading={loading}>
              Create Homeowner Profile in MySQL
            </Button>
          </form>
        )}

        {/* CONTRACTOR REGISTRATION */}
        {selectedRole === 'contractor' && (
          <form onSubmit={handleContractorSubmit} className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <button
                type="button"
                onClick={() => setSelectedRole('select')}
                className="inline-flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-[#176B5B] cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
              <Badge variant="warning">Contractor Portal</Badge>
            </div>

            <div>
              <h3 className="text-xl font-black text-[#17211F]">Contractor Registration</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Register your construction firm to manage crews, muster rolls, and project jobs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Contact Person Name"
                value={contractorData.name}
                onChange={(e) => setContractorData({ ...contractorData, name: e.target.value })}
                placeholder="e.g. Vikram Sharma"
                required
              />
              <Input
                label="Company / Firm Name"
                value={contractorData.company_name}
                onChange={(e) =>
                  setContractorData({ ...contractorData, company_name: e.target.value })
                }
                placeholder="e.g. Sharma Infrastructure Ltd."
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Mobile Phone"
                value={contractorData.phone}
                onChange={(e) => setContractorData({ ...contractorData, phone: e.target.value })}
                placeholder="e.g. 9898989898"
                required
              />
              <Input
                label="Business Email"
                type="email"
                value={contractorData.email}
                onChange={(e) => setContractorData({ ...contractorData, email: e.target.value })}
                placeholder="e.g. vikram@sharma-infra.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="GST Number (Optional)"
                value={contractorData.gst_number}
                onChange={(e) =>
                  setContractorData({ ...contractorData, gst_number: e.target.value })
                }
                placeholder="07AAAAA0000A1Z5"
              />
              <Input
                label="Operating City"
                value={contractorData.city}
                onChange={(e) => setContractorData({ ...contractorData, city: e.target.value })}
                required
              />
              <Input
                label="Current Crew Size"
                type="number"
                value={contractorData.team_size}
                onChange={(e) =>
                  setContractorData({ ...contractorData, team_size: Number(e.target.value) })
                }
                min={1}
                required
              />
            </div>

            {/* Optional Contractor Business License / Registration Document */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700">
                  Business License / GST Document (Optional)
                </label>
                <span className="text-[11px] font-semibold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                  Stored in DB • PDF or Image
                </span>
              </div>
              {!contractorDocumentFile ? (
                <label className="flex items-center gap-3 border border-dashed border-stone-300 hover:border-[#176B5B] rounded-xl p-3 bg-stone-50/70 hover:bg-[#176B5B]/5 cursor-pointer transition-all">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          showToast('Document exceeds 5MB limit', 'warning');
                          return;
                        }
                        setContractorDocumentFile(file);
                        setContractorDocumentName(file.name);
                      }
                    }}
                  />
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#176B5B] flex items-center justify-center shrink-0">
                    <UploadCloud size={18} />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-xs font-bold text-stone-800 block">
                      Upload License Certificate or GST Registration
                    </span>
                    <span className="text-[10px] text-stone-500">
                      PDF, PNG, JPG (Max 5MB)
                    </span>
                  </div>
                </label>
              ) : (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#176B5B] flex items-center justify-center">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900 truncate max-w-[240px]">
                        {contractorDocumentName}
                      </p>
                      <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={11} /> Document ready for database storage
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setContractorDocumentFile(null);
                      setContractorDocumentName('');
                    }}
                    className="p-1 text-stone-400 hover:text-red-500 rounded"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Optional Profile Photo */}
            <ProfilePhotoUpload
              file={contractorPhoto}
              preview={contractorPhotoPreview}
              onSelect={(e) => handlePhotoSelect(e, setContractorPhoto, setContractorPhotoPreview)}
              onClear={() => {
                setContractorPhoto(null);
                setContractorPhotoPreview(null);
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Create Password"
                type="password"
                value={contractorData.password}
                onChange={(e) =>
                  setContractorData({ ...contractorData, password: e.target.value })
                }
                placeholder="Min 6 characters"
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                value={contractorData.confirmPassword}
                onChange={(e) =>
                  setContractorData({ ...contractorData, confirmPassword: e.target.value })
                }
                placeholder="Repeat password"
                required
              />
            </div>

            <Button variant="primary" size="md" fullWidth type="submit" loading={loading}>
              Create Contractor Profile in MySQL
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
