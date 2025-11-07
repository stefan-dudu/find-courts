import Court from "@/components/Court";
import Image from "next/image";

export default async function Home() {
  const response = await fetch(
    process.env.NEXT_PUBLIC_COURT_GET_LINK || ""
  );
  const res = await response.json();
  // console.log("posts json:", res.body);

  return (
    <div className="flex min-h-screen items-center justify-center  ">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between px-16  sm:items-start">
        <Court data = {res.body} />
      </main>
    </div>
  );
}
