import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Scores } from '../types';

interface ResultsViewProps {
  preScores: Scores;
  postScores: Scores;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ preScores, postScores }) => {
  const data = [
    {
      name: 'Appearance',
      Pre: preScores.sses.Appearance.toFixed(2),
      Post: postScores.sses.Appearance.toFixed(2),
    },
    {
      name: 'Performance',
      Pre: preScores.sses.Performance.toFixed(2),
      Post: postScores.sses.Performance.toFixed(2),
    },
    {
      name: 'Social',
      Pre: preScores.sses.Social.toFixed(2),
      Post: postScores.sses.Social.toFixed(2),
    },
  ];

  const panasData = [
    {
      name: 'Positive Affect',
      Pre: preScores.panas.positive.toFixed(2),
      Post: postScores.panas.positive.toFixed(2),
    },
    {
      name: 'Negative Affect',
      Pre: preScores.panas.negative.toFixed(2),
      Post: postScores.panas.negative.toFixed(2),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold text-slate-800 mb-4">Your Well-being Insights</h2>
        <p className="text-lg text-slate-600">Here is how your state self-esteem shifted during the session.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <h3 className="text-xl font-bold text-slate-700 mb-6 text-center">Self-Esteem Subscales</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" />
                <Bar dataKey="Pre" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Post" fill="#db2777" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <h3 className="text-xl font-bold text-slate-700 mb-6 text-center">Emotional Affect (PANAS)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={panasData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip 
                   cursor={{fill: '#f8fafc'}}
                   contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" />
                <Bar dataKey="Pre" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Post" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-brand-50 p-8 rounded-2xl text-center">
        <h3 className="text-2xl font-serif font-bold text-brand-900 mb-4">Thank You for Participating</h3>
        <p className="text-brand-800 mb-6">
          Your participation helps advance research into ethical AI and digital well-being.
          Remember, these small nudges are designed to be micro-actions you can take anytime.
        </p>
        <div className="text-sm text-brand-600">
          Study ID: LUM-{Math.floor(Math.random() * 10000)}
        </div>
      </div>
    </div>
  );
};