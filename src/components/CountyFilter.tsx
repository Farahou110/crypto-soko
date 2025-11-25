
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface County {
  id: string;
  name: string;
}

interface CountyFilterProps {
  counties: County[];
  selectedCounty: string;
  onCountyChange: (county: string) => void;
}

const CountyFilter: React.FC<CountyFilterProps> = ({ counties, selectedCounty, onCountyChange }) => {
  return (
    <Select value={selectedCounty} onValueChange={onCountyChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select County" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Counties</SelectItem>
        {counties.map((county) => (
          <SelectItem key={county.id} value={county.name}>
            {county.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountyFilter;
