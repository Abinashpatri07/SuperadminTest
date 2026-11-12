import { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Download } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/* ── Data ─────────────────────────────────────────────── */
const monthLabels    = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
const quarterLabels  = ["Q1","Q2","Q3","Q4"];
const yearLabels     = ["2022","2023","2024"];

/* ── Gradient plugin ──────────────────────────────────── */
const gradientPlugin = {
  id: "gradientBars",
  beforeDatasetsDraw(chart) {
    const { ctx, chartArea: { top, bottom } } = chart;
    chart.data.datasets.forEach((dataset) => {
      const gradient = ctx.createLinearGradient(0, top, 0, bottom);
      gradient.addColorStop(0, "#4B47B6");
      gradient.addColorStop(1, "rgba(200, 198, 240, 0.15)");
      dataset.backgroundColor = gradient;
    });
  },
};

/* ── Component ────────────────────────────────────────── */
export default function RevenueGrowth({ metricsData }) {
  const [view, setView] = useState("Monthly");

  const monthlyData = metricsData?.monthly || [0,0,0,0,0,0,0,0,0,0,0,0];
  const quarterlyData = metricsData?.quarterly || [0,0,0,0];
  const yearlyData = metricsData?.yearly || [0,0,0];

  const labels = view === "Monthly" ? monthLabels : view === "Quarterly" ? quarterLabels : yearLabels;
  const values = view === "Monthly" ? monthlyData  : view === "Quarterly" ? quarterlyData  : yearlyData;

  const data = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: values,
        backgroundColor: "#4B47B6",
        borderRadius: { topLeft: 6, topRight: 6 },
        borderSkipped: false,
        barThickness: view === "Yearly" ? 80 : view === "Quarterly" ? 60 : 38,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1F2937",
        padding: 12,
        cornerRadius: 10,
        titleColor: "#E5E7EB",
        bodyColor: "#FFFFFF",
        titleFont: { size: 11 },
        bodyFont: { size: 13, weight: "bold" },
        callbacks: {
          title: (items) => {
            const label = items[0].label;
            return view === "Monthly" ? `${label} 2026` : label;
          },
          label: (ctx) => ` ₹ ${ctx.raw.toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#9CA3AF", font: { size: 12 } },
      },
      y: {
        grid: { color: "#F3F4F6", drawBorder: false },
        border: { display: false },
        beginAtZero: true,
        ticks: {
          color: "#9CA3AF",
          font: { size: 12 },
          callback: (value) => {
            if (value >= 1000000) return `${value / 1000000}M`;
            if (value >= 1000)    return `${value / 1000}K`;
            return value;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">

        {/* LEFT */}
        <div>
          <p className="text-sm font-semibold text-gray-700">Revenue</p>
          <div className="flex items-center gap-2 mt-0.5">
            <h1 className="text-2xl font-bold text-gray-900">₹ 159,849</h1>
            <span className="text-xs font-semibold text-green-500 flex items-center gap-0.5">
              ↗ 5.2%
            </span>
            <span className="text-xs text-gray-400">Last Month</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* TOGGLE */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            {["Monthly", "Quartile", "Yearly"].map((item) => (
              <button
                key={item}
                onClick={() => setView(item === "Quartile" ? "Quarterly" : item)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  (item === "Quartile" ? view === "Quarterly" : view === item)
                    ? "bg-[#4B47B6] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* DOWNLOAD */}
          <button className="flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
            <Download size={13} />
            Download
          </button>

        </div>
      </div>

      {/* CHART */}
      <div className="h-72">
        <Bar data={data} options={options} plugins={[gradientPlugin]} />
      </div>

    </div>
  );
}