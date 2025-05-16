export default function LoadingSection() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-white text-lg font-semibold tracking-wide">
          Loading...
        </span>
      </div>
    </div>
  );
}
