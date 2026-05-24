import { useEffect, useState } from "react";
import { HermesSidebar } from "./components/layout/HermesSidebar";
import { WeaveLandingPage } from "./components/landing/WeaveLandingPage";
import { WorkspacePage } from "./components/pages/WorkspacePage";

const DEMO_AUTH_KEY = "weave-demo-auth";
const APP_ROUTE = "/app";

// Lightweight demo routing: `/` is the judge-facing landing page, `/app` is the
// existing workspace. The localStorage flag is demo continuity, not production auth.
function getRoute() {
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

export default function App() {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const syncRoute = () => setRoute(getRoute());
    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  const enterDemo = () => {
    try {
      window.localStorage.setItem(DEMO_AUTH_KEY, "1");
    } catch {
      // Demo access should still work when localStorage is unavailable.
    }
    window.history.pushState({}, "", APP_ROUTE);
    setRoute(APP_ROUTE);
  };

  if (route !== APP_ROUTE) {
    return <WeaveLandingPage onEnterDemo={enterDemo} />;
  }

  return (
    <div className="vl-shell">
      <HermesSidebar />
      <main className="vl-shell__main">
        <WorkspacePage />
      </main>
    </div>
  );
}
