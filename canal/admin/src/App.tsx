import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";

const LoginPage = React.lazy(() => import("./routes/login"));
const DashboardLayout = React.lazy(() => import("./routes/dashboard"));
const CollectionPage = React.lazy(() => import("./routes/collection"));
const MediaPage = React.lazy(() => import("./routes/media"));
const FormsPage = React.lazy(() => import("./routes/forms"));
const ChatsPage = React.lazy(() => import("./routes/chats"));

/** Wrapper para passar slug como prop */
function CollectionRoute({ slug }: { slug: string }) {
  return <CollectionPage slug={slug} />;
}

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <CollectionRoute slug="insights" /> },
      { path: "cases", element: <CollectionRoute slug="cases" /> },
      { path: "jobs", element: <CollectionRoute slug="jobs" /> },
      { path: "pages", element: <CollectionRoute slug="pages" /> },
      { path: "media", element: <MediaPage /> },
      { path: "forms", element: <FormsPage /> },
      { path: "chats", element: <ChatsPage /> },
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
