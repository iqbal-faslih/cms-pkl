import React from "react";
import Card from "../../components/cards/Card";
import ScheduleCard from "../../components/cards/ScheduleCard";


const Approval = () => {
  return (
    <div className="p-3">    

      {/* Schedule component */}
      <Card className="mt-8 px-1 pb-6">
        <ScheduleCard />
      </Card>
    </div>
  );
};

export default Approval;