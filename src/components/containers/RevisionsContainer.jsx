import React, { useState } from "react";
import AddRevisionButton from "../cards/student/AddRevisionbutton";
import RevisionCard from "../cards/student/RevisionCard";
import {statusColors} from "../../utils/revisionUtils"


const RevisionsContainer = () => {
  const [revisions, setRevisions] = useState([]);

  const handleAddRevision = () => {
    const nextId = revisions.length > 0 
      ? Math.max(...revisions.map(r => r.id)) + 1 
      : 1;

    const newRevision = {
      id: nextId,
      status: "belum dikerjakan",
      tanggal: new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      }),
      tugas: [],
      isLate: false,
      };
      setRevisions(prev => [newRevision, ...prev]);
  };

  const handleAddTask = (revisionId) => {
        setRevisions(prev =>
            prev.map(rev =>
            rev.id === revisionId
                ? {
                    ...rev,
                    tugas: [
                    ...rev.tugas,
                    { id: Date.now(), deskripsi: "", selesai: false }, 
                    ],
                }
                : rev
            )
        );
    };

  const handleUpdateTask = (revisionId, taskIndex, updates) => {
        setRevisions((prev) =>
            prev.map((rev) =>
            rev.id === revisionId
                ? {
                    ...rev,
                    tugas: rev.tugas.map((t, i) =>
                    i === taskIndex ? { ...t, ...updates } : t
                    ),
                }
                : rev
            )
        );
    };

  const handleEditRevision = (revisionId, newDescription) => {
    setRevisions((prev) =>
      prev.map((rev) =>
        rev.id === revisionId ? { ...rev, description: newDescription } : rev
      )
    );
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <AddRevisionButton onClick={handleAddRevision} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {revisions.map((rev) => {
          const isLate = rev.isLate || false;
          const statusKey = isLate ? "terlambat" : rev.status.toLowerCase();
          const { backgroundClass, statusText, icon } = statusColors[statusKey] || {};

          return (
            <RevisionCard
              key={rev.id}
              revisi={rev}
              backgroundClass={backgroundClass}
              statusText={statusText}
              icon={icon}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onEditRevision={handleEditRevision}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RevisionsContainer;