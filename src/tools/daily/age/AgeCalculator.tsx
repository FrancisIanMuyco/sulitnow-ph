import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    if (!birthDate) return;
    const birth = new Date(birthDate);
    const now = new Date();
    if (birth > now) return;

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }

    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // Next birthday
    let nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= now) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Zodiac
    const zodiacSigns = [
      { sign: 'Capricorn', emoji: '♑', start: [0, 1], end: [0, 19] },
      { sign: 'Aquarius', emoji: '♒', start: [0, 20], end: [1, 18] },
      { sign: 'Pisces', emoji: '♓', start: [1, 19], end: [2, 20] },
      { sign: 'Aries', emoji: '♈', start: [2, 21], end: [3, 19] },
      { sign: 'Taurus', emoji: '♉', start: [3, 20], end: [4, 20] },
      { sign: 'Gemini', emoji: '♊', start: [4, 21], end: [5, 20] },
      { sign: 'Cancer', emoji: '♋', start: [5, 21], end: [6, 22] },
      { sign: 'Leo', emoji: '♌', start: [6, 23], end: [7, 22] },
      { sign: 'Virgo', emoji: '♍', start: [7, 23], end: [8, 22] },
      { sign: 'Libra', emoji: '♎', start: [8, 23], end: [9, 22] },
      { sign: 'Scorpio', emoji: '♏', start: [10, 23], end: [11, 21] },
      { sign: 'Sagittarius', emoji: '♐', start: [11, 22], end: [12, 31] },
    ];
    const m = birth.getMonth(), d = birth.getDate();
    const zodiac = zodiacSigns.find(z => {
      const [sm, sd] = z.start, [em, ed] = z.end;
      if (sm === em) return m === sm && d >= sd && d <= ed;
      return (m === sm && d >= sd) || (m === em && d <= ed);
    });

    setResult({ years, months, days, totalDays, totalWeeks, totalMonths, totalHours, totalMinutes, daysUntilBirthday, zodiac, birthDate: birth.toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) });
  };

  return (
    <ToolLayout
      tool={{ id: 'age-calculator', name: 'Age Calculator', slug: 'age-calculator', description: 'Calculate your exact age in years, months, days, and more.', category: 'daily', keywords: ['age', 'birthday', 'years', 'old', 'calculator', 'odiac'], icon: 'Cake', status: 'active', path: '/tools/age-calculator', requiresApi: false }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Date of Birth</label>
          <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>

        <button onClick={calculate} className="w-full py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition">Calculate Age</button>

        {result && (
          <div className="space-y-3">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center">
              <p className="text-sm text-text-secondary">You are</p>
              <p className="text-5xl font-bold text-primary mt-1">{result.years}</p>
              <p className="text-lg font-semibold text-text mt-1">years, {result.months} months, {result.days} days</p>
              <p className="text-xs text-text-muted mt-2">Born: {result.birthDate}</p>
            </div>

            {result.zodiac && (
              <div className="bg-surface-alt rounded-xl p-4 text-center">
                <span className="text-3xl">{result.zodiac.emoji}</span>
                <p className="font-semibold mt-1">{result.zodiac.sign}</p>
              </div>
            )}

            <div className="bg-surface-alt rounded-xl p-4">
              <h4 className="text-sm font-semibold mb-3">Age Breakdown</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-surface rounded-lg p-2"><p className="text-text-muted text-xs">Months</p><p className="font-bold">{result.totalMonths.toLocaleString()}</p></div>
                <div className="bg-surface rounded-lg p-2"><p className="text-text-muted text-xs">Weeks</p><p className="font-bold">{result.totalWeeks.toLocaleString()}</p></div>
                <div className="bg-surface rounded-lg p-2"><p className="text-text-muted text-xs">Days</p><p className="font-bold">{result.totalDays.toLocaleString()}</p></div>
                <div className="bg-surface rounded-lg p-2"><p className="text-text-muted text-xs">Hours</p><p className="font-bold">{result.totalHours.toLocaleString()}</p></div>
                <div className="bg-surface rounded-lg p-2"><p className="text-text-muted text-xs">Minutes</p><p className="font-bold">{result.totalMinutes.toLocaleString()}</p></div>
                <div className="bg-surface rounded-lg p-2"><p className="text-text-muted text-xs">Next Birthday</p><p className="font-bold">{result.daysUntilBirthday} days</p></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
