import ProductDetails from "@/components/ui/Products/productDetails";
import ProductVariantForm from "@/components/ui/Products/product_variants/ProductVariantForm";
import { UUID } from "crypto";

const Page = async ({ params }: { params: { id: UUID } }) => {
  const { id }: { id: UUID } = await params;

  return (
    <div className="component-name">
      <ProductDetails id={id} />
    </div>
  );
};

export default Page;
