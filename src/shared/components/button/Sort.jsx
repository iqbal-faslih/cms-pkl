import { useState, useEffect, useRef } from "react";
import Button from "@/shared/components/button/Button";
import { Icon } from "@iconify/react";

const BREAKPOINTS = { lg: 1202, md: 888 };

const SortButton = ({
  label = "Terbaru - Terlama",
  options = [
    { value: "terbaru-terlama", label: "Terbaru - Terlama" },
    { value: "terlama-terbaru", label: "Terlama - Terbaru" },
    { value: "a-z", label: "A-Z" },
    { value: "z-a", label: "Z-A" },
  ],
  onSelect = () => {},
  onOpen = () => {},
  className = "",
  dropdownClassName = "",
  showIcon = true,
  icon = "material-symbols-light:filter-list-rounded",
  labelText = "Sort by:",
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const [width, setWidth] = useState(window.innerWidth);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (opt) => {
    setSelected(opt);
    onSelect(opt.value);
    setOpen(false);
  };

  const isLg = width >= BREAKPOINTS.lg;
  const isMd = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
  const isSm = width < BREAKPOINTS.md;

  const renderButtonContent = () => {
    if (isLg) {
      return (
        <>
          {showIcon && <Icon icon={icon} className="w-5 h-5 text-gray-400" />}
          <span className="flex-1 text-left text-gray-400 truncate">{selected.label}</span>
          <Icon icon="ep:arrow-down-bold" className="w-4 h-4 -mt-1 text-gray-400" />
        </>
      );
    }
    return showIcon && <Icon icon={icon} className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="relative flex-shrink-0 inline-flex items-center gap-2" ref={wrapperRef}>
      {(isLg || isMd) && <span className="text-sm text-gray-600">{labelText}</span>}

      <Button
        onClick={() => {
          const newOpen = !open;
          setOpen(newOpen);
          if (newOpen) onOpen();
        }}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-md
          bg-white hover:bg-gray-100 text-gray-700 flex-shrink-0 ${className}`}
      >
        {renderButtonContent()}
      </Button>

      {open && (
        <div
          className={`absolute top-full overflow-hidden right-0 mt-1 min-w-32 text-left text-sm text-gray-700 
            bg-white border border-gray-200 rounded-md shadow-lg z-15 ${dropdownClassName}`}
        >
          {options.map((opt, idx) => (
            <div key={opt.value} onClick={() => handleSelect(opt)} className={`px-4 py-2 text-sm text-gray-400 text-center cursor-pointer hover:bg-blue-500 hover:text-white ${idx !== options.length - 1 ? "border-b border-gray-200" : ""}`}>
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortButton;
