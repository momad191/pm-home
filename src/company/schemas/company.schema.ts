import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type CompanyDocument = Company & Document;

export enum SubscriptionPlan {
  FREE = 'FREE',

  STARTER = 'STARTER',

  PROFESSIONAL = 'PROFESSIONAL',

  ENTERPRISE = 'ENTERPRISE',
}

export enum CompanyStatus {
  ACTIVE = 'ACTIVE',

  INACTIVE = 'INACTIVE',

  SUSPENDED = 'SUSPENDED',
}

@Schema({
  timestamps: true,
})
export class Company {
  @Prop({
    required: true,
    unique: true,
    index: true,
    trim: true,
  })
  companyId: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: 150,
    index: true,
  })
  companyName: string;

  @Prop({
    trim: true,
    maxlength: 200,
  })
  legalName: string;

  @Prop({
    trim: true,
    maxlength: 100,
  })
  industry?: string;

  @Prop({
    trim: true,
    maxlength: 3000,
  })
  description: string;

  @Prop({
    trim: true,
    maxlength: 300,
  })
  website: string;

  @Prop({
    lowercase: true,
    trim: true,
    index: true,
  })
  email: string;

  @Prop({
    trim: true,
    maxlength: 30,
  })
  phone: string;

  @Prop({
    trim: true,
    maxlength: 500,
  })
  address: string;

  @Prop({
    trim: true,
    maxlength: 100,
  })
  city: string;

  @Prop({
    trim: true,
    maxlength: 100,
    index: true,
  })
  country: string;

  @Prop({
    trim: true,
    maxlength: 100,
  })
  timezone: string;

  @Prop({
    trim: true,
    maxlength: 100,
  })
  currency: string;

  @Prop({
    trim: true,
    maxlength: 500,
  })
  logo: string;

  @Prop({
    default: 0,
  })
  employeesCount: number;

  @Prop({
    default: 0,
  })
  projectsCount: number;

  @Prop({
    enum: CompanyStatus,
    default: CompanyStatus.ACTIVE,
    index: true,
  })
  status: CompanyStatus;

  @Prop({
    default: false,
    index: true,
  })
  isDeleted: boolean;

  @Prop({
    trim: true,
    maxlength: 100,
  })
  commercialRegistration: string;

  @Prop({
    trim: true,
    maxlength: 100,
  })
  taxNumber: string;

  @Prop({
    trim: true,
    maxlength: 100,
  })
  ownerName: string;

  @Prop({
    lowercase: true,
    trim: true,
  })
  ownerEmail: string;

  @Prop({
    trim: true,
    maxlength: 20,
  })
  ownerPhone: string;

  @Prop({
    enum: SubscriptionPlan,
    default: SubscriptionPlan.FREE,
  })
  subscriptionPlan: SubscriptionPlan;

  @Prop({
    default: 10,
  })
  maxUsers: number;

  @Prop({
    default: 5,
  })
  maxProjects: number;

  @Prop({
    default: 1024,
  })
  storageLimit: number;

  @Prop()
  lastLogin: Date;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

// CompanySchema.index({
//   companyId: 1,
// });

// CompanySchema.index({
//   companyName: 1,
// });

CompanySchema.index({
  industry: 1,
});

// CompanySchema.index({
//   status: 1,
// });

// CompanySchema.index({
//   country: 1,
// });

CompanySchema.index({
  city: 1,
});

// CompanySchema.index({
//   isDeleted: 1,
// });

// CompanySchema.index({
//   email: 1,
// });

CompanySchema.index({
  phone: 1,
});

CompanySchema.index({
  employeesCount: -1,
});

CompanySchema.index({
  projectsCount: -1,
});

CompanySchema.index({
  companyName: 'text',
  description: 'text',
});

CompanySchema.index({
  commercialRegistration: 1,
});

CompanySchema.index({
  taxNumber: 1,
});
