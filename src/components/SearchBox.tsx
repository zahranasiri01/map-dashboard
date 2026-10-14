
interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBox({
  value,
  onChange,
}: SearchBoxProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search equipment..."
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
    />
  );
}