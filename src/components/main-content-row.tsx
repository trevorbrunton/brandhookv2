export function MainContentRow({ children }: { children: React.ReactNode }) {
    
  return (
    <div className="flex grow items-start justify-start rounded bg-background mx-2 mb-2 border min-h-[calc(100vh-168px)]">
      <div className="flex-1 flex flex-col overflow-hidden h-full min-h-full bg-gray-50">
        <div className="flex-1 overflow-y-auto min-h-full h-full shadow-md relative z-10">
          <div className="relative min-h-full flex flex-col">
            <div className="min-h-full flex flex-col flex-1 space-y-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}