import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function RouteErrorBoundary() {
  const err = useRouteError();
  if (isRouteErrorResponse(err)) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-semibold">Error {err.status}</h1>
        <p className="mt-2">{err.statusText}</p>
      </main>
    );
  }
  const message = err instanceof Error ? err.message : "Unknown error";
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2">{message}</p>
    </main>
  );
}
