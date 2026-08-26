import { useState, useMemo } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

function checkPassword(password: string) {
  let score = 0;
  const checks = {
    length: password.length >= 8,
    longLength: password.length >= 12,
    veryLong: password.length >= 16,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    symbols: /[^A-Za-z0-9]/.test(password),
    noRepeats: !/(.)\1{2,}/.test(password),
    noSequential: !/(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password),
    noCommon: !/^(password|123456|qwerty|admin|letmein|welcome|monkey|dragon|master|login|abc123|111111|password1)/i.test(password),
  };

  if (checks.length) score += 1;
  if (checks.longLength) score += 1;
  if (checks.veryLong) score += 1;
  if (checks.uppercase) score += 1;
  if (checks.lowercase) score += 1;
  if (checks.numbers) score += 1;
  if (checks.symbols) score += 1.5;
  if (checks.noRepeats) score += 0.5;
  if (checks.noSequential) score += 0.5;
  if (checks.noCommon) score += 1;

  // Length bonus
  score += Math.min(password.length * 0.1, 2);

  // Variety bonus
  const uniqueChars = new Set(password).size;
  score += Math.min(uniqueChars * 0.05, 1.5);

  let strength: string;
  let color: string;
  let bgColor: string;
  let percent: number;

  if (score < 3) { strength = 'Very Weak'; color = 'text-red-500'; bgColor = 'bg-red-500'; percent = 15; }
  else if (score < 5) { strength = 'Weak'; color = 'text-orange-500'; bgColor = 'bg-orange-500'; percent = 35; }
  else if (score < 7) { strength = 'Fair'; color = 'text-yellow-500'; bgColor = 'bg-yellow-500'; percent = 55; }
  else if (score < 9) { strength = 'Strong'; color = 'text-blue-500'; bgColor = 'bg-blue-500'; percent = 80; }
  else { strength = 'Very Strong'; color = 'text-green-500'; bgColor = 'bg-green-500'; percent = 100; }

  // Crack time estimate
  const charsetSize = (checks.lowercase ? 26 : 0) + (checks.uppercase ? 26 : 0) + (checks.numbers ? 10 : 0) + (checks.symbols ? 32 : 0);
  const combinations = Math.pow(charsetSize || 1, password.length);
  const guessesPerSec = 1e10; // 10 billion/sec (modern GPU)
  const secondsToCrack = combinations / guessesPerSec / 2;

  let crackTime: string;
  if (secondsToCrack < 1) crackTime = 'Instantly';
  else if (secondsToCrack < 60) crackTime = `${Math.round(secondsToCrack)} seconds`;
  else if (secondsToCrack < 3600) crackTime = `${Math.round(secondsToCrack / 60)} minutes`;
  else if (secondsToCrack < 86400) crackTime = `${Math.round(secondsToCrack / 3600)} hours`;
  else if (secondsToCrack < 31536000) crackTime = `${Math.round(secondsToCrack / 86400)} days`;
  else if (secondsToCrack < 31536000 * 1000) crackTime = `${Math.round(secondsToCrack / 31536000)} years`;
  else if (secondsToCrack < 31536000 * 1e6) crackTime = `${Math.round(secondsToCrack / 31536000 / 1000)}K years`;
  else if (secondsToCrack < 31536000 * 1e9) crackTime = `${Math.round(secondsToCrack / 31536000 / 1e6)}M years`;
  else crackTime = 'Centuries+';

  return { score, strength, color, bgColor, percent, checks, crackTime, password };
}

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const result = useMemo(() => password ? checkPassword(password) : null, [password]);

  return (
    <ToolLayout
      tool={{ id: 'password-strength', name: 'Password Strength Checker', slug: 'password-strength', description: 'Check how strong your password is and estimated crack time', category: 'safety', keywords: ['password', 'strength', 'security', 'crack', 'hack'], icon: 'Key', status: 'active', path: '/tools/password-strength', requiresApi: false }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Enter Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type your password..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pr-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">🔒 Your password is never sent anywhere — checked locally</p>
        </div>

        {result && (
          <div className="space-y-4">
            {/* Strength bar */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-lg font-bold ${result.color}`}>{result.strength}</span>
                <span className="text-sm text-gray-400">{result.password.length} characters</span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full ${result.bgColor} rounded-full transition-all duration-500`}
                  style={{ width: `${result.percent}%` }} />
              </div>
            </div>

            {/* Crack time */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center">
              <p className="text-xs text-red-500 mb-1">⏱️ Estimated crack time (10B guesses/sec)</p>
              <p className="text-2xl font-bold text-red-600">{result.crackTime}</p>
            </div>

            {/* Checklist */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-sm">Security Checklist</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {[
                  { label: 'At least 8 characters', pass: result.checks.length },
                  { label: '12+ characters (bonus)', pass: result.checks.longLength },
                  { label: 'Uppercase letters (A-Z)', pass: result.checks.uppercase },
                  { label: 'Lowercase letters (a-z)', pass: result.checks.lowercase },
                  { label: 'Numbers (0-9)', pass: result.checks.numbers },
                  { label: 'Special symbols (!@#$)', pass: result.checks.symbols },
                  { label: 'No repeated characters (aaa)', pass: result.checks.noRepeats },
                  { label: 'No sequential patterns (abc, 123)', pass: result.checks.noSequential },
                  { label: 'Not a common password', pass: result.checks.noCommon },
                ].map((item) => (
                  <div key={item.label} className="flex items-center px-4 py-2">
                    <span className="mr-3">{item.pass ? '✅' : '❌'}</span>
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-sm">
              <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">🔐 Strong Password Tips</h3>
              <ul className="space-y-1 text-green-700 dark:text-green-300">
                <li>• Use 12+ characters minimum</li>
                <li>• Mix uppercase, lowercase, numbers, symbols</li>
                <li>• Use a passphrase: "MyDogLoves2Run!Fast"</li>
                <li>• Never reuse passwords across sites</li>
                <li>• Use a password manager (Bitwarden, 1Password)</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
