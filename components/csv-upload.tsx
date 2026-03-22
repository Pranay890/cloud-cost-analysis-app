'use client';

import Papa from 'papaparse';
import { UploadCloud } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { BillingRecord } from '@/lib/types';
import { normalizeRecord } from '@/lib/utils';

export function CsvUpload({ onUploaded }: { onUploaded: () => Promise<void> }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setLoading(true);
    setMessage(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const records = (results.data as Record<string, unknown>[])
          .map((row) => normalizeRecord(row))
          .filter(Boolean) as BillingRecord[];

        if (!records.length) {
          setMessage('No valid rows found. Expected columns: date, service_name, cost, region(optional).');
          setLoading(false);
          return;
        }

        try {
          const response = await fetch('/api/billing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ records }),
          });

          const data = await response.json();

          if (!response.ok) {
            setMessage(data.message ?? 'Upload failed. Please try again.');
            return;
          }

          const target = data.source === 'mongo' ? 'MongoDB' : 'in-memory fallback';
          setMessage(data.message ?? `Billing data uploaded successfully to ${target}.`);
          await onUploaded();
        } catch (error) {
          console.error(error);
          setMessage('Upload failed. Please try again.');
        }

        setLoading(false);
      },
      error: (error) => {
        setMessage(error.message);
        setLoading(false);
      },
    });
  };

  return (
    <div className="rounded-2xl border border-dashed border-blue-400/40 bg-blue-500/5 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Upload cloud billing CSV</h3>
          <p className="mt-1 text-sm text-muted">
            Supports AWS, Azure, and GCP. Required columns: <span className="text-white">date, service_name, cost</span>.
          </p>
        </div>
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
          <Button onClick={() => inputRef.current?.click()} disabled={loading}>
            <UploadCloud className="mr-2 h-4 w-4" />
            {loading ? 'Uploading...' : 'Upload CSV'}
          </Button>
        </div>
      </div>
      {message && <p className="mt-3 text-sm text-blue-100">{message}</p>}
    </div>
  );
}
