import React from "react";

const TableHeader = ({ config = {} }) => {
  const {
    title,
    subtitle,
    subtitleColor = "text-gray-500",
    className = "",
    actions = [],
    split = false,
    top = {},
    bottom = {},
    titleLeftActions = [],
    titleRightActions = [],
  } = config;

  /**
   * ✅ Render action (support JSX & render function)
   */
  const renderActions = (list = []) =>
    list.map((item, index) => {
      // FORMAT BARU: { key, render }
      if (item && typeof item === "object" && typeof item.render === "function") {
        return (
          <React.Fragment key={item.key || index}>
            {item.render()}
          </React.Fragment>
        );
      }

      // FORMAT LAMA: JSX langsung
      return <React.Fragment key={index}>{item}</React.Fragment>;
    });

  const renderArea = (areaConfig = {}) => {
    const {
      left = [],
      right = [],
      center = [],
      className = "",
      showDivider = false,
    } = areaConfig;

    return (
      <>
        <div
          className={`flex flex-wrap justify-between items-center gap-3 ${className}`}
        >
          <div className="flex items-center gap-2">
            {renderActions(left)}
          </div>

          {center.length > 0 && (
            <div className="flex justify-center items-center gap-2 flex-1">
              {renderActions(center)}
            </div>
          )}

          <div className="flex items-center gap-2">
            {renderActions(right)}
          </div>
        </div>

        {showDivider && <div className="border-b border-gray-300 my-2" />}
      </>
    );
  };

  return (
    <div className={`px-4 py-3 ${className}`}>
      {!split ? (
        // =============================
        // SINGLE AREA
        // =============================
        <div className="flex flex-row justify-between items-center">
          <div>
            {title && (
              <h2 className="text-xl font-bold text-gray-800 mb-1">{title}</h2>
            )}
            {subtitle && (
              <p className={`text-sm ${subtitleColor}`}>{subtitle}</p>
            )}
          </div>

          {actions.length > 0 && (
            <div className="flex items-center gap-2">
              {renderActions(actions)}
            </div>
          )}
        </div>
      ) : (
        // =============================
        // SPLIT MODE
        // =============================
        <>
          <div className="mb-2">
            {(title || subtitle) && (
              <div className="flex justify-between items-start mb-2 w-full">
                <div className="flex items-start gap-3">
                  <div>
                    {title && (
                      <h2 className="text-xl font-bold text-gray-800 mb-1">
                        {title}
                      </h2>
                    )}
                    {subtitle && (
                      <p className={`text-sm ${subtitleColor}`}>{subtitle}</p>
                    )}
                  </div>

                  {titleLeftActions.length > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      {renderActions(titleLeftActions)}
                    </div>
                  )}
                </div>

                {titleRightActions.length > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    {renderActions(titleRightActions)}
                  </div>
                )}
              </div>
            )}

            {renderArea(top)}
          </div>

          {renderArea(bottom)}
        </>
      )}
    </div>
  );
};

export default TableHeader;
