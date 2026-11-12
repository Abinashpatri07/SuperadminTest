export default function InputField({
  label,
  type,
  placeholder,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}