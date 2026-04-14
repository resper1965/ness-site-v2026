import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";

const LoginPage      = React.lazy(() => import("./routes/login"));
const DashboardLayout = React.lazy(() => import("./routes/dashboard"));
const InsightsPage   = React.lazy(() => import("./routes/insights"));
const CasesPage      = React.lazy(() => import("./routes/cases"));
const JobsPage       = React.lazy(() => import("./routes/jobs"));
const FormsPage      = React.lazy(() => import("./routes/forms"));

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true,         element: <InsightsPage /> },
      { path: "cases",       element: <CasesPage /> },
      { path: "jobs",        element: <JobsPage /> },
      { path: "forms",       element: <FormsPage /> },
    ],
  },
]);

export default function App() {
  return (
    <React.Suspense fallback={<div className="loader" />}>
      <RouterProvider router={router} />
    </React.Suspense>
  );
}
