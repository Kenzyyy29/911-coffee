export interface Career {
  id?: string;
  title: string;
  description: string;
  outlet: string;
  requirements: string[];
  responsibilities: string[];
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP'
  isActive: boolean;
  salaryRange?: string;
  createdAt?: string;
  updatedAt?: string;
}