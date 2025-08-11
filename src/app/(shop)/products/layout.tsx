import { ReactNode } from "react";

interface ProductLayoutProps {
  children: ReactNode;
  params: Promise<{ id?: string }>;
}

export default async function ProductLayout({ children, params }: ProductLayoutProps) {
  const { id } = await params;

  return <>{children}</>;
}
