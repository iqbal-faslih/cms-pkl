import { dataJamKantor } from "../../shared/dummy/Superadmin/DataKantor";
import { ConfigStatistic } from "../../shared/config/ConfigStatistic";
import { ConfigJamKantor, ColumnJamKantor } from "../../shared/config/ConfigDetailManajemen";
import SummaryCards from "./SummaryCards";
import MentorPerDivision from "./MentorPerDivision";
import ChartView from "../../shared/components/ChartVIew";
import TableHeader from "../../shared/components/table/TableHeader";
import DataTable from "../../shared/components/table/Table";
const Dashboard = () => {
  return (
    <div className="container mx-auto px-2 py-2 min-h-screen">
      {/* Membuat layout grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Kolom Kiri - Lebih Lebar */}
        <div className="flex-[7] w-full flex flex-col gap-2">
          {/* <StatisticsCard /> */}
          <div className="bg-white py-2 rounded-md border  border-gray-300 shadow-md p-6 mb-6">
            <ChartView
              config={ConfigStatistic}
              data={[
                {
                  name: "Peserta Per Divisi",
                  data: [21, 22, 10, 40, 40, 21],
                },
              ]}
            />
          </div>

          <div className="bg-white py-2 rounded-md border border-gray-300 shadow-md">
            <TableHeader
              config={{
                title: ConfigJamKantor.headers.title,
              }}
            />
            <DataTable
              config={{
                columns: ColumnJamKantor.columns,
                headerStyle: ColumnJamKantor.headerStyle,
                cellStyle: ColumnJamKantor.cellStyle,
              }}
              data={dataJamKantor}
            />
          </div>
        </div>

        {/* Kolom Kanan - Lebih Sempit */}
        <div className="flex-[5] w-full space-y-7">
          <SummaryCards />
          <MentorPerDivision />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
