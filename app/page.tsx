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
        {/* <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-700 py-10 sm:mt-16 sm:py-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <h2>Contact</h2>
        </div> */}
      </main>
    </div>
  );
}
