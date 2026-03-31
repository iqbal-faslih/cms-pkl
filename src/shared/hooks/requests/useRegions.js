import { useEffect, useState } from "react";

export const useIndonesiaRegions = () => {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch(
          "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
        );
        setProvinces(await res.json());
      } catch (err) {
        console.error("Error fetching provinces:", err);
      }
    };

    fetchProvinces();
  }, []);

  const fetchCities = async (provinceId) => {
    try {
      const res = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`
      );
      setCities(await res.json());
      setDistricts([]);
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  const fetchDistrictsFn = async (cityId) => {
    try {
      const res = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${cityId}.json`
      );
      setDistricts(await res.json());
    } catch (err) {
      console.error("Error fetching districts:", err);
    }
  };

  const handleProvinceChange = (provinceName) => {
    const selected = provinces.find((p) => p.name === provinceName);
    if (!selected) return;

    setSelectedProvince(provinceName);
    setSelectedCity("");
    setCities([]);
    setDistricts([]);

    fetchCities(selected.id);
  };

  const handleCityChange = (cityName) => {
    const selected = cities.find((c) => c.name === cityName);
    if (!selected) return;

    setSelectedCity(cityName);
    setDistricts([]);

    fetchDistrictsFn(selected.id);
  };

  return {
    provinces,
    cities,
    districts,
    selectedProvince,
    selectedCity,
    handleProvinceChange,
    handleCityChange,
  };
};
