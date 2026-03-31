import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../../../components/Button';

const StatusModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Select task status",
  description = "Select your task status",
  options = [],
  initialValue = null,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  const [selected, setSelected] = useState(initialValue);

  useEffect(() => {
    setSelected(initialValue);
  }, [initialValue, isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selected) {
      onConfirm(selected);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full px-8 py-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          {title}
        </h2>

        {/* Description */}
        <p className="text-gray-400 mb-8 font-light">{description}</p>

        {/* Options */}
        <div className="flex gap-4 mb-8">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelected(opt.value)}
              className={`
                px-7 py-3 rounded-md font-semibold text-sm transition-all
                ${selected === opt.value ? opt.activeClass : opt.inactiveClass}
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="px-6 py-2 rounded-md border border-gray-200 font-semibold text-gray-700 hover:bg-gray-100"
          >
            {cancelText}
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={!selected}
            className={`
              px-6 py-2 rounded-md font-semibold text-white transition-colors
              ${selected ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}
            `}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
