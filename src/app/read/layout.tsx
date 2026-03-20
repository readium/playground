import { CustomProviders } from "@/Components/CustomProviders";

export default function ReadLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CustomProviders>
      { children }
    </CustomProviders>
  );
}
