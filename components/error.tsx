export default function Error({ message }: { message: string }) {
  return <div className="text-center text-red-500">{message}</div>;
}
