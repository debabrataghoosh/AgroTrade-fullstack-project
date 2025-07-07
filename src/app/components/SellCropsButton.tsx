import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";

export default function SellCropsButton({ className = "" }: { className?: string }) {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  return (
    <button
      className={clsx(
        "flex items-center gap-2 px-4 py-2 text-lg font-semibold transition",
        className
      )}
      onClick={() => {
        router.push("/becomeseller");
      }}
    >
      <Image src="/assets/farmer.png" alt="Farmer" width={24} height={24} />
      Become Seller
    </button>
  );
} 