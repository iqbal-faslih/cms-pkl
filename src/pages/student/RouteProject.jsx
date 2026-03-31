import React from "react";
import { useRouteProject } from "../../hooks/useRouteProject";
import CardRoute from "../../components/cards/student/CardRoute";
import { getRouteStatus } from "../../utils/routeUtils";


const RouteProject = () => {
  const { routes, loading, error } = useRouteProject();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="mt-4 text-gray-600">Memuat data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        Belum ada project route tersedia.
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        Route Project
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {routes.map((stage) => {
        const statusProps = getRouteStatus(stage.status);
          return (
            <CardRoute
              key={stage.id}
              stage={stage}
              {...statusProps} 
            />
          );
        })}
      </div>
    </div>
  );
};


export default RouteProject;