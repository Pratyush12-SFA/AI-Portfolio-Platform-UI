declare namespace Portfolio {
  interface Profile {
    Id?: number;
    UserId?: number;
    FullName?: string;
    Headline?: string;
    Summary?: string;
    PhoneNumber?: string;
    ContactEmail?: string;
    Address?: string;
    ProfilePictureUrl?: string;
    BannerPictureUrl?: string;
    ThemeName?: string;
    ThemeConfigJson?: string;
    CustomSlug?: string;
    IsPublic?: boolean;
    SelectedThemeId?: number;
    RowVersion?: number[];
    // Aliases for backend mapping
    ProfileHeadline?: string;
    ProfileSummary?: string;
    ContactPhone?: string;
  }

  interface Education {
    Id?: number;
    ResumeId?: number;
    Institution: string;
    Degree: string;
    FieldOfStudy?: string;
    StartDate: string;
    EndDate?: string;
    IsCurrent?: boolean;
    Grade?: string;
    Description?: string;
    OrderIndex?: number;
    DisplayOrder?: number;
    CreatedBy?: string;
    CreatedFromIp?: string;
    CreatedOn?: string;
    RowVersion?: number[];
  }

  interface Experience {
    Id?: number;
    ResumeId?: number;
    CompanyName: string;
    JobTitle: string;
    Location?: string;
    StartDate: string;
    EndDate?: string;
    IsCurrent?: boolean;
    Description?: string;
    Responsibilities?: string;
    EmploymentType?: string;
    OrderIndex?: number;
    DisplayOrder?: number;
    // Aliases for frontend compat
    Company?: string;
    Position?: string;
    Designation?: string;
  }

  interface Project {
    Id?: number;
    ResumeId?: number;
    Title: string;
    Description?: string;
    TechStack?: string;
    ProjectUrl?: string;
    GithubUrl?: string;
    StartDate?: string;
    EndDate?: string;
    Role?: string;
    OrderIndex?: number;
    DisplayOrder?: number;
    ThumbnailUrl?: string;
    // Aliases
    Technologies?: string;
    Url?: string;
    LiveDemoUrl?: string;
  }

  interface Skill {
    Id?: number;
    ResumeId?: number;
    Name: string;
    Category?: string;
    ProficiencyLevel?: string;
    OrderIndex?: number;
    DisplayOrder?: number;
  }

  interface Certification {
    Id?: number;
    ResumeId?: number;
    Name: string;
    IssuingOrganization?: string;
    IssueDate?: string;
    ExpiryDate?: string;
    CredentialId?: string;
    CredentialUrl?: string;
    OrderIndex?: number;
    DisplayOrder?: number;
    // Aliases
    Issuer?: string;
    ExpirationDate?: string;
  }

  interface Achievement {
    Id?: number;
    ResumeId?: number;
    Title: string;
    Description?: string;
    AchievedDate?: string;
    OrderIndex?: number;
    DisplayOrder?: number;
    // Alias
    Date?: string;
  }

  interface Language {
    Id?: number;
    ResumeId?: number;
    Name: string;
    ProficiencyLevel?: string;
    OrderIndex?: number;
    DisplayOrder?: number;
    // Alias
    Proficiency?: string;
  }

  interface SocialLink {
    Id?: number;
    PortfolioId?: number;
    Platform: string;
    Url: string;
    OrderIndex?: number;
    DisplayOrder?: number;
    // Alias
    PlatformName?: string;
  }

  interface CustomSection {
    Id?: number;
    ResumeId?: number;
    SectionTitle: string;
    Content: string;
    OrderIndex?: number;
    DisplayOrder?: number;
    // Aliases
    SectionName?: string;
    Title?: string;
  }

  interface ChatSession {
    id: number;
    title: string;
    context?: string;
    createdOn?: string;
    messages?: ChatMessage[];
  }

  interface ChatMessage {
    id?: number;
    sessionId?: number;
    role: string;
    content: string;
    tokensUsed?: number;
    inputTokens?: number;
    outputTokens?: number;
    createdOn?: string;
  }

  interface Session {
    Id: number;
    IpAddress?: string;
    DeviceType?: string;
    DeviceDetails?: string;
    IsCurrentActive?: boolean;
    CreatedOn?: string;
  }

  interface ATSAnalysisResult {
    score: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    recommendations: string[];
  }

  interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
  }

  interface ForgotPasswordRequest {
    email: string;
  }

  type ResumeData = Education | Experience | Project | Skill | Certification | Achievement | Language | SocialLink | CustomSection;
}
