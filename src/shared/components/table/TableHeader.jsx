import React, { useState, useEffect } from "react";

const BREAKPOINTS = { lg: 1202, md: 888 };

const TableHeader = ({ config = {} }) => {
  const {
    title,
    subtitle,
    subtitleColor = "text-gray-500",
    className = "",
    split = false,
    titleLeftActions = [],
    titleRightActions = [],
    top = {},
    bottom = {},
  } = config;

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isLg = width >= BREAKPOINTS.lg;
  const isMd = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
  const isSm = width < BREAKPOINTS.md;

  const cloneIfComponent = (el) => {
    if (!React.isValidElement(el)) return el;
    if (typeof el.type === "function") {
      return React.cloneElement(el, { isMd, isSm });
    }
    return el;
  };

  const renderList = (items = [], prefix = "item") =>
    items.map((el, i) => {
      const key = React.isValidElement(el) && el.key != null ? el.key : `${prefix}-${i}`;
      return <React.Fragment key={key}>{cloneIfComponent(el)}</React.Fragment>;
    });

  const renderRow = (section) => {
    const { left = [], right = [] } = section;
    return (
      <div className={`flex ${isSm ? "flex-wrap" : "flex-nowrap"} justify-between items-center gap-3 w-full mt-3`}>
        <div className="flex flex-wrap items-center gap-2">
          {renderList(left, "bottom-left")}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {renderList(right, "bottom-right")}
        </div>
      </div>
    );
  };

  return (
    <div className={`px-4 py-3 ${className}`}>
      {!split ? (
        <div className="w-full">
          <div className={`flex ${isSm ? "flex-wrap" : "flex-nowrap"} justify-between items-center gap-y-3 gap-x-4`}>
            {/* LEFT */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 min-w-0">
              <div className="shrink-0">
                {title && <h2 className="text-xl font-bold text-gray-800">{title}</h2>}
                {subtitle && <p className={`text-sm ${subtitleColor}`}>{subtitle}</p>}
              </div>

              {renderList(top.left || [], "top-left")}
            </div>

            {/* RIGHT */}
            <div className="flex flex-wrap items-center gap-2">
              {renderList(top.right || [], "top-right")}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* TITLE AREA */}
          <div className={`flex ${isSm ? "flex-wrap" : "flex-nowrap"} justify-between items-start gap-y-3 gap-x-4 w-full`}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 min-w-0">
              <div className="shrink-0">
                {title && <h2 className="text-xl font-bold text-gray-800">{title}</h2>}
                {subtitle && <p className={`text-sm ${subtitleColor}`}>{subtitle}</p>}
              </div>

              {renderList(titleLeftActions, "title-left")}
            </div>

            {renderList(titleRightActions, "title-right")}
          </div>

          {/* SEARCH / FILTER */}
          <div className={`flex ${isSm ? "flex-wrap" : isMd ? "flex-wrap" : "flex-nowrap"} justify-between items-center gap-y-3 gap-x-4 w-full mt-4`}>
            {renderList(top.left || [], "split-top-left")}
            {renderList(top.right || [], "split-top-right")}
          </div>

          {renderRow(bottom)}
        </>
      )}
    </div>
  );
};

export default TableHeader;
