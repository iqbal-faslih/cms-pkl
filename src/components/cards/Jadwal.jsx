const JamKantor = () => {
    return (
      <div className="w-full bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <h2 className="text-lg font-semibold mb-3">Jam Kantor</h2>
  
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-2 px-3 text-left font-semibold">Hari</th>
                <th className="py-2 px-3 text-left font-semibold">Masuk</th>
                <th className="py-2 px-3 text-left font-semibold">Istirahat</th>
                <th className="py-2 px-3 text-left font-semibold">Kembali</th>
                <th className="py-2 px-3 text-left font-semibold">Pulang</th>
              </tr>
            </thead>
  
            <tbody className="text-gray-600">
              <tr>
                <td className="py-2 px-3 font-medium">Senin</td>
                <td className="py-2 px-3">08.00 – 08.15</td>
                <td className="py-2 px-3">12.00 – 13.00</td>
                <td className="py-2 px-3">12.25 – 13.00</td>
                <td className="py-2 px-3">16.00 – 17.00</td>
              </tr>
  
              <tr>
                <td className="py-2 px-3 font-medium">Selasa</td>
                <td className="py-2 px-3">08.00 – 08.15</td>
                <td className="py-2 px-3">12.00 – 13.00</td>
                <td className="py-2 px-3">12.25 – 13.00</td>
                <td className="py-2 px-3">16.00 – 17.00</td>
              </tr>
  
              <tr>
                <td className="py-2 px-3 font-medium">Rabu</td>
                <td className="py-2 px-3">08.00 – 08.15</td>
                <td className="py-2 px-3">12.00 – 13.00</td>
                <td className="py-2 px-3">12.25 – 13.00</td>
                <td className="py-2 px-3">16.00 – 17.00</td>
              </tr>
  
              <tr>
                <td className="py-2 px-3 font-medium">Kamis</td>
                <td className="py-2 px-3">08.00 – 08.15</td>
                <td className="py-2 px-3">12.00 – 13.00</td>
                <td className="py-2 px-3">12.25 – 13.00</td>
                <td className="py-2 px-3">16.00 – 17.00</td>
              </tr>
  
              <tr>
                <td className="py-2 px-3 font-medium">Jum’at</td>
                <td className="py-2 px-3">08.00 – 08.15</td>
                <td className="py-2 px-3">11.00 – 13.00</td>
                <td className="py-2 px-3">12.25 – 13.00</td>
                <td className="py-2 px-3">16.00 – 17.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default JamKantor;
  