export type ProductCardMediaImage = {
  id: string;
  src: string;
  alt: string;
};

export type ProductCardMediaProps = {
  href: string;
  productName: string;
  images: ProductCardMediaImage[];
};
