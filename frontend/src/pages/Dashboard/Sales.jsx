import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Sales.css'; // Ensure this path is correct

const Sales = () => {
  const [chartData, setChartData] = useState(null); // For Total Sales, Active Orders, Pending Deliveries
  const [salesByItemData, setSalesByItemData] = useState(null); // For Sales by Item (Daily)

  // Fetch data for Total Sales, Active Orders, Pending Deliveries
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/dashboard/overview')
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

  // Fetch data for Sales by Item (Daily)
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/dashboard/sales-by-item')
      .then((response) => {
        setSalesByItemData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching sales by item data:', error);
      });
  }, []);

  if (!chartData || !salesByItemData) return <p>Loading charts...</p>;

  // Transform Sales by Item data for the chart
  const groupedData = salesByItemData.reduce((acc, item) => {
    const date = item.date;
    if (!acc[item.item_name]) acc[item.item_name] = {};
    acc[item.item_name][date] = item.total_sales;
    return acc;
  }, {});

  const itemNames = Object.keys(groupedData); // All unique item names
  const dates = [...new Set(salesByItemData.map((item) => item.date))]; // All unique dates

  // Chart configuration for Sales by Item (Daily)
  const salesByItemChartConfig = {
    type: 'bar',
    data: {
      labels: itemNames, // Item names on the x-axis
      datasets: dates.map((date, index) => ({
        label: date, // Each dataset represents a date
        data: itemNames.map((item) => groupedData[item][date] || 0), // Sales data for each item on that date
        backgroundColor: `rgba(${index * 50}, ${index * 100}, 200, 0.5)`,
      })),
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Total Sales by Item (Daily)',
          font: { size: 18 },
        },
        tooltip: {
          enabled: true,
        },
        datalabels: {
          anchor: 'end',
          align: 'top',
          formatter: (value) => `₹${value.toLocaleString()}`, // Format the value as currency
          font: {
            size: 12,
          },
        },
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Total Sales',
          },
          beginAtZero: true,
        },
        x: {
          title: {
            display: true,
            text: 'Item Names',
          },
        },
      },
    },
  };

  // Chart configuration for Total Sales, Active Orders, Pending Deliveries
  const overviewChartConfig = {
    type: 'bar',
    data: {
      labels: chartData.map((item) => item.label), // Labels for Total Sales, Active Orders, Pending Deliveries
      datasets: [
        {
          label: 'Overview',
          data: chartData.map((item) => item.value), // Values for each category
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'], // Colors for each bar
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Overview: Total Sales, Active Orders, Pending Deliveries',
          font: { size: 18 },
        },
        tooltip: {
          enabled: true,
        },
        datalabels: {
          anchor: 'end',
          align: 'top',
          formatter: (value) => `₹${value.toLocaleString()}`, // Format the value as currency
          font: {
            size: 10,
          },
        },
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Count / Amount',
          },
          beginAtZero: true,
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

  return (
    <div className="sales-container">
      <h2 className="sales-heading">Sales Overview</h2>

      <div className="sales-chart-container">
        {/* Render the Sales by Item Chart */}
        <div className="chart-wrapper">
          <h3>Sales by Item (Daily)</h3>
          <img
            src={`https://quickchart.io/chart?width=500&height=300&c=${encodeURIComponent(
              JSON.stringify(salesByItemChartConfig)
            )}`}
            alt="Sales by Item Chart"
            className="sales-chart"
          />
        </div>

        {/* Render the Overview Chart */}
        <div className="chart-wrapper">
          <h3>Overview: Total Sales, Active Orders, Pending Deliveries</h3>
          <img
            src={`https://quickchart.io/chart?width=500&height=300&c=${encodeURIComponent(
              JSON.stringify(overviewChartConfig)
            )}`}
            alt="Overview Chart"
            className="sales-chart"
          />
        </div>
      </div>
    </div>
  );
};

export default Sales;