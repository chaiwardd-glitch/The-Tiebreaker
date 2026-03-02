import React from "react";
import { ProsConsResult } from "../services/gemini";
import { CheckCircle2, XCircle } from "lucide-react";

interface Props {
  data: ProsConsResult;
}

export function ProsConsView({ data }: Props) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(data?.items || []).map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {item.optionName}
              </h3>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="flex items-center text-sm font-medium text-emerald-700 uppercase tracking-wider mb-3">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Pros
                </h4>
                <ul className="space-y-2">
                  {(item?.pros || []).map((pro, pIdx) => (
                    <li
                      key={pIdx}
                      className="text-gray-600 text-sm flex items-start"
                    >
                      <span className="text-emerald-500 mr-2 mt-0.5">•</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="flex items-center text-sm font-medium text-rose-700 uppercase tracking-wider mb-3">
                  <XCircle className="w-4 h-4 mr-2" />
                  Cons
                </h4>
                <ul className="space-y-2">
                  {(item?.cons || []).map((con, cIdx) => (
                    <li
                      key={cIdx}
                      className="text-gray-600 text-sm flex items-start"
                    >
                      <span className="text-rose-500 mr-2 mt-0.5">•</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
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
