import Court from "@/components/Court";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function Home() {
  const response = await fetch(process.env.NEXT_PUBLIC_COURT_GET_LINK || "");
  const res = await response.json();
  // console.log("posts json:", res.body);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
      <main>
        <Court data={res.body} />
      </main>
    </div>
  );
}
