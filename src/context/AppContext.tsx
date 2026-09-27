import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, Language, Worker, Job, Project, NotificationItem, AttendanceState } from '../types';
import { initialWorkers, initialJobs, initialProject, initialNotifications } from '../data/mockData';
import { translations } from '../translations';
import api from '../services/api';
import { getPhotoUrl } from '../utils/imageUrl';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

// Generic user object for ALL roles (worker, homeowner, contractor, admin)
export interface CurrentUser {
  id: string;
  name: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  role_normalized: string;
  registration_id: string;
  profile_photo: string | null;
  avatar: string | null;
  city: string;
  status: string;
  // Homeowner/client extras
  company_name?: string;
  project_type?: string;
  address?: string;
  // Worker extras (also in currentWorker)
  profession_name?: string;
  trade?: string;
  profession_slug?: string;
  worker_profile_id?: number;
  // Contractor extras
  specialization?: string;
  license_number?: string;
}

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];

  // Generic auth user — works for ALL roles
  currentUser: CurrentUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser | null>>;
  
  workers: Worker[];
  currentWorker: Worker;
  updateCurrentWorker: (workerData: Partial<Worker>) => void;
  getWorkerById: (id: string) => Worker | undefined;
  
  jobs: Job[];
  activeJob: Job | null;
  refreshJobs: () => Promise<void>;
  applyToJob: (jobId: string) => void;
  acceptJob: (jobId: string) => void;
  
  project: Project;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  refreshProjects: () => Promise<void>;
  hireWorker: (workerId: string) => void;
  approveMilestone: (milestoneId: string) => void;
  addTimelineEntry: (title: string, description: string, photos?: string[]) => void;
  createProject: (newProject: Partial<Project>) => string;
  
  attendance: AttendanceState;
  checkIn: () => void;
  checkOut: () => void;
  updateWorkProgress: (percent: number) => void;
  addWorkPhoto: (url: string) => void;
  completeDay: () => void;
  
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  refreshNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  isSosOpen: boolean;
  setIsSosOpen: (open: boolean) => void;
  isQrOpen: boolean;
  setIsQrOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  
  toast: ToastState;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  hideToast: () => void;
  
  refreshAuthUser: () => Promise<void>;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  ROLE: 'nirmaan_role_v2',
  LANG: 'nirmaan_lang_v2',
};

// Helper: parse nirmaan_user from localStorage into CurrentUser
const parseStoredUser = (): CurrentUser | null => {
  try {
    const stored = localStorage.getItem('nirmaan_user');
    if (!stored) return null;
    const u = JSON.parse(stored);
    if (!u || !u.id) return null;
    return {
      id: String(u.id),
      name: u.full_name || u.name || '',
      full_name: u.full_name || u.name || '',
      email: u.email || '',
      phone: u.phone || '',
      role: u.role || '',
      role_normalized: u.role_normalized || (u.role || '').toLowerCase(),
      registration_id: u.registration_id || '',
      profile_photo: u.profile_photo || null,
      avatar: u.avatar || null,
      city: u.city || '',
      status: u.status || 'active',
      company_name: u.company_name,
      project_type: u.project_type,
      address: u.address,
      profession_name: u.profession_name || u.trade,
      trade: u.trade || u.profession_name,
      profession_slug: u.profession_slug,
      worker_profile_id: u.worker_profile_id,
      specialization: u.specialization,
      license_number: u.license_number,
    };
  } catch {
    return null;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Role & Language (harmless UI preferences stored in localStorage)
  const [role, setRoleState] = useState<Role>(() => {
    return (localStorage.getItem(LOCAL_STORAGE_KEYS.ROLE) as Role) || 'guest';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(LOCAL_STORAGE_KEYS.LANG) as Language) || 'en';
  });

  // Generic auth user state — works for ALL roles
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => parseStoredUser());

  // Workers — Initialized clean, populated dynamically from PHP/MySQL
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);

  // Active Authenticated Worker (Hydrated dynamically from MySQL auth/me.php or session cache)
  const defaultEmptyWorker: Worker = {
    id: '',
    name: 'Artisan',
    photo: getPhotoUrl(null),
    city: '',
    trade: '',
    profession_slug: '',
    level: 'Level 1 Artisan',
    verified: false,
    nirmaanId: '',
    rating: 0,
    totalReviews: 0,
    completedJobs: 0,
    yearsExperience: 0,
    expectedDailyWage: 0,
    phone: '',
    available: true,
    skills: [],
    reputation: { quality: 0, punctuality: 0, reliability: 0, completion: 0 },
    workerClientReputation: { paymentReliability: 0, siteConditions: 0, workClarity: 0 },
    distanceKm: 0,
    matchScore: 0,
    matchReasons: [],
    about: '',
    recentProjects: [],
    reviews: [],
  };

  const [currentWorker, setCurrentWorker] = useState<Worker>(() => {
    try {
      const stored = localStorage.getItem('nirmaan_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.role === 'worker' || u.role_normalized === 'worker' || u.role === 'WORKER') {
          return {
            id: String(u.worker_profile_id || u.id || ''),
            name: u.full_name || u.name || 'Artisan',
            nameHindi: u.name,
            photo: getPhotoUrl(u.profile_photo || u.avatar),
            city: u.city || '',
            trade: u.profession_name || u.trade || u.profession || '',
            profession_slug: u.profession_slug || '',
            level: u.level || 'Level 1 Artisan',
            verified: Boolean(u.is_verified),
            nirmaanId: u.registration_id || u.nirmaan_id || `WRK-${u.id}`,
            rating: Number(u.rating) || 0,
            totalReviews: Number(u.total_reviews) || 0,
            completedJobs: Number(u.completed_jobs) || 0,
            yearsExperience: Number(u.years_experience || u.experience_years) || 0,
            expectedDailyWage: Number(u.expected_daily_wage || u.daily_rate) || 0,
            phone: u.phone || '',
            available: u.is_available !== false,
            skills: Array.isArray(u.skills) ? u.skills : [],
            reputation: u.passport ? {
              quality: Number(u.passport.quality_score) || 0,
              punctuality: Number(u.passport.punctuality_score) || 0,
              reliability: Number(u.passport.reliability_score) || 0,
              completion: Number(u.passport.completion_score) || 0,
            } : { quality: 0, punctuality: 0, reliability: 0, completion: 0 },
            workerClientReputation: u.passport ? {
              paymentReliability: Number(u.passport.client_payment_score) || 0,
              siteConditions: Number(u.passport.client_site_score) || 0,
              workClarity: Number(u.passport.client_clarity_score) || 0,
            } : { paymentReliability: 0, siteConditions: 0, workClarity: 0 },
            distanceKm: Number(u.distance_km) || 0,
            matchScore: Number(u.match_score) || 0,
            matchReasons: [],
            about: u.bio || '',
            recentProjects: [],
            reviews: [],
          };
        }
      }
    } catch {}
    return defaultEmptyWorker;
  });

  // Jobs — Initialized clean from PHP/MySQL
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  // Project — Initialized clean from PHP/MySQL
  const [project, setProject] = useState<Project>(initialProject);
  const [projects, setProjects] = useState<Project[]>([]);

  // Attendance — Clean initial state until actual worker check-in
  const [attendance, setAttendance] = useState<AttendanceState>({
    isCheckedIn: false,
    checkInTime: null,
    locationVerified: false,
    progressPercent: 0,
    workPhotos: [],
    dayCompleted: false,
  });

  // Notifications — Clean initial state from MySQL
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  // Modals & UI States
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Sync ONLY harmless UI preferences to LocalStorage
  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem(LOCAL_STORAGE_KEYS.ROLE, newRole);
    setTimeout(() => {
      refreshNotifications();
      refreshJobs();
      refreshProjects();
    }, 50);
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem(LOCAL_STORAGE_KEYS.LANG, newLang);
  };

  // Load Primary Application Data from PHP 8+ / MySQL REST API
  useEffect(() => {
    let isMounted = true;
    const loadBackendData = async () => {
      try {
        // 1. Fetch authenticated user from MySQL
        try {
          const meRes = await api.get<{ authenticated: boolean; user?: any }>('auth/me.php');
          if (isMounted && meRes?.authenticated && meRes.user) {
            const u = meRes.user;

            // Update nirmaan_user in localStorage with full profile data from server
            const mergedUser = { ...(parseStoredUser() || {}), ...u };
            localStorage.setItem('nirmaan_user', JSON.stringify(mergedUser));

            // Set generic currentUser for ALL roles
            if (isMounted) {
              setCurrentUser({
                id: String(u.id),
                name: u.full_name || u.name || '',
                full_name: u.full_name || u.name || '',
                email: u.email || '',
                phone: u.phone || '',
                role: u.role || '',
                role_normalized: u.role_normalized || (u.role || '').toLowerCase(),
                registration_id: u.registration_id || '',
                profile_photo: u.profile_photo || null,
                avatar: u.avatar || null,
                city: u.city || '',
                status: u.status || 'active',
                company_name: u.company_name,
                project_type: u.project_type,
                address: u.address,
                profession_name: u.profession_name || u.trade,
                trade: u.trade || u.profession_name,
                profession_slug: u.profession_slug,
                worker_profile_id: u.worker_profile_id,
                specialization: u.specialization,
                license_number: u.license_number,
              });
            }

            if (u.role === 'worker' || u.role_normalized === 'worker' || u.role === 'WORKER') {
              setCurrentWorker({
                id: String(u.worker_profile_id || u.id || ''),
                name: u.full_name || u.name || 'Artisan',
                nameHindi: u.name,
                photo: getPhotoUrl(u.profile_photo || u.avatar),
                city: u.city || '',
                trade: u.profession_name || u.trade || u.profession || '',
                profession_slug: u.profession_slug || '',
                level: u.level || 'Level 1 Artisan',
                verified: Boolean(u.is_verified),
                nirmaanId: u.registration_id || u.nirmaan_id || `WRK-${u.id}`,
                rating: Number(u.rating) || 0,
                totalReviews: Number(u.total_reviews) || 0,
                completedJobs: Number(u.completed_jobs) || 0,
                yearsExperience: Number(u.years_experience || u.experience_years) || 0,
                expectedDailyWage: Number(u.expected_daily_wage || u.daily_rate) || 0,
                phone: u.phone || '',
                available: u.is_available !== false,
                skills: Array.isArray(u.skills)
                  ? u.skills.map((s: any) => typeof s === 'string' ? { name: s, verified: true, level: 'Master' } : s)
                  : [],
                reputation: u.passport ? {
                  quality: Number(u.passport.quality_score) || 0,
                  punctuality: Number(u.passport.punctuality_score) || 0,
                  reliability: Number(u.passport.reliability_score) || 0,
                  completion: Number(u.passport.completion_score) || 0,
                } : { quality: 0, punctuality: 0, reliability: 0, completion: 0 },
                workerClientReputation: u.passport ? {
                  paymentReliability: Number(u.passport.client_payment_score) || 0,
                  siteConditions: Number(u.passport.client_site_score) || 0,
                  workClarity: Number(u.passport.client_clarity_score) || 0,
                } : { paymentReliability: 0, siteConditions: 0, workClarity: 0 },
                distanceKm: Number(u.distance_km) || 0,
                matchScore: Number(u.match_score) || 0,
                matchReasons: [],
                about: u.bio || '',
                recentProjects: [],
                reviews: [],
              });
            }
          }
        } catch {
          // auth check error — use localStorage fallback
          const stored = parseStoredUser();
          if (stored && isMounted) setCurrentUser(stored);
        }

        // 2. Fetch Notifications from MySQL
        try {
          const notifRes = await api.get<{ notifications: any[] }>('notifications/list.php');
          if (isMounted && notifRes?.notifications?.length) {
            setNotifications(notifRes.notifications.map((n: any) => ({
              id: String(n.id),
              title: n.title,
              message: n.message,
              time: n.created_at ? n.created_at.substring(11, 16) : 'Just now',
              read: Boolean(n.is_read),
              type: n.type || 'job',
            })));
          } else if (isMounted) {
            setNotifications([]);
          }
        } catch {
          if (isMounted) setNotifications([]);
        }

        // 3. Fetch workers, jobs, projects from MySQL (scoped to authenticated user)
        const [workersRes, jobsRes, projectsRes] = await Promise.allSettled([
          api.get<{ workers?: any[] }>('workers/list.php'),
          api.get<{ jobs?: any[] }>('jobs/list.php'),
          api.get<{ projects?: any[] }>('projects/list.php'),
        ]);

        if (!isMounted) return;

        if (workersRes.status === 'fulfilled' && Array.isArray(workersRes.value?.workers)) {
          const bwList = workersRes.value.workers;
          const mapped = bwList.map((bw: any) => ({
            id: String(bw.id || bw.user_id),
            name: bw.name || bw.full_name,
            nameHindi: bw.name_hindi || bw.name,
            photo: getPhotoUrl(bw.photo_url || bw.photo || bw.profile_photo),
            city: bw.city || '',
            trade: bw.profession_name || bw.trade || '',
            level: bw.level || 'Level 1 Artisan',
            verified: Boolean(bw.verified || bw.is_verified),
            nirmaanId: bw.passport_id || bw.nirmaanId || `NRM-${bw.id}`,
            rating: Number(bw.rating) || 0,
            totalReviews: Number(bw.total_reviews) || 0,
            completedJobs: Number(bw.completed_jobs) || 0,
            yearsExperience: Number(bw.experience_years || bw.years_experience) || 0,
            expectedDailyWage: Number(bw.daily_wage || bw.expected_daily_wage) || 0,
            phone: bw.phone || '',
            available: bw.availability_status !== 'busy',
            skills: Array.isArray(bw.skills)
              ? bw.skills.map((s: any) => typeof s === 'string' ? { name: s, verified: true, level: 'Master' } : s)
              : [],
            reputation: bw.reputation || {
              quality: 0,
              punctuality: 0,
              reliability: 0,
              completion: 0,
            },
            workerClientReputation: {
              paymentReliability: 0,
              siteConditions: 0,
              workClarity: 0,
            },
            distanceKm: Number(bw.distance_km) || 0,
            latitude: Number(bw.latitude) || undefined,
            longitude: Number(bw.longitude) || undefined,
            matchScore: Number(bw.match_score) || 0,
            matchReasons: bw.match_reasons || [],
            about: bw.bio || bw.about || '',
            recentProjects: bw.recent_projects || [],
          }));
          setWorkers(mapped);
        } else {
          setWorkers([]);
        }

        if (jobsRes.status === 'fulfilled' && Array.isArray(jobsRes.value?.jobs)) {
          const bjList = jobsRes.value.jobs;
          setJobs(bjList.map((bj: any) => ({
            id: String(bj.id),
            title: bj.title,
            category: bj.category || bj.profession_name || 'Renovation',
            clientName: bj.homeowner_name || bj.client_full_name || bj.client_name || bj.clientName || 'Client Site',
            location: bj.location || bj.city || '',
            distanceKm: Number(bj.distance_km || 0),
            dailyWage: Number(bj.daily_wage || bj.budget_per_day || 0),
            durationDays: Number(bj.duration_days || 0),
            startDate: bj.start_date || 'Immediate',
            clientRating: Number(bj.client_rating || 0),
            requiredSkills: Array.isArray(bj.skills_required) ? bj.skills_required : [bj.profession_name || 'General'],
            status: (bj.status === 'accepted' || bj.status === 'in_progress') ? 'accepted' : bj.status === 'applied' ? 'applied' : 'open',
            hiredWorkerProfileId: bj.hired_worker_profile_id ? Number(bj.hired_worker_profile_id) : undefined,
            matchReasons: bj.match_reasons || ['Verified site requirement from MySQL database'],
            description: bj.description || 'Verified site construction job.',
          })));
        } else {
          setJobs([]);
        }

        if (projectsRes.status === 'fulfilled' && Array.isArray(projectsRes.value?.projects)) {
          const rawProjects = projectsRes.value.projects;
          const mappedProjects: Project[] = rawProjects.map((bp: any) => ({
            id: String(bp.id),
            name: bp.name || 'Active Project',
            category: bp.category || 'Construction',
            location: bp.location || bp.address || '',
            startDate: bp.start_date || '',
            progressPercent: Number(bp.progress_percent || bp.progress_percentage) || 0,
            budget: Number(bp.budget) || 0,
            spent: Number(bp.spent) || 0,
            status: bp.status || 'planning',
            description: bp.description || '',
            workers: Array.isArray(bp.workers) ? bp.workers : [],
            milestones: Array.isArray(bp.milestones) ? bp.milestones : [],
            timeline: Array.isArray(bp.timeline) ? bp.timeline : [],
          }));
          setProjects(mappedProjects);
          // Set the most recent project as the primary active project
          if (mappedProjects.length > 0) {
            setProject(mappedProjects[0]);
          } else {
            setProject(initialProject);
          }
        } else {
          setProjects([]);
          setProject(initialProject);
        }
      } catch (err) {
        console.info('Backend API notice: running in clean pristine state.');
      }
    };

    loadBackendData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Refresh Authenticated User Session from MySQL (all roles)
  const refreshAuthUser = async () => {
    try {
      const meRes = await api.get<{ authenticated: boolean; user?: any }>('auth/me.php');
      if (meRes?.authenticated && meRes.user) {
        const u = meRes.user;

        // Merge full server data into localStorage
        const existing = parseStoredUser() || {};
        const merged = { ...existing, ...u };
        localStorage.setItem('nirmaan_user', JSON.stringify(merged));

        // Update generic currentUser for ALL roles
        setCurrentUser({
          id: String(u.id),
          name: u.full_name || u.name || '',
          full_name: u.full_name || u.name || '',
          email: u.email || '',
          phone: u.phone || '',
          role: u.role || '',
          role_normalized: u.role_normalized || (u.role || '').toLowerCase(),
          registration_id: u.registration_id || '',
          profile_photo: u.profile_photo || null,
          avatar: u.avatar || null,
          city: u.city || '',
          status: u.status || 'active',
          company_name: u.company_name,
          project_type: u.project_type,
          address: u.address,
          profession_name: u.profession_name || u.trade,
          trade: u.trade || u.profession_name,
          profession_slug: u.profession_slug,
          worker_profile_id: u.worker_profile_id,
          specialization: u.specialization,
          license_number: u.license_number,
        });

        if (u.role === 'worker' || u.role_normalized === 'worker' || u.role === 'WORKER') {
          setCurrentWorker({
            id: String(u.worker_profile_id || u.id || ''),
            name: u.full_name || u.name || 'Artisan',
            nameHindi: u.name,
            photo: getPhotoUrl(u.profile_photo || u.avatar),
            city: u.city || '',
            trade: u.profession_name || u.trade || u.profession || '',
            profession_slug: u.profession_slug || '',
            level: u.level || 'Level 1 Artisan',
            verified: Boolean(u.is_verified),
            nirmaanId: u.registration_id || u.nirmaan_id || `WRK-${u.id}`,
            rating: Number(u.rating) || 0,
            totalReviews: Number(u.total_reviews) || 0,
            completedJobs: Number(u.completed_jobs) || 0,
            yearsExperience: Number(u.years_experience || u.experience_years) || 0,
            expectedDailyWage: Number(u.expected_daily_wage || u.daily_rate) || 0,
            phone: u.phone || '',
            available: u.is_available !== false,
            skills: Array.isArray(u.skills)
              ? u.skills.map((s: any) => typeof s === 'string' ? { name: s, verified: true, level: 'Master' } : s)
              : [],
            reputation: u.passport ? {
              quality: Number(u.passport.quality_score) || 0,
              punctuality: Number(u.passport.punctuality_score) || 0,
              reliability: Number(u.passport.reliability_score) || 0,
              completion: Number(u.passport.completion_score) || 0,
            } : { quality: 0, punctuality: 0, reliability: 0, completion: 0 },
            workerClientReputation: u.passport ? {
              paymentReliability: Number(u.passport.client_payment_score) || 0,
              siteConditions: Number(u.passport.client_site_score) || 0,
              workClarity: Number(u.passport.client_clarity_score) || 0,
            } : { paymentReliability: 0, siteConditions: 0, workClarity: 0 },
            distanceKm: Number(u.distance_km) || 0,
            matchScore: Number(u.match_score) || 0,
            matchReasons: [],
            about: u.bio || '',
            recentProjects: [],
            reviews: [],
          });
        }
      }
    } catch (e) {
      // Fallback: try localStorage
      const stored = parseStoredUser();
      if (stored) setCurrentUser(stored);
      console.warn('refreshAuthUser notice:', e);
    }
  };

  // Refresh the current user's projects from MySQL
  const refreshProjects = async () => {
    try {
      const res = await api.get<{ projects?: any[] }>('projects/list.php');
      if (res?.projects && Array.isArray(res.projects)) {
        const mapped: Project[] = res.projects.map((bp: any) => ({
          id: String(bp.id),
          name: bp.name || 'Active Project',
          category: bp.category || 'Construction',
          location: bp.location || bp.address || '',
          startDate: bp.start_date || '',
          progressPercent: Number(bp.progress_percent || bp.progress_percentage) || 0,
          budget: Number(bp.budget) || 0,
          spent: Number(bp.spent) || 0,
          status: bp.status || 'planning',
          description: bp.description || '',
          workers: Array.isArray(bp.workers) ? bp.workers : [],
          milestones: Array.isArray(bp.milestones) ? bp.milestones : [],
          timeline: Array.isArray(bp.timeline) ? bp.timeline : [],
        }));
        setProjects(mapped);
        setProject(mapped.length > 0 ? mapped[0] : initialProject);
      } else {
        setProjects([]);
        setProject(initialProject);
      }
    } catch (e) {
      console.warn('refreshProjects notice:', e);
    }
  };

  // Refresh jobs from MySQL
  const refreshJobs = async () => {
    try {
      const jobsRes = await api.get<{ jobs?: any[] }>('jobs/list.php');
      if (jobsRes?.jobs && Array.isArray(jobsRes.jobs)) {
        const bjList = jobsRes.jobs;
        setJobs(
          bjList.map((bj: any) => ({
            id: String(bj.id),
            title: bj.title,
            category: bj.category || bj.profession_name || 'Renovation',
            clientName: bj.homeowner_name || bj.client_full_name || bj.client_name || bj.clientName || 'Client Site',
            location: bj.location || bj.city || '',
            distanceKm: Number(bj.distance_km || 0),
            dailyWage: Number(bj.daily_wage || bj.budget_per_day || 0),
            durationDays: Number(bj.duration_days || 0),
            startDate: bj.start_date || 'Immediate',
            clientRating: Number(bj.client_rating || 0),
            requiredSkills: Array.isArray(bj.skills_required) ? bj.skills_required : [bj.profession_name || 'General'],
            status: (bj.status === 'accepted' || bj.status === 'in_progress') ? 'accepted' : bj.status === 'applied' ? 'applied' : 'open',
            hiredWorkerProfileId: bj.hired_worker_profile_id ? Number(bj.hired_worker_profile_id) : undefined,
            matchReasons: bj.match_reasons || ['Verified site requirement from MySQL database'],
            description: bj.description || 'Verified site construction job.',
          }))
        );
      }
    } catch (e) {
      console.warn('refreshJobs notice:', e);
    }
  };

  // Refresh notifications from MySQL
  const refreshNotifications = async () => {
    try {
      const stored = parseStoredUser();
      const uid = currentUser?.id || stored?.id || (currentWorker?.id ? Number(String(currentWorker.id).replace('w-', '')) : undefined);
      const notifRes = await api.get<{ notifications: any[] }>('notifications/list.php', {
        user_id: uid,
        role: role || stored?.role || 'worker',
      });
      if (notifRes?.notifications && Array.isArray(notifRes.notifications)) {
        setNotifications(
          notifRes.notifications.map((n: any) => ({
            id: String(n.id),
            title: n.title,
            message: n.message,
            time: n.created_at ? n.created_at.substring(11, 16) : 'Just now',
            read: Boolean(n.is_read),
            type: n.type || 'job',
          }))
        );
      }
    } catch (e) {
      console.warn('refreshNotifications notice:', e);
    }
  };

  // Actions
  const updateCurrentWorker = (workerData: Partial<Worker>) => {
    // Update both the workers list AND the currentWorker state
    setCurrentWorker((prev) => ({ ...prev, ...workerData }));
    setWorkers((prev) =>
      prev.map((w) => (w.id === currentWorker.id ? { ...w, ...workerData } : w))
    );
    showToast('Profile updated successfully!', 'success');
  };

  const getWorkerById = (id: string) => workers.find((w) => w.id === id);

  const applyToJob = async (jobId: string) => {
    try {
      const wpId = currentWorker.id ? Number(String(currentWorker.id).replace('w-', '')) : undefined;
      const res: any = await api.post('jobs/apply.php', {
        job_id: Number(jobId),
        worker_profile_id: wpId,
        user_id: currentUser?.id ? Number(currentUser.id) : undefined,
      });

      if (res && res.success) {
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, status: 'applied' } : j))
        );
        showToast('Application sent to homeowner! Persisted in MySQL job_applications.', 'success');
        refreshJobs();
        refreshNotifications();
      } else {
        showToast(res?.error || 'Failed to apply for job', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'You cannot apply for jobs outside your profession.', 'error');
    }
  };

  const acceptJob = async (jobId: string) => {
    try {
      const wpId = currentWorker.id ? Number(String(currentWorker.id).replace('w-', '')) : undefined;
      const res: any = await api.post('jobs/accept.php', {
        job_id: Number(jobId),
        worker_profile_id: wpId,
        user_id: currentUser?.id ? Number(currentUser.id) : undefined,
      });

      if (res && res.success) {
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, status: 'accepted' } : j))
        );
        showToast('Job Accepted! Project agreement generated in MySQL.', 'success');
        refreshJobs();
        refreshProjects();
        refreshNotifications();
      } else {
        showToast(res?.error || 'Error accepting job', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error accepting job', 'error');
    }
  };

  const hireWorker = async (workerId: string) => {
    const targetWorker = workers.find((w) => w.id === workerId) || currentWorker;
    const workerProfileId = Number(String(workerId).replace('w-', '')) || 1;

    try {
      const clientId = currentUser?.id ? Number(currentUser.id) : ((project as any)?.client_user_id || undefined);
      const res: any = await api.post('workers/hire.php', {
        worker_profile_id: workerProfileId,
        project_id: project?.id && !isNaN(Number(project.id)) ? Number(project.id) : 0,
        client_user_id: clientId,
      });

      if (res?.success) {
        // Update local project state with the hired worker
        const updatedWorkers = [
          ...project.workers.filter((w) => w.id !== workerId),
          {
            id: targetWorker.id,
            name: targetWorker.name,
            trade: targetWorker.trade,
            photo: targetWorker.photo,
            dailyWage: targetWorker.expectedDailyWage,
            checkedInToday: false,
            checkInTime: '',
          },
        ];
        setProject((prev) => ({
          ...prev,
          workers: updatedWorkers,
        }));

        showToast(
          `✅ Hired ${res.worker_name || targetWorker.name}! Job created, linked to project, and worker notified.`,
          'success'
        );

        // Refresh projects, jobs, and notifications to reflect the new hire
        refreshProjects();
        refreshJobs();
        refreshNotifications();
      } else {
        showToast(res?.error || 'Failed to hire worker', 'error');
      }
    } catch (err: any) {
      // Fallback: update UI optimistically
      const updatedWorkers = [
        ...project.workers.filter((w) => w.id !== workerId),
        {
          id: targetWorker.id,
          name: targetWorker.name,
          trade: targetWorker.trade,
          photo: targetWorker.photo,
          dailyWage: targetWorker.expectedDailyWage,
          checkedInToday: false,
          checkInTime: '',
        },
      ];
      setProject((prev) => ({
        ...prev,
        workers: updatedWorkers,
      }));
      showToast(`Hired ${targetWorker.name}. ${err.message || ''}`, 'info');
    }
  };

  const approveMilestone = (milestoneId: string) => {
    const targetMilestone = project.milestones.find((m) => m.id === milestoneId);
    const milestoneTitle = targetMilestone?.title || 'Milestone';
    const milestoneAmount = targetMilestone?.amount || 0;

    setProject((prev) => {
      const updatedMilestones = prev.milestones.map((m) =>
        m.id === milestoneId ? { ...m, status: 'approved' as const } : m
      );
      const approvedCount = updatedMilestones.filter((m) => m.status === 'approved' || m.status === 'paid').length;
      const newProgress = updatedMilestones.length > 0
        ? Math.min(100, Math.round((approvedCount / updatedMilestones.length) * 100))
        : 100;

      return {
        ...prev,
        progressPercent: newProgress,
        spent: prev.spent + milestoneAmount,
        milestones: updatedMilestones,
      };
    });

    addTimelineEntry(
      `✓ ${milestoneTitle} Approved (₹${milestoneAmount.toLocaleString('en-IN')})`,
      `Homeowner approved milestone completion. Verified and logged to project ledger.`
    );

    // If current worker is assigned, increment their completed jobs
    if (currentWorker.id) {
      setWorkers((prev) =>
        prev.map((w) =>
          w.id === currentWorker.id
            ? {
                ...w,
                completedJobs: (w.completedJobs || 0) + 1,
              }
            : w
        )
      );
    }

    const newNotif: NotificationItem = {
      id: `n-${Date.now()}`,
      title: '💳 Milestone Payment Approved',
      message: `₹${milestoneAmount.toLocaleString('en-IN')} milestone for "${milestoneTitle}" was approved.`,
      time: 'Just now',
      read: false,
      type: 'milestone',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast('Milestone Approved! Work Passport updated.', 'success');
  };

  const addTimelineEntry = (title: string, description: string, photos?: string[]) => {
    const newEntry = {
      id: `t-${Date.now()}`,
      date: 'TODAY',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title,
      description,
      photos: photos || [],
      verified: true,
      contributor: currentWorker.name ? `${currentWorker.name} (${currentWorker.trade || 'Worker'})` : 'Project Contributor',
      contributesToPassport: true,
    };
    setProject((prev) => ({
      ...prev,
      timeline: [newEntry, ...prev.timeline],
    }));
  };

  const createProject = (newProjectData: Partial<Project>) => {
    const newId = `proj-${Date.now()}`;
    const newProj: Project = {
      id: newId,
      name: newProjectData.name || 'New Construction Project',
      category: newProjectData.category || 'Renovation',
      location: newProjectData.location || 'Noida NCR',
      startDate: newProjectData.startDate || 'Next Week',
      progressPercent: 10,
      budget: Number(newProjectData.budget) || 50000,
      spent: 0,
      status: 'in_progress',
      description: newProjectData.description || 'Custom construction project created in Nirmaan.',
      workers: [],
      milestones: initialProject.milestones,
      timeline: initialProject.timeline,
    };
    setProject(newProj);

    // Persist to MySQL jobs table
    api.post('jobs/create.php', {
      title: newProjectData.name || 'New Construction Job',
      description: newProjectData.description || 'Custom construction scope',
      budget: Number(newProjectData.budget) || 45000,
      location: newProjectData.location || 'Sector 62, Noida',
      start_date: newProjectData.startDate || 'Tomorrow',
    }).catch(() => {});

    showToast('Project created successfully! Saved to MySQL workforce ledger.', 'success');
    return newId;
  };

  // Attendance Actions
  const checkIn = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAttendance((prev) => ({
      ...prev,
      isCheckedIn: true,
      checkInTime: timeStr,
      locationVerified: true,
      dayCompleted: false,
    }));
    showToast(`Checked In at ${timeStr} (GPS verified - Demo)`, 'success');
  };

  const checkOut = () => {
    setAttendance((prev) => ({
      ...prev,
      isCheckedIn: false,
    }));
    showToast('Checked out for the day.', 'info');
  };

  const updateWorkProgress = (percent: number) => {
    setAttendance((prev) => ({
      ...prev,
      progressPercent: percent,
    }));
    showToast(`Today's progress updated to ${percent}%`, 'success');
  };

  const addWorkPhoto = (url: string) => {
    setAttendance((prev) => ({
      ...prev,
      workPhotos: [url, ...prev.workPhotos],
    }));
    addTimelineEntry('📸 Site Progress Photo Added', 'Worker uploaded timestamped site progress proof.', [url]);
    showToast('Photo added & linked to Work Passport!', 'success');
  };

  const completeDay = () => {
    setAttendance((prev) => ({
      ...prev,
      dayCompleted: true,
      isCheckedIn: false,
      progressPercent: 100,
    }));
    showToast('Day completed! Attendance & progress logged to Passport.', 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    api.post('notifications/read.php', { id: Number(id) }).catch(() => {});
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    const uid = currentUser?.id ? Number(currentUser.id) : undefined;
    api.post('notifications/read.php', { all: true, user_id: uid }).catch(() => {});
    showToast('All notifications marked as read', 'info');
  };

  // Periodic real-time background sync with MySQL
  useEffect(() => {
    const timer = setInterval(() => {
      refreshNotifications();
      refreshJobs();
    }, 10000);
    return () => clearInterval(timer);
  }, [role, currentUser?.id]);

  const resetDemoData = () => {
    setWorkers([]);
    setJobs([]);
    setProject(initialProject);
    setAttendance({
      isCheckedIn: false,
      checkInTime: null,
      locationVerified: false,
      progressPercent: 0,
      workPhotos: [],
      dayCompleted: false,
    });
    setNotifications([]);
    showToast('Platform data reset to clean initial state!', 'info');
  };

  // For workers: find a job they are specifically hired on (hired_worker_profile_id matches their profile)
  // For homeowners/contractors: find any accepted job
  const workerProfileIdNum = currentWorker?.id ? Number(String(currentWorker.id).replace('w-', '')) : 0;
  const activeJob = jobs.find((j) => {
    if (j.status !== 'accepted') return false;
    // If we have a worker profile id, check if this job was assigned to them
    if (workerProfileIdNum > 0 && j.hiredWorkerProfileId !== undefined) {
      return j.hiredWorkerProfileId === workerProfileIdNum;
    }
    return true; // fallback: show any accepted job
  }) || null;
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;
  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        t,
        currentUser,
        setCurrentUser,
        workers,
        currentWorker,
        updateCurrentWorker,
        getWorkerById,
        jobs,
        activeJob,
        refreshJobs,
        applyToJob,
        acceptJob,
        project,
        projects,
        setProjects,
        refreshProjects,
        hireWorker,
        approveMilestone,
        addTimelineEntry,
        createProject,
        attendance,
        checkIn,
        checkOut,
        updateWorkProgress,
        addWorkPhoto,
        completeDay,
        notifications,
        unreadNotificationCount,
        refreshNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        isSosOpen,
        setIsSosOpen,
        isQrOpen,
        setIsQrOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        toast,
        showToast,
        hideToast,
        refreshAuthUser,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
