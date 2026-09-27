export type Role =
  | 'WORKER'
  | 'HOMEOWNER'
  | 'CONTRACTOR'
  | 'SUPER_ADMIN'
  | 'worker'
  | 'homeowner'
  | 'contractor'
  | 'admin'
  | 'guest';

export type Language = 'en' | 'hi';

export interface User {
  id: number | string;
  name: string;
  email?: string;
  phone: string;
  role: Role;
  avatar?: string;
  status?: 'active' | 'suspended' | 'pending';
  profession_slug?: string;
}

export interface Profession {
  id: number | string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  status: 'active' | 'inactive';
  worker_count?: number;
  open_jobs_count?: number;
  completed_jobs_count?: number;
  skills?: Skill[];
}

export interface Skill {
  id: number | string;
  profession_id: number | string;
  name: string;
  slug: string;
  description?: string;
  status?: 'active' | 'inactive';
  profession_name?: string;
  profession_slug?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  hindiName?: string;
  verified: boolean;
  level?: string;
}

export interface WorkerReview {
  id: string;
  clientName: string;
  projectTitle: string;
  rating: number;
  date: string;
  comment: string;
  verifiedWork: boolean;
}

export interface Worker {
  id: string;
  name: string;
  nameHindi?: string;
  photo: string;
  city: string;
  trade: string;
  profession_id?: number | string;
  profession_slug?: string;
  level: string;
  verified: boolean;
  nirmaanId: string;
  rating: number;
  totalReviews: number;
  completedJobs: number;
  yearsExperience: number;
  expectedDailyWage: number;
  phone: string;
  available: boolean;
  skills: {
    name: string;
    verified: boolean;
    level: string;
  }[];
  reputation: {
    quality: number;
    punctuality: number;
    reliability: number;
    completion: number;
  };
  workerClientReputation: {
    paymentReliability: number;
    siteConditions: number;
    workClarity: number;
  };
  distanceKm?: number;
  latitude?: number;
  longitude?: number;
  matchScore?: number;
  matchReasons?: string[];
  about: string;
  recentProjects?: {
    id: string;
    title: string;
    year: string;
    role: string;
    rating: number;
    image: string;
  }[];
  reviews?: WorkerReview[];
}

export interface Job {
  id: string;
  title: string;
  titleHindi?: string;
  category: string;
  profession_id?: number | string;
  profession_slug?: string;
  clientName: string;
  client_user_id?: number | string;
  location: string;
  city?: string;
  distanceKm: number;
  dailyWage: number;
  durationDays: number;
  workers_needed?: number;
  startDate: string;
  clientRating: number;
  requiredSkills: string[];
  description: string;
  matchReasons?: string[];
  status: 'open' | 'applied' | 'accepted' | 'completed';
  hiredWorkerProfileId?: number; // worker_profile_id of the hired worker (from job_applications)
  isBathroomRenovationDemo?: boolean;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  trade: string;
  workerName: string;
  amount: number;
  progress: number;
  status: 'pending' | 'approved' | 'paid';
  proofPhotos: string[];
  completionDate?: string;
  note?: string;
}

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description: string;
  time?: string;
  photos?: string[];
  verified: boolean;
  contributor: string;
  contributesToPassport: boolean;
}

export interface ProjectWorker {
  id: string;
  name: string;
  trade: string;
  photo: string;
  dailyWage: number;
  checkedInToday: boolean;
  checkInTime?: string;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  location: string;
  city?: string;
  startDate: string;
  progressPercent: number;
  budget: number;
  spent: number;
  status: 'planning' | 'in_progress' | 'completed';
  description: string;
  workers: ProjectWorker[];
  milestones: ProjectMilestone[];
  timeline: TimelineItem[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'job' | 'milestone' | 'checkin' | 'passport' | 'review' | 'system';
}

export interface AttendanceState {
  isCheckedIn: boolean;
  checkInTime: string | null;
  locationVerified: boolean;
  progressPercent: number;
  workPhotos: string[];
  dayCompleted: boolean;
}

export interface VerificationRequest {
  id: number | string;
  worker_name: string;
  worker_phone: string;
  worker_avatar?: string;
  profession_name: string;
  nirmaan_id: string;
  level: string;
  type: 'identity' | 'skills' | 'documents';
  status: 'pending' | 'approved' | 'rejected' | 'needs_correction';
  document_type: string;
  document_url?: string;
  remarks?: string;
  created_at: string;
}

export interface DisputeItem {
  id: number | string;
  project_name: string;
  raised_by_name: string;
  raised_by_phone: string;
  against_name: string;
  against_phone: string;
  category: string;
  description: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'ESCALATED';
  resolution_notes?: string;
  created_at: string;
}

export interface EmergencyReportItem {
  id: number | string;
  reporter_name: string;
  reporter_phone: string;
  project_name?: string;
  profession_name?: string;
  location: string;
  emergency_type: string;
  details?: string;
  status: 'OPEN' | 'RESPONDED' | 'RESOLVED';
  reported_at: string;
}

export interface AdminKPIs {
  total_workers: number;
  total_homeowners: number;
  total_contractors: number;
  total_jobs: number;
  active_jobs: number;
  completed_jobs: number;
  active_projects: number;
  completed_projects: number;
  pending_verification: number;
  pending_disputes: number;
  total_recorded_payments: number;
}
