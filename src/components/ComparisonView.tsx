import React from "react";
import { ComparisonResult } from "../services/gemini";

interface Props {
  data: ComparisonResult;
}

export function ComparisonView({ data }: Props) {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Criteria
              </th>
              {(data?.options || []).map((opt, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                >
                  {opt.optionName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(data?.criteria || []).map((criterion, cIdx) => (
              <tr
                key={cIdx}
                className={cIdx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {criterion}
                </td>
                {(data?.options || []).map((opt, oIdx) => {
                  const evaluation = (opt?.evaluations || []).find(
                    (e) => e.criterion === criterion,
                  );
                  return (
                    <td key={oIdx} className="px-6 py-4 text-sm text-gray-600">
                      {evaluation ? evaluation.value : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
        <h4 className="text-indigo-900 font-semibold mb-2">
          The Tiebreaker's Take
        </h4>
        <p className="text-indigo-800 text-sm leading-relaxed">
          {data.conclusion}
        </p>
      </div>
    </div>
  );
}
