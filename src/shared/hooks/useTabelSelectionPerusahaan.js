import { useState } from "react";

export const useTableSelection = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedIzinItems, setSelectedIzinItems] = useState([]);

  const handleSelectItem = (id) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]));
  };

  const handleToggleIzinCheckbox = (id) => {
    setSelectedIzinItems((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]));
  };

  return {
    selectedItems,
    setSelectedItems,
    selectedIzinItems,
    setSelectedIzinItems,
    handleSelectItem,
    handleToggleIzinCheckbox,
  };
};
