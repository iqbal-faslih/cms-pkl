import { useState, useEffect } from "react";

export const useRegionData = () => {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json");
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  const handleProvinceChange = async (provinceName, setFormData) => {
    const selected = provinces.find((p) => p.name === provinceName);

    if (!selected) return;

    setSelectedProvince(provinceName);
    setFormData((prev) => ({
      ...prev,
      provinsi: provinceName,
      kota: "",
      kecamatan: "",
    }));

    try {
      const response = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selected.id}.json`
      );
      const data = await response.json();
      setCities(data);
      setDistricts([]);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleCityChange = async (cityName, setFormData) => {
    const selected = cities.find((c) => c.name === cityName);

    if (!selected) return;

    setSelectedCity(cityName);
    setFormData((prev) => ({
      ...prev,
      kota: cityName,
      kecamatan: "",
    }));

    try {
      const response = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selected.id}.json`
      );
      const data = await response.json();
      setDistricts(data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleDistrictChange = (districtName, setFormData) => {
    const selected = districts.find((d) => d.name === districtName);

    if (!selected) return;

    setFormData((prev) => ({
      ...prev,
      kecamatan: districtName,
    }));
  };

  return {
    provinces,
    cities,
    districts,
    selectedProvince,
    selectedCity,
    handleProvinceChange,
    handleCityChange,
    handleDistrictChange,
  };
};
