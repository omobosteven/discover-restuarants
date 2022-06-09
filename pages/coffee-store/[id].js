import { useRouter } from "next/router";
import Link from "next/link";

const CoffeeShop = () => {
  const router = useRouter();

  return (
    <div>
      Coffee Store Page {router.query.id}
      <Link href="/">Back to home</Link>
      <Link href="/coffee-store/dynamic">Go to page dynamic</Link>
    </div>
  );
};

export default CoffeeShop;
