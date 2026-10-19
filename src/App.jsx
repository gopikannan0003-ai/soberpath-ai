
import { useState } from "react";
import Hospitals from "./Hospitals";
import AIChat from "./AIChat";
import "./App.css";

function App() {
  const [language, setLanguage] = useState("en");
  const [menuOpen, setMenuOpen] = useState(false);

  const content = {
    en: {
      home: "Home",
      awareness: "Awareness",
      recovery: "Recovery",
      family: "Family Support",
      assistant: "AI Assistant",

      badge: "YOUR JOURNEY. YOUR FUTURE.",
      title1: "A healthier life",
      title2: "starts with",
      highlight: "one step.",

      description:
        "Find guidance, discover support, and take your next step towards a healthier future. You don't have to face this journey alone.",

      primary: "Explore Support",
      secondary: "Learn More",
      trusted: "A safe space for awareness, guidance and hope",

      sectionLabel: "HOW WE CAN HELP",
      sectionTitle: "Support for every step",
      sectionDescription:
        "Explore helpful resources designed for individuals and families.",

      card1Title: "Alcohol Awareness",
      card1Desc:
        "Understand alcohol-related risks, warning signs, and the importance of informed choices.",

      card2Title: "Recovery Guidance",
      card2Desc:
        "Explore supportive recovery resources and discover ways to find professional help.",

      card3Title: "Family Support",
      card3Desc:
        "Learn how to support a loved one with patience, understanding, and healthy boundaries.",

      card4Title: "AI Support Assistant",
      card4Desc:
        "Get supportive guidance and helpful information through our AI-powered digital assistant.",

      cardButton: "Explore →",

      awarenessTitle: "Alcohol Awareness",
      awarenessDesc:
        "Understanding alcohol-related risks can help people make informed decisions. Learn about warning signs, health concerns, and when professional support may be helpful.",

      recoveryTitle: "Recovery Guidance",
      recoveryDesc:
        "Everyone's recovery journey is different. Explore supportive steps, connect with trusted people, and seek guidance from qualified healthcare professionals.",

      familyTitle: "Family Support",
      familyDesc:
        "Supporting someone can be challenging. Listen without judgement, encourage professional help, respect healthy boundaries, and remember to care for your own wellbeing.",

      assistantTitle: "AI Support Assistant",
      assistantDesc:
        "Ask questions and explore general information with our supportive AI assistant. It provides educational guidance, not a medical diagnosis or treatment.",

      assistantButton: "Open AI Assistant →",

      bannerTitle: "Every small step matters.",
      bannerDesc:
        "Asking for help is a positive step. Support is available, and you deserve to be treated with care.",
      bannerButton: "Find Support",

      footer:
        "A place for awareness, encouragement and informed support.",

      safety:
        "SOBERPATH AI provides educational information, not medical diagnosis or treatment.",
    },

    ta: {
      home: "முகப்பு",
      awareness: "விழிப்புணர்வு",
      recovery: "மீட்பு வழிகாட்டுதல்",
      family: "குடும்ப ஆதரவு",
      assistant: "AI உதவியாளர்",

      badge: "உங்கள் பயணம். உங்கள் எதிர்காலம்.",
      title1: "ஆரோக்கியமான வாழ்க்கை",
      title2: "தொடங்குவது",
      highlight: "ஒரு சிறிய படியில்.",

      description:
        "சரியான வழிகாட்டுதலைப் பெறுங்கள். ஆதரவைத் தெரிந்துகொள்ளுங்கள். ஆரோக்கியமான எதிர்காலத்தை நோக்கி அடுத்த படியை எடுங்கள். இந்தப் பயணத்தில் நீங்கள் தனியாக இல்லை.",

      primary: "ஆதரவை அறியுங்கள்",
      secondary: "மேலும் அறிய",
      trusted:
        "விழிப்புணர்வு, வழிகாட்டுதல் மற்றும் நம்பிக்கைக்கான பாதுகாப்பான இடம்",

      sectionLabel: "நாங்கள் எவ்வாறு உதவலாம்",
      sectionTitle: "ஒவ்வொரு படிக்கும் ஆதரவு",
      sectionDescription:
        "தனிநபர்கள் மற்றும் குடும்பங்களுக்கான பயனுள்ள தகவல்களை அறிந்துகொள்ளுங்கள்.",

      card1Title: "மது பற்றிய விழிப்புணர்வு",
      card1Desc:
        "மதுவால் ஏற்படக்கூடிய பாதிப்புகள், எச்சரிக்கை அறிகுறிகள் மற்றும் விழிப்புணர்வான முடிவுகளைப் பற்றி அறியுங்கள்.",

      card2Title: "மீட்பு வழிகாட்டுதல்",
      card2Desc:
        "மீட்புக்கான ஆதரவு வழிகளை அறிந்து, தேவையான தொழில்முறை உதவியைப் பெறுவதற்கான வழிகளைக் கண்டறியுங்கள்.",

      card3Title: "குடும்ப ஆதரவு",
      card3Desc:
        "பொறுமை, புரிதல் மற்றும் ஆரோக்கியமான எல்லைகளுடன் உங்கள் அன்புக்குரியவருக்கு எவ்வாறு ஆதரவளிப்பது என அறியுங்கள்.",

      card4Title: "AI உதவியாளர்",
      card4Desc:
        "AI உதவியாளர் மூலம் வழிகாட்டுதல் மற்றும் பயனுள்ள தகவல்களைப் பெறுங்கள்.",

      cardButton: "மேலும் அறிய →",

      awarenessTitle: "மது பற்றிய விழிப்புணர்வு",
      awarenessDesc:
        "மதுவால் ஏற்படக்கூடிய பாதிப்புகளைப் புரிந்துகொள்வது விழிப்புணர்வான முடிவுகளை எடுக்க உதவும். எச்சரிக்கை அறிகுறிகள், உடல்நலப் பாதிப்புகள் மற்றும் தொழில்முறை உதவி தேவைப்படும் சூழ்நிலைகளைப் பற்றி அறிந்துகொள்ளுங்கள்.",

      recoveryTitle: "மீட்பு வழிகாட்டுதல்",
      recoveryDesc:
        "ஒவ்வொருவரின் மீட்புப் பயணமும் வித்தியாசமானது. ஆதரவான வழிமுறைகளை அறிந்து, நம்பகமானவர்களுடன் தொடர்பில் இருந்து, தகுதியான மருத்துவ நிபுணர்களின் ஆலோசனையைப் பெறுங்கள்.",

      familyTitle: "குடும்ப ஆதரவு",
      familyDesc:
        "ஒருவருக்கு ஆதரவளிப்பது சவாலாக இருக்கலாம். குறை கூறாமல் கேளுங்கள், தொழில்முறை உதவியை ஊக்குவியுங்கள், ஆரோக்கியமான எல்லைகளைக் கடைப்பிடியுங்கள், உங்கள் நலனையும் கவனித்துக்கொள்ளுங்கள்.",

      assistantTitle: "AI உதவியாளர்",
      assistantDesc:
        "உங்கள் கேள்விகளுக்கான பொதுவான தகவல்களை AI உதவியாளர் மூலம் அறிந்துகொள்ளுங்கள். இது கல்வி மற்றும் விழிப்புணர்வுக்கான உதவி மட்டுமே; மருத்துவ நோயறிதல் அல்லது சிகிச்சைக்கு மாற்றாகாது.",

      assistantButton: "AI உதவியாளரைத் திறக்கவும் →",

      bannerTitle: "ஒவ்வொரு சிறிய முயற்சியும் முக்கியம்.",
      bannerDesc:
        "உதவி கேட்பது ஒரு நல்ல தொடக்கம். ஆதரவு கிடைக்கும். அக்கறையுடன் நடத்தப்படுவதற்கு நீங்கள் தகுதியானவர்.",
      bannerButton: "ஆதரவை அறியுங்கள்",

      footer: "விழிப்புணர்வு, நம்பிக்கை மற்றும் ஆதரவுக்கான இடம்.",

      safety:
        "SOBERPATH AI கல்வி மற்றும் விழிப்புணர்வுக்கான தகவல்களை வழங்குகிறது. இது மருத்துவ நோயறிதல் அல்லது சிகிச்சைக்கு மாற்றாகாது.",
    },
  };

  const t = content[language];

  // Smooth scroll to a section
  const scrollToSection = (id) => {
    setMenuOpen(false);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Open the AI assistant
  const openAssistant = (event) => {
    event?.preventDefault();

    setMenuOpen(false);

    window.dispatchEvent(new Event("open-soberpath-chat"));

    // Scroll only if the assistant section exists.
    setTimeout(() => {
      document.getElementById("assistant")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const cards = [
    {
      icon: "◉",
      number: "01",
      title: t.card1Title,
      description: t.card1Desc,
      className: "mint",
      id: "awareness",
      target: "awareness-details",
    },
    {
      icon: "↗",
      number: "02",
      title: t.card2Title,
      description: t.card2Desc,
      className: "blue",
      id: "recovery",
      target: "recovery-details",
    },
    {
      icon: "♡",
      number: "03",
      title: t.card3Title,
      description: t.card3Desc,
      className: "peach",
      id: "family",
      target: "family-details",
    },
    {
      icon: "✳",
      number: "04",
      title: t.card4Title,
      description: t.card4Desc,
      className: "lavender",
      id: "assistant",
      target: "assistant",
    },
  ];

  return (
    <div className="app">
      {/* NAVBAR */}
      <header className="navbar">
        <a
          className="brand"
          href="#home"
          aria-label="SOBERPATH AI Home"
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand-icon">S</span>

          <span>
            SOBERPATH<span className="brand-ai"> AI</span>
            <small>HEALTH • HOPE • SUPPORT</small>
          </span>
        </a>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#home" onClick={() => setMenuOpen(false)}>
            {t.home}
          </a>

          <a
            href="#awareness-details"
            onClick={() => setMenuOpen(false)}
          >
            {t.awareness}
          </a>

          <a
            href="#recovery-details"
            onClick={() => setMenuOpen(false)}
          >
            {t.recovery}
          </a>

          <a
            href="#family-details"
            onClick={() => setMenuOpen(false)}
          >
            {t.family}
          </a>

          <a href="#assistant" onClick={openAssistant}>
            {t.assistant}
          </a>
        </nav>

        <button
          type="button"
          className="language-button"
          onClick={() =>
            setLanguage((previous) =>
              previous === "en" ? "ta" : "en"
            )
          }
          aria-label="Change language"
        >
          <span>文</span>{" "}
          {language === "en" ? "தமிழ்" : "English"}
        </button>
      </header>

      <main>
        {/* HERO */}
        <section className="hero section-wrap" id="home">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="status-dot"></span>
              {t.badge}
            </div>

            <h1>
              {t.title1}
              <br />
              {t.title2}{" "}
              <span className="gradient-text">
                {t.highlight}
              </span>
            </h1>

            <p className="hero-description">{t.description}</p>

            <div className="hero-actions">
              <a
                className="button button-primary"
                href="#support"
              >
                {t.primary} <span>↗</span>
              </a>

              <a
                className="button button-secondary"
                href="#about"
              >
                {t.secondary}
              </a>
            </div>

            <div className="hero-trust">
              <span className="trust-icon">✓</span>
              <span>{t.trusted}</span>
            </div>
          </div>

          {/* HOPE ILLUSTRATION */}
          <div
            className="hero-visual"
            aria-label="Hope and wellbeing illustration"
          >
            <div className="visual-glow"></div>
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>

            <div className="floating-card floating-top">
              <span className="floating-icon">✦</span>
              <span>
                <strong>One day at a time</strong>
                <small>Small steps count</small>
              </span>
            </div>

            <div className="main-illustration">
              <div className="sun"></div>
              <div className="hill hill-back"></div>
              <div className="hill hill-front"></div>
              <div className="path"></div>

              <div className="plant plant-left">
                <i></i>
                <i></i>
                <i></i>
              </div>

              <div className="plant plant-right">
                <i></i>
                <i></i>
                <i></i>
              </div>

              <div className="illustration-label">
                <span>✧</span>
                <strong>A new beginning</strong>
              </div>
            </div>

            <div className="floating-card floating-bottom">
              <span className="heart-icon">♡</span>
              <span>
                <strong>You matter.</strong>
                <small>Hope starts here</small>
              </span>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="stats-strip section-wrap" id="about">
          <div className="stat-item">
            <span className="stat-icon">◎</span>
            <div>
              <strong>Awareness</strong>
              <p>Learn without judgement</p>
            </div>
          </div>

          <div className="stat-item">
            <span className="stat-icon">↗</span>
            <div>
              <strong>Guidance</strong>
              <p>Take informed steps</p>
            </div>
          </div>

          <div className="stat-item">
            <span className="stat-icon">♡</span>
            <div>
              <strong>Compassion</strong>
              <p>Support for everyone</p>
            </div>
          </div>
        </section>

        {/* SUPPORT CARDS */}
        <section
          className="support-section section-wrap"
          id="support"
        >
          <div className="section-heading">
            <span className="section-label">
              {t.sectionLabel}
            </span>

            <h2>{t.sectionTitle}</h2>
            <p>{t.sectionDescription}</p>
          </div>

          <div className="support-grid">
            {cards.map((card, index) => (
              <article
                className={`support-card ${card.className}`}
                key={card.number}
                style={{ "--card-index": index }}
              >
                <div className="card-top">
                  <span className="card-icon">{card.icon}</span>
                  <span className="card-number">{card.number}</span>
                </div>

                <h3>{card.title}</h3>
                <p>{card.description}</p>

                {card.id === "assistant" ? (
                  <button
                    type="button"
                    className="card-link"
                    onClick={openAssistant}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      font: "inherit",
                      textAlign: "left",
                    }}
                  >
                    {t.cardButton}
                  </button>
                ) : (
                  <a
                    className="card-link"
                    href={`#${card.target}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t.cardButton}
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* ALCOHOL AWARENESS DETAILS */}
        <section
          className="support-section section-wrap"
          id="awareness-details"
        >
          <div className="section-heading">
            <span className="section-label">
              {t.awareness}
            </span>
            <h2>{t.awarenessTitle}</h2>
            <p>{t.awarenessDesc}</p>
          </div>

          <div className="support-grid">
            <article className="support-card mint">
              <div className="card-top">
                <span className="card-icon">✓</span>
              </div>
              <h3>
                {language === "en"
                  ? "Know the risks"
                  : "பாதிப்புகளை அறியுங்கள்"}
              </h3>
              <p>
                {language === "en"
                  ? "Alcohol can affect physical health, mood, judgement, relationships, and everyday life. Effects vary from person to person."
                  : "மது உடல்நலம், மனநிலை, முடிவெடுக்கும் திறன், உறவுகள் மற்றும் அன்றாட வாழ்க்கையைப் பாதிக்கலாம். பாதிப்புகள் ஒவ்வொருவருக்கும் மாறுபடும்."}
              </p>
            </article>

            <article className="support-card blue">
              <div className="card-top">
                <span className="card-icon">♡</span>
              </div>
              <h3>
                {language === "en"
                  ? "Recognise warning signs"
                  : "எச்சரிக்கை அறிகுறிகளை அறியுங்கள்"}
              </h3>
              <p>
                {language === "en"
                  ? "If alcohol use is affecting health, work, studies, or relationships, consider talking to a qualified healthcare professional."
                  : "மது பயன்பாடு உடல்நலம், வேலை, படிப்பு அல்லது உறவுகளைப் பாதித்தால், தகுதியான மருத்துவ நிபுணரிடம் ஆலோசனை பெறுவது உதவியாக இருக்கும்."}
              </p>
            </article>
          </div>
        </section>

        {/* RECOVERY GUIDANCE DETAILS */}
        <section
          className="support-section section-wrap"
          id="recovery-details"
        >
          <div className="section-heading">
            <span className="section-label">
              {t.recovery}
            </span>
            <h2>{t.recoveryTitle}</h2>
            <p>{t.recoveryDesc}</p>
          </div>

          <div className="support-grid">
            <article className="support-card blue">
              <div className="card-top">
                <span className="card-icon">↗</span>
              </div>
              <h3>
                {language === "en"
                  ? "Reach out for support"
                  : "ஆதரவைக் கேளுங்கள்"}
              </h3>
              <p>
                {language === "en"
                  ? "Consider speaking with a trusted person or qualified healthcare professional about the support that may suit your situation."
                  : "உங்கள் சூழ்நிலைக்கு ஏற்ற ஆதரவைப் பற்றி நம்பகமான ஒருவரிடமோ தகுதியான மருத்துவ நிபுணரிடமோ பேசுங்கள்."}
              </p>
            </article>

            <article className="support-card mint">
              <div className="card-top">
                <span className="card-icon">✓</span>
              </div>
              <h3>
                {language === "en"
                  ? "Take a safe next step"
                  : "பாதுகாப்பான அடுத்த படியை எடுங்கள்"}
              </h3>
              <p>
                {language === "en"
                  ? "Recovery is not the same for everyone. Heavy, regular alcohol use can cause dangerous withdrawal, so seek medical advice before making sudden changes."
                  : "மீட்பு ஒவ்வொருவருக்கும் வேறுபடும். அதிகமாகவும் தொடர்ந்து மது அருந்துபவர்களுக்கு திடீரென நிறுத்துவது ஆபத்தான அறிகுறிகளை ஏற்படுத்தலாம். மாற்றங்களைச் செய்வதற்கு முன் மருத்துவ ஆலோசனை பெறுங்கள்."}
              </p>
            </article>
          </div>

          <button
            type="button"
            className="button button-primary"
            onClick={openAssistant}
          >
            {t.assistant} ↗
          </button>
        </section>

        {/* FAMILY SUPPORT DETAILS */}
        <section
          className="support-section section-wrap"
          id="family-details"
        >
          <div className="section-heading">
            <span className="section-label">{t.family}</span>
            <h2>{t.familyTitle}</h2>
            <p>{t.familyDesc}</p>
          </div>

          <div className="support-grid">
            <article className="support-card peach">
              <div className="card-top">
                <span className="card-icon">♡</span>
              </div>
              <h3>
                {language === "en"
                  ? "Listen with care"
                  : "அக்கறையுடன் கேளுங்கள்"}
              </h3>
              <p>
                {language === "en"
                  ? "Choose a calm moment to listen. Avoid blaming language and let your loved one know they can seek help."
                  : "அமைதியான நேரத்தில் அவர்களின் கருத்துகளைக் கேளுங்கள். குற்றம் சாட்டும் வார்த்தைகளைத் தவிர்த்து, உதவி பெறலாம் என்பதை உணர்த்துங்கள்."}
              </p>
            </article>

            <article className="support-card blue">
              <div className="card-top">
                <span className="card-icon">✓</span>
              </div>
              <h3>
                {language === "en"
                  ? "Care for yourself too"
                  : "உங்களையும் கவனித்துக்கொள்ளுங்கள்"}
              </h3>
              <p>
                {language === "en"
                  ? "Set healthy boundaries and seek support for your own wellbeing. You do not have to manage everything alone."
                  : "ஆரோக்கியமான எல்லைகளை அமைத்து, உங்கள் நலனுக்கான ஆதரவையும் பெறுங்கள். எல்லாவற்றையும் நீங்கள் தனியாகச் சமாளிக்க வேண்டியதில்லை."}
              </p>
            </article>
          </div>

          <button
            type="button"
            className="button button-primary"
            onClick={openAssistant}
          >
            {t.assistant} ↗
          </button>
        </section>

        {/* AI ASSISTANT INFORMATION */}
        <section
          className="support-section section-wrap"
          id="assistant"
        >
          <div className="section-heading">
            <span className="section-label">{t.assistant}</span>
            <h2>{t.assistantTitle}</h2>
            <p>{t.assistantDesc}</p>
          </div>

          <button
            type="button"
            className="button button-primary"
            onClick={openAssistant}
          >
            {t.assistantButton}
          </button>
        </section>

        {/* HOPE BANNER */}
        <section
          className="hope-banner section-wrap"
          id="contact"
        >
          <div className="banner-decoration">✳</div>

          <div className="banner-content">
            <span className="section-label">
              A MESSAGE OF HOPE
            </span>

            <h2>{t.bannerTitle}</h2>
            <p>{t.bannerDesc}</p>
          </div>

          <button
            type="button"
            className="button banner-button"
            onClick={() => scrollToSection("support")}
          >
            {t.bannerButton} <span>↗</span>
          </button>
        </section>

        {/* NEARBY HOSPITALS */}
        <Hospitals />
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner section-wrap">
          <a
            className="brand footer-brand"
            href="#home"
            onClick={() => setMenuOpen(false)}
          >
            <span className="brand-icon">S</span>

            <span>
              SOBERPATH<span className="brand-ai"> AI</span>
              <small>HEALTH • HOPE • SUPPORT</small>
            </span>
          </a>

          <p>{t.footer}</p>

          <span className="footer-copy">
            © 2026 SOBERPATH AI
          </span>
        </div>

        <div className="safety-note">{t.safety}</div>
      </footer>

      {/* AI CHAT ASSISTANT */}
      <AIChat />
    </div>
  );
}

export default App;
