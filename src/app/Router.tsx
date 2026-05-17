import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Card } from '@core/ui';
import { ErrorBoundary } from './ErrorBoundary';

const HomePage = lazy(() => import('@/pages/HomePage'));
const CalculatorPage = lazy(() => import('@/pages/CalculatorPage'));
const ResultsPage = lazy(() => import('@/pages/ResultsPage'));

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/calculadora', element: <CalculatorPage /> },
  { path: '/resultados', element: <ResultsPage /> },
]);

function RouterFallback(): JSX.Element {
  return (
    <Card className="mx-auto mt-10 max-w-2xl animate-pulse">
      <div className="h-6 w-40 rounded-full bg-slate-200" />
      <div className="mt-4 h-28 rounded-3xl bg-slate-100" />
    </Card>
  );
}

export function AppRouter(): JSX.Element {
  return (
    <ErrorBoundary>
      <Suspense fallback={<RouterFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
}
