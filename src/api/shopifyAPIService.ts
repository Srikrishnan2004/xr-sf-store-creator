import Variant from "@/Types/Variant";
import Product from "../Types/Product";
import { EnvAsset } from "@/stores/ZustandStores";

const BASE_URL =
  "https://function-14-201137466588.asia-south1.run.app?brandname=";
const LIBRARY_URL = "https://ownstoreasset-201137466588.asia-south1.run.app";
const OWN_STORE_PRODUCT_URL = "https://fetch-products-by-vendor-201137466588.asia-south1.run.app?vendor=";
interface ProductResponse {
  data: {
    products: {
      edges: {
        node: {
          id: string;
          title: string;
          media: {
            edges: {
              node: {
                mediaContentType: string;
                image?: {
                  url: string;
                  altText: string;
                };
                id?: string;
                sources?: {
                  url: string;
                  format: string;
                  mimeType: string;
                }[];
              };
            }[];
          };
          options: {
            id: string;
            name: string;
            position: number;
            values: string[];
          }[];
          variants: {
            edges: {
              node: {
                id: string;
                title: string;
                price: string;
                compareAtPrice?: string;
                availableForSale: boolean;
                selectedOptions: {
                  name: string;
                  value: string;
                }[];
              };
            }[];
          };
          tags: string[];
          metafields: {
            edges: {
              node: {
                namespace: string;
                key: string;
                value: string;
                type: string;
                description: string;
              };
            }[];
          };
          descriptionHtml: string;
        };
      }[];
    };
  };
}

export const ProductService = {
  async getAllProducts(brandName: string): Promise<Product[]> {
    const response = await fetch(BASE_URL + brandName);
    const resultJSON: ProductResponse = await response.json();

    const products: Product[] = resultJSON.data.products.edges.map(
      (product) => {
        const productImages: { src: string }[] = product.node.media.edges
          .filter(
            (edge) =>
              edge.node.mediaContentType.toUpperCase() === "IMAGE" &&
              edge.node.image
          )
          .map((edge) => {
            return { src: edge.node.image?.url || "" };
          });

        const models: {
          id: string | undefined;
          sources:
            | {
                url: string;
                format: string;
                mimeType: string;
              }[]
            | undefined;
        }[] = product.node.media.edges
          .filter(
            (edge) =>
              edge.node.mediaContentType.toUpperCase() === "MODEL_3D" &&
              edge.node.sources
          )
          .map((edge) => {
            return {
              id: edge.node.id,
              sources: edge.node.sources,
            };
          });

        const productVariants: Variant[] = product.node.variants.edges.map(
          (variant) => {
            return {
              id: Number(variant.node.id.split("/").pop()),
              price: variant.node.price,
              compareAtPrice: variant.node.compareAtPrice,
              productId: Number(product.node.id.split("/").pop()),
              selectedOptions: variant.node.selectedOptions,
              availableForSale: variant.node.availableForSale,
            };
          }
        ).filter(variant => parseFloat(variant.price) > 0);

        const arLensLink = product.node.metafields.edges.find(
          (metafield) =>
            metafield.node.namespace === "custom" &&
            metafield.node.key === "snapchat_lens_link"
        )?.node.value;

        const parsedProduct: Product = {
          id: Number(product.node.id.split("/").pop()),
          title: product.node.title,
          description: product.node.descriptionHtml,
          images: productImages,
          options: product.node.options,
          variants: productVariants,
          models: models,
          arLensLink: arLensLink,
          tags: product.node.tags.join(" "),
        };

        return parsedProduct;
      }
    );

    // Filter out products that have no variants with price > 0
    return products.filter(product => product.variants.length > 0);
  },

  async getAllProductsFromVendor(brandName: string): Promise<Product[]> {
    const response = await fetch(OWN_STORE_PRODUCT_URL + brandName, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        vendor: brandName
      })
    });
    const resultJSON: ProductResponse = await response.json();

    const products: Product[] = resultJSON.data.products.edges.map(
      (product) => {
        const productImages: { src: string }[] = product.node.media.edges
          .filter(
            (edge) =>
              edge.node.mediaContentType.toUpperCase() === "IMAGE" &&
              edge.node.image
          )
          .map((edge) => {
            return { src: edge.node.image?.url || "" };
          });

        const models: {
          id: string | undefined;
          sources:
            | {
                url: string;
                format: string;
                mimeType: string;
              }[]
            | undefined;
        }[] = product.node.media.edges
          .filter(
            (edge) =>
              edge.node.mediaContentType.toUpperCase() === "MODEL_3D" &&
              edge.node.sources
          )
          .map((edge) => {
            return {
              id: edge.node.id,
              sources: edge.node.sources,
            };
          });

        const productVariants: Variant[] = product.node.variants.edges.map(
          (variant) => {
            return {
              id: Number(variant.node.id.split("/").pop()),
              price: variant.node.price,
              compareAtPrice: variant.node.compareAtPrice,
              productId: Number(product.node.id.split("/").pop()),
              selectedOptions: variant.node.selectedOptions,
              availableForSale: variant.node.availableForSale,
            };
          }
        ).filter(variant => parseFloat(variant.price) > 0);

        const arLensLink = product.node.metafields.edges.find(
          (metafield) =>
            metafield.node.namespace === "custom" &&
            metafield.node.key === "snapchat_lens_link"
        )?.node.value;

        const parsedProduct: Product = {
          id: Number(product.node.id.split("/").pop()),
          title: product.node.title,
          description: product.node.descriptionHtml,
          images: productImages,
          options: product.node.options,
          variants: productVariants,
          models: models,
          arLensLink: arLensLink,
          tags: product.node.tags.join(" "),
        };

        return parsedProduct;
      }
    );

    // Filter out products that have no variants with price > 0
    return products.filter(product => product.variants.length > 0);
  },

  async getLibraryAssetsAsProducts(): Promise<Product[]> {
    const response = await fetch(LIBRARY_URL);
    const resultJSON: ProductResponse = await response.json();

    const products: Product[] = resultJSON.data.products.edges.map(
      (product) => {
        const productImages: { src: string }[] = product.node.media.edges
          .filter(
            (edge) =>
              edge.node.mediaContentType.toUpperCase() === "IMAGE" &&
              edge.node.image
          )
          .map((edge) => {
            return { src: edge.node.image?.url || "" };
          });

        const models: {
          id: string | undefined;
          sources:
            | {
                url: string;
                format: string;
                mimeType: string;
              }[]
            | undefined;
        }[] = product.node.media.edges
          .filter(
            (edge) =>
              edge.node.mediaContentType.toUpperCase() === "MODEL_3D" &&
              edge.node.sources
          )
          .map((edge) => {
            return {
              id: edge.node.id,
              sources: edge.node.sources,
            };
          });

        const productVariants: Variant[] = product.node.variants.edges.map(
          (variant) => {
            return {
              id: Number(variant.node.id.split("/").pop()),
              price: variant.node.price,
              compareAtPrice: variant.node.compareAtPrice,
              productId: Number(product.node.id.split("/").pop()),
              selectedOptions: variant.node.selectedOptions,
              availableForSale: variant.node.availableForSale,
            };
          }
        );

        const arLensLink = product.node.metafields.edges.find(
          (metafield) =>
            metafield.node.namespace === "custom" &&
            metafield.node.key === "snapchat_lens_link"
        )?.node.value;

        const parsedProduct: Product = {
          id: Number(product.node.id.split("/").pop()),
          title: product.node.title,
          description: product.node.descriptionHtml,
          images: productImages,
          options: product.node.options,
          variants: productVariants,
          models: models,
          arLensLink: arLensLink,
          tags: product.node.tags.join(" "),
        };

        return parsedProduct;
      }
    );

    return products;
  },

  async getLibraryAssets(brandName: string): Promise<EnvAsset[]> {
    const products = await this.getLibraryAssetsAsProducts();

    const libraryAssets = products.map((product) => {
      const assets: EnvAsset = {
        id: `${brandName}/${product.id}`,
        type: product.models.length > 0 ? "MODEL_3D" : "PHOTO",
        status: "SUCCESS",
        src:
          product.models.length > 0
            ? product.models[0].sources?.[0].url || ""
            : product.images[0].src,
        name: product.title,
        source: "LIBRARY",
        image : product?.images[0] && product?.images[0].src,
        isEnvironmentAsset: false,
      };
      return assets;
    });

    return libraryAssets;
  },
};
