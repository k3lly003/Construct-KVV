import React from 'react';
import { provinceData } from '@/app/utils/fakes/Locations';

interface LocationSelectorProps {
  province: string;
  district: string;
  cell: string;
  onProvinceChange: (province: string) => void;
  onDistrictChange: (district: string) => void;
  onCellChange: (cell: string) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  province,
  district,
  cell,
  onProvinceChange,
  onDistrictChange,
  onCellChange
}) => {
  type ProvinceKey = keyof typeof provinceData;

  const provinces = Object.keys(provinceData) as ProvinceKey[];
  const districts =
    province && (province in provinceData)
      ? Object.keys(provinceData[province as ProvinceKey].districts)
      : [];
  const cells =
    province && district && (province in provinceData) && (district in provinceData[province as ProvinceKey].districts)
      ? provinceData[province as ProvinceKey].districts[district as keyof (typeof provinceData)[ProvinceKey]['districts']]
      : [];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Location Information</h3>
        <p className="text-slate-600">Specify your working area</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Province <span className="text-red-500">*</span>
          </label>
          <select
            value={province}
            onChange={(e) => {
              onProvinceChange(e.target.value);
              onDistrictChange('');
              onCellChange('');
            }}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-emerald-500 focus:outline-none transition-all duration-300 font-medium hover:border-slate-300"
          >
            <option value="">Select Province</option>
            {provinces.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            District <span className="text-red-500">*</span>
          </label>
          <select
            value={district}
            onChange={(e) => {
              onDistrictChange(e.target.value);
              onCellChange('');
            }}
            disabled={!province}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-emerald-500 focus:outline-none transition-all duration-300 font-medium hover:border-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed"
          >
            <option value="">Select District</option>
            {districts.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Cell <span className="text-red-500">*</span>
          </label>
          <select
            value={cell}
            onChange={(e) => onCellChange(e.target.value)}
            disabled={!district}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-emerald-500 focus:outline-none transition-all duration-300 font-medium hover:border-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed"
          >
            <option value="">Select Cell</option>
            {cells.map((cellName) => (
              <option key={cellName} value={cellName}>
                {cellName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};