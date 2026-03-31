import React, { useState } from 'react';
import { HeaderInfo } from '../../../shared/components/header/HeaderInfo';
import DataCabangCard from './components/DataCabangCard';
import DataAdminCard from './components/DataAdminCard';
import { useProfileCabang } from '../../../hooks/useProfilAdminCabangHooks';

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState("data-admin-cabang");
  const { data, loading, error } = useProfileCabang();

  return (
    <div>
      <HeaderInfo
        nameCabang={data?.nama || "Cabang Purnama"}
        nameDescription={data?.deskripsi || "Bebek Purnama"}
        alamat={data?.alamat || "Malang"}
        logo={data?.logo}
        cover={data?.cover}
        enableTabs={true}             
        activeTab={activeTab}        
        setActiveTab={setActiveTab}   
      />

      {/* Konten berdasarkan tab */}
      <div className="mt-6">
        {activeTab === "data-admin-cabang" && (
          <DataAdminCard />
        )}

        {activeTab === "data-cabang" && (
          <DataCabangCard />
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
