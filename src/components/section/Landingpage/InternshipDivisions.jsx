import Button from "../../Button";

const InternshipDivisions = () => {
  const divisions = [
    { title: "Frontend Development", icon: "logo1.png", companies: 256 },
    { title: "Digital Marketing", icon: "logo1.png", companies: 356 },
    { title: "Mobile Development", icon: "logo1.png", companies: 456 },
    { title: "Backend Development", icon: "logo1.png", companies: 156 },
    { title: "Project Manager", icon: "logo1.png", companies: 220 },
    { title: "UI/UX Design", icon: "logo1.png", companies: 230 },
    { title: "Quality Assurance", icon: "logo1.png", companies: 226 },
  ];

  return (
    <section className="relative lg:mt-10 pt-14 pb-10 px-10 bg-blue-50 w-full overflow-hidden">
    <img
      src="assets/img/shapes.png"
      alt="Shapes"
      className="hidden sm:absolute inset-0 -top-52 left-0 w-full h-auto object-cover opacity-15 pointer-events-none"
    />
  
    <div className="relative z-10 w-full">
      <div className="flex justify-between flex-col sm:flex-row">
        <div className="">
          <h2 className="text-3xl font-bold text-blue-900">DIVISI MAGANG</h2>
          <p className="text-gray-900 mt-2 font-semibold">
            Jelajahi peluang magang di berbagai divisi terkait Software Development.
          </p>
        </div>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {divisions.map((division, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-white rounded-lg hover:scale-105 transition cursor-pointer duration-300 ease-in-out"
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                <img
                  src={`assets/icons/Devisions/${division.icon}`}
                  alt="Icon"
                  className="w-8 h-8"
                />
              </div>
              <div className="max-w-[150px] lg:max-w-[200px]">
                <h3 className="lg:text-lg font-semibold text-gray-900">
                  {division.title}
                </h3>
                <p className="text-gray-500 text-sm">
                  {division.companies} Perusahaan
                </p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  </section>
  
  );
};

export default InternshipDivisions;
