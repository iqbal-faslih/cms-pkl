import Chart from "react-apexcharts";

const ChartView = ({
  config,
  data = [],
  height = 320,
  width = "100%",
  onPointClick,
  onLegendClick,
  plain = false,
  className,
  onExport,
}) => {
  if (!config) {
    console.warn("ChartView membutuhkan prop `config`");
    return <div>Tidak ada konfigurasi chart</div>;
  }

  const { type, options, header } = config;

  const safeOptions = options || {};
  const safeChart = safeOptions.chart || {};
  const safeXaxis = safeOptions.xaxis || {};

  const mergedOptions = {
    ...safeOptions,
    chart: {
      ...safeChart,
      events: {
        dataPointSelection: (_, __, ctx) => {
          onPointClick?.(ctx?.dataPointIndex, ctx?.seriesIndex);
        },
        legendClick: (_, __, ctx) => {
          onLegendClick?.(ctx);
        },
      },
    },
    xaxis: {
      ...safeXaxis,
    },
  };

  const chartElement = (
    <Chart
      type={type}
      options={mergedOptions}
      series={data || []}  // extra safety
      height={height}
      width={width}
    />
  );

  if (plain) return chartElement;

  return (
    <div className={`${className}`}>
      {header?.title && (
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-gray-800">
            {header.title}
          </h2>
          {header.showExport && (
            <button
              onClick={onExport}
              className="text-sm text-blue-600 hover:underline"
            >
              Export
            </button>
          )}
        </div>
      )}

      {chartElement}
    </div>
  );
};

export default ChartView;