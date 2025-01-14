interface PageHeaderProps {
    title: string;
}


export function PageHeader({title}: PageHeaderProps) {
  return (
    <div className="min-h-16 max-h-16 rounded border-1 bg-brown flex items-end justify-start grow mx-2 mb-2 text-slate-50">
      <span className="text-xl px-4 py-2 font-fine">
        {title.toUpperCase()}
      </span>
    </div>
  );
}
