import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import LandingPage from "./pages/LandingPage";
import OmiiPage from "./pages/OmiiPage";
import RomiiPage from "./pages/RomiiPage";

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const omiiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/omii",
  component: OmiiPage,
});

const romiiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/romii",
  component: RomiiPage,
});

const routeTree = rootRoute.addChildren([indexRoute, omiiRoute, romiiRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
