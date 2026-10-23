import LoadingState from "@/components/LoadingState";

export default function Loading() {
  return (
    <div className="page-shell flex min-h-[65vh] items-center justify-center">
      <LoadingState />
    </div>
  );
}
