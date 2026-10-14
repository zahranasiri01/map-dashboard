
import type { StatusFilterValue } from "../types";

interface StatusFilterProps {
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
}

export default function StatusFilter({
  value,
  onChange,
}: StatusFilterProps) {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange(event.target.value as StatusFilterValue)
      }
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
    >
      <option value="all">All</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  );
}

