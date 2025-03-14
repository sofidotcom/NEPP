import React from 'react';

function ProgressViewer() {
  return (
    <div>
      <h2>Student Progress</h2>
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Course</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          {/* Data can be fetched from an API or stored locally */}
          <tr>
            <td>John Doe</td>
            <td>Math 101</td>
            <td>80%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ProgressViewer;
