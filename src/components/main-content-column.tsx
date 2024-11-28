export function MainContentColumn({ children }: { children: React.ReactNode }) {
    
  return (
    <div className="flex flex-col items-center rounded bg-background mx-2 mb-2 border grow">
      {children}
    </div>
  );
}