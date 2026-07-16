import { useState, useEffect } from 'react';

const STORAGE_KEY = 'steps_data';

function StepsTracker() {
  const [entries, setEntries] = useState([]);
  const [date, setDate] = useState('');
  const [distance, setDistance] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!date || !distance) {
      alert('Заполните оба поля');
      return;
    }

    const distanceNum = parseFloat(distance);
    if (isNaN(distanceNum) || distanceNum <= 0) {
      alert('Введите положительное число');
      return;
    }

    const existingIndex = entries.findIndex(entry => entry.date === date);

    let newEntries;
    if (existingIndex !== -1) {
      const updatedEntries = [...entries];
      const newDistance = updatedEntries[existingIndex].distance + distanceNum;
      updatedEntries[existingIndex].distance = Math.round(newDistance * 10) / 10; // округление до 1 знака
      newEntries = updatedEntries;
    } else {
      const newEntry = {
        id: Date.now(),
        date: date,
        distance: distanceNum,
        displayDate: formatDate(date),
      };
      newEntries = [...entries, newEntry];
    }

    newEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

    setEntries(newEntries);
    setDate('');
    setDistance('');
  };

  const handleDelete = (id) => {
    const newEntries = entries.filter(entry => entry.id !== id);
    setEntries(newEntries);
  };

  return (
    <div className="app">
      <h1>Учёт тренировок</h1>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">Дата</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="distance">Пройдено км</label>
          <input
            id="distance"
            type="number"
            step="0.1"
            min="0"
            placeholder="0.0"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
        </div>
        <button type="submit">Добавить</button>
      </form>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Км</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan="3" className="empty-message">
                  Нет данных. Добавьте первую тренировку!
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="date-cell">{entry.displayDate}</td>
                  <td className="distance-cell">{entry.distance}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(entry.id)}
                    >
                      ✘
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StepsTracker;