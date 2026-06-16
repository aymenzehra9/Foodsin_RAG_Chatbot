export function LeadStatusSelect({ defaultValue = "new" }: { defaultValue?: string }) {
  return (
    <select defaultValue={defaultValue} className="h-9 rounded-md border bg-white px-2 text-sm">
      {["new", "contacted", "confirmed", "cancelled", "completed"].map((status) => (
        <option key={status} value={status}>{status}</option>
      ))}
    </select>
  );
}
