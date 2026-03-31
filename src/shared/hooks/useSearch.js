import { useState, useRef, useEffect } from "react";
import { debounce } from "../utils/debounce";

export const useSearch = (delay = 400) => {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  const debouncedUpdate = useRef(
    debounce((value) => {
      setDebouncedKeyword(value);
    }, delay)
  ).current;

  useEffect(() => {
    debouncedUpdate(keyword);
  }, [keyword, debouncedUpdate]);

  return {
    keyword,           
    debouncedKeyword,  
    setKeyword,        
  };
};