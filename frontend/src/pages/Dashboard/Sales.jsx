import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Sales.css';  // Ensure this path is correct

const Sales = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/dashboard/overview')
      .then((response) => {
        const data = response.data;
        setChartData([
          { label: 'Total Sales', value: data.totalSales },
          { label: 'Active Orders', value: data.activeOrders },
          { label: 'Pending Deliveries', value: data.pendingDeliveries },
        ]);
      })
      .catch((error) => {
        console.error('Error fetching chart data:', error);
      });
  }, []);

  if (!chartData) return <p>Loading chart...</p>;

  // Bar chart configuration
  const barChartConfig = {
    type: 'bar',
    data: {
      labels: chartData.map(item => item.label),
      datasets: [
        {
          label: 'Count / Amount',
          data: chartData.map(item => item.value),
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Dashboard Overview',
          font: { size: 18 },
        },
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
        },
        datalabels: {
          anchor: 'end',
          align: 'top',
        },
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Count / Amount',
          },
          beginAtZero: true,
          grid: {
            display: true,
            color: '#ddd',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Categories',
          },
        },
      },
    },
  };

  // Pie chart configuration
  const pieChartConfig = {
    type: 'pie',
    data: {
      labels: chartData.map(item => item.label),
      datasets: [
        {
          data: chartData.map(item => item.value),
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Sales Distribution',
          font: { size: 18 },
        },
        tooltip: {
          enabled: true,
        },
        datalabels: {
          formatter: (value) => `${value}%`, // Optional: show percentage on the pie chart
        },
      },
    },
  };

  const chartUrlBar = `https://quickchart.io/chart?width=500&height=300&c=${encodeURIComponent(
    JSON.stringify(barChartConfig)
  )}`;

  const chartUrlPie = `https://quickchart.io/chart?width=500&height=300&c=${encodeURIComponent(
    JSON.stringify(pieChartConfig)
  )}`;

  return (
    <div className="sales-container">
      <h2 className="sales-heading">Sales Overview</h2>
      
      <div className="sales-chart-container">
        {/* Render the Bar Chart */}
        <div className="chart-wrapper">
          <h3>Sales Bar Chart</h3>
          <img src={chartUrlBar} alt="Sales Bar Chart" className="sales-chart" />
        </div>

        {/* Render the Pie Chart */}
        <div className="chart-wrapper">
          <h3>Sales Pie Chart</h3>
          <img src={chartUrlPie} alt="Sales Pie Chart" className="sales-chart" />
        </div>
      </div>
    </div>
  );
};

export default Sales;
