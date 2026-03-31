import React from "react";
import JobCard from "../cards/JobCard";

const LowonganSummaryCards = ({ summaryCardsData }) => {
  return (
    <>
      {summaryCardsData.map((summaryCard) => (
        <JobCard key={summaryCard.id} job={summaryCard} />
      ))}
    </>
  );
};

export default LowonganSummaryCards;
