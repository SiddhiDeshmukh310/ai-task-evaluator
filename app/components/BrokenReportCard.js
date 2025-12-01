// intentionally broken UI component
export default function BrokenReportCard({ title, score, locked }) {
  return (
    <div className="border p-3 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p>Score: {score}/100</p>
      {locked === true && ( // BUG: assignment instead of check
        <button className="bg-blue-600 text-white px-3 py-1 rounded">
          Unlock Full Report
        </button>
      )}
    </div>
  );
}
