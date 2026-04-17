'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { FilterState } from '@/lib/types';

export function FilterBar({
  filters,
  services,
  onChange,
  onReset,
}: {
  filters: FilterState;
  services: string[];
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}) {
  return (
    <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-md md:grid-cols-4">
      <Input
        type="date"
        value={filters.startDate ?? ''}
        onChange={(event) => onChange({ ...filters, startDate: event.target.value })}
      />
      <Input
        type="date"
        value={filters.endDate ?? ''}
        onChange={(event) => onChange({ ...filters, endDate: event.target.value })}
      />
      <Select value={filters.service ?? 'All Services'} onChange={(event) => onChange({ ...filters, service: event.target.value })}>
        <option>All Services</option>
        {services.map((service) => (
          <option key={service} value={service}>
            {service}
          </option>
        ))}
      </Select>
      <Button variant="outline" onClick={onReset}>
        Reset Filters
      </Button>
    </div>
  );
}
