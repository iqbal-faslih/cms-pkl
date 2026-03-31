import React from 'react';

const TahapCards = () => {
  const tahapData = [
    { id: 1, title: 'Tahap Pengenalan', jumlah: '12 Orang' },
    { id: 2, title: 'Tahap Pengenalan', jumlah: '15 Orang' },
    { id: 3, title: 'Tahap Pengenalan', jumlah: '10 Orang' },
    { id: 4, title: 'Tahap Pengenalan', jumlah: '8 Orang' },
    { id: 5, title: 'Tahap Optimisasi', jumlah: '12 Orang' },
    { id: 6, title: 'Tahap Finalisasi', jumlah: '6 Orang' },
    { id: 7, title: 'Tahap Monitoring', jumlah: '9 Orang' },
  ];


  const Card = ({ item }) => (
    <div className="flex-shrink-0 w-56 min-w-56 h-32 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="text-left space-y-2">
        <h3 className="text-lg font-bold text-black">{item.title}</h3>
        <p className="text-sm text-gray-600">{item.jumlah}</p>
      </div>
    </div>
  );

  return (
    <div>
      <div className='py-4 px-3 flex items-center justify-center'>   
        <div
          className="mx-2 max-w-5xl flex gap-2 overflow-x-auto scrollbar-hide pb-2 pr-2"
        >
          {tahapData.map((item) => (
            <div key={item.id}>
              <Card item={item} />
            </div>
          ))}
        </div>
        </div>
    </div>
  );
};

export default TahapCards;
