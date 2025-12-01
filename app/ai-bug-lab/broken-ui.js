// intentionally broken on purpose for assignment
export default function BrokenReportCard({ title, score, locked }) {
  return (
    <div className="border p-3 rounded-2xl bg-black/60">
      <h3 className="text-sm font-semibold">{title}</h3> {/* wrong closing tag */}
      <p>Score: {score}/100</p>
      {locked === true && ( /* BUG: assignment instead of comparison */
        <button className="bg-blue-600 text-white px-2 py-1 rounded">
          Unlock Full Report
        </button>
      )}
    </div>
  );
}
