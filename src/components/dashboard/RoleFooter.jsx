import React from "react";
import { Link } from "react-router-dom";

const RoleFooter = () => {
    const footerMenus = ["License", "More Themes", "Documentation", "Support"];
    return (
        <div className="hidden bg-white rounded-t-xl px-5 py-4 w-full md:flex flex-col md:flex-row md:justify-between">
      <div className="text-slate-400 font-normal text-sm">
        © Copyright Edmate 2024, All Right Reserved
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        {footerMenus.map((item, i) => (
          <Link
            key={i + 1}
            to="#"
            className="text-slate-400 text-sm font-normal hover:text-slate-600 transition-colors"
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RoleFooter;
