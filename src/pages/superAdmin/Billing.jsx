import React, { useState, useEffect } from "react";
import axiosInstance from "../../API/axiosInstance";
import {
  Banknote,
  History,
  FileText,
  CheckCircle,
  Calendar,
  ChevronDown,
  Building2,
  Wallet,
  User,
  Download,
  Filter,
  CircleDollarSign,
  X,
  MoreVertical,
  RotateCcw
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Billing = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [searchFilter, setSearchFilter] = useState("Order ID");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  const [overviewData, setOverviewData] = useState({
    totalPayments: 0,
    totalRefunds: 0,
    totalSettlements: 0,
    transactionStatus: { successful: 0, pending: 0, failed: 0 },
    lineChartData: { labels: [], data: [] },
    topPaymentMethods: [],
    topClients: [],
    recentActivities: []
  });
  
  const [paymentsList, setPaymentsList] = useState([]);
  const [refundsList, setRefundsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination for Payments Tab
  const [paymentCurrentPage, setPaymentCurrentPage] = useState(1);
  const [paymentItemsPerPage, setPaymentItemsPerPage] = useState(10);

  const [trendFilter, setTrendFilter] = useState("Monthly");

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const overviewRes = await axiosInstance.get(`/api/billing/overview?trend=${trendFilter.toLowerCase()}`);
        if (overviewRes.data.success) {
          setOverviewData(overviewRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching overview data", error);
      }
    };
    fetchOverviewData();
  }, [trendFilter]);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        setIsLoading(true);
        const paymentsRes = await axiosInstance.get("/api/billing/payments");
        if (paymentsRes.data.success) {
          setPaymentsList(paymentsRes.data.data);
        }

        const refundsRes = await axiosInstance.get("/api/billing/payments?type=refund");
        if (refundsRes.data.success) {
          setRefundsList(refundsRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching table data", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTableData();
  }, []);

  const tabs = ["Overview", "Payment", "Refund"]; // "Dispute" commented out for now

  // Line Chart Data
  const lineChartData = {
    labels: overviewData.lineChartData.labels.length ? overviewData.lineChartData.labels : ["Jan"],
    datasets: [
      {
        label: "Payment",
        data: overviewData.lineChartData.data.length ? overviewData.lineChartData.data.map(d => parseFloat(d || 0)) : [0],
        borderColor: "#4F46E5",
        backgroundColor: "transparent",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#4F46E5",
      }
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => (value === 0 ? "0" : `${value / 1000}K`),
          color: "#9CA3AF",
          font: { size: 12 }
        },
        grid: { display: false }
      },
      x: {
        grid: { display: false },
        ticks: { color: "#9CA3AF", font: { size: 12 } }
      },
    },
  };

  // Doughnut Chart Data
  const doughnutData = {
    labels: ["Successful", "Pending", "Failed"],
    datasets: [
      {
        data: [
          overviewData.transactionStatus.successful,
          overviewData.transactionStatus.pending,
          overviewData.transactionStatus.failed
        ],
        backgroundColor: ["#22C55E", "#FACC15", "#EF4444"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Payment Tab Pagination Logic
  const indexOfLastPayment = paymentCurrentPage * paymentItemsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentItemsPerPage;
  const currentPayments = paymentsList.slice(indexOfFirstPayment, indexOfLastPayment);
  const totalPaymentPages = Math.ceil(paymentsList.length / paymentItemsPerPage);

  const handlePaymentPageChange = (pageNumber) => {
    setPaymentCurrentPage(pageNumber);
  };

  return (
    <div className="p-4 flex flex-col gap-6">
      
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-indigo-100 text-indigo-700"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Overview" && (
        <>
          {/* Header & Date Picker */}
          <div className="flex justify-between items-center mt-2">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Get A Quick Summary Of All Financial Activities Across The Platform.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm hover:bg-gray-50">
          <Calendar size={16} />
          Today 01 May 2025 - 31 May 2025
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Payments */}
        <div className="bg-[#f0fdf4] rounded-2xl p-4 shadow-sm border border-green-50 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="p-1.5 bg-white rounded-lg text-green-500 shadow-sm">
              <Banknote size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-xs text-gray-600 font-medium">Total Payments</p>
            <h3 className="text-lg font-bold text-gray-900 mt-0.5">₹ {overviewData.totalPayments.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
          </div>
        </div>

        {/* Total Refunds */}
        <div className="bg-[#fff1f2] rounded-2xl p-4 shadow-sm border border-red-50 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="p-1.5 bg-white rounded-lg text-red-400 shadow-sm">
              <History size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-xs text-gray-600 font-medium">Total Refunds</p>
            <h3 className="text-lg font-bold text-gray-900 mt-0.5">₹ {overviewData.totalRefunds.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
          </div>
        </div>

        {/* Total Settlements */}
        <div className="bg-[#f0f9ff] rounded-2xl p-4 shadow-sm border border-blue-50 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="p-1.5 bg-white rounded-lg text-blue-500 shadow-sm">
              <CheckCircle size={16} />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-xs text-gray-600 font-medium">Total Settlements</p>
            <h3 className="text-lg font-bold text-gray-900 mt-0.5">₹ {overviewData.totalSettlements.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Trend Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Revenue Trend</h3>
            
            {/* Custom Legend */}
            <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-600"></div> Payment
              </div>
            </div>

            <select 
              value={trendFilter}
              onChange={(e) => setTrendFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-600 text-xs rounded-md px-2 py-1 focus:outline-none"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          <div className="h-64 w-full">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Transaction Status Doughnut Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Transaction Status</h3>
          
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="h-40 w-40 relative mb-6">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>

            <div className="w-full space-y-3">
              {[
                { 
                  label: "Successful", 
                  value: overviewData.transactionStatus.successful, 
                  percent: overviewData.transactionStatus.successful > 0 ? ((overviewData.transactionStatus.successful / (overviewData.transactionStatus.successful + overviewData.transactionStatus.pending + overviewData.transactionStatus.failed)) * 100).toFixed(1) + "%" : "0%", 
                  color: "bg-green-500" 
                },
                { 
                  label: "Pending", 
                  value: overviewData.transactionStatus.pending, 
                  percent: overviewData.transactionStatus.pending > 0 ? ((overviewData.transactionStatus.pending / (overviewData.transactionStatus.successful + overviewData.transactionStatus.pending + overviewData.transactionStatus.failed)) * 100).toFixed(1) + "%" : "0%", 
                  color: "bg-yellow-400" 
                },
                { 
                  label: "Failed", 
                  value: overviewData.transactionStatus.failed, 
                  percent: overviewData.transactionStatus.failed > 0 ? ((overviewData.transactionStatus.failed / (overviewData.transactionStatus.successful + overviewData.transactionStatus.pending + overviewData.transactionStatus.failed)) * 100).toFixed(1) + "%" : "0%", 
                  color: "bg-red-500" 
                },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                    <span className="text-gray-600">{item.label}</span>
                  </div>
                  <div className="text-gray-900 font-medium">
                    {item.value} <span className="text-gray-400 font-normal">({item.percent})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Lower Section: 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        
        {/* Top Payment Methods */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Top Payment Methods</h3>
          
          <div className="space-y-2">
            {(() => {
              const staticMethods = [
                { name: 'UPI', icon: '₹', bg: 'bg-indigo-100', text: 'text-indigo-600', barBg: 'bg-indigo-50', barFill: 'bg-indigo-500' },
                { name: 'Credit Card', icon: <Banknote size={10}/>, bg: 'bg-green-100', text: 'text-green-600', barBg: 'bg-green-50', barFill: 'bg-green-500' },
                { name: 'Net Banking', icon: <Building2 size={10}/>, bg: 'bg-yellow-100', text: 'text-yellow-600', barBg: 'bg-yellow-50', barFill: 'bg-yellow-400' },
                { name: 'Wallet', icon: <Wallet size={10}/>, bg: 'bg-purple-100', text: 'text-purple-600', barBg: 'bg-purple-50', barFill: 'bg-purple-500' }
              ];
              const totalPaymentSum = overviewData.topPaymentMethods?.reduce((sum, item) => sum + parseFloat(item.total || 0), 0) || 1;

              return staticMethods.map((method, idx) => {
                const foundMethod = overviewData.topPaymentMethods?.find(m => m.method.toUpperCase() === method.name.toUpperCase());
                const total = foundMethod ? parseFloat(foundMethod.total || 0) : 0;
                const percent = ((total / totalPaymentSum) * 100).toFixed(1);

                return (
                  <div key={idx}>
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-900 mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-4 h-4 ${method.bg} rounded ${method.text} flex justify-center items-center text-[9px]`}>
                          {method.icon}
                        </div>
                        {method.name}
                      </div>
                      <span>₹ {total.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <div className={`w-full ${method.barBg} rounded-full h-1.5`}>
                      <div className={`${method.barFill} h-1.5 rounded-full`} style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Top Clients By Revenue */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Top Clients By Revenue</h3>
          
          <div className="space-y-1">
            {overviewData.topClients && overviewData.topClients.map((client, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs font-semibold text-gray-900 py-0.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-indigo-50 rounded text-indigo-600 flex justify-center items-center">
                    <User size={10} />
                  </div>
                  <span className="font-medium text-gray-700">{client.name}</span>
                </div>
                <span>₹ {client.amount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
            ))}
            {(!overviewData.topClients || overviewData.topClients.length === 0) && (
              <div className="text-center text-xs text-gray-400 py-4">No top clients found</div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Recent Activities</h3>
          
          <div className="space-y-0">
            {overviewData.recentActivities && overviewData.recentActivities.map((activity, idx) => {
              let iconInfo = { bg: 'bg-green-50', text: 'text-green-500', icon: <CheckCircle size={14} strokeWidth={2} />, desc: 'Payment Received From' };
              if (activity.status === 'FAILED' || activity.status === 'REFUNDED') {
                iconInfo = { bg: 'bg-red-50', text: 'text-red-500', icon: <History size={14} strokeWidth={2} />, desc: 'Refund Processed For' };
              } else if (activity.status === 'PENDING') {
                iconInfo = { bg: 'bg-orange-50', text: 'text-orange-500', icon: <FileText size={14} strokeWidth={2} />, desc: 'Payment Pending From' };
              }
              
              return (
                <div key={idx} className={`flex justify-between items-start py-1.5 ${idx !== overviewData.recentActivities.length - 1 ? 'border-b border-gray-100' : ''} ${idx === 0 ? 'first:pt-0' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-7 h-7 ${iconInfo.bg} rounded-lg ${iconInfo.text} flex justify-center items-center shrink-0`}>
                      {iconInfo.icon}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-xs font-medium text-gray-800 leading-snug">
                        {iconInfo.desc}<br/>{activity.client}
                      </p>
                      <span className="text-[10px] text-gray-400">{activity.date}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-900 mt-1">₹ {activity.amount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
              );
            })}
            {(!overviewData.recentActivities || overviewData.recentActivities.length === 0) && (
              <div className="text-center text-xs text-gray-400 py-4">No recent activities found</div>
            )}
          </div>
        </div>
      </div>
        </>
      )}

      {activeTab === "Payment" && (
        <>
          {/* Header & Date Picker */}
          <div className="flex justify-between items-center mt-2">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Payment</h1>
              <p className="text-sm text-gray-500 mt-1">
                Get A Quick Summary Of All Financial Activities Across The Platform.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm hover:bg-gray-50">
                <Calendar size={16} />
                Today 01 May 2025 - 31 May 2025
                <ChevronDown size={16} />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-indigo-600 font-medium shadow-sm hover:bg-gray-50">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>

          {/* Payment Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* All Payments */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between h-28">
              <div className="w-8 h-8 bg-blue-50 rounded-xl text-blue-500 flex justify-center items-center">
                <Wallet size={16} strokeWidth={2} />
              </div>
              <div className="flex justify-between items-end mt-auto">
                <p className="text-xs text-gray-600 font-medium">All Payments</p>
                <h3 className="text-lg font-bold text-gray-900 leading-none">
                  {(overviewData.transactionStatus.successful + overviewData.transactionStatus.pending + overviewData.transactionStatus.failed).toLocaleString('en-IN')}
                </h3>
              </div>
            </div>

            {/* Successful */}
            <div className="bg-[#f0fdf4] rounded-2xl p-4 shadow-sm border border-green-50 flex flex-col justify-between h-28">
              <div className="w-8 h-8 bg-green-100 rounded-xl text-green-600 flex justify-center items-center">
                <Banknote size={16} strokeWidth={2} />
              </div>
              <div className="flex justify-between items-end mt-auto">
                <p className="text-xs text-gray-600 font-medium">Successful</p>
                <h3 className="text-lg font-bold text-gray-900 leading-none">
                  {overviewData.transactionStatus.successful.toLocaleString('en-IN')}
                </h3>
              </div>
            </div>

            {/* Pending */}
            <div className="bg-[#faf5ff] rounded-2xl p-4 shadow-sm border border-purple-50 flex flex-col justify-between h-28">
              <div className="w-8 h-8 bg-purple-100 rounded-xl text-purple-500 flex justify-center items-center">
                <CircleDollarSign size={16} strokeWidth={2} />
              </div>
              <div className="flex justify-between items-end mt-auto">
                <p className="text-xs text-gray-600 font-medium">Pending</p>
                <h3 className="text-lg font-bold text-gray-900 leading-none">
                  {overviewData.transactionStatus.pending.toLocaleString('en-IN')}
                </h3>
              </div>
            </div>

            {/* Failed */}
            <div className="bg-[#fff1f2] rounded-2xl p-4 shadow-sm border border-red-50 flex flex-col justify-between h-28">
              <div className="w-8 h-8 bg-red-100 rounded-xl text-red-500 flex justify-center items-center relative">
                <Banknote size={16} strokeWidth={2} />
                <div className="absolute bottom-1 right-1 bg-red-100 rounded-full w-2.5 h-2.5 flex items-center justify-center">
                  <X size={8} strokeWidth={4} />
                </div>
              </div>
              <div className="flex justify-between items-end mt-auto">
                <p className="text-xs text-gray-600 font-medium">Failed</p>
                <h3 className="text-lg font-bold text-gray-900 leading-none">
                  {overviewData.transactionStatus.failed.toLocaleString('en-IN')}
                </h3>
              </div>
            </div>
          </div>

          {/* Table Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
            
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-auto relative">
              <div 
                className="text-sm text-gray-500 flex items-center gap-1 border-r border-gray-300 pr-2 mr-2 cursor-pointer hover:text-gray-700 select-none"
                onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)}
              >
                {searchFilter} <ChevronDown size={14} />
              </div>
              
              {isSearchDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                  {["All", "Transaction ID", "Order ID"].map((option) => (
                    <div 
                      key={option}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                      onClick={() => {
                        setSearchFilter(option);
                        setIsSearchDropdownOpen(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
              
              <input type="text" placeholder="Ex: ORD-2025-5589" className="bg-transparent border-none outline-none text-sm w-full sm:w-48 text-gray-700" />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm hover:bg-gray-50 min-w-[120px]">
                All Status <ChevronDown size={16} />
              </button>
              <button className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm hover:bg-gray-50 min-w-[170px]">
                All Payment Methods <ChevronDown size={16} />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 font-medium shadow-sm hover:bg-gray-50">
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date & Time</th>
                    <th className="px-6 py-4 font-medium">Transaction ID</th>
                    <th className="px-6 py-4 font-medium">Client / Company</th>
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Payment Method</th>
                    <th className="px-6 py-4 font-medium text-center">Status</th>
                    <th className="px-6 py-4 font-medium">Payment Ref. No.</th>
                    <th className="px-6 py-4 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentPayments.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-500">{row.date}</td>
                      <td className="px-6 py-4 font-medium text-indigo-600">{row.txnId}</td>
                      <td className="px-6 py-4 text-gray-700">{row.client}</td>
                      <td className="px-6 py-4 text-gray-500">{row.orderId}</td>
                      <td className="px-6 py-4 text-gray-700">{row.amount}</td>
                      <td className="px-6 py-4 text-gray-500">{row.method}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{row.refNo}</td>
                      <td className="px-6 py-4 text-center">
                        <button title="Initiate Refund" className="text-gray-400 hover:text-indigo-600 transition-colors">
                          <RotateCcw size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paymentsList.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                        No payments found
                      </td>
                    </tr>
                  )}
                  {isLoading && (
                    <tr>
                      <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                Showing 
                <select 
                  className="border border-gray-200 rounded px-1 py-0.5 outline-none bg-white"
                  value={paymentItemsPerPage}
                  onChange={(e) => {
                    setPaymentItemsPerPage(Number(e.target.value));
                    setPaymentCurrentPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select> 
                out of {paymentsList.length}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <button 
                  onClick={() => setPaymentCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={paymentCurrentPage === 1}
                  className="flex items-center gap-1 px-3 py-1 text-gray-500 hover:text-gray-900 disabled:opacity-50"
                >
                  &larr; Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPaymentPages }, (_, i) => i + 1).map(page => (
                    <button 
                      key={page}
                      onClick={() => handlePaymentPageChange(page)}
                      className={`w-7 h-7 rounded-md font-medium ${paymentCurrentPage === page ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setPaymentCurrentPage(prev => Math.min(prev + 1, totalPaymentPages))}
                  disabled={paymentCurrentPage === totalPaymentPages || totalPaymentPages === 0}
                  className="flex items-center gap-1 px-3 py-1 text-gray-900 font-medium hover:opacity-80 disabled:opacity-50"
                >
                  Next &rarr;
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "Refund" && (
        <>
          {/* Header & Date Picker */}
          <div className="flex justify-between items-center mt-2">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Refund</h1>
              <p className="text-sm text-gray-500 mt-1">
                View And Manage All Refund Transactions.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm hover:bg-gray-50">
                <Calendar size={16} />
                Today 01 May 2025 - 31 May 2025
                <ChevronDown size={16} />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-indigo-600 font-medium shadow-sm hover:bg-gray-50">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>

          {/* Table Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
            
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-auto relative">
              <div 
                className="text-sm text-gray-500 flex items-center gap-1 border-r border-gray-300 pr-2 mr-2 cursor-pointer hover:text-gray-700 select-none"
                onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)}
              >
                {searchFilter} <ChevronDown size={14} />
              </div>
              
              {isSearchDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                  {["All", "Transaction ID", "Order ID"].map((option) => (
                    <div 
                      key={option}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                      onClick={() => {
                        setSearchFilter(option);
                        setIsSearchDropdownOpen(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
              
              <input type="text" placeholder="Ex: ORD-2025-5589" className="bg-transparent border-none outline-none text-sm w-full sm:w-48 text-gray-700" />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm hover:bg-gray-50 min-w-[120px]">
                All Status <ChevronDown size={16} />
              </button>
              <button className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm hover:bg-gray-50 min-w-[170px]">
                All Payment Methods <ChevronDown size={16} />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 font-medium shadow-sm hover:bg-gray-50">
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date & Time</th>
                    <th className="px-6 py-4 font-medium">Transaction ID</th>
                    <th className="px-6 py-4 font-medium">Client / Company</th>
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Payment Method</th>
                    <th className="px-6 py-4 font-medium text-center">Status</th>
                    <th className="px-6 py-4 font-medium">Payment Ref. No.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {refundsList.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-500">{row.date}</td>
                      <td className="px-6 py-4 font-medium text-indigo-600">{row.txnId}</td>
                      <td className="px-6 py-4 text-gray-700">{row.client}</td>
                      <td className="px-6 py-4 text-gray-500">{row.orderId}</td>
                      <td className="px-6 py-4 text-gray-700">{row.amount}</td>
                      <td className="px-6 py-4 text-gray-500">{row.method}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{row.refNo}</td>
                    </tr>
                  ))}
                  {refundsList.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                        No refunds found
                      </td>
                    </tr>
                  )}
                  {isLoading && (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                Showing 
                <select className="border border-gray-200 rounded px-1 py-0.5 outline-none bg-white">
                  <option>9</option>
                  <option>10</option>
                  <option>20</option>
                </select> 
                out of 40
              </div>
              <div className="flex items-center gap-1 text-sm">
                <button className="flex items-center gap-1 px-3 py-1 text-gray-500 hover:text-gray-900 disabled:opacity-50">
                  &larr; Previous
                </button>
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 font-medium">1</button>
                  <button className="w-7 h-7 rounded-md text-gray-500 hover:bg-gray-50">2</button>
                  <button className="w-7 h-7 rounded-md text-gray-500 hover:bg-gray-50">3</button>
                  <button className="w-7 h-7 rounded-md text-gray-500 hover:bg-gray-50">4</button>
                  <button className="w-7 h-7 rounded-md text-gray-500 hover:bg-gray-50">5</button>
                  <span className="text-gray-400 px-1">...</span>
                  <button className="w-7 h-7 rounded-md text-gray-500 hover:bg-gray-50">8</button>
                  <button className="w-7 h-7 rounded-md text-gray-500 hover:bg-gray-50">9</button>
                </div>
                <button className="flex items-center gap-1 px-3 py-1 text-gray-900 font-medium hover:opacity-80">
                  Next &rarr;
                </button>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default Billing;
