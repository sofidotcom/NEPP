import React, { useState } from 'react';

function TipForm() {
  const [tip, setTip] = useState('');

  const handleSubmit = () => {
    console.log('Tip Added:', { tip });
    // Save data (you can save it to a server or localStorage)
  };

  return (
    <div>
      <h2>Add Tip</h2>
      <textarea
        placeholder="Write a helpful tip"
        value={tip}
        onChange={(e) => setTip(e.target.value)}
      />
      <button onClick={handleSubmit}>Add Tip</button>
    </div>
  );
}

export default TipForm;
