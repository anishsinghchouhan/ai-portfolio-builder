import React from "react";
import "./CandidatePortfolioView.css";

const DEFAULT_SECTIONS = [
  { id: "hero", name: "Hero Header", isVisible: true },
  { id: "about", name: "About & Bio", isVisible: true },
  { id: "skills", name: "Technical Skills", isVisible: true },
  { id: "projects", name: "Featured Projects", isVisible: true },
  { id: "experience", name: "Work Experience", isVisible: true },
  { id: "testimonials", name: "Testimonials", isVisible: false },
  { id: "contact", name: "Contact & Socials", isVisible: true },
];

const DEFAULT_DARK_THEME = {
  preset: "dark",
  primary: "#6366f1",
  bg: "#0b0f17",
  text: "#f8fafc",
  font: "Inter",
  radius: 12,
  layout: "default",
};

export const CandidatePortfolioView = ({
  portfolio = {},
  user = {},
  sections: propSections,
  isPublic = false,
}) => {
  // 1. Resolve content and personal data with zero fake defaults
  // The portfolio's own content is the single source of truth.
  // Profile data is used strictly as a fallback only when the portfolio content field is empty.
  const content = portfolio?.content || {};
  const about = content.about || {};
  const personal = content.personal || {};
  const hero = content.hero || {};

  // Theme resolution: read themeConfig, fall back to Dark preset for missing values
  const themeConfig = content.themeConfig || portfolio?.themeConfig || {};
  const themePrimary = themeConfig.primary || themeConfig.primaryColor || DEFAULT_DARK_THEME.primary;
  const themeBg = themeConfig.bg || DEFAULT_DARK_THEME.bg;
  const themeText = themeConfig.text || DEFAULT_DARK_THEME.text;
  const themeRadius =
    themeConfig.radius !== undefined
      ? typeof themeConfig.radius === "number"
        ? `${themeConfig.radius}px`
        : themeConfig.radius
      : `${DEFAULT_DARK_THEME.radius}px`;
  const themeFont = themeConfig.font || themeConfig.fontFamily || DEFAULT_DARK_THEME.font;
  const themeLayout = themeConfig.layout || DEFAULT_DARK_THEME.layout || "default";

  // Candidate identity (portfolio content first, user profile only as fallback)
  const candidateName =
    about.name?.trim() ||
    personal.name?.trim() ||
    hero.name?.trim() ||
    (typeof content.name === "string" ? content.name.trim() : "") ||
    user?.fullName?.trim() ||
    portfolio?.user?.fullName?.trim() ||
    portfolio?.title?.trim() ||
    "Candidate Portfolio";

  const candidateHeadline =
    about.title?.trim() ||
    about.headline?.trim() ||
    personal.headline?.trim() ||
    personal.title?.trim() ||
    hero.headline?.trim() ||
    hero.title?.trim() ||
    (typeof content.headline === "string" ? content.headline.trim() : "") ||
    (typeof content.title === "string" ? content.title.trim() : "") ||
    user?.headline?.trim() ||
    portfolio?.user?.headline?.trim() ||
    "";

  const candidateLocation =
    about.location?.trim() ||
    personal.location?.trim() ||
    hero.location?.trim() ||
    (typeof content.location === "string" ? content.location.trim() : "") ||
    user?.location?.trim() ||
    portfolio?.user?.location?.trim() ||
    "";

  const avatarUrl =
    about.avatarUrl?.trim() ||
    personal.avatarUrl?.trim() ||
    hero.avatarUrl?.trim() ||
    (typeof content.avatarUrl === "string" ? content.avatarUrl.trim() : "") ||
    user?.avatarUrl?.trim() ||
    portfolio?.user?.avatarUrl?.trim() ||
    "";

  const candidateBio =
    about.bio?.trim() ||
    about.description?.trim() ||
    personal.bio?.trim() ||
    personal.description?.trim() ||
    (typeof content.bio === "string" ? content.bio.trim() : "") ||
    (typeof content.description === "string" ? content.description.trim() : "") ||
    user?.bio?.trim() ||
    portfolio?.user?.bio?.trim() ||
    "";

  // Skills: Portfolio content first (array of strings or { name: string }), profile skills only as fallback
  const rawSkills =
    (Array.isArray(content.skills) && content.skills.length > 0)
      ? content.skills
      : (Array.isArray(portfolio?.skills) && portfolio.skills.length > 0)
      ? portfolio.skills
      : (typeof content.skillsList === "string" && content.skillsList.trim())
      ? content.skillsList.split(",").map((s) => s.trim()).filter(Boolean)
      : (Array.isArray(user?.skills) && user.skills.length > 0)
      ? user.skills
      : (Array.isArray(portfolio?.user?.skills) && portfolio.user.skills.length > 0)
      ? portfolio.user.skills
      : (Array.isArray(content.skills) ? content.skills : []);
  const skills = Array.isArray(rawSkills) ? rawSkills : [];

  // Work Experience: Portfolio content first (supports content.experiences and content.experience)
  const rawExperience =
    (Array.isArray(content.experiences) && content.experiences.length > 0)
      ? content.experiences
      : (Array.isArray(content.experience) && content.experience.length > 0)
      ? content.experience
      : (Array.isArray(portfolio?.experiences) && portfolio.experiences.length > 0)
      ? portfolio.experiences
      : (Array.isArray(portfolio?.experience) && portfolio.experience.length > 0)
      ? portfolio.experience
      : (Array.isArray(user?.experience) && user.experience.length > 0)
      ? user.experience
      : (Array.isArray(user?.experiences) && user.experiences.length > 0)
      ? user.experiences
      : (Array.isArray(portfolio?.user?.experience) ? portfolio.user.experience : []);
  const experienceList = Array.isArray(rawExperience) ? rawExperience : [];

  // Projects: Portfolio content first. content.projects is the single source of truth.
  // Only fall back to Prisma relation portfolio.projects if content.projects is empty or not provided.
  const rawProjects =
    (Array.isArray(content.projects) && content.projects.length > 0)
      ? content.projects
      : (Array.isArray(portfolio?.projects) && portfolio.projects.length > 0)
      ? portfolio.projects
      : (Array.isArray(content.projects) ? content.projects : []);
  const projectsList = Array.isArray(rawProjects) ? rawProjects : [];

  // Testimonials: hidden by default unless real items exist in portfolio content
  const rawTestimonials =
    (Array.isArray(content.testimonials) && content.testimonials.length > 0)
      ? content.testimonials
      : (Array.isArray(portfolio?.testimonials) && portfolio.testimonials.length > 0)
      ? portfolio.testimonials
      : [];
  const testimonialsList = Array.isArray(rawTestimonials) ? rawTestimonials : [];

  // Contact info: Portfolio content first, user profile only as fallback
  const email =
    about.email?.trim() ||
    personal.email?.trim() ||
    (typeof content.email === "string" ? content.email.trim() : "") ||
    user?.email?.trim() ||
    portfolio?.user?.email?.trim() ||
    "";
  const github =
    about.github?.trim() ||
    personal.github?.trim() ||
    (typeof content.github === "string" ? content.github.trim() : "") ||
    user?.github?.trim() ||
    portfolio?.user?.github?.trim() ||
    "";
  const linkedin =
    about.linkedin?.trim() ||
    personal.linkedin?.trim() ||
    (typeof content.linkedin === "string" ? content.linkedin.trim() : "") ||
    user?.linkedin?.trim() ||
    portfolio?.user?.linkedin?.trim() ||
    "";
  const website =
    about.website?.trim() ||
    personal.website?.trim() ||
    (typeof content.website === "string" ? content.website.trim() : "") ||
    user?.website?.trim() ||
    portfolio?.user?.website?.trim() ||
    "";
  const phone =
    about.phone?.trim() ||
    personal.phone?.trim() ||
    (typeof content.phone === "string" ? content.phone.trim() : "") ||
    user?.phone?.trim() ||
    portfolio?.user?.phone?.trim() ||
    "";

  // 2. Initials for avatar fallback
  const candidateInitials =
    candidateName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  // 3. Resolve active ordered sections from props or saved portfolio content
  const activeSections =
    propSections ||
    content.sections ||
    DEFAULT_SECTIONS;

  // ─── Section Renderers ───────────────────────────────────────────────────

  // HERO SECTION (#hero)
  const renderHero = () => (
    <section key="hero" id="hero" className="candidate-hero-section" aria-label="Candidate Introduction">
      <div className="candidate-hero-content">
        <div className="candidate-avatar-wrapper">
          {avatarUrl ? (
            <img src={avatarUrl} alt={candidateName} className="candidate-avatar-img" />
          ) : (
            <div className="candidate-avatar-initials" aria-hidden="true">
              {candidateInitials}
            </div>
          )}
        </div>

        <div className="candidate-hero-details">
          <h1 className="candidate-hero-name">{candidateName}</h1>

          {candidateHeadline ? (
            <div className="candidate-hero-headline">{candidateHeadline}</div>
          ) : !isPublic ? (
            <div className="candidate-hero-headline" style={{ color: "var(--portfolio-text-muted)", fontStyle: "italic", fontWeight: 400 }}>
              Add your professional title in Profile settings
            </div>
          ) : null}

          {candidateLocation && (
            <div className="candidate-hero-location">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{candidateLocation}</span>
            </div>
          )}

          <div className="candidate-hero-actions">
            <a href="#projects" className="btn-hero-primary">
              <span>View Projects</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>

            <a href="#contact" className="btn-hero-secondary">
              <span>Get In Touch</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );

  // ABOUT SECTION (#about)
  const renderAbout = () => (
    <section key="about" id="about" className="candidate-section" aria-label="About Me">
      <div className="candidate-section-header">
        <h2 className="candidate-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>About Me</span>
        </h2>
      </div>

      {candidateBio ? (
        <p className="candidate-bio-text">{candidateBio}</p>
      ) : (
        <div className="candidate-empty-state">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p>No bio added yet.</p>
          {!isPublic && <span className="empty-action-hint">Add a summary in Profile settings</span>}
        </div>
      )}
    </section>
  );

  // SKILLS SECTION (#skills)
  const renderSkills = () => (
    <section key="skills" id="skills" className="candidate-section" aria-label="Technical Skills">
      <div className="candidate-section-header">
        <h2 className="candidate-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <span>Technical Skills</span>
        </h2>
        <p className="candidate-section-subtitle">Core languages, frameworks, and technologies.</p>
      </div>

      {skills.length > 0 ? (
        <div className="candidate-skills-wrap">
          {skills.map((skill, idx) => {
            const skillName =
              typeof skill === "object" && skill !== null
                ? skill.name || skill.title || skill.label || ""
                : String(skill || "").trim();
            if (!skillName) return null;
            return (
              <span key={idx} className="candidate-skill-tag">
                {skillName}
              </span>
            );
          })}
        </div>
      ) : (
        <div className="candidate-empty-state">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <p>No skills added yet.</p>
          {!isPublic && <span className="empty-action-hint">Add your skills or import from resume</span>}
        </div>
      )}
    </section>
  );

  // EXPERIENCE SECTION (#experience)
  const renderExperience = () => (
    <section key="experience" id="experience" className="candidate-section" aria-label="Work Experience">
      <div className="candidate-section-header">
        <h2 className="candidate-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          <span>Work Experience</span>
        </h2>
        <p className="candidate-section-subtitle">Professional career history and track record.</p>
      </div>

      {experienceList.length > 0 ? (
        <div className="candidate-timeline">
          {experienceList.map((item, idx) => {
            const role = item.role || item.position || item.title || "Software Engineer";
            const company = item.company || item.organization || item.employer || "";
            const duration = item.duration || item.period || item.year || item.dates || "";
            const description = item.description || item.summary || "";

            return (
              <div key={idx} className="candidate-timeline-item">
                <div className="candidate-timeline-dot" aria-hidden="true" />
                <div className="candidate-timeline-heading">
                  <h3 className="candidate-timeline-role">{role}</h3>
                  {duration && <span className="candidate-timeline-period">{duration}</span>}
                </div>
                {company && <div className="candidate-timeline-company">{company}</div>}
                {description && <p className="candidate-timeline-desc">{description}</p>}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="candidate-empty-state">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          <p>No work experience added yet.</p>
          {!isPublic && <span className="empty-action-hint">Import experience from resume or add in Profile</span>}
        </div>
      )}
    </section>
  );

  // PROJECTS SECTION (#projects)
  const renderProjects = () => (
    <section key="projects" id="projects" className="candidate-section" aria-label="Featured Projects">
      <div className="candidate-section-header">
        <h2 className="candidate-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
          <span>Featured Projects</span>
        </h2>
        <p className="candidate-section-subtitle">Selected engineering works and open-source contributions.</p>
      </div>

      {projectsList.length > 0 ? (
        <div className="candidate-projects-grid">
          {projectsList.map((proj, idx) => {
            const title = proj.title || proj.name || "Untitled Project";
            const description = proj.description || proj.desc || proj.summary || "";
            const rawTech = proj.techStack || proj.tech || proj.technologies || proj.tags || [];
            const techItems = Array.isArray(rawTech)
              ? rawTech
              : typeof rawTech === "string" && rawTech.trim()
              ? rawTech.split(",").map((t) => t.trim()).filter(Boolean)
              : [];

            return (
              <div key={proj.id || idx} className="candidate-project-card">
                <div className="candidate-project-header">
                  <h3 className="candidate-project-title">{title}</h3>
                  {description && <p className="candidate-project-desc">{description}</p>}

                  {techItems.length > 0 && (
                    <div className="candidate-project-tech-stack">
                      {techItems.map((tech, tIdx) => {
                        const techName =
                          typeof tech === "object" && tech !== null
                            ? tech.name || tech.label || ""
                            : String(tech || "").trim();
                        if (!techName) return null;
                        return (
                          <span key={tIdx} className="candidate-project-tech-pill">
                            {techName}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {(proj.liveUrl || proj.githubUrl) && (
                  <div className="candidate-project-links">
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="candidate-project-link"
                      >
                        <span>Live Demo</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="candidate-project-link"
                      >
                        <span>GitHub</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="candidate-empty-state">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
          <p>No projects added yet.</p>
          {!isPublic && <span className="empty-action-hint">Add a project to showcase your work</span>}
        </div>
      )}
    </section>
  );

  // TESTIMONIALS SECTION (#testimonials) - STRICT RULE: HIDDEN IF NONE EXIST
  const renderTestimonials = () => {
    if (testimonialsList.length === 0) {
      return null;
    }

    return (
      <section key="testimonials" id="testimonials" className="candidate-section" aria-label="Client & Peer Recommendations">
        <div className="candidate-section-header">
          <h2 className="candidate-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Recommendations</span>
          </h2>
          <p className="candidate-section-subtitle">What managers and peers say about my work.</p>
        </div>

        <div className="candidate-testimonials-grid">
          {testimonialsList.map((test, idx) => (
            <div key={idx} className="candidate-testimonial-card">
              <p className="candidate-testimonial-quote">"{test.content || test.quote || ""}"</p>
              <div className="candidate-testimonial-author">
                {test.avatarUrl && (
                  <img src={test.avatarUrl} alt={test.author || ""} className="candidate-testimonial-avatar" />
                )}
                <div className="candidate-testimonial-info">
                  <h4>{test.author || test.name || "Colleague"}</h4>
                  {(test.role || test.company) && (
                    <p>{[test.role, test.company].filter(Boolean).join(" at ")}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // CONTACT SECTION (#contact)
  const renderContact = () => {
    const hasContactDetails = email || github || linkedin || website || phone;

    return (
      <section key="contact" id="contact" className="candidate-section" aria-label="Contact Information">
        <div className="candidate-section-header">
          <h2 className="candidate-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>Get In Touch</span>
          </h2>
          <p className="candidate-section-subtitle">Let's discuss opportunities, collaborations, and engineering challenges.</p>
        </div>

        {hasContactDetails ? (
          <div className="candidate-contact-grid">
            {email && (
              <a href={`mailto:${email}`} className="candidate-contact-card">
                <div className="candidate-contact-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="candidate-contact-text">
                  <span className="candidate-contact-label">Email</span>
                  <span className="candidate-contact-value" title={email}>{email}</span>
                </div>
              </a>
            )}

            {github && (
              <a
                href={github.startsWith("http") ? github : `https://github.com/${github.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="candidate-contact-card"
              >
                <div className="candidate-contact-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </div>
                <div className="candidate-contact-text">
                  <span className="candidate-contact-label">GitHub</span>
                  <span className="candidate-contact-value">
                    {github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}
                  </span>
                </div>
              </a>
            )}

            {linkedin && (
              <a
                href={linkedin.startsWith("http") ? linkedin : `https://linkedin.com/in/${linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="candidate-contact-card"
              >
                <div className="candidate-contact-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </div>
                <div className="candidate-contact-text">
                  <span className="candidate-contact-label">LinkedIn</span>
                  <span className="candidate-contact-value">
                    {linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}
                  </span>
                </div>
              </a>
            )}

            {website && (
              <a
                href={website.startsWith("http") ? website : `https://${website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="candidate-contact-card"
              >
                <div className="candidate-contact-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <div className="candidate-contact-text">
                  <span className="candidate-contact-label">Website</span>
                  <span className="candidate-contact-value">{website.replace(/^https?:\/\//, "")}</span>
                </div>
              </a>
            )}
          </div>
        ) : (
          <div className="candidate-empty-state">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <p>No contact details provided yet.</p>
            {!isPublic && <span className="empty-action-hint">Add your email, GitHub, or LinkedIn in Profile</span>}
          </div>
        )}
      </section>
    );
  };

  // Section dispatch mapping: renders in the exact order specified by activeSections
  const renderSectionById = (sectionId) => {
    switch (sectionId) {
      case "hero":
        return renderHero();
      case "about":
        return renderAbout();
      case "skills":
        return renderSkills();
      case "experience":
        return renderExperience();
      case "projects":
        return renderProjects();
      case "testimonials":
        return renderTestimonials();
      case "contact":
        return renderContact();
      default:
        return null;
    }
  };

  return (
    <div
      className={`candidate-portfolio-root layout-${themeLayout}`}
      data-layout={themeLayout}
      style={{
        "--portfolio-primary": themePrimary,
        "--portfolio-accent": themePrimary,
        "--portfolio-bg": themeBg,
        "--portfolio-text": themeText,
        "--portfolio-radius": themeRadius,
        "--portfolio-font": themeFont,
      }}
    >
      <div className="candidate-portfolio-container">
        {activeSections.map((sec) => {
          if (!sec.isVisible) return null;
          return renderSectionById(sec.id);
        })}

        <footer className="candidate-portfolio-footer">
          <p>
            © {new Date().getFullYear()} {candidateName}. Built with{" "}
            <span style={{ color: "var(--portfolio-accent)", fontWeight: 600 }}>Portfolio.ai</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CandidatePortfolioView;

