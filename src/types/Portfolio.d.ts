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
    ThemeName?: string;
    CustomSlug?: string;
    IsDarkModePreferred?: boolean;
    ProfilePictureUrl?: string;
  }

  interface Education {
    Id?: number;
    Institution: string;
    Degree: string;
    FieldOfStudy: string;
    StartDate: string;
    EndDate?: string;
    Grade?: string;
    Description?: string;
  }

  interface Experience {
    Id?: number;
    Company: string;
    Position: string;
    Location?: string;
    StartDate: string;
    EndDate?: string;
    Description: string;
  }

  interface Project {
    Id?: number;
    Title: string;
    Description: string;
    ThumbnailUrl?: string;
    GithubUrl?: string;
    LiveDemoUrl?: string;
    Technologies?: string;
  }

  interface Skill {
    Id?: number;
    Name: string;
    ProficiencyLevel?: string;
    Category?: string;
  }

  interface Certification {
    Id?: number;
    Name: string;
    Issuer: string;
    IssueDate?: string;
    ExpirationDate?: string;
    CredentialUrl?: string;
    CredentialId?: string;
  }

  interface Achievement {
    Id?: number;
    Title: string;
    Description?: string;
    Date?: string;
  }

  interface Language {
    Id?: number;
    Name: string;
    Proficiency?: string;
  }

  interface SocialLink {
    Id?: number;
    Platform: string;
    Url: string;
  }

  interface CustomSection {
    Id?: number;
    Title: string;
    Content: string;
  }
}
