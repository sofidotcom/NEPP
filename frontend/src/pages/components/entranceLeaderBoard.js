import { useEffect, useState } from "react";
import axios from "axios";
import "../../css/leaderboard/entranceleader.css";

const EntranceLeaderboard = () => {
  const [scores, setScores] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get("/api/v1/leaderboard", {
          params: { subject: subjectFilter, year: yearFilter }
        });
        console.log("API Response:", response.data);
        setScores(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error.message);
      }
    };
    fetchLeaderboard();
  }, [subjectFilter, yearFilter]);

  return (
    <div className="leaderboard-container">
      <div className="header-container">
        <h2>Entrance Exam Top Scorers</h2>
        <div className="filters-container">
          <div className="filter-wrapper">
            <label htmlFor="subjectFilter">Subject:</label>
            <select
              id="subjectFilter"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="biology">Biology</option>
              <option value="Chemistry">Chemistry</option>
            </select>
          </div>
          <div className="filter-wrapper">
            <label htmlFor="yearFilter">Year:</label>
            <select
              id="yearFilter"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="2014">2014</option>
              <option value="2015">2015</option>
              <option value="2016">2016</option>
            </select>
          </div>
        </div>
      </div>

      <div className="leaderboard-table">
        {scores.length === 0 ? (
          <p>No scores available for the selected filters.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student Name</th>
                {subjectFilter === "All" && yearFilter !== "All" ? (
                  <>
                    <th>Total Score</th>
                    <th>Total Questions</th>
                  </>
                ) : (
                  <>
                    <th>Subject</th>
                    <th>Year</th>
                    <th>Score</th>
                    <th>Total Questions</th>
                  </>
                )}
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <tr key={index}>
                  <td>
                    <span className={`rank-badge rank-${index + 1}`}>
                      {index + 1}
                    </span>
                  </td>
                  <td>{score.studentName}</td>
                  {subjectFilter === "All" && yearFilter !== "All" ? (
                    <>
                      <td>{score.totalScore}</td>
                      <td>{score.totalQuestions}</td>
                    </>
                  ) : (
                    <>
                      <td>{score.subject}</td>
                      <td>{score.year}</td>
                      <td>{score.score}</td>
                      <td>{score.totalQuestions}</td>
                    </>
                  )}
                  <td>{score.percentage.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EntranceLeaderboard;