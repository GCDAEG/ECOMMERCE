
import { Timestamp } from "next/dist/server/lib/cache-handlers/types"

export type BaseProduct = {
    id:string
    name:string,
    description:string,
    price:number,
    slug:string,
    discount_price:number | null,
    active:boolean,
  categories:Categorie[],
product_variants:{sku:string, id:string }[]}

export type ProductCategories = {
    product_id:string,
    category_id:string
}
export type Categorie = {
    id:string,
    name:string,
    slug:string,
}
export type AttributeType = {
    id:string,
    name:string
}
export type AttributeValues = {
    id:string,
    attribute_id:string,
    value:string
}
export type AttributeWithValues = {
    id:string,
    name:string
    attributeValues:AttributeValues[]
}
export type ProductVariants = {
    id:string,
    product_id:string,
    sku:string,
    price:number,
    stock:number,
    created_at:Timestamp
}
export type VariantValues = {
    id:string,
    variant_id:string,
    attribute_id:string
}


export type CleanAttribute = {
  name: string;
  value: string;
  attributeId: string;
  attributeValueId: string;
};

export type CleanVariant = {
  id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: CleanAttribute[];
};

export type CleanProduct = {
  product: {
    id: string;
    name: string;
    price: number;
    description: string | null;
  };
  product_variants: CleanVariant[];
};

