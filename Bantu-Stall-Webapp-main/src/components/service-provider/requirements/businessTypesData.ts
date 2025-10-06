
import { User, Building2, Briefcase, Users } from 'lucide-react';

export interface RequirementItem {
  label: string;
  key: string;
  description?: string;
}

export interface BusinessType {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  description: string[];
  mandatory: RequirementItem[];
  optional: RequirementItem[];
  exemptions?: string;
  notes?: string[];
}

export const businessTypes: Record<string, BusinessType> = {
  soleProp: {
    id: 'soleProp',
    title: 'Sole Proprietor',
    subtitle: '(Service-based)',
    icon: User,
    description: [
      'Individual offering services (tour guide, chef, facilitator, etc.)',
      'Not trading under a reserved/registered business name'
    ],
    mandatory: [
      {
        label: 'SA ID or Passport',
        key: 'id',
        description: 'Valid South African ID document or foreign passport'
      },
      {
        label: '3 × recent bank-statement PDFs',
        key: 'bank',
        description: 'Last 90 days; same account that will receive payouts'
      },
      {
        label: 'SARS Tax Number (TIN)',
        key: 'tin',
        description: 'System will auto-pull TCS status; you\'ll just need the number'
      }
    ],
    optional: [
      {
        label: 'Valid SARS TCS PIN',
        key: 'tcs',
        description: 'Fast-track approval'
      },
      {
        label: 'Proof of Public-Liability Insurance',
        key: 'pli',
        description: 'Recommended for service providers'
      }
    ],
    exemptions: 'As a non-registered sole prop you\'re exempt from CIPC and B-BBEE documentation. If you upgrade to a Pty Ltd later, we\'ll prompt you for them.'
  },
  
  registeredSoleProp: {
    id: 'registeredSoleProp',
    title: 'Registered Sole Proprietor',
    subtitle: '(Trading-as name reserved)',
    icon: User,
    description: [
      'Individual trading under a reserved business name',
      'Registered with CIPC for business name protection'
    ],
    mandatory: [
      {
        label: 'SA ID or Passport',
        key: 'id'
      },
      {
        label: 'CIPC trading-name confirmation',
        key: 'cipc',
        description: 'Proof of reserved business name'
      },
      {
        label: 'SARS TIN & TCS PIN',
        key: 'sars'
      },
      {
        label: '3 × bank statements',
        key: 'bank'
      }
    ],
    optional: [
      {
        label: 'B-BBEE affidavit',
        key: 'bbee',
        description: 'If claiming Black ownership status'
      }
    ]
  },

  ptyLtd: {
    id: 'ptyLtd',
    title: 'Private Company',
    subtitle: '(Pty Ltd)',
    icon: Building2,
    description: [
      'Incorporated private company with shareholders',
      'Limited liability protection for owners'
    ],
    mandatory: [
      {
        label: 'CIPC CoR14.3',
        key: 'cor14',
        description: 'Certificate of Incorporation'
      },
      {
        label: 'SARS TCS PIN',
        key: 'tcs',
        description: 'Tax Compliance Status PIN'
      },
      {
        label: 'B-BBEE Certificate / Affidavit',
        key: 'bbee',
        description: 'Broad-Based Black Economic Empowerment documentation'
      },
      {
        label: 'Public-Liability Insurance',
        key: 'insurance',
        description: 'Mandatory for incorporated entities'
      }
    ],
    optional: [
      {
        label: 'Shareholder schedule',
        key: 'shareholders',
        description: 'Accelerates Black-Female % validation'
      }
    ]
  },

  cc: {
    id: 'cc',
    title: 'Close Corporation',
    subtitle: '(CC)',
    icon: Briefcase,
    description: [
      'Close corporation with members',
      'Simplified corporate structure (legacy entity type)'
    ],
    mandatory: [
      {
        label: 'CIPC CK1/CK2',
        key: 'ck1',
        description: 'Founding statement and registration documents'
      },
      {
        label: 'SARS TCS PIN',
        key: 'tcs'
      },
      {
        label: 'B-BBEE docs',
        key: 'bbee'
      },
      {
        label: 'Insurance',
        key: 'insurance'
      }
    ],
    optional: [
      {
        label: 'Member resolution',
        key: 'resolution',
        description: 'Naming authorised signatory'
      }
    ]
  },

  npc: {
    id: 'npc',
    title: 'Non-Profit Company',
    subtitle: '(NPC)',
    icon: Users,
    description: [
      'Non-profit organization incorporated for public benefit',
      'Directors instead of shareholders'
    ],
    mandatory: [
      {
        label: 'CIPC CoR14.3 + CoR14.1D',
        key: 'cor14',
        description: 'Certificate of Incorporation + Non-profit confirmation'
      },
      {
        label: 'SARS PBO letter',
        key: 'pbo',
        description: 'Public Benefit Organisation letter (if applicable)'
      },
      {
        label: 'Board resolution',
        key: 'resolution',
        description: 'Authorizing service provider registration'
      },
      {
        label: 'Insurance',
        key: 'insurance'
      }
    ],
    optional: [
      {
        label: 'B-BBEE affidavit',
        key: 'bbee',
        description: 'If turnover ≤ R10 million'
      }
    ]
  }
};
