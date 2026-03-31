import React, { useState } from "react";
import Checkbox from "../../../shared/components/Checkbox";
import { revisions } from "./dummies";
import Card from "../../../components/cards/Card";
import BackHeader from "../../../shared/components/header/BackHeader";

const DetailRevisi = () => {
  const [firstChecked, setFirstChecked] = useState({});
  const [secondChecked, setSecondChecked] = useState({});

  const routeName = "Tahap pengenalan"

  const toggleFirst = (id) => {
    setFirstChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSecond = (id) => {
    setSecondChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Card className="rounded-2xl">
      <BackHeader title={routeName} />
      <div className="mt-10">
        <div className="border border-gray-200 rounded-xl bg-gray-50 p-4">

        <h2 className="font-semibold mb-2">First Revision</h2>
        <ol className="ml-4 list-decimal text-sm text-gray-600">
          {revisions.firstRevisions.map((item) => (
            <li key={item.id}>{item.revision}</li>
          ))}
        </ol>
        </div>

        <div className="mt-4 space-y-6">
          {revisions.firstRevisions.map((item) => (
            <Checkbox
              key={item.id}
              label={item.revision}
              checked={!!firstChecked[item.id]}
              onChange={() => toggleFirst(item.id)}
              boxClass={`w-4 h-4 rounded border ${
                firstChecked[item.id]
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "border-gray-400"
              }`}
              checkIconClass="stroke-white"
            />
          ))}
        </div>
      </div>

      <div className="mt-10">
        <div className="border border-gray-200 rounded-xl bg-gray-50 p-4">

        <h2 className="font-semibold mb-2">Second Revision</h2>
        <ol className="ml-4 list-decimal text-sm text-gray-600">
          {revisions.secondRevisons.map((item) => (
            <li key={item.id}>{item.revision}</li>
          ))}
        </ol>
        </div>

        <div className="mt-4 space-y-6">
          {revisions.secondRevisons.map((item) => (
            <Checkbox
              key={item.id}
              label={item.revision}
              checked={!!secondChecked[item.id]}
              onChange={() => toggleSecond(item.id)}
              boxClass={`w-4 h-4 rounded border ${
                secondChecked[item.id]
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "border-gray-400"
              }`}
              checkIconClass="stroke-white"
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default DetailRevisi;
