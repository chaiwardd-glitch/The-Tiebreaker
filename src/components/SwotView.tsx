import React from "react";
import { SwotResult } from "../services/gemini";
import {
  ArrowUpRight,
  ArrowDownRight,
  Target,
  AlertTriangle,
} from "lucide-react";

interface Props {
  data: SwotResult;
}

export function SwotView({ data }: Props) {
  return (
    <div className="space-y-12">
      {(data?.items || []).map((item, idx) => (
        <div key={idx} className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 border-b pb-2">
            {item.optionName}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
              <h4 className="flex items-center text-emerald-800 font-semibold mb-4">
                <ArrowUpRight className="w-5 h-5 mr-2 text-emerald-600" />
                Strengths
              </h4>
              <ul className="space-y-2">
                {(item?.strengths || []).map((s, sIdx) => (
                  <li
                    key={sIdx}
                    className="text-emerald-900/80 text-sm flex items-start"
                  >
                    <span className="text-emerald-500 mr-2 mt-0.5">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-rose-50/50 rounded-2xl p-6 border border-rose-100">
              <h4 className="flex items-center text-rose-800 font-semibold mb-4">
                <ArrowDownRight className="w-5 h-5 mr-2 text-rose-600" />
                Weaknesses
              </h4>
              <ul className="space-y-2">
                {(item?.weaknesses || []).map((w, wIdx) => (
                  <li
                    key={wIdx}
                    className="text-rose-900/80 text-sm flex items-start"
                  >
                    <span className="text-rose-500 mr-2 mt-0.5">•</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
              <h4 className="flex items-center text-blue-800 font-semibold mb-4">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Opportunities
              </h4>
              <ul className="space-y-2">
                {(item?.opportunities || []).map((o, oIdx) => (
                  <li
                    key={oIdx}
                    className="text-blue-900/80 text-sm flex items-start"
                  >
                    <span className="text-blue-500 mr-2 mt-0.5">•</span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>

            {/* Threats */}
            <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100">
              <h4 className="flex items-center text-amber-800 font-semibold mb-4">
                <AlertTriangle className="w-5 h-5 mr-2 text-amber-600" />
                Threats
              </h4>
              <ul className="space-y-2">
                {(item?.threats || []).map((t, tIdx) => (
                  <li
                    key={tIdx}
                    className="text-amber-900/80 text-sm flex items-start"
                  >
                    <span className="text-amber-500 mr-2 mt-0.5">•</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}

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
