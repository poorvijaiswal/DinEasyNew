import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Sales.css'; // Ensure this path is correct

const Sales = () => {
  const [restaurantId, setRestaurantId] = useState(null); // State to store restaurant_id
  const [chartData, setChartData] = useState(null);
  const [salesByItemData, setSalesByItemData] = useState(null);
  const [topSoldItemsData, setTopSoldItemsData] = useState(null);

  useEffect(() => {
    // Fetch restaurant_id
    const fetchRestaurantId = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        if (!token) {
          throw new Error('No token found in localStorage');
        }

        const response = await axios.get('http://localhost:5000/api/auth/getRestaurantId', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedRestaurantId = response.data.restaurant_id;
        setRestaurantId(fetchedRestaurantId); // Set the restaurant_id
      } catch (error) {
        console.error('Error fetching restaurant ID:', error);
      }
    };

    fetchRestaurantId();
  }, []);

  useEffect(() => {
    if (!restaurantId) return; // Wait until restaurant_id is fetched

    // Fetch overview data
    axios
      .get('http://localhost:5000/api/dashboard/overview', {
        params: { restaurant_id: restaurantId }, // Pass restaurant_id as a query parameter
      })
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

    // Fetch sales by item data
    axios
      .get('http://localhost:5000/api/dashboard/sales-by-item', {
        params: { restaurant_id: restaurantId }, // Pass restaurant_id as a query parameter
      })
      .then((response) => {
        setSalesByItemData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching sales by item data:', error);
      });

    // Fetch top sold items data
    axios
      .get('http://localhost:5000/api/dashboard/top-sold-items', {
        params: { restaurant_id: restaurantId }, // Pass restaurant_id as a query parameter
      })
      .then((response) => {
        const data = response.data;
        const labels = data.map((item) => item.item_name);
        const values = data.map((item) => item.total_sold);

        setTopSoldItemsData({
          labels,
          datasets: [
            {
              label: 'Top 5 Sold Items',
              data: values,
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((error) => {
        console.error('Error fetching top sold items:', error);
      });
  }, [restaurantId]); // Dependency on restaurantId

  if (!restaurantId || !chartData || !salesByItemData || !topSoldItemsData) {
    return <p>Loading charts...</p>;
  }

  const groupedData = salesByItemData.reduce((acc, item) => {
    const date = item.date;
    if (!acc[item.item_name]) acc[item.item_name] = {};
    acc[item.item_name][date] = item.total_sales;
    return acc;
  }, {});

  const itemNames = Object.keys(groupedData);
  const dates = [...new Set(salesByItemData.map((item) => item.date))];

  const axisLabelConfig = {
    display: true,
    color: '#000',
    font: { size: 14, weight: 'bold' },
  };

  const tickStyle = {
    color: '#000',
  };

  const salesByItemChartConfig = {
    type: 'bar',
    data: {
      labels: itemNames,
      datasets: dates.map((date, index) => ({
        label: date,
        data: itemNames.map((item) => groupedData[item][date] || 0),
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
        tooltip: { enabled: true },
      },
      scales: {
        y: {
          display: true,
          beginAtZero: true,
          title: { ...axisLabelConfig, text: 'Total Sales (₹)' },
          ticks: tickStyle,
        },
        x: {
          display: true,
          title: { ...axisLabelConfig, text: 'Item Names' },
          ticks: tickStyle,
        },
      },
    },
  };

  const overviewChartConfig = {
    type: 'bar',
    data: {
      labels: chartData.map((item) => item.label),
      datasets: [
        {
          label: 'Overview',
          data: chartData.map((item) => item.value),
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
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
        tooltip: { enabled: true },
      },
      scales: {
        y: {
          display: true,
          beginAtZero: true,
          title: { ...axisLabelConfig, text: 'Count / Amount' },
          ticks: tickStyle,
        },
        x: {
          display: true,
          title: { ...axisLabelConfig, text: 'Categories' },
          ticks: tickStyle,
        },
      },
    },
  };

  const topSoldItemsChartUrl = `https://quickchart.io/chart?width=500&height=300&c=${encodeURIComponent(
    JSON.stringify({
      type: 'bar',
      data: topSoldItemsData,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Top 5 Sold Items',
            font: { size: 18 },
          },
          tooltip: { enabled: true },
        },
        scales: {
          y: {
            display: true,
            beginAtZero: true,
            title: { ...axisLabelConfig, text: 'Quantity Sold' },
            ticks: tickStyle,
          },
          x: {
            display: true,
            title: { ...axisLabelConfig, text: 'Items' },
            ticks: tickStyle,
          },
        },
      },
    })
  )}`;

  return (
    <div className="sales-container">
      <h2 className="sales-heading">Sales Overview</h2>

      <div className="sales-chart-container">
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

        <div className="chart-wrapper">
          <h3>Top 5 Sold Items</h3>
          <img
            src={topSoldItemsChartUrl}
            alt="Top Sold Items Chart"
            className="sales-chart"
          />
        </div>
      </div>
    </div>
  );
};

export default Sales;