import { useState } from 'react';
import ToolLayout from '../../../components/tool/ToolLayout';

export default function RoomAreaCalculator() {
  const [shape, setShape] = useState<'rect' | 'lshape'>('rect');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [length2, setLength2] = useState('');
  const [width2, setWidth2] = useState('');

  const l = parseFloat(length) || 0;
  const w = parseFloat(width) || 0;
  const h = parseFloat(height) || 0;
  const l2 = parseFloat(length2) || 0;
  const w2 = parseFloat(width2) || 0;

  // Area in sq meters
  const floorArea = shape === 'rect' ? l * w : (l * w) + (l2 * w2);
  // Wall area (4 walls)
  const perimeter = shape === 'rect' ? 2 * (l + w) : 2 * (l + w) + 2 * (l2 + w2);
  const wallArea = perimeter * h;
  // Ceiling
  const ceilingArea = floorArea;
  // Paint needed: ~10 sqm per liter, 2 coats
  const paintLiters = Math.ceil((wallArea * 2) / 10);
  const paintCans = Math.ceil(paintLiters / 4); // 4L cans

  return (
    <ToolLayout
      tool={{ id: 'room-area', name: 'Room Area & Paint Calculator', slug: 'room-area', description: 'Calculate room area, wall area, and estimated paint needed.', category: 'daily', keywords: ['room', 'area', 'paint', 'wall', 'floor', 'sqm', 'square', 'meter'], icon: 'Ruler', status: 'active', path: '/tools/room-area', requiresApi: false }}
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          {(['rect', 'lshape'] as const).map(s => (
            <button key={s} onClick={() => setShape(s)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition border ${shape === s ? 'bg-primary text-white border-primary' : 'bg-surface text-text-muted border-border'}`}>
              {s === 'rect' ? '⬜ Rectangle' : '📐 L-Shape'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Length (m)</label>
            <input type="number" value={length} onChange={e => setLength(e.target.value)} placeholder="0"
              className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Width (m)</label>
            <input type="number" value={width} onChange={e => setWidth(e.target.value)} placeholder="0"
              className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
        </div>

        {shape === 'lshape' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Extra Length (m)</label>
              <input type="number" value={length2} onChange={e => setLength2(e.target.value)} placeholder="0"
                className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Extra Width (m)</label>
              <input type="number" value={width2} onChange={e => setWidth2(e.target.value)} placeholder="0"
                className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Ceiling Height (m)</label>
          <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 2.8" step="0.1"
            className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>

        {floorArea > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-center">
                <p className="text-xs text-text-muted">Floor Area</p>
                <p className="text-xl font-bold text-primary">{floorArea.toFixed(1)} m²</p>
              </div>
              <div className="bg-surface-alt rounded-xl p-3 text-center">
                <p className="text-xs text-text-muted">Wall Area</p>
                <p className="text-xl font-bold">{wallArea.toFixed(1)} m²</p>
              </div>
            </div>
            <div className="bg-surface-alt rounded-xl p-3 text-center">
              <p className="text-xs text-text-muted">Ceiling Area</p>
              <p className="text-lg font-bold">{ceilingArea.toFixed(1)} m²</p>
            </div>
            {h > 0 && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
                <p className="text-sm font-semibold text-center">🎨 Paint Estimate</p>
                <p className="text-center text-xs text-text-muted mt-1">Based on 2 coats, ~10 m² per liter</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-surface rounded-lg p-2 text-center">
                    <p className="text-xs text-text-muted">Liters needed</p>
                    <p className="font-bold">{paintLiters}L</p>
                  </div>
                  <div className="bg-surface rounded-lg p-2 text-center">
                    <p className="text-xs text-text-muted">4L Cans</p>
                    <p className="font-bold">{paintCans} can{paintCans !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
