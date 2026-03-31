
export default function CompanySteps({ procedures, MotionDiv }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
      {procedures.company.map((step, index) => {
        const IconComponent = step.icon;
        return (
          <MotionDiv key={index} delay={index} className="flex flex-col items-center text-center">
            <div className="relative mb-6 group cursor-pointer">
              <div className="w-20 h-20 bg-gradient-to-b from-[#0069AB] to-[#C635FF] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <IconComponent className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#0C1018] text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                {index + 1}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 hover:text-[#0069AB] transition-colors duration-300">{step.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
          </MotionDiv>
        );
      })}
    </div>
  );
}
