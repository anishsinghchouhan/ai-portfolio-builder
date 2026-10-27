import React, { useState } from "react";
import "./SkillsSelectionPage.css";

export const SkillsSelectionPage = ({ onSaveAndContinue, onPrevious }) => {
  const [theme, setTheme] = useState("dark");
  const [profession, setProfession] = useState("Software Engineer");
  const [experienceLevel, setExperienceLevel] = useState("Senior (5-8 yrs)");
  const [yearsExperience, setYearsExperience] = useState("5 Years");
  const [preferredIndustry, setPreferredIndustry] = useState("Fintech & SaaS");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([
    "React",
    "Node.js",
    "TypeScript",
    "Tailwind CSS",
    "Next.js",
  ]);

  const aiRecommendedSkills = [
    "GraphQL",
    "PostgreSQL",
    "Docker",
    "AI Prompting",
    "Vite",
  ];

  const allAvailableSkills = [
    "React",
    "Node.js",
    "TypeScript",
    "JavaScript",
    "Python",
    "Tailwind CSS",
    "Next.js",
    "Figma",
    "GraphQL",
    "PostgreSQL",
    "MongoDB",
    "Docker",
    "AWS",
    "Kubernetes",
    "AI Prompting",
    "Vite",
    "Redux",
    "System Design",
    "CI/CD",
    "Vue.js",
    "Angular",
    "Go",
    "Rust",
    "Java",
  ];

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddAllAi = () => {
    const combined = Array.from(new Set([...selectedSkills, ...aiRecommendedSkills]));
    setSelectedSkills(combined);
  };

  const handleAddCustomSkill = () => {
    if (searchQuery && !selectedSkills.includes(searchQuery)) {
      setSelectedSkills([...selectedSkills, searchQuery]);
      setSearchQuery("");
    }
  };

  const filteredSkills = allAvailableSkills.filter((s) =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSkills.length === 0) {
      alert("Please select at least 1 technical skill to continue.");
      return;
    }

    if (onSaveAndContinue) {
      onSaveAndContinue({
        profession,
        experienceLevel,
        yearsExperience,
        preferredIndustry,
        selectedSkills,
      });
    } else {
      alert(`Skills & Profession Saved (${selectedSkills.length} skills selected)! Advancing to Step 4: Preview & Publish...`);
    }
  };

  return (
    <div className={`skills-page-root ${theme}`}>
      <div className="skills-bg-mesh" />
      <div className="skills-bg-glow" />

      {/* Light / Dark Mode Toggle */}
      <button className="theme-toggle-fixed" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === "dark" ? (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
            </svg>
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            <span>Dark Mode</span>
          </>
        )}
      </button>

      {/* Main Container Card */}
      <div className="skills-setup-card">
        {/* Header Bar */}
        <div className="skills-header-bar">
          <a href="#home" className="skills-brand">
            <div className="skills-brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="skills-brand-text">Portfolio.ai</span>
          </a>

          <span className="step-indicator-pill">Step 3 of 4</span>
        </div>

        {/* Step 3 Progress Bar Track (75%) */}
        <div className="progress-bar-track" aria-label="Progress: Step 3 of 4">
          <div className="progress-bar-fill-step3" />
        </div>

        {/* Title Section */}
        <div className="skills-title-group">
          <h1 className="skills-heading">Select Profession & Technical Skills</h1>
          <p className="skills-subtitle">
            Choose your core discipline and tech stack skills. Portfolio.ai will highlight these skills on your portfolio homepage and project badges.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Profession, Level & Industry Grid */}
          <div className="prof-experience-grid">
            <div className="form-group-item">
              <label>Profession / Role</label>
              <select
                className="select-custom-field"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="Full-Stack Engineer">Full-Stack Engineer</option>
                <option value="Backend Engineer">Backend Engineer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Data Scientist / AI Engineer">Data Scientist / AI Engineer</option>
                <option value="DevOps & Infrastructure">DevOps & Infrastructure</option>
              </select>
            </div>

            <div className="form-group-item">
              <label>Experience Level</label>
              <select
                className="select-custom-field"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              >
                <option value="Junior (1-2 yrs)">Junior (1-2 yrs)</option>
                <option value="Mid-Level (3-5 yrs)">Mid-Level (3-5 yrs)</option>
                <option value="Senior (5-8 yrs)">Senior (5-8 yrs)</option>
                <option value="Lead / Principal (8+ yrs)">Lead / Principal (8+ yrs)</option>
              </select>
            </div>

            <div className="form-group-item">
              <label>Years of Exp.</label>
              <select
                className="select-custom-field"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
              >
                <option value="1 Year">1 Year</option>
                <option value="3 Years">3 Years</option>
                <option value="5 Years">5 Years</option>
                <option value="8+ Years">8+ Years</option>
              </select>
            </div>
          </div>

          {/* AI Recommended Skills Sparkle Box */}
          <div className="ai-recommendation-box">
            <div className="ai-recommendation-header">
              <h4>
                <span>✨ AI Recommended Skills for {profession}</span>
              </h4>
              <button type="button" className="btn-add-all-ai" onClick={handleAddAllAi}>
                + Add All AI Suggestions
              </button>
            </div>

            <div className="ai-chips-wrapper">
              {aiRecommendedSkills.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <div
                    key={skill}
                    className={`skill-chip ${isSelected ? "selected" : ""}`}
                    onClick={() => toggleSkill(skill)}
                  >
                    <span>{isSelected ? "✓" : "+"}</span>
                    <span>{skill}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Search & Filter Skills */}
          <div className="search-skills-box">
            <div className="search-input-wrapper">
              <svg className="search-icon-lead" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="search-input-field"
                placeholder="Search skills (e.g. React, Python, Docker, Figma)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Popular Available Skills Tags */}
            <div className="ai-chips-wrapper">
              {filteredSkills.length > 0 ? (
                filteredSkills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <div
                      key={skill}
                      className={`skill-chip ${isSelected ? "selected" : ""}`}
                      onClick={() => toggleSkill(skill)}
                    >
                      <span>{isSelected ? "✓" : "+"}</span>
                      <span>{skill}</span>
                    </div>
                  );
                })
              ) : (
                <div className="empty-skills-state">
                  <p>No matching skills found for "{searchQuery}".</p>
                  <button type="button" className="btn-add-custom-skill" onClick={handleAddCustomSkill}>
                    + Add "{searchQuery}" as custom skill
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Selected Skills Panel */}
          <div className="selected-skills-panel">
            <div className="selected-panel-header">
              <h4>Selected Portfolio Skills</h4>
              <span className="selected-count-badge">{selectedSkills.length} Selected</span>
            </div>

            <div className="ai-chips-wrapper">
              {selectedSkills.map((skill) => (
                <div key={skill} className="skill-chip selected">
                  <span>{skill}</span>
                  <button type="button" className="chip-remove-btn" onClick={() => toggleSkill(skill)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="skills-actions-row">
            <button type="button" className="btn-prev-step" onClick={onPrevious}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Back</span>
            </button>

            <button type="submit" className="btn-save-continue">
              <span>Save & Continue</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillsSelectionPage;
