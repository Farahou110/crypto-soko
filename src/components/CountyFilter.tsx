
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CountyFilterProps {
  selectedCounty: string;
  onCountyChange: (county: string) => void;
}

const counties = [
  'All',
  'Nairobi',
  'Mombasa',
  'Kisumu',
  'Nakuru',
  'Eldoret',
  'Nyeri',
  'Machakos',
  'Meru',
  'Thika',
  'Kitale'
];

const CountyFilter: React.FC<CountyFilterProps> = ({ selectedCounty, onCountyChange }) => {
  return (
    <Select value={selectedCounty} onValueChange={onCountyChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select County" />
      </SelectTrigger>
      <SelectContent>
        {counties.map((county) => (
          <SelectItem key={county} value={county}>
            {county}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountyFilter;
