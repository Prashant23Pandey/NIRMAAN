import { Worker, Job, Project, NotificationItem } from '../types';

/**
 * NIRMAAN 2.0 — Initial Clean State
 * No fake users, no fake workers, no fake jobs, no fake projects, and no fake notifications.
 * Platform data is populated exclusively through genuine MySQL database records.
 */

export const initialWorkers: Worker[] = [];

export const initialJobs: Job[] = [];

export const initialProject: Project = {
  id: '',
  name: '',
  category: 'Renovation',
  location: '',
  startDate: '',
  progressPercent: 0,
  budget: 0,
  spent: 0,
  status: 'planning',
  description: '',
  workers: [],
  milestones: [],
  timeline: [],
};

export const initialNotifications: NotificationItem[] = [];
