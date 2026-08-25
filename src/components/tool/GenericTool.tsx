import { toolRegistry } from '../../constants/toolRegistry';
import ToolLayout from './ToolLayout';
import { Wrench } from 'lucide-react';

interface GenericToolProps {
  toolId: string;
}

export default function GenericTool({ toolId }: GenericToolProps) {
  const tool = toolRegistry.find((t) => t.id === toolId);
  if (!tool) return <div className="p-8 text-center text-text-muted">Tool not found</div>;

  if (tool.status === 'coming-soon') {
    return (
      <ToolLayout tool={tool}>
        <div className="px-4 py-12 text-center">
          <Wrench size={40} className="text-text-muted mx-auto mb-3" />
          <h3 className="font-semibold text-sm text-text mb-1">Coming Soon</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            This tool is under development. Check back soon for updates!
          </p>
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout tool={tool}>
      <div className="px-4 py-12 text-center">
        <Wrench size={40} className="text-text-muted mx-auto mb-3" />
        <h3 className="font-semibold text-sm text-text mb-1">Under Development</h3>
        <p className="text-xs text-text-muted max-w-sm mx-auto">
          This tool is being built. Check back soon!
        </p>
      </div>
    </ToolLayout>
  );
}
