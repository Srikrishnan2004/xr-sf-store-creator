import React, { Suspense } from "react";
import { useEnvAssetStore, useEnvProductStore, useComponentStore } from "@/stores/ZustandStores";
import ErrorBoundary from "@/UI/Components/ErrorBoundary";

const LazyDraggableProductContainer = React.lazy(() => 
  import("./DraggableProductContainer").then(module => ({ 
    default: module.default || module 
  }))
);

const LazyDraggableAssetContainer = React.lazy(() => 
  import("./DraggableAssetContainer").then(module => ({ 
    default: module.default || module 
  }))
);

const Products = () => {
  const {envProducts} = useEnvProductStore();
  const {envAssets} = useEnvAssetStore();
  const {products} = useComponentStore();

  // Validate data to prevent React errors and check product status
  const validEnvProducts = Object.keys(envProducts).filter(id => {
    const envProduct = envProducts[id];
    
    // Basic validation
    if (!envProduct || 
        typeof envProduct !== 'object' || 
        envProduct.isEnvironmentProduct !== true ||
        typeof envProduct.id !== 'number') {
      return false;
    }
    
    // Check if the corresponding product exists and is ACTIVE
    const product = products.find(p => p.id === envProduct.id);
    return product && product.status === "ACTIVE";
  });

  const validEnvAssets = Object.keys(envAssets).filter(id => {
    const asset = envAssets[id];
    return asset && 
           typeof asset === 'object' && 
           asset.isEnvironmentAsset === true &&
           typeof asset.id === 'string';
  });

  return (
    <Suspense fallback={null}>
      {
        validEnvProducts.map((id) => {
          const product = envProducts[id];
          return (
            <ErrorBoundary key={id}>
              <LazyDraggableProductContainer
                placeHolderId={product.placeHolderId}
                envPosition={product.position}
                envRotation={product.rotation}
                envScale={product.scale}
                envProduct={product}
              />
            </ErrorBoundary>
          );
        })
      }
      {
        validEnvAssets.map((id) => {
          const asset = envAssets[id];
          return (
            <ErrorBoundary key={id}>
              <LazyDraggableAssetContainer
                envPosition={asset.position}
                envRotation={asset.rotation}
                envScale={asset.scale}
                envAsset={asset}
              />
            </ErrorBoundary>
          );
        })
      }
    </Suspense>
  );
};

export default Products;
