export default function Table({ headers, data, renderRow }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item._id || index}>
              {renderRow(item)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
