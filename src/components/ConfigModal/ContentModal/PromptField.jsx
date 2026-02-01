import { MessageSquare } from "lucide-react";

export function PromptField({
  label,
  value,
  onChange,
  placeholder,
  description,
  minHeight = "100px",
  iconColor = "text-primary-500",
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
        <MessageSquare className={`w-4 h-4 ${iconColor}`} />
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field min-h-[${minHeight}] resize-y`}
        style={{ minHeight }}
      />
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
}
