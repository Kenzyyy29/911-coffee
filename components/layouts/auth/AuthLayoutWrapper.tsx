export default function AuthLayoutWrapper({
 children,
}: {
 children: React.ReactNode;
}) {
 return <div className="bg-white w-full">{children}</div>;
}
