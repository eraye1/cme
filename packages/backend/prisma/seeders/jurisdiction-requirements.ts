import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type RequirementParams = {
  categoryName: string;
  requiredHours: number;
  maximumHours?: number;
  annualLimit?: number;
  notes?: string;
};

type SpecialRequirementParams = {
  topic: string;
  requiredHours: number;
  description: string;
  effectiveDate?: Date;
  oneTime?: boolean;
  notes?: string;
};

type LegalCitationParams = {
  citation: string;
  url?: string;
};

type ExceptionParams = {
  description: string;
};

type JurisdictionParams = {
  state: string;
  licenseType: 'MD' | 'DO' | 'MD_DO';
  totalHours: number;
  cycleLength: number;
  requirements?: RequirementParams[];
  specialRequirements?: SpecialRequirementParams[];
  legalCitations?: LegalCitationParams[];
  exceptions?: ExceptionParams[];
  carryOverHours?: number;
  verified?: boolean;
  live?: boolean;
  requiresCme?: boolean;
  hasSpecificContent?: boolean;
};

async function createJurisdictionRequirement(params: JurisdictionParams) {
  try {
    console.log(`Upserting ${params.state} ${params.licenseType} requirements...`);
    
    return await prisma.jurisdictionRequirement.upsert({
      where: {
        state_licenseType: {
          state: params.state,
          licenseType: params.licenseType,
        }
      },
      update: {
        verified: params.verified,
        live: params.live,
        requiresCme: params.requiresCme,
        hasSpecificContent: params.hasSpecificContent,
        totalHours: params.totalHours,
        cycleLength: params.cycleLength,
        requirements: {
          deleteMany: {},  // Remove existing requirements
          create: params.requirements || [],
        },
        specialRequirements: {
          deleteMany: {},  // Remove existing special requirements
          create: params.specialRequirements || [],
        },
        legalCitations: {
          deleteMany: {},  // Remove existing citations
          create: params.legalCitations || [],
        },
      },
      create: {
        state: params.state,
        licenseType: params.licenseType,
        verified: params.verified,
        live: params.live,
        requiresCme: params.requiresCme,
        hasSpecificContent: params.hasSpecificContent,
        totalHours: params.totalHours,
        cycleLength: params.cycleLength,
        requirements: {
          create: params.requirements || [],
        },
        specialRequirements: {
          create: params.specialRequirements || [],
        },
        legalCitations: {
          create: params.legalCitations || [],
        },
      },
    });
  } catch (error) {
    console.error(`Error upserting requirement for ${params.state} ${params.licenseType}:`, error);
    throw error;
  }
}

async function seedStates() {
  // Alabama
  await createJurisdictionRequirement({
    state: 'AL',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 25,
    cycleLength: 12,
    requirements: [
      {
        categoryName: 'Category 1',
        requiredHours: 25,
      }
    ],
    specialRequirements: [
      {
        topic: 'Alabama Controlled Substance Certificate (ACSC) holders',
        requiredHours: 2,
        description: 'Required in the area of controlled substances',
        effectiveDate: new Date('2018-04-01'),
      }
    ],
    legalCitations: [
      {
        citation: 'Ala. Admin. Code r. 540-x-14.02',
      }
    ]
  });

  // Alaska
  await createJurisdictionRequirement({
    state: 'AK',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 50,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AMA Category 1 | AOA Category 1 | AOA Category 2',
        requiredHours: 50,
      }
    ],
    specialRequirements: [
      {
        topic: 'Opioid Education',
        requiredHours: 2,
        description: 'Required in pain management and opioid prescribing',
      }
    ],
    legalCitations: [
      {
        citation: 'Alaska Admin. Code tit. 12, § 40.200',
      },
      {
        citation: 'Alaska Statutes § 8-64-312',
      },
      {
        citation: 'Alaska Statutes § 8-36-070(a)',
      }
    ]
  });

  // Arizona - MD
  await createJurisdictionRequirement({
    state: 'AZ',
    licenseType: 'MD',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 40,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'Category 1',
        requiredHours: 40,
      }
    ],
    specialRequirements: [
      {
        topic: 'Opioid Related',
        requiredHours: 3,
        description: 'Required for DEA registrants - opioid-related, substance use disorder-related or addiction-related',
        effectiveDate: new Date('2018-04-01'),
      }
    ],
    legalCitations: [
      {
        citation: 'Ariz. Admin. Code R4-16-102.',
      },
      {
        citation: 'A.R.S. 32-3248.02',
      }
    ]
  });

  // Arizona - DO
  await createJurisdictionRequirement({
    state: 'AZ',
    licenseType: 'DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 40,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AOA Category 1-A',
        requiredHours: 24,
      },
      {
        categoryName: 'AMA Category 1',
        requiredHours: 0,
        maximumHours: 16,
        annualLimit: 16,
        notes: 'No more than 16 hours annually from AMA Category 1',
      }
    ],
    specialRequirements: [
      {
        topic: 'Opioid Related',
        requiredHours: 3,
        description: 'Required for DEA registrants - opioid-related, substance use disorder-related or addiction-related',
        effectiveDate: new Date('2018-04-01'),
      }
    ],
    legalCitations: [
      {
        citation: 'Ariz. Admin. Code R4-22-207',
      },
      {
        citation: 'A.R.S. 32-3248.02',
      }
    ]
  });

  // Arkansas
  await createJurisdictionRequirement({
    state: 'AR',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 20,
    cycleLength: 12,
    requirements: [
      {
        categoryName: 'Category 1',
        requiredHours: 10,
        notes: 'Must be in areas pertaining to the physician\'s primary area of practice',
      }
    ],
    legalCitations: [
      {
        citation: 'Code Ark. R. 060.00.001 Reg. No. 17.',
      }
    ]
  });

  // California - MD
  await createJurisdictionRequirement({
    state: 'CA',
    licenseType: 'MD',
    verified: false,
    live: false,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 50,
    cycleLength: 24,
    specialRequirements: [
      {
        topic: 'Pain Management and End-of-Life Care',
        requiredHours: 12,
        description: 'Required for pain management and end-of-life care',
      },
      {
        topic: 'Implicit Bias',
        requiredHours: 4,
        description: 'Required training in implicit bias',
      }
    ],
    legalCitations: [
      {
        citation: 'Cal. Bus. & Prof. Code § 2190.1',
      }
    ]
  });

    // California - DO
    await createJurisdictionRequirement({
        state: 'CA',
        licenseType: 'DO',
        verified: false,
        live: false,
        requiresCme: true,
        hasSpecificContent: true,
        totalHours: 50,
        cycleLength: 24,
        specialRequirements: [
        {
            topic: 'Pain Management and End-of-Life Care',
            requiredHours: 12,
            description: 'Required for pain management and end-of-life care',
        },
        {
            topic: 'Implicit Bias',
            requiredHours: 4,
            description: 'Required training in implicit bias',
        }
        ],
        legalCitations: [
        {
            citation: 'Cal. Bus. & Prof. Code § 2190.1',
        }
        ]
    });
    
  await createJurisdictionRequirement({
    state: 'CA',
    licenseType: 'MD',
    verified: false,
    live: false,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 50,
    cycleLength: 24,
    specialRequirements: [
      {
        topic: 'Pain Management and End-of-Life Care',
        requiredHours: 12,
        description: 'Required for pain management and end-of-life care',
      },
      {
        topic: 'Implicit Bias',
        requiredHours: 4,
        description: 'Required training in implicit bias',
      }
    ],
    legalCitations: [
      {
        citation: 'Cal. Bus. & Prof. Code § 2190.1',
      }
    ]
  });

  // Colorado
  await createJurisdictionRequirement({
    state: 'CO',
    licenseType: 'MD_DO',
    verified: false,
    live: false,
    requiresCme: true,
    hasSpecificContent: false,
    totalHours: 0,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AMA Category 1 | AAFP | ACOG | National Board Certification',
        requiredHours: 30,
      }
    ],
    specialRequirements: [
      {
        topic: 'Opioid Prescribing',
        requiredHours: 2,
        description: 'On best practices for opioid prescribing, recognition of substance use disorders, referral of patients with substance use disorders for treatment, and use of the Electronic Prescription Drug Monitoring Program.',
        effectiveDate: new Date('2020-03-20'),
        notes: 'Licensees who maintain a national board certification that requires equivalent substance use prevention training, or attests to the Board that the health care provider does not prescribe opioids are exempted.',
      }
    ],
    legalCitations: [
        {
            citation: 'Senate Bill 19-228',
        },
        {
            citation: 'HB 24-1153 (2024)',
        }
    ]
  });

  // Connecticut
  await createJurisdictionRequirement({
    state: 'CT',
    licenseType: 'MD_DO',
    verified: false,
    live: false,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 50,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'Category 1',
        requiredHours: 50,
      }
    ],
    specialRequirements: [
      {
        topic: 'Risk Management',
        requiredHours: 1,
        description: 'Required in risk management',
      },
      {
        topic: 'Infectious Diseases',
        requiredHours: 1,
        description: 'Required in infectious diseases',
      }
    ]
  });

  // Delaware
  await createJurisdictionRequirement({
    state: 'DE',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 40,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AMA Category 1 | AOA Category 1A | AOA Category 1B',
        requiredHours: 40,
      }
    ],
    specialRequirements: [
      {
        topic: 'Controlled Substances',
        requiredHours: 2,
        description: 'Required for controlled substance registration',
        effectiveDate: new Date('2017-01-01'),
      }
    ],
    legalCitations: [
        {
            citation: '24 Del. Admin. Code 1700-12.0.',
        },
        {
            citation: '24 Del. Admin. Code Uniform Controlled Substances Act Regulations 3.1.3',
        }
    ],
    exceptions: [
        {
            description: 'A physician who is renewing his registration for the first time and who has been licensed to practice medicine in Delaware for less thanone year shall not be required to meet any continuing medical education requirements until the time of the next subsequent renewal of his registration.',
        }
    ]
  });

  // District of Columbia
  await createJurisdictionRequirement({
    state: 'DC',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 50,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AMA Category 1',
        requiredHours: 50,
      }
    ],
    specialRequirements: [
      {
        topic: 'HIV/AIDS',
        requiredHours: 3,
        description: 'Required for all physicians',
        effectiveDate: new Date('2018-01-01'),
      },
      {
        topic: 'LGBTQ cultural competency',
        requiredHours: 2,
        description: 'Required for all physicians',
        effectiveDate: new Date('2018-01-01'),
      },
      {
        topic: 'Pharmacology',
        requiredHours: 1,
        description: 'Required for all physicians',
        effectiveDate: new Date('2018-01-01'),
      },
      {
        topic: 'Public Health',
        requiredHours: 5,
        description: 'Topics identified by the Director of the Dept of Health as public health priorities',
        effectiveDate: new Date('2018-01-01'),
      }
    ],
    legalCitations: [
        {
            citation: 'D.C. Mun. Regs. tit.17, § 4614.',
        },
        {
            citation: 'D.C. Official Code § 3–1205.10.',
        }
    ]
  });

  // Florida - MD
  await createJurisdictionRequirement({
    state: 'FL',
    licenseType: 'MD',
    verified: false,
    live: false,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 40,
    cycleLength: 24,
    specialRequirements: [
      {
        topic: 'Domestic Violence',
        requiredHours: 2,
        description: 'Required every third renewal',
      },
      {
        topic: 'Medical Errors',
        requiredHours: 2,
        description: 'Required each renewal period',
      },
      {
        topic: 'Professional Ethics',
        requiredHours: 1,
        description: 'Required each renewal period',
      }
    ]
  });

  // Florida - DO
  await createJurisdictionRequirement({
    state: 'FL',
    licenseType: 'DO',
    verified: false,
    live: false,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 40,
    cycleLength: 24,
    requirements: [
      {
        categoryName: '-A',
        requiredHours: 20,
      }
    ],
    specialRequirements: [
      {
        topic: 'Professional Ethics',
        requiredHours: 1,
        description: 'Required each renewal period',
      },
      {
        topic: 'Medical Errors',
        requiredHours: 2,
        description: 'Required each renewal period',
      }
    ]
  });

  // Georgia
  await createJurisdictionRequirement({
    state: 'GA',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 40,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'Category 1',
        requiredHours: 10,
      }
    ],
    specialRequirements: [
      {
        topic: 'Sexual Misconduct and Professional Boundaries',
        requiredHours: 2,
        description: '',
        effectiveDate: new Date('2022-01-01'),
        oneTime: true,
      },
      {
        topic: 'Opioid Prescribing',
        requiredHours: 3,
        description: 'Required for DEA registrants',
        effectiveDate: new Date('2018-01-01'),
        oneTime: true,
      }
    ],
    legalCitations: [
        {
            citation: 'Ga. Comp. R. & Regs. r. 360-15-.01.',
        },
        {
            citation: 'https://www.mag.org/georgia-composite-medical-board-update/',
        },
        {
            citation: 'GA HB 458 (2021).',
        }
    ],
    exceptions: [
        {
            description: 'The Board may accept certification or recertification by a member of ABMS, the AOA or the Royal College of Physicians and Surgeons ' + 
            'of Canada in lieu of compliance with CME requirements during the cycle in which the certification or recertification is granted.',
        }
    ]
  });

  // Hawaii
  await createJurisdictionRequirement({
    state: 'HI',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: false,
    totalHours: 40,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AMA Category 1 | AOA Category 1A | AOA Category 1B',
        requiredHours: 40,
      }
    ],
    legalCitations: [
      {
        citation: 'Haw. Admin. R. §16-85-33',
      }
    ]
  });

  // Idaho
  await createJurisdictionRequirement({
    state: 'ID',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 40,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AMA Category 1 | AOA Category 1A | AOA Category 1B',
        requiredHours: 40,
      }
    ],
    legalCitations: [
      {
        citation: 'Idaho Admin. Code r. 22.01.01-079.01',
      }
    ],
    exceptions: [
        {
            description: 'The Board may accept certification or recertification by a member of ABMS, the AOA or the Royal College of Physicians and Surgeons ' + 
            'of Canada in lieu of compliance with CME requirements during the cycle in which the certification or recertification is granted.',
        }
    ]
  });

  // Illinois
  await createJurisdictionRequirement({
    state: 'IL',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 150,
    cycleLength: 36,
    requirements: [
      {
        categoryName: 'Category 1',
        requiredHours: 60,
      }
    ],
    specialRequirements: [
      {
        topic: 'Sexual Harassment Prevention',
        requiredHours: 1,
        description: 'Required training in sexual harassment prevention',
      },
      {
        topic: "Alzheimer's and Dementia",
        requiredHours: 1,
        description: 'Required for healthcare professionals treating adults 26 or older',
        effectiveDate: new Date('2023-01-01'),
      },
      {
        topic: 'Implicit Bias',
        requiredHours: 1,
        description: 'Required training in implicit bias awareness',
        effectiveDate: new Date('2023-01-01'),
      },
      {
        topic: 'Opioid Prescribing',
        requiredHours: 3,
        description: 'Required for all physicians',
      }
    ],
    legalCitations: [
      {
        citation: 'Ill. Admin. Code tit.68., § 1285.110',
      },
      {
        citation: '20 ILCS 2105/2105-365',
      },
      {
        citation: '20 ILCS 2105/2105-15.7.',
      }
    ]
  });

  // Indiana
  await createJurisdictionRequirement({
    state: 'IN',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 2, // Special case - only opioid requirement
    cycleLength: 24,
    specialRequirements: [
      {
        topic: 'Opioid Prescribing',
        requiredHours: 2,
        description: 'CME addressing the topic of opioid prescribing and opioid abuse',
        effectiveDate: new Date('2019-07-01'),
      }
    ],
    legalCitations: [
      {
        citation: 'IC 35-48-3-3.5',
      }
    ]
  });

  // Iowa
  await createJurisdictionRequirement({
    state: 'IA',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 40,
    carryOverHours: 20,
    cycleLength: 24,
    specialRequirements: [
      {
        topic: 'Dependent Adult Abuse',
        requiredHours: 2,
        description: 'Required for primary care providers every 5 years',
      },
      {
        topic: 'Child Abuse',
        requiredHours: 2,
        description: 'Required for primary care providers that deal with children every 5 years',
      },
      {
        topic: 'Chronic Pain Management',
        requiredHours: 2,
        description: 'Required for primary care providers every 5 years',
      },
      {
        topic: 'End-of-Life Care',
        requiredHours: 2,
        description: 'Required for primary care providers every 5 years',
      }
    ],
    legalCitations: [
      {
        citation: 'Iowa Admin. Code r. 653-11.4(1)',
      },
      {
        citation: 'Iowa Admin. Code r. 653-11.2(2).',
      },
      {
        citation: 'Iowa Admin. Code r. 653-11.4(272C)',
      }
    ],
    exceptions: [
      {
        description: 'The Board will accept participation in an approved resident training program or board ' + 
        'certification or recertification by an ABMS or AOA specialty board within the licensing period.',
      }
    ]
  });

  // Kansas
  await createJurisdictionRequirement({
    state: 'KS',
    licenseType: 'MD_DO',
    verified: false,
    live: false,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 50,
    cycleLength: 18,
    requirements: [
      {
        categoryName: 'AMA Category 1',
        requiredHours: 20,
      },
      {
        categoryName: 'AMA Category 2',
        requiredHours: 30,
      }
    ],
    legalCitations: [
      {
        citation: 'Kan. Admin. Regs. § 100-15-5',
      }
    ]
  });

  // Kentucky
  await createJurisdictionRequirement({
    state: 'KY',
    licenseType: 'MD_DO',
    verified: true,
    live: true, 
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 60,
    cycleLength: 36,
    requirements: [
      {
        categoryName: 'AMA Category 1',
        requiredHours: 30,
      }
    ],
    specialRequirements: [
      {
        topic: 'Domestic Violence',
        requiredHours: 1, 
        description: 'Required for all physicians',
        oneTime: true,
      },
      {
        topic: 'HIV/AIDS',
        requiredHours: 2,
        description: 'Required once every 10 years',
      },
      {
        topic: 'KASPER, Pain Management, and Addiction',
        requiredHours: 4.5,
        description: 'Required for prescribing/dispensing controlled substances',
        effectiveDate: new Date('2015-01-01'),
      }
    ],
    legalCitations: [
      {
        citation: '201 KAR 9:310',
      }
    ]
  });

  // Louisiana
  await createJurisdictionRequirement({
    state: 'LA',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 20,
    cycleLength: 12,
    requirements: [
      {
        categoryName: 'AMA Category 1',
        requiredHours: 20,
      }
    ],
    specialRequirements: [
      {
        topic: 'Drug Diversion',
        requiredHours: 3,
        description: 'One-time requirement for CDS licensees on drug diversion, best prescribing practices, and addiction treatment',
        effectiveDate: new Date('2018-01-01'),
      },
      {
        topic: 'Board Orientation',
        requiredHours: 0,
        description: 'One-time course required for new licensees on Medical Practice Act and Board rules',
        oneTime: true,
      }
    ],
    legalCitations: [
      {
        citation: 'La. Admin. Code tit. 46, pt. XLV, §§ 435',
      }
    ]
  });

  // Maine - MD
  await createJurisdictionRequirement({
    state: 'ME',
    licenseType: 'MD',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 100,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AMA Category 1',
        requiredHours: 40,
      }
    ],
    specialRequirements: [
      {
        topic: 'Opioid Prescribing',
        requiredHours: 3,
        description: 'Required for physicians who prescribe controlled substances',
      }
    ],
    legalCitations: [
      {
        citation: 'Code Me. R 02-373 Ch.1 § 11',
      }
    ]
  });

  // Maine - DO
  await createJurisdictionRequirement({
    state: 'ME',
    licenseType: 'DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 100,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AOA Category 1',
        requiredHours: 40,
      }
    ],
    specialRequirements: [
      {
        topic: 'Opioid Prescribing',
        requiredHours: 3,
        description: 'Required for physicians who prescribe controlled substances',
      }
    ],
    legalCitations: [
      {
        citation: 'Code Me. R. 02-383 Ch. 14 §§ 1-2',
      }
    ]
  });

  // Maryland
  await createJurisdictionRequirement({
    state: 'MD',
    licenseType: 'MD',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 50,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AMA Category 1',
        requiredHours: 50,
      }
    ],
    specialRequirements: [
      {
        topic: 'Controlled Substances',
        requiredHours: 2,
        description: 'Required for CDS registration',
        effectiveDate: new Date('2018-10-01'),
      },
      {
        topic: 'Implicit Bias',
        requiredHours: 0,
        description: 'Required training program for first renewal after April 1, 2022',
        effectiveDate: new Date('2021-10-01'),
      }
    ],
    legalCitations: [
      {
        citation: 'COMAR 10.32.01.10',
      },
      {
        citation: 'HB 1452 of 2018',
      }
    ]
  });

  // Massachusetts
  await createJurisdictionRequirement({
    state: 'MA',
    licenseType: 'MD_DO',
    verified: false,
    live: false,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 50,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'Risk Management',
        requiredHours: 10,
        notes: 'May be Category 1 or 2',
      }
    ],
    specialRequirements: [
      {
        topic: 'End-of-Life Care',
        requiredHours: 2,
        description: '',
        oneTime: true,
      },
      {
        topic: 'Opioid Education',
        requiredHours: 3,
        description: 'Required if prescribing controlled substances',
      },
      {
        topic: 'Electronic Health Records',
        requiredHours: 3,
        description: 'Required under state law',
      },
      {
        topic: 'Implicit Bias',
        requiredHours: 2,
        description: 'Required for initial licensure and renewal',
        effectiveDate: new Date('2022-06-01'),
      }
    ],
    legalCitations: [
      {
        citation: 'Board of Registration in Medicine, Policy 2017-05',
      },
      {
        citation: 'Board of Registration in Medicine, Policy 2019-06',
      }
    ]
  });

  // Michigan (MD)
  await createJurisdictionRequirement({
    state: 'MI',
    licenseType: 'MD',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 150,
    cycleLength: 36,
    requirements: [
      {
        categoryName: 'AMA Category 1',
        requiredHours: 75,
      }
    ],
    specialRequirements: [
      {
        topic: 'Medical Ethics',
        requiredHours: 1,
        description: 'Required in medical ethics',
      },
      {
        topic: 'Pain and Symptom Management',
        requiredHours: 3,
        description: 'Required in pain and symptom management',
        effectiveDate: new Date('2017-12-06'),
      },
      {
        topic: 'Implicit Bias',
        requiredHours: 1,
        description: 'Required for new applicants, 2 hours for the first time, 1 hour for renewals',
        effectiveDate: new Date('2022-06-01'),
      }
    ],
    legalCitations: [
      {
        citation: 'Mich. Admin. Code r. 338.2371-.2382',
      }
    ]
  });

  // Michigan (DO)
  await createJurisdictionRequirement({
    state: 'MI',
    licenseType: 'DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 150,
    cycleLength: 36,
    requirements: [
      {
        categoryName: 'AMA Category 1',
        requiredHours: 60,
      }
    ],
    specialRequirements: [
      {
        topic: 'Pain and Symptom Management',
        requiredHours: 3,
        description: 'Required in pain and symptom management',
        effectiveDate: new Date('2017-12-06'),
      },
      {
        topic: 'Implicit Bias',
        requiredHours: 2,
        description: 'Required for new applicants, 1 hour annually for renewals',
        effectiveDate: new Date('2022-06-01'),
      }
    ],
    legalCitations: [
      {
        citation: 'Mich. Admin. Code r. 338.91-.99',
      }
    ]
  });

  // Minnesota
  await createJurisdictionRequirement({
    state: 'MN',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 75,
    cycleLength: 36,
    requirements: [
      {
        categoryName: 'Category 1',
        requiredHours: 75,
      }
    ],
    legalCitations: [
      {
        citation: 'Minnesota Rules, part 5605.0100-.1200',
      }
    ]
  });

  // Mississippi
  await createJurisdictionRequirement({
    state: 'MS',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 40,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'Category 1',
        requiredHours: 40,
      }
    ],
    specialRequirements: [
      {
        topic: 'Prescribing Medications',
        requiredHours: 5,
        description: 'Required for DEA certificate holders, emphasis on controlled substances',
      }
    ],
    legalCitations: [
      {
        citation: 'Code Miss. Rules 50 013 001',
      }
    ]
  });

  // Missouri
  await createJurisdictionRequirement({
    state: 'MO',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 50,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AMA Category 1/AOA Category 1A or 2A',
        requiredHours: 50,
        notes: 'Or 40 hours Category 1/1A with proof of post-testing',
      }
    ],
    legalCitations: [
      {
        citation: 'Mo. Code Regs. Ann. Tit. 20, 2150- 2.125',
      }
    ]
  });

  // Montana
  await createJurisdictionRequirement({
    state: 'MT',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: false,
    hasSpecificContent: false,
    totalHours: 0,
    cycleLength: 0,
  });

  // Nebraska
  await createJurisdictionRequirement({
    state: 'NE',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 50,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'Category 1',
        requiredHours: 50,
      }
    ],
    specialRequirements: [
      {
        topic: 'Opioid Prescribing',
        requiredHours: 3,
        description: 'Required for prescribing controlled substances, including PDMP training',
        effectiveDate: new Date('2018-10-01'),
      }
    ],
    legalCitations: [
      {
        citation: 'Neb. Admin. R. & Regs. Tit. 172, Ch. 88, § 016',
      }
    ]
  });

  // Nevada (MD)
  await createJurisdictionRequirement({
    state: 'NV',
    licenseType: 'MD',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 40,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AMA Category 1',
        requiredHours: 40,
      }
    ],
    specialRequirements: [
      {
        topic: 'Ethics/Pain Management/Addiction',
        requiredHours: 2,
        description: 'Must be in medical ethics, pain management, or addiction care',
      },
      {
        topic: 'Controlled Substances',
        requiredHours: 2,
        description: 'Must be in misuse and abuse of controlled substances, prescribing of opioids, or addiction',
      },
      {
        topic: 'Suicide Prevention',
        requiredHours: 2,
        description: 'Required every 4 years in suicide detection, intervention, and prevention',
      },
      {
        topic: 'WMD/Bioterrorism',
        requiredHours: 4,
        description: 'Required within 2 years of licensure',
        oneTime: true,
      }
    ],
    legalCitations: [
      {
        citation: 'Nev. Rev. Stat. 630.253',
      },
      {
        citation: 'Nev. Admin. Code ch. 630, s. 153, 154, 155.',
      }
    ]
  });

  // Nevada (DO)
  await createJurisdictionRequirement({
    state: 'NV',
    licenseType: 'DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 35,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AOA Category 1A',
        requiredHours: 35,
      }
    ],
    specialRequirements: [
      {
        topic: 'Ethics/Pain Management/Addiction',
        requiredHours: 2,
        description: 'Must be in medical ethics, pain management, or addiction care',
      },
      {
        topic: 'Suicide Prevention',
        requiredHours: 2,
        description: 'Required every 4 years in suicide detection, intervention, and prevention',
      },
    ],
    legalCitations: [
      {
        citation: 'Nev. Rev. Stat. 633.250',
      }
    ]
  });

  // New Hampshire
  await createJurisdictionRequirement({
    state: 'NH',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 100,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'Category 1',
        requiredHours: 40,
      }
    ],
    specialRequirements: [
      {
        topic: 'Pain Management',
        requiredHours: 3,
        description: 'Required in pain management',
      }
    ],
    legalCitations: [
      {
        citation: 'N.H. Rev. Stat. 329:16-g',
      },
      {
        citation: 'N.H. Admin. R. Ann. Med 402.01.',
      }
    ]
  });

  // New Jersey
  await createJurisdictionRequirement({
    state: 'NJ',
    licenseType: 'MD',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 100,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AMA Category 1',
        requiredHours: 40,
      }
    ],
    specialRequirements: [
      {
        topic: 'Cultural Competence',
        requiredHours: 6,
        description: 'Required for physicians licensed prior to 3/2/2005',
      },
      {
        topic: 'End-of-Life Care',
        requiredHours: 2,
        description: 'Required Category 1 Credits',
      },
      {
        topic: 'Opioid Prescribing',
        requiredHours: 1,
        description: 'Required for 2019 renewals and after',
        effectiveDate: new Date('2019-01-01'),
      },
      {
        topic: 'Orientation Attendance',
        requiredHours: 2,
        description: 'Required for newly licensed physicians, no CME credit involved',
        oneTime: true,
      }
    ],
    legalCitations: [
      {
        citation: 'N.J. Stat. Ann. § 45:9-7.1',
      },
      {
        citation: 'N.J. Admin. Code 13:35-6.15',
      },
      {
        citation: 'N.J. P.L. 2011, c.145 (C45: 9-7.7)',
      },
      {
        citation: 'N.J. P.L. 2017, c. 28',
      }
    ]
  });

  // New Mexico
  await createJurisdictionRequirement({
    state: 'NM',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 75,
    cycleLength: 36,
    requirements: [
      {
        categoryName: 'Category 1',
        requiredHours: 75,
      }
    ],
    specialRequirements: [
      {
        topic: 'Pain Management',
        requiredHours: 5,
        description: 'Required for DEA registrants and new licensees',
      }
    ],
    legalCitations: [
      {
        citation: 'N.M. Admin. Code § 16.10.4',
      }
    ]
  });

  // New York
  await createJurisdictionRequirement({
    state: 'NY',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 2, // Special case - only specific content requirements
    cycleLength: 48,
    specialRequirements: [
      {
        topic: 'Child Abuse Identification',
        requiredHours: 2,
        description: 'Required for identifying and reporting child abuse',
      },
      {
        topic: 'Infection Control',
        requiredHours: 0,
        description: 'Required coursework every four years',
      },
      {
        topic: 'Pain Management',
        requiredHours: 3,
        description: 'Required for DEA registrants - includes pain management, palliative care, and addiction',
      }
    ],
    legalCitations: [
      {
        citation: 'N.Y. Comp. Codes, R. & Regs. tit. 8, §§ 59.12, 59.13',
      }
    ]
  });

  // North Carolina
  await createJurisdictionRequirement({
    state: 'NC',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 60,
    cycleLength: 36,
    requirements: [
      {
        categoryName: 'Category 1',
        requiredHours: 60,
        notes: 'Must be relevant to current/intended specialty or practice area',
      }
    ],
    specialRequirements: [
      {
        topic: 'Controlled Substance Prescribing',
        requiredHours: 3,
        description: 'Only for physicians who prescribe controlled substances. ' + 
        'Must address controlled substance prescribing practices, recognizing abuse signs, and chronic pain management',
      }
    ],
    legalCitations: [
      {
        citation: 'N.C. Admin. Code tit. 21, r. 32R.0101',
      }
    ]
  });

  // North Dakota
  await createJurisdictionRequirement({
    state: 'ND',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 60,
    cycleLength: 36,
    requirements: [
      {
        categoryName: 'Category 1',
        requiredHours: 60,
      }
    ],
    legalCitations: [
      {
        citation: 'N.D. Admin. Code 50-04-01-01',
      }
    ]
  });

  // Ohio
  await createJurisdictionRequirement({
    state: 'OH',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 100,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'Category 1',
        requiredHours: 40,
      }
    ],
    specialRequirements: [
      {
        topic: 'Pain Medicine',
        requiredHours: 1,
        description: 'Required only for owners of pain management clinics',
        effectiveDate: new Date('2021-05-31'),
      },
      {
        topic: 'Duty to Report',
        requiredHours: 1,
        description: 'Required on licensee\'s duty to report misconduct',
        effectiveDate: new Date('2021-05-31'),
      }
    ],
    legalCitations: [
      {
        citation: 'Ohio Rev. Code Ann. § 4731.281, 282, 283',
      },
      {
        citation: 'Ohio Admin. Code §§ 4731-10-01 through 4731-10-15',
      }
    ]
  });

  // Oklahoma (MD)
  await createJurisdictionRequirement({
    state: 'OK',
    licenseType: 'MD',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 60,
    cycleLength: 36,
    requirements: [
      {
        categoryName: 'Category 1',
        requiredHours: 60,
      }
    ],
    specialRequirements: [
      {
        topic: 'Pain Management/Opioid Use',
        requiredHours: 2,
        description: 'Required annually for DEA registrants',
        effectiveDate: new Date('2018-11-01'),
      }
    ],
    legalCitations: [
      {
        citation: 'Okla. Admin. Code § 435:10-15-1',
      }
    ]
  });

  // Oklahoma (DO)
  await createJurisdictionRequirement({
    state: 'OK',
    licenseType: 'DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 16,
    cycleLength: 12,
    requirements: [
      {
        categoryName: 'AOA Category 1A or 1B',
        requiredHours: 16,
      }
    ],
    specialRequirements: [
      {
        topic: 'Controlled Substances',
        requiredHours: 1,
        description: 'Required annually on prescribing, dispensing, and administering controlled substances',
      }
    ],
    legalCitations: [
      {
        citation: 'Okla. Admin. Code § 435:10-3-8',
      }
    ]
  });

  // Oregon
  await createJurisdictionRequirement({
    state: 'OR',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 60,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'Category 1',
        requiredHours: 60,
        notes: '30 hours if licensed during second year of biennium',
      }
    ],
    specialRequirements: [
      {
        topic: 'Pain Management',
        requiredHours: 1,
        description: 'Required pain management course',
      },
      {
        topic: 'Pain Management/Terminal Illness',
        requiredHours: 6,
        description: 'Pain management and/or treatment of terminally ill patients',
      }
    ],
    legalCitations: [
      {
        citation: 'Or. Admin. R § 847-008-0070',
      },
      {
        citation: 'Or. Admin. R. § 847-008-0075(1)',
      }
    ]
  });

  // Pennsylvania (MD)
  await createJurisdictionRequirement({
    state: 'PA',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 100,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'Category 1',
        requiredHours: 20,
      }
    ],
    specialRequirements: [
      {
        topic: 'Patient Safety/Risk Management',
        requiredHours: 12,
        description: 'Required hours in patient safety or risk management',
      },
      {
        topic: 'Child Abuse',
        requiredHours: 2,
        description: 'Required in child abuse recognition and reporting',
      },
      {
        topic: 'Opioid Education',
        requiredHours: 2,
        description: 'Required in pain management or addiction identification',
      },
      {
        topic: 'Opioid Education (On initial licensure)',
        requiredHours: 2,
        description: 'In addition to the two hours required on re-licensure',
        oneTime: true,
      }
    ],
    legalCitations: [
      {
        citation: 'Pa. Code tit. 49, § 16.19',
      },
      {
        citation: '35 P. S. § 872.3.',
      },
      {
        citation: 'Pa. Code tit. 49, § 25.271.',
      }
    ]
  });

  // Rhode Island
  await createJurisdictionRequirement({
    state: 'RI',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 40,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AMA Category 1 | AOA Category 1A',
        requiredHours: 40,
      }
    ],
    specialRequirements: [
      {
        topic: 'Universal Precautions',
        requiredHours: 2,
        description: 'Must include universal precautions, infection control, modes of transmission, bioterrorism, end of life education, palliative care, OHSA, ethics, or pain management',
      }
    ],
    legalCitations: [
      {
        citation: 'Code R.I. R. r. 14.140.031(6)',
      }
    ]
  });

  // South Carolina
  await createJurisdictionRequirement({
    state: 'SC',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 40,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AMA Category 1',
        requiredHours: 40,
        notes: 'At least 30 hours must be related to the licensee\'s practice area',
      }
    ],
    specialRequirements: [
      {
        topic: 'Controlled Substances',
        requiredHours: 2,
        description: 'Must address approved procedures for prescribing and monitoring schedules II-IV controlled substances',
      }
    ],
    legalCitations: [
      {
        citation: 'SC Code § 40-47-40',
      },
      {
        citation: 'S.C. Code Regs. 81-95',
      }
    ]
  });

  // South Dakota
  await createJurisdictionRequirement({
    state: 'SD',
    licenseType: 'MD',
    verified: true,
    live: true,
    requiresCme: false,
    hasSpecificContent: false,
    totalHours: 0,
    cycleLength: 0,
  });

  // Tennessee (MD)
  await createJurisdictionRequirement({
    state: 'TN',
    licenseType: 'MD',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 40,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AMA Category 1',
        requiredHours: 40,
      }
    ],
    specialRequirements: [
      {
        topic: 'Controlled Substance Prescribing',
        requiredHours: 2,
        description: 'Must include instruction in Department treatment guidelines on opioids, benzodiazepines, barbiturates, and carisoprodol',
      }
    ],
    legalCitations: [
      {
        citation: 'Tenn. Comp. R. & Regs. 0880-02-.14',
      },
      {
        citation: 'Tenn. Comp. R. & Regs. 0880-02-.19',
      }
    ]
  });

  // Tennessee (DO)
  await createJurisdictionRequirement({
    state: 'TN',
    licenseType: 'DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 40,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AOA Category 1A | AOA Category 2A',
        requiredHours: 40,
      }
    ],
    specialRequirements: [
      {
        topic: 'Prescribing Practices',
        requiredHours: 2,
        description: 'Required course(s) specifically addressing prescribing practices',
      }
    ],
    legalCitations: [
      {
        citation: 'Tenn. Comp. R. & Regs. 1050-02-.12',
      }
    ]
  });

  // Texas
  await createJurisdictionRequirement({
    state: 'TX',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 48,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AMA Category 1 | AOA Category 1A',
        requiredHours: 24,
      }
    ],
    specialRequirements: [
      {
        topic: 'Medical Ethics/Professional Responsibility',
        requiredHours: 2,
        description: 'Including risk management, domestic abuse, child abuse',
      },
      {
        topic: 'Human Trafficking Prevention',
        requiredHours: 1,
        description: 'Required as part of ethics requirement',
      },
      {
        topic: 'Pain Management',
        requiredHours: 2,
        description: 'Required for first two renewal periods and every eight years thereafter',
      },
      {
        topic: 'Pain Management Clinics',
        requiredHours: 10,
        description: 'Required for licensees practicing in pain management clinics',
      },
      

    ],
    legalCitations: [
      {
        citation: 'TX Occupations Code §§ 156.051 through 156.057',
      },
      {
        citation: 'Tex. Admin. Code tit. 22, § 166.2',
      },
      {
        citation: 'Tex. Admin. Code tit. 22, § 195.2',
      },
      {
        citation: 'Tex. Admin. Code tit. 22, § 166.2',
      }
    ]
  });

  // Utah
  await createJurisdictionRequirement({
    state: 'UT',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 40,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AMA Category 1 | AOA Category 1A',
        requiredHours: 34,
      }
    ],
    specialRequirements: [
      {
        topic: 'Controlled Substances',
        requiredHours: 3.5,
        description: 'Required for controlled substance prescribers',
      },
      {
        topic: 'Suicide Prevention',
        requiredHours: 1,
        description: 'Must complete online suicide prevention training from DOPL list',
      }
    ],
    legalCitations: [
      {
        citation: 'Utah Admin. Code r. 156-67-304',
      }
    ]
  });

  // Vermont (MD)
  await createJurisdictionRequirement({
    state: 'VT',
    licenseType: 'MD',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 30,
    cycleLength: 24,
    specialRequirements: [
      {
        topic: 'Hospice/Palliative Care',
        requiredHours: 1,
        description: 'Required in hospice, palliative care, or pain management services',
      },
      {
        topic: 'Prescribing Controlled Substances',
        requiredHours: 2,
        description: 'Required for DEA registrants in safe prescribing and pain management',
      }
    ],
    legalCitations: [
      {
        citation: '12-5 Vt. Code R. § 200',
      }
    ]
  });

  // Vermont (DO)
  await createJurisdictionRequirement({
    state: 'VT',
    licenseType: 'DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 30,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'Osteopathic Medical Education',
        requiredHours: 12,
        notes: '40% must be osteopathic medical education',
      }
    ],
    legalCitations: [
      {
        citation: 'Code Vt. R. 04 030 220',
      }
    ]
  });

  // Virginia
  await createJurisdictionRequirement({
    state: 'VA',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 60,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AMA Category 1 | AOA Category 1A',
        requiredHours: 30,
      }
    ],
    specialRequirements: [
      {
        topic: 'Pain Management',
        requiredHours: 2,
        description: 'Must include pain management, proper prescribing of controlled substances, and addiction management',
      }
    ],
    legalCitations: [
      {
        citation: 'Va. Admin. Code 85-20-235',
      }
    ]
  });

  // Washington (MD)
  await createJurisdictionRequirement({
    state: 'WA',
    licenseType: 'MD',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 200,
    cycleLength: 48,
    specialRequirements: [
      {
        topic: 'Suicide Assessment',
        requiredHours: 6,
        description: 'One-time requirement in suicide assessment, treatment, and management',
        oneTime: true,
      },
      {
        topic: 'Opioid Prescribing',
        requiredHours: 1,
        description: 'One-time requirement in opioid prescribing best practices',
        effectiveDate: new Date('2019-01-01'),
        oneTime: true,
      }
    ],
    legalCitations: [
      {
        citation: 'WAC 246-919-421-480',
      },
      {
        citation: 'WAC 246-919-435',
      },
      {
        citation: 'WAC 246-919-875',
      }
    ]
  });

  // Washington (DO)
  await createJurisdictionRequirement({
    state: 'WA',
    licenseType: 'DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 150,
    cycleLength: 36,
    requirements: [
      {
        categoryName: 'AMA Category 1 | AOA Category 1A',
        requiredHours: 60,
      }
    ],
    specialRequirements: [
      {
        topic: 'Suicide Assessment',
        requiredHours: 6,
        description: 'One-time requirement in suicide assessment, treatment, and management',
      },
      {
        topic: 'Opioid Prescribing',
        requiredHours: 1,
        description: 'One-time requirement in opioid prescribing best practices',
        effectiveDate: new Date('2019-01-01'),
      }
    ],
    legalCitations: [
      {
        citation: 'WAC 246-853-070',
      }
    ]
  });

  // West Virginia (MD)
  await createJurisdictionRequirement({
    state: 'WV',
    licenseType: 'MD',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 50,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AMA Category 1',
        requiredHours: 50,
        notes: 'Up to 20 hours may be earned by teaching or precepting',
      }
    ],
    specialRequirements: [
      {
        topic: 'Drug Diversion',
        requiredHours: 3,
        description: 'Required in drug diversion training and best practice prescribing',
        effectiveDate: new Date('2014-05-01'),
      }
    ],
    legalCitations: [
      {
        citation: 'W. Va. R. tit. 11, § 6-3',
      },
      {
        citation: 'W. Va. Code, § 30-3-12',
      }
    ],
    exceptions: [
      {
        description: 'The Board will accept as equivalent to 47 hours of Category 1 activity, participation in a board certification or recertification by an ABMS specialty board within the licensing period.',
      }
    ]
  });

  // West Virginia (DO)
  await createJurisdictionRequirement({
    state: 'WV',
    licenseType: 'DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 32,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AMA Category 1A | AOA Category 1B',
        requiredHours: 16,
      }
    ],
    specialRequirements: [
      {
        topic: 'Drug Diversion',
        requiredHours: 3,
        description: 'Required in drug diversion training and best practice prescribing',
        effectiveDate: new Date('2014-05-01'),
      }
    ],
    legalCitations: [
      {
        citation: 'W. Va. R. tit. 11, § 6-3',
      },
      {
        citation: 'W. Va. Code, § 30-3-12',
      }
    ],
    exceptions: [
      {
        description: 'A licensee participating in a clinical residency program for more than nine months out of the most recent licensing period may substitute a verification of participation in lieu of documentation of the CME hours specified.',
      }
    ]
  });

  // Wisconsin
  await createJurisdictionRequirement({
    state: 'WI',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 30,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AMA Category 1 | AOA Category 1A | AOA Category 1B | AMA Category 2',
        requiredHours: 30,
      }
    ],
    specialRequirements: [
      {
        topic: 'Opioid Prescribing',
        requiredHours: 2,
        description: 'Required on opioid prescribing guidelines issued by the Board',
      }
    ],
    legalCitations: [
      {
        citation: 'Wis. Admin. Code MED § 13.02',
      }
    ]
  });

  // Wyoming
  await createJurisdictionRequirement({
    state: 'WY',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 60,
    cycleLength: 36,
    requirements: [
      {
        categoryName: 'AMA Category 1 | AOA Category 1A | AOA Category 1B | AMA Category 2',
        requiredHours: 60,
      }
    ],
    legalCitations: [
      {
        citation: 'WY Rules & Regulations AI BM Ch.1 s5',
      }
    ]
  });
}

async function seedTerritories() {
  // Guam
  await createJurisdictionRequirement({
    state: 'GU',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 100,
    cycleLength: 24,
    requirements: [
      {
        categoryName: 'AMA Category 1 | AOA Category 1A',
        requiredHours: 25,
      }
    ],
    legalCitations: [
      {
        citation: '25 GAR Prof. & Voc. Regs § 11101(g)(9).',
      }
    ]
  });

  // Northern Mariana Islands (MP)
  await createJurisdictionRequirement({
    state: 'MP',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 25,
    cycleLength: 12,
    requirements: [
      {
        categoryName: 'AMA Category 1 | AOA Category 1A',
        requiredHours: 25,
      }
    ],
    legalCitations: [
      {
        citation: 'Public Law No. 7-48.',
      }
    ]
  });

  // Puerto Rico (PR)
  await createJurisdictionRequirement({
    state: 'PR',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 60,
    cycleLength: 36,
    requirements: [
      {
        categoryName: 'AMA Category 1',
        requiredHours: 40,
        notes: '20 hours must be related to the licensee\'s practice area',
      }
    ],
    specialRequirements: [
      {
        topic: 'Disease Prevention',
        requiredHours: 10,
        description: '',
      },
      {
        topic: 'Emergency Medicine',
        requiredHours: 20,
        description: 'Must including courses in life support (CPR, ACLS, and PALS), emergency management, and the study of emergency medicine',
        notes: 'Only required for physicians providing direct or indirect hospital emergency room services',
      },
      {
        topic: 'Bioethics and Professionalism',
        requiredHours: 6,
        description: '',
      }
    ],
    legalCitations: [
      {
        citation: '12-5 Vt. Code R. § 200',
      }
    ]
  });

  // Virgin Islands (VI)
  await createJurisdictionRequirement({
    state: 'VI',
    licenseType: 'MD_DO',
    verified: true,
    live: true,
    requiresCme: true,
    hasSpecificContent: true,
    totalHours: 25,
    cycleLength: 12,
    requirements: [
      {
        categoryName: 'AMA Category 1 | AOA Category 1A',
        requiredHours: 25,
      }
    ],
    legalCitations: [
      {
        citation: 'VI Code 27 § 38d',
      }
    ]
  });
}

async function seedRequirements() {
  try {
    console.log('Starting to upsert jurisdiction requirements...');
    
    const existingCount = await prisma.jurisdictionRequirement.count();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing requirements`);
      console.log('Will update existing entries and create new ones...');
    }
    
    await seedStates();
    console.log('✓ States seeded');

    await seedTerritories();
    console.log('✓ Territories seeded');
    
    const finalCount = await prisma.jurisdictionRequirement.count();
    console.log(`Seeding complete. Total requirements: ${finalCount}`);
  } catch (error) {
    console.error('Error upserting jurisdiction requirements:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Starting seeding...');
    await seedRequirements();
    console.log('Seeding completed.');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main(); 