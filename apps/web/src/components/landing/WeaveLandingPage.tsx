type WeaveLandingPageProps = {
  onEnterDemo: () => void;
};

const steps = [
  {
    icon: "/brand-icons/finder.png",
    title: "Read the room before you reach out",
    copy: "Start with a company brief that turns public signals into a sharper search.",
  },
  {
    icon: "/brand-icons/network.png",
    title: "Find people with a real reason to care",
    copy: "Prioritize recruiters, product leaders, alumni, and warm adjacency in one pass.",
  },
  {
    icon: "/brand-icons/draft.png",
    title: "Draft like you already did the homework",
    copy: "Use your profile, the company context, and the contact's role to write a note worth opening.",
  },
];

export function WeaveLandingPage({ onEnterDemo }: WeaveLandingPageProps) {
  return (
    <main className="weave-landing" aria-labelledby="weave-landing-title">
      <div className="weave-landing__glow weave-landing__glow--blue" />
      <div className="weave-landing__glow weave-landing__glow--pink" />
      <section className="weave-landing__hero">
        <div className="weave-landing__story">
          <a className="weave-landing__brand" href="/" aria-label="Weave landing page">
            <img
              src="/brand-icons/weave-transparent-logo-updated.png"
              alt="Weave"
              className="weave-landing__logo"
            />
          </a>

          <p className="weave-landing__eyebrow">Student outreach, with receipts</p>
          <h1 id="weave-landing-title" className="weave-landing__title">
            Weave turns cold applications into warm conversations.
          </h1>
          <p className="weave-landing__lede">
            Find the right hiring contacts, draft context-rich outreach, and keep every
            follow-up moving from one focused workspace.
          </p>

          <div className="weave-landing__actions">
            <button type="button" className="weave-landing__primary" onClick={onEnterDemo}>
              Enter demo workspace
            </button>
            <span className="weave-landing__demo-note">
              Built for Calgary SWE students chasing internship conversations.
            </span>
          </div>
        </div>

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
            Temporary demo login only. No account setup, no production auth, just the main
            Weave workspace ready for the hackathon flow.
          </p>
        </form>
      </section>

      <section className="weave-landing__path" aria-label="How Weave helps">
        {steps.map((step, index) => (
          <article className="weave-path-card" key={step.title}>
            <span className="weave-path-card__number">0{index + 1}</span>
            <img src={step.icon} alt="" className="weave-path-card__icon" />
            <h2>{step.title}</h2>
            <p>{step.copy}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
