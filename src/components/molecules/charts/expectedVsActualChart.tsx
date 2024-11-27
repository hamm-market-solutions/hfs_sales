"use client";

import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

const DEFAULT_DATA_LABELS: ApexDataLabels = {
  formatter: function (val: string | number, opts?: any) {
    const goals =
      opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].goals;

    if (goals && goals.length) {
      return `${val} / ${goals[0].value}`;
    }

    return val;
  },
};

const DEFAULT_LEGEND: ApexLegend = {
  show: true,
  showForSingleSeries: true,
  customLegendItems: ["Actual", "Expected"],
  markers: {
    fillColors: ["#00E396", "#775DD0"],
  },
};

const DEFAULT_PLOT_OPTIONS: ApexPlotOptions = {
  bar: {
    horizontal: true,
  },
};

export default function ExpectedVsActualChart({
  expected,
  actual,
  options,
}: {
  expected: { name: string; value: number }[];
  actual: number[];
  options: ApexOptions;
}) {
  const series: ApexAxisChartSeries = [
    {
      name: "Actual",
      data: expected.map((exp, i) => ({
        x: exp.name,
        y: exp.value,
        goals: [
          {
            name: "Expected",
            value: actual[i],
            strokeWidth: 5,
            strokeHeight: 10,
            strokeColor: DEFAULT_LEGEND.markers?.fillColors
              ? DEFAULT_LEGEND.markers?.fillColors[1]
              : "#775DD0",
          },
        ],
      })),
    },
  ];

  console.log(series);
  if (!options.dataLabels) {
    options.dataLabels = DEFAULT_DATA_LABELS;
  }
  if (!options.legend) {
    options.legend = DEFAULT_LEGEND;
  }
  if (!options.plotOptions) {
    options.plotOptions = DEFAULT_PLOT_OPTIONS;
  }
  if (!options.colors) {
    options.colors = ["#00E396"];
  }

  return (
    <Chart
      height={300}
      options={options}
      series={series}
      type="bar"
      width={400}
    />
  );
}
