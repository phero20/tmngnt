import { envConfig } from '@/config/env.config';

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * FIXED DIAGNOSTIC SERVER COMPONENT
 */
export default async function Page({ params }: PageProps) {
  const start = Date.now();
  let hotel = null;
  let debug = {
    start,
    end: 0,
    duration: 0,
    baseUrl: '',
    id: '',
    status: 'starting',
    error: null as any,
  };

  try {
    const { id } = await params;
    debug.id = id;

    // Explicitly try 127.0.0.1 if localhost hangs
    const backendUrl = envConfig.get('NEXT_PUBLIC_BACKEND_URL');
    debug.baseUrl = backendUrl;

    debug.status = 'fetching';
    const response = await fetch(`${backendUrl}/api/hotels/${id}`, {
      next: { revalidate: 0 },
      // Important: Add a signal to prevent infinite hanging
      signal: AbortSignal.timeout(3000),
    });

    debug.status = `response-${response.status}`;
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const json = await response.json();
    hotel = json.data;
    debug.status = 'success';
  } catch (err: any) {
    debug.status = 'error';
    debug.error = {
      message: err.message,
      name: err.name,
      cause: err.cause,
    };
  } finally {
    debug.end = Date.now();
    debug.duration = debug.end - debug.start;
  }

  if (hotel) {
    return (
      <div className="min-h-screen bg-black text-white p-6 lg:p-24 space-y-8 font-mono pt-32">
        <h1 className="text-4xl font-serif text-primary">
          DEBUG: Property Found
        </h1>
        <div className="bg-zinc-900 p-4 rounded border border-zinc-700 text-xs text-zinc-400">
          <p>Time taken: {debug.duration}ms</p>
          <p>Status: {debug.status}</p>
        </div>
        <h2 className="text-6xl">{hotel.name}</h2>
        <a
          href="/hotels"
          className="text-zinc-500 hover:text-white underline text-sm mt-8 block"
        >
          ← Back to Listings
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 lg:p-24 space-y-8 font-mono pt-32">
      <h1 className="text-3xl font-bold text-red-500">DIAGNOSTIC FAILURE</h1>
      <div className="space-y-4 bg-black/50 p-6 rounded-xl border border-red-900/50">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-slate-900 rounded">
            <span className="text-xs text-slate-500 block">ID</span>
            {debug.id}
          </div>
          <div className="p-3 bg-slate-900 rounded">
            <span className="text-xs text-slate-500 block">Base URL</span>
            {debug.baseUrl}
          </div>
          <div className="p-3 bg-slate-900 rounded">
            <span className="text-xs text-slate-500 block">Duration</span>
            {debug.duration}ms
          </div>
          <div className="p-3 bg-slate-900 rounded">
            <span className="text-xs text-slate-500 block">Status</span>
            {debug.status}
          </div>
        </div>
        <div className="p-4 bg-red-950/20 rounded border border-red-900/30">
          <h3 className="text-red-400 font-bold mb-2">Error Log</h3>
          <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap">
            {JSON.stringify(debug.error, null, 2)}
          </pre>
        </div>
        <a
          href="/hotels"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm transition-colors decoration-transparent inline-block"
        >
          Try Listings Again
        </a>
      </div>
    </div>
  );
}

export const revalidate = 0;
