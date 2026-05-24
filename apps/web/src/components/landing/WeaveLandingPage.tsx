import {
  behavioralInsights,
  faqItems,
  landingNav,
  pathSteps,
  productFeatures,
  studentBullets,
} from "./landingContent";

type WeaveLandingPageProps = {
  onEnterDemo: () => void;
};

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function WeaveLandingPage({ onEnterDemo }: WeaveLandingPageProps) {
  return (
    <div className="weave-landing">
      <div className="weave-landing__glow weave-landing__glow--blue" aria-hidden="true" />
      <div className="weave-landing__glow weave-landing__glow--pink" aria-hidden="true" />

      <header className="weave-landing__header">
        <div className="weave-landing__header-inner">
          <div className="weave-landing__header-main">
            <a
              className="weave-landing__header-brand"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("top");
              }}
            >
              <img
                src="/brand-icons/weave-transparent-logo-updated.png"
                alt="Weave"
                className="weave-landing__header-logo"
              />
            </a>
            <nav className="weave-landing__nav" aria-label="Page sections">
              {landingNav.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <button type="button" className="weave-landing__header-cta" onClick={onEnterDemo}>
            Open demo
          </button>
        </div>
      </header>

      <main>
        <section id="top" className="weave-landing__hero" aria-labelledby="weave-landing-title">
          <div className="weave-landing__hero-copy">
            <p className="weave-landing__eyebrow">Student outreach, with receipts</p>
            <h1 id="weave-landing-title" className="weave-landing__title">
              <span className="weave-landing__title-weave">Weave</span> turns cold applications
              into warm conversations.
            </h1>
            <p className="weave-landing__lede">
              Find the right hiring contacts, draft context-rich outreach, and keep every
              follow-up moving from one focused workspace.
            </p>
            <p className="weave-landing__story-links">
              <button
                type="button"
                className="weave-landing__text-link"
                onClick={() => scrollToSection("how")}
              >
                See how it works
              </button>
            </p>
            <div className="weave-landing__actions weave-landing__actions--mobile">
              <button type="button" className="weave-landing__primary" onClick={onEnterDemo}>
                Enter demo workspace
              </button>
            </div>
            <p className="weave-landing__demo-note">
              Use <strong>Open demo</strong> above or the workspace card to enter.
            </p>
          </div>

          <aside className="weave-landing__hero-aside" aria-label="Demo workspace access">
            <DemoLoginCard onEnterDemo={onEnterDemo} />
          </aside>
        </section>

        <section className="weave-landing__strip" aria-label="Product pillars">
          <ul className="weave-landing__strip-list">
            <li>Company briefs with hiring signals</li>
            <li>Ranked contacts with evidence</li>
            <li>Editable outreach drafts</li>
            <li>Follow-up pipeline</li>
          </ul>
        </section>

        <section id="how" className="weave-landing__section weave-landing__path-wrap">
          <div className="weave-landing__section-head">
            <p className="weave-landing__section-eyebrow">How it works</p>
            <h2 className="weave-landing__section-title">Three moves, one workspace</h2>
            <p className="weave-landing__section-lede">
              Weave mirrors how strong students actually network: research first, reach out with
              proof, then stay on top of replies.
            </p>
          </div>
          <div className="weave-landing__path" aria-label="How Weave helps">
            {pathSteps.map((step, index) => (
              <article className="weave-path-card" key={step.title}>
                <div className="weave-path-card__top">
                  <span className="weave-path-card__number">0{index + 1}</span>
                  <img src={step.icon} alt="" className="weave-path-card__icon" />
                </div>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="psychology" className="weave-landing__section weave-landing__psychology">
          <div className="weave-landing__section-head weave-landing__section-head--wide">
            <p className="weave-landing__section-eyebrow">The psychology of reaching out</p>
            <h2 className="weave-landing__section-title">
              Outreach feels risky because the cost is immediate and the upside is invisible.
            </h2>
            <p className="weave-landing__section-lede">
              Weave is designed around the moment people hesitate: they have a goal, but not a
              warm path, a specific person, or a safe next sentence.
            </p>
          </div>

          <div className="weave-psychology-grid">
            {behavioralInsights.map((item, index) => (
              <article className="weave-psychology-card" key={item.title}>
                <span className="weave-psychology-card__index">0{index + 1}</span>
                <p className="weave-psychology-card__label">{item.label}</p>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <div className="weave-psychology-card__fact">{item.fact}</div>
              </article>
            ))}
          </div>

          <div className="weave-psychology-punchline">
            <span>Weave makes the next step concrete:</span>
            <strong>who to contact, why they matter, what to say, and when to follow up.</strong>
          </div>
        </section>

        <section id="features" className="weave-landing__section">
          <div className="weave-landing__section-head">
            <p className="weave-landing__section-eyebrow">Inside the product</p>
            <h2 className="weave-landing__section-title">Everything you need before you hit send</h2>
            <p className="weave-landing__section-lede">
              The demo workspace is the same UI judges see: profile on the right, search and coach
              in the center, results tabs for company, contacts, and messages.
            </p>
          </div>
          <div className="weave-feature-grid">
            {productFeatures.map((feature) => (
              <article
                key={feature.title}
                className={`weave-feature-card weave-feature-card--${feature.accent}`}
              >
                <img src={feature.icon} alt="" className="weave-feature-card__icon" />
                <h3>{feature.title}</h3>
                <p>{feature.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="students" className="weave-landing__section weave-landing__audience">
          <div className="weave-audience-card">
            <div className="weave-audience-card__copy">
              <p className="weave-landing__section-eyebrow">For students</p>
              <h2 className="weave-landing__section-title">Stop spraying applications into the void</h2>
              <p className="weave-landing__section-lede">
                Weave is for people who will do the work but want better tools than a spreadsheet
                and a generic LinkedIn template.
              </p>
              <ul className="weave-audience-card__list">
                {studentBullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <button type="button" className="weave-landing__primary" onClick={onEnterDemo}>
                Try the demo workspace
              </button>
            </div>
            <div className="weave-audience-card__visual" aria-hidden="true">
              <div className="weave-audience-card__tile weave-audience-card__tile--profile">
                <img src="/brand-icons/profile.png" alt="" />
                <span>Your story</span>
              </div>
              <div className="weave-audience-card__tile weave-audience-card__tile--finder">
                <img src="/brand-icons/finder.png" alt="" />
                <span>Find people</span>
              </div>
              <div className="weave-audience-card__tile weave-audience-card__tile--draft">
                <img src="/brand-icons/draft.png" alt="" />
                <span>Draft outreach</span>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="weave-landing__section weave-landing__faq-section">
          <div className="weave-landing__section-head">
            <p className="weave-landing__section-eyebrow">FAQ</p>
            <h2 className="weave-landing__section-title">Quick answers</h2>
          </div>
          <dl className="weave-faq">
            {faqItems.map((item) => (
              <div className="weave-faq__item" key={item.question}>
                <dt>{item.question}</dt>
                <dd>{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="weave-landing__cta-band" aria-labelledby="weave-cta-title">
          <h2 id="weave-cta-title" className="weave-landing__cta-title">
            Ready to weave your next outreach thread?
          </h2>
          <p className="weave-landing__cta-lede">
            Open the demo, run a WestJet search, pick contacts, and generate a draft in under a
            minute.
          </p>
          <button type="button" className="weave-landing__primary" onClick={onEnterDemo}>
            Enter demo workspace
          </button>
        </section>
      </main>

      <footer className="weave-landing__footer">
        <img
          src="/brand-icons/weave-transparent-logo-updated.png"
          alt=""
          className="weave-landing__footer-logo"
        />
        <p>Weave · Student outreach workspace</p>
        <p className="weave-landing__footer-meta">
          <button type="button" className="weave-landing__footer-link" onClick={onEnterDemo}>
            Demo workspace
          </button>
        </p>
      </footer>
    </div>
  );
}

function DemoLoginCard({ onEnterDemo }: { onEnterDemo: () => void }) {
  return (
    <form
      className="weave-login"
      aria-label="Demo login"
      onSubmit={(event) => {
        event.preventDefault();
        onEnterDemo();
      }}
    >
      <div className="weave-login__header">
        <img src="/brand-icons/pin.png" alt="" className="weave-login__pin" />
        <div>
          <p className="weave-login__kicker">Demo access</p>
          <h2 className="weave-login__title">Step into the workspace</h2>
        </div>
      </div>

      <label className="weave-login__field">
        <span>Email</span>
        <input type="email" defaultValue="demo@weave.local" autoComplete="email" />
      </label>

      <label className="weave-login__field">
        <span>Password</span>
        <input type="text" defaultValue="weave-demo" autoComplete="current-password" />
      </label>

      <button type="submit" className="weave-login__submit">
        Continue with demo info
      </button>

      <p className="weave-login__fine-print">
        Temporary demo login only. No account setup, no production auth, just the main Weave
        workspace ready for the hackathon flow.
      </p>
    </form>
  );
}
