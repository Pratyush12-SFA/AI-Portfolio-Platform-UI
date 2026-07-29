import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicPortfolio, sendContactMessage } from "../../services/portfolio.service";
import { Mail, MapPin, Phone, ExternalLink, Globe } from "lucide-react";
import { FaGithub } from "react-icons/fa";

interface PublicPortfolioData {
  profile: Portfolio.Profile;
  educations: Portfolio.Education[];
  experiences: Portfolio.Experience[];
  projects: Portfolio.Project[];
  skills: Portfolio.Skill[];
  certifications: Portfolio.Certification[];
  achievements: Portfolio.Achievement[];
  languages: Portfolio.Language[];
  socialLinks: Portfolio.SocialLink[];
  customSections: Portfolio.CustomSection[];
}

export default function PublicPortfolioPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<PublicPortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!slug) return;
    const currentSlug = slug;
    async function loadPortfolio() {
      try {
        setLoading(true);
        const res = await getPublicPortfolio(currentSlug);
        setData(res as unknown as PublicPortfolioData);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, [slug]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSending(true);
      setSuccessMsg("");
      await sendContactMessage({ name, email, subject, message });
      setSuccessMsg("Your message has been sent successfully!");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setSuccessMsg("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080a] text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#08080a] text-white flex items-center justify-center flex-col gap-4">
        <h1 className="text-3xl font-bold">Portfolio Not Found</h1>
        <p className="text-zinc-400">The public portfolio URL you requested is invalid.</p>
      </div>
    );
  }

  const { profile, educations, experiences, projects, skills, certifications, achievements, languages, socialLinks, customSections } = data;
  const theme = profile.ThemeName || "ModernDark";

  const getThemeClass = () => {
    switch (theme) {
      case "Cyberpunk":
        return "bg-black text-[#39ff14] font-mono border-[#39ff14]/30";
      case "ClassicCharcoal":
        return "bg-[#111115] text-zinc-100 font-sans border-zinc-700/50";
      case "ModernDark":
      default:
        return "bg-[#08080a] text-white font-sans border-white/5";
    }
  };

  const getCardBg = () => {
    switch (theme) {
      case "Cyberpunk": return "bg-black border border-[#39ff14]/20";
      case "ClassicCharcoal": return "bg-[#1c1c22] border border-zinc-800";
      case "ModernDark":
      default:
        return "bg-white/[0.01] border border-white/5";
    }
  };

  return (
    <div className={`min-h-screen ${getThemeClass()} selection:bg-amber-500 selection:text-black`}>
      {/* Premium Header - Asymmetric Staggered Hero */}
      <header className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">
          <div className="space-y-6">
            {profile.CustomSlug && (
              <span className="inline-block text-xs uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 bg-white/5 text-zinc-400">
                @{profile.CustomSlug}
              </span>
            )}
            <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-none">
              {profile.FullName || "User Name"}
            </h1>
            <p className={`text-xl lg:text-2xl font-light ${theme === "Cyberpunk" ? "text-[#39ff14]" : "text-amber-400/90"} max-w-2xl`}>
              {profile.Headline || profile.ProfileHeadline || "Professional Headline"}
            </p>
            <p className="text-zinc-400 max-w-2xl leading-relaxed text-base">
              {profile.Summary || profile.ProfileSummary || "Bio / Professional summary goes here."}
            </p>

            <div className="flex flex-wrap gap-6 text-sm text-zinc-400 pt-4">
              {profile.ContactEmail && (
                <a href={`mailto:${profile.ContactEmail}`} className="flex items-center gap-2 hover:text-white transition">
                  <Mail className="w-4 h-4 text-amber-500" /> {profile.ContactEmail}
                </a>
              )}
              {profile.PhoneNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-500" /> {profile.PhoneNumber}
                </div>
              )}
              {profile.Address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500" /> {profile.Address}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-2">
              {socialLinks?.map((link) => (
                <a
                  key={link.Id}
                  href={link.Url}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-3 rounded-full ${getCardBg()} hover:scale-110 transition duration-300 text-zinc-300 hover:text-white`}
                >
                  <Globe className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {profile.ProfilePictureUrl && (
            <div className="relative group mx-auto lg:mx-0">
              <div className={`absolute -inset-2 bg-gradient-to-r ${theme === "Cyberpunk" ? "from-[#39ff14] to-green-600" : "from-amber-500 to-amber-700"} rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition duration-500`} />
              <img
                src={profile.ProfilePictureUrl}
                alt={profile.FullName}
                className="relative w-[300px] h-[300px] rounded-3xl object-cover border border-white/10"
              />
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-24">
        {projects && projects.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight border-b border-white/5 pb-4">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project) => (
                <div key={project.Id} className={`rounded-2xl ${getCardBg()} overflow-hidden group hover:-translate-y-1 transition duration-300`}>
                  {project.ThumbnailUrl && (
                    <div className="h-48 overflow-hidden relative">
                      <img src={project.ThumbnailUrl} alt={project.Title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                  )}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-xl font-bold">{project.Title}</h3>
                      <div className="flex gap-2">
                        {project.GithubUrl && (
                          <a href={project.GithubUrl} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white">
                            <FaGithub className="w-5 h-5" />
                          </a>
                        )}
                        {project.ProjectUrl && (
                          <a href={project.ProjectUrl} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white">
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">{project.Description}</p>
                    {project.TechStack && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.TechStack.split(",").map((tech, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded bg-white/5 border border-white/5 text-zinc-300">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills && skills.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight border-b border-white/5 pb-4">Professional Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {skills.map((skill) => (
                <div key={skill.Id} className={`p-4 rounded-xl ${getCardBg()} text-center space-y-2`}>
                  <div className="font-semibold text-sm">{skill.Name}</div>
                  <div className="text-xs text-zinc-400">{skill.Category}</div>
                  {skill.ProficiencyLevel && (
                    <div className="w-full bg-white/5 rounded-full h-1.5 mt-2">
                      <div
                        className={`h-1.5 rounded-full ${theme === "Cyberpunk" ? "bg-[#39ff14]" : "bg-amber-500"}`}
                        style={{ width: `${parseInt(skill.ProficiencyLevel) || 50}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {experiences && experiences.length > 0 && (
            <section className="space-y-8">
              <h2 className="text-3xl font-bold tracking-tight border-b border-white/5 pb-4">Work Experience</h2>
              <div className="space-y-8 border-l border-white/5 pl-4 ml-2">
                {experiences.map((exp) => (
                  <div key={exp.Id} className="relative space-y-2">
                    <div className={`absolute w-3.5 h-3.5 rounded-full ${theme === "Cyberpunk" ? "bg-[#39ff14]" : "bg-amber-500"} -left-[23px] top-1.5 border-4 border-[#08080a]`} />
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-bold text-lg">{exp.JobTitle || exp.Position || exp.Designation}</h3>
                      <span className="text-xs text-zinc-500 bg-white/5 px-2 py-1 rounded">
                        {new Date(exp.StartDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} - {exp.EndDate ? new Date(exp.EndDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : "Present"}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-zinc-400">{exp.CompanyName || exp.Company} {exp.EmploymentType ? `• ${exp.EmploymentType}` : ""}</div>
                    <p className="text-sm text-zinc-400 leading-relaxed pt-1">{exp.Description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {educations && educations.length > 0 && (
            <section className="space-y-8">
              <h2 className="text-3xl font-bold tracking-tight border-b border-white/5 pb-4">Education</h2>
              <div className="space-y-8 border-l border-white/5 pl-4 ml-2">
                {educations.map((edu) => (
                  <div key={edu.Id} className="relative space-y-2">
                    <div className={`absolute w-3.5 h-3.5 rounded-full ${theme === "Cyberpunk" ? "bg-[#39ff14]" : "bg-amber-500"} -left-[23px] top-1.5 border-4 border-[#08080a]`} />
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-bold text-lg">{edu.Degree}</h3>
                      <span className="text-xs text-zinc-500 bg-white/5 px-2 py-1 rounded">
                        {new Date(edu.StartDate).getFullYear()} - {edu.EndDate ? new Date(edu.EndDate).getFullYear() : "Present"}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-zinc-400">{edu.Institution} {edu.FieldOfStudy ? `• ${edu.FieldOfStudy}` : ""}</div>
                    {edu.Grade && <div className="text-xs text-amber-500/80 font-mono">Grade: {edu.Grade}</div>}
                    <p className="text-sm text-zinc-400 leading-relaxed pt-1">{edu.Description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
            <section className="space-y-8">
              <h2 className="text-3xl font-bold tracking-tight border-b border-white/5 pb-4">Certifications & Achievements</h2>
              <div className="space-y-4">
                {certifications?.map((cert) => (
                  <div key={cert.Id} className={`p-4 rounded-xl ${getCardBg()} flex justify-between items-center`}>
                    <div>
                      <div className="font-bold text-sm">{cert.Name}</div>
                      <div className="text-xs text-zinc-400">{cert.IssuingOrganization || cert.Issuer}</div>
                    </div>
                    {cert.CredentialUrl && (
                      <a href={cert.CredentialUrl} target="_blank" rel="noreferrer" className="text-amber-500 hover:underline text-xs flex items-center gap-1">
                        View <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
                {achievements?.map((ach) => (
                  <div key={ach.Id} className={`p-4 rounded-xl ${getCardBg()} space-y-1`}>
                    <div className="font-bold text-sm">{ach.Title}</div>
                    {ach.Description && <p className="text-xs text-zinc-400 pt-1">{ach.Description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {((languages && languages.length > 0) || (customSections && customSections.length > 0)) && (
            <section className="space-y-8">
              <h2 className="text-3xl font-bold tracking-tight border-b border-white/5 pb-4">Extra Sections</h2>
              <div className="space-y-6">
                {languages && languages.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-zinc-400 uppercase tracking-wider">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((lang) => (
                        <span key={lang.Id} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                          {lang.Name} <span className="text-amber-500/80">({lang.Proficiency || lang.ProficiencyLevel})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {customSections?.map((section) => (
                  <div key={section.Id} className="space-y-2">
                    <h3 className="font-bold text-lg">{section.SectionTitle}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{section.Content}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <section className="max-w-2xl mx-auto pt-12 space-y-8">
          <h2 className="text-3xl font-bold tracking-tight text-center">Get In Touch</h2>
          <form onSubmit={handleContactSubmit} className={`p-8 rounded-2xl ${getCardBg()} space-y-5`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Message</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 resize-none"
              />
            </div>
            {successMsg && <p className="text-sm text-amber-400 text-center font-medium">{successMsg}</p>}
            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 font-medium text-black transition duration-300 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
