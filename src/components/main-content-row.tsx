export function MainContentRow({ children }: { children: React.ReactNode }) {
    
  return (
    <div className="flex grow items-start justify-start rounded bg-background mx-2 mb-2 border min-h-[calc(100vh-168px)]">
      {children}
    </div>
  );
}