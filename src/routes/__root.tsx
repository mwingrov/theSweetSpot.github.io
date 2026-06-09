import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Layout } from "../components/Layout";

function NotFoundComponent() {
  return (
    <section>
      <div className="container" style={{ textAlign: "center", padding: "3rem 1rem" }}>
        <h1>404</h1>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">Back home</Link>
      </div>
    </section>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  // Force scroll animations to refresh whenever the pathname changes
  useEffect(() => {
    // 1. Instantly force the window back to the top of the viewpoint
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // 2. Locate all hidden elements on the new page template
    const elements = document.querySelectorAll(".reveal");

    // 3. Fail-safe: If an element is already at the top of the new viewport, make it visible instantly
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add("active"); // Or whatever class your CSS uses to show elements (e.g., .visible, .show)
      }
    });
  }, [location.pathname]); // Fires every single time you click a <Link> to another route

  return (
    <section>
      <div className="container" style={{ textAlign: "center", padding: "3rem 1rem" }}>
        <h1>Something went wrong</h1>
        <p>We couldn't load this page. Try again or go home.</p>
        <div className="btn-group" style={{ justifyContent: "center" }}>
          <button
            className="btn btn-primary"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </button>
          <Link to="/" className="btn btn-outline">Go home</Link>
        </div>
      </div>
    </section>
  );
}

// 1. Maintain context type-safety for React Query
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: App,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

// 2. Pure client-side wrapper that injects layout shell and route outlets
function App() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        {/* Renders your index.tsx home component inside the layout shell */}
        <Outlet />
      </Layout>
    </QueryClientProvider>
  );
}
