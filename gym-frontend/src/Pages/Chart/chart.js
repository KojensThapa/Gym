import { useEffect, useState } from "react";
import axios from "axios";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Line } from "react-chartjs-2";

defaults.plugins.title.display = true;
defaults.plugins.title.align = "center";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

const Chart = () => {
  const [monthlyJoined, setMonthlyJoined] = useState(Array(12).fill(0));
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);

  const limit = 1000; // You can set higher to fetch more members at once
  const skip = 0;

  // Fetch monthly joined members
  useEffect(() => {
    const fetchMonthlyJoined = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4001/members/monthlyMember",
          { withCredentials: true }
        );

        const members = response.data.members;
        const monthlyCounts = Array(12).fill(0);

        members.forEach((member) => {
          const joinDate = new Date(member.lastPayment); // or member.createdAt
          const monthIndex = joinDate.getMonth(); // 0 = Jan, 11 = Dec
          monthlyCounts[monthIndex]++;
        });

        setMonthlyJoined(monthlyCounts);
      } catch (error) {
        console.error("Error while fetching monthly members:", error);
      }
    };

    fetchMonthlyJoined();
  }, []);

  // Fetch all members for Active/Inactive counts
  useEffect(() => {
    const fetchAllMembers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4001/members/all-member?skip=${skip}&limit=${limit}`,
          { withCredentials: true }
        );

        const members = response.data.members;

        let active = 0;
        let inactive = 0;

        members.forEach((member) => {
          if (member.status === "Active") {
            active++;
          } else {
            inactive++;
          }
        });

        setActiveCount(active);
        setInactiveCount(inactive);
      } catch (error) {
        console.error("Error fetching all members:", error);
      }
    };

    fetchAllMembers();
  }, []);

  const labels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return (
    <div className="w-3/4 bg-white">
      <div className="m-4 p-4 bg-slate-100 font-serif rounded-md h-[95vh] overflow-auto">

        {/* Line Chart - Monthly Joined */}
        <div className="bg-white rounded p-4 m-4">
          <Line
            data={{
              labels: labels,
              datasets: [
                {
                  label: "Members Joined",
                  data: monthlyJoined,
                  fill: false,
                  borderColor: "rgba(75, 192, 192, 1)",
                  tension: 0.3,
                  pointBackgroundColor: "rgba(75, 192, 192, 1)",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                title: {
                  text: "Monthly Joined",
                },
                legend: {
                  position: "top",
                },
                tooltip: {
                  enabled: true,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Number of Members",
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: "Month",
                  },
                },
              },
            }}
          />
        </div>

        {/* Bar Chart - Active vs Inactive (from live API) */}
        <div className="w-auto bg-white rounded m-4 p-4">
          <Bar
            data={{
              labels: ["Active", "Inactive"],
              datasets: [
                {
                  label: "Member Status",
                  data: [activeCount, inactiveCount],
                  backgroundColor: ["rgba(75,192,192,0.6)", "rgba(255,99,132,0.6)"],
                  borderRadius: 5,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                title: {
                  text: "Active and Inactive Members",
                },
                legend: {
                  position: "top",
                },
                tooltip: {
                  enabled: true,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Number of Members",
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Chart;
    