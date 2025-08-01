import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Perf } from 'r3f-perf';
import App from "./world/App.jsx";
import "@/index.scss";
import UI from "@/UI/UI.tsx";
import { ProductService } from "./api/shopifyAPIService";
import {
  EnvProduct,
  useComponentStore,
  useEnvironmentStore,
  useEnvProductStore,
  useEnvAssetStore,
  useBrandStore,
  useResourceFetchStore,
  EnvAsset,
} from "./stores/ZustandStores";
import BrandService from "./api/brandService.js";
import EnvStoreService from "./api/envStoreService.js";
import { AssetService } from "./api/assetService.js";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Load from "./UI/Components/Loader";
import { ACESFilmicToneMapping, LinearToneMapping } from "three";
import TutorialOverlay from "./UI/Components/TutorialOverlay";
import Product from "@/Types/Product";

export default function CanvasWrapper() {
  // Load brand data
  const { brandData, setBrandData } = useBrandStore();
  const { environmentType } = useEnvironmentStore();
  const [brandStatus, setBrandStatus] = useState<"VALID" | "INVALID" | null>(
    null
  );
  const navigate = useNavigate();

  // Environments that should use LinearToneMapping
  const linearToneMappingEnvironments = ["GLOWBAR", "LUXECRADLE","GARDENATELIER"];

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const brandName = queryParams.get("brandName");
    const initialBrandName = Cookies.get("brandName");

    console.log("brandName:", brandName);
    console.log("initialBrandName:", initialBrandName);

    // Check if the current brandName matches the initial one
    if (brandName !== initialBrandName) {
      // If they don't match, redirect back to auth with the original brandName
      navigate("/auth");
      return;
    }

    async function fetchBrandDetails() {
      try {
        if (!brandName) {
          setBrandStatus("INVALID");
          return;
        }

        const response = await BrandService.fetchBrandData(brandName);
        if (response.status && response.status === 404) {
          setBrandStatus("INVALID");
          return;
        }

        console.log("BrandService:", response);
        setBrandStatus("VALID");
        setBrandData(response);
      } catch (error) {
        console.error("Brand Error: ", error);
        setBrandStatus("INVALID");
      }
    }

    fetchBrandDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setBrandData, navigate, window.location.search]); // Add dependencies to track URL changes

  // Set the environment type
  const { setEnvironmentType } = useEnvironmentStore();
  useEffect(() => {
    if (brandStatus === "VALID" && brandData)
      setEnvironmentType(brandData.environment_name.toUpperCase());
  }, [brandStatus, brandData, setEnvironmentType]);

  // Load All resources
  const { envAssets, setEnvAssets } = useEnvAssetStore();
  const { products, setProducts, isAdvancedPerfVisible, isTutorialOpen, closeTutorial } = useComponentStore();
  const { envProducts, setEnvProducts } = useEnvProductStore();
  const {
    productsLoaded,
    productsLoading,
    setProductsLoaded,
    setProductsLoading,
  } = useResourceFetchStore();
  const {
    envItemsLoaded,
    setEnvItemsLoaded,
    envItemsLoading,
    setEnvItemsLoading,
  } = useResourceFetchStore();
  const {
    assetLibraryLoaded,
    setAssetLibraryLoaded,
    assetLibraryLoading,
    setAssetLibraryLoading,
  } = useResourceFetchStore();

  const [myProgress, setProgress] = useState(0);
  const assetLibraryRef = useRef<{[id: string]: EnvAsset}>({});
  const cleanupPerformedRef = useRef(false);

  // Function to check and fix 3D models that are no longer available
  const fixUnavailable3DModels = (fetchedProducts: Product[], envProducts: { [id: number]: EnvProduct }) => {
    let hasChanges = false;
    const updatedEnvProducts = { ...envProducts };

    for (const [productId, envProduct] of Object.entries(envProducts)) {
      if (envProduct.type === "MODEL_3D" && envProduct.modelIndex !== undefined) {
        const product = fetchedProducts.find(p => p.id === parseInt(productId));
        if (product) {
          const model = product.models[envProduct.modelIndex];
          if (!model || !model.sources || model.sources.length === 0) {
            console.log(`🔧 Fixing unavailable 3D model for product ${productId}, switching to first image`);
            updatedEnvProducts[parseInt(productId)] = {
              ...envProduct,
              type: "PHOTO",
              imageIndex: 0,
              modelIndex: undefined,
            };
            hasChanges = true;
          }
        }
      }
    }

    if (hasChanges) {
      setEnvProducts(updatedEnvProducts);
      console.log("✅ Fixed unavailable 3D models");
    }

    return hasChanges;
  };

  // Function to clean up orphaned environment products and update server
  const cleanupOrphanedProducts = async (fetchedProducts: Product[], envProducts: { [id: number]: EnvProduct }) => {
    const fetchedProductIds = new Set(fetchedProducts.map(p => p.id));
    const orphanedIds = Object.keys(envProducts).filter(id => {
      const productId = parseInt(id);
      return !fetchedProductIds.has(productId);
    });
    
    if (orphanedIds.length > 0) {
      console.log(`🧹 Cleaning up ${orphanedIds.length} orphaned products:`, orphanedIds);
      const cleanedEnvProducts = { ...envProducts };
      orphanedIds.forEach(id => {
        delete cleanedEnvProducts[parseInt(id)];
      });
      
      // Update local state
      setEnvProducts(cleanedEnvProducts);
      
      // Update server state via API
      if (brandData) {
        try {
          console.log("🔄 Updating server with cleaned environment data...");
          const envProductsArray = Object.values(cleanedEnvProducts);
          const envAssetsArray = Object.values(envAssets);
          
          await EnvStoreService.storeEnvData(
            brandData.brand_name,
            envProductsArray,
            envAssetsArray
          );
          console.log("✅ Server updated successfully with cleaned environment data");
        } catch (error) {
          console.error("❌ Error updating server with cleaned environment data:", error);
        }
      }
    }
  };

  // Function to compare fetched products with environment products and log differences
  const compareProductsWithEnvironment = (fetchedProducts: Product[], envProducts: { [id: number]: EnvProduct }) => {
    try {
    const fetchedProductIds = new Set(fetchedProducts.map(p => p.id));
    const envProductIds = new Set(Object.keys(envProducts).map(id => parseInt(id)));
    
    // Products in fetched but not in environment
    const onlyInFetched = fetchedProducts.filter(product => !envProductIds.has(product.id));
    
    // Products in environment but not in fetched
    const onlyInEnvironment = Array.from(envProductIds).filter(id => !fetchedProductIds.has(id));
    
    // Products in both but with different properties
    const commonProducts = fetchedProducts.filter(product => envProductIds.has(product.id));
    const differences = commonProducts.map(product => {
      const envProduct = envProducts[product.id];
      const diff: any = { id: product.id, title: product.title };
      
      if (envProduct.type !== "PHOTO") {
        diff.type = { fetched: "PHOTO", environment: envProduct.type };
      }
      
      if (envProduct.scale !== 1) {
        diff.scale = { fetched: 1, environment: envProduct.scale };
      }
      
      if (envProduct.position) {
        diff.position = { fetched: "undefined", environment: envProduct.position };
      }
      
      if (envProduct.rotation) {
        diff.rotation = { fetched: "undefined", environment: envProduct.rotation };
      }
      
      if (envProduct.imageIndex !== undefined) {
        diff.imageIndex = { fetched: "undefined", environment: envProduct.imageIndex };
      }
      
      if (envProduct.modelIndex !== undefined) {
        diff.modelIndex = { fetched: "undefined", environment: envProduct.modelIndex };
      }
      
      if (envProduct.placeHolderId !== undefined) {
        diff.placeHolderId = { fetched: "undefined", environment: envProduct.placeHolderId };
      }
      
      if (envProduct.face) {
        diff.face = { fetched: "undefined", environment: envProduct.face };
      }
      
      // Only return if there are actual differences
      const hasDifferences = Object.keys(diff).length > 2; // More than just id and title
      return hasDifferences ? diff : null;
    }).filter(Boolean);
    
    // Log differences in a structured format
    console.log("=== PRODUCT COMPARISON RESULTS ===");
    console.log(`Total fetched products: ${fetchedProducts.length}`);
    console.log(`Total environment products: ${Object.keys(envProducts).length}`);
    console.log(`Common products: ${commonProducts.length}`);
    
    if (onlyInFetched.length > 0) {
      console.log(`❌ Products only in fetched (${onlyInFetched.length}):`, onlyInFetched.map(p => ({ id: p.id, title: p.title })));
    }
    
    if (onlyInEnvironment.length > 0) {
      console.log(`❌ Products only in environment (${onlyInEnvironment.length}):`, onlyInEnvironment);
    }
    
    if (differences.length > 0) {
      console.log(`⚠️ Products with property differences (${differences.length}):`, differences);
    }
    
    if (onlyInFetched.length === 0 && onlyInEnvironment.length === 0 && differences.length === 0) {
      console.log("✅ No differences found between fetched products and environment products");
    }
    
    console.log("=== END COMPARISON ===");
    } catch (error) {
      console.error("Error in comparison function:", error);
    }
  };

  useEffect(() => {

    async function fetchProducts() {
      try {
        if (!productsLoaded && !productsLoading && brandData) {
          setProductsLoading(true);
          const response = (brandData.shopify_store_name === 'nufewd-83.myshopify.com' || brandData.shopify_store_name === 'h49c6z-yr.myshopify.com') 
            ? await ProductService.getAllProductsFromVendor(brandData.brand_name)
            : await ProductService.getAllProducts(brandData.brand_name);
          setProducts(response);
          console.log("All Products:", response);

          const newEnvProducts: { [id: number]: EnvProduct } = {};
          for (const product of response) {
            newEnvProducts[product.id] = {
              id: product.id,
              type: "PHOTO",
              placeHolderId: undefined,
              imageIndex: undefined,
              modelIndex: undefined,
              position: undefined,
              rotation: undefined,
              scale: 1,
              isEnvironmentProduct: false,
            };
          }
          setEnvProducts(newEnvProducts);
          setProductsLoaded(true);
          console.log("All Products:", response);
          
          // Compare fetched products with environment products
          try {
            compareProductsWithEnvironment(response, newEnvProducts);
          } catch (error) {
            console.error("Error during initial comparison:", error);
          }
          
          // Reset cleanup flag when new products are fetched
          cleanupPerformedRef.current = false;
        }
      } catch (err) {
        console.error("Products error:", err);
      }
    }

    async function fetchLibraryAssets() {
      try {
        if (brandData && !assetLibraryLoaded && !assetLibraryLoading) {
          setAssetLibraryLoading(true);
          const assets = await ProductService.getLibraryAssets(
            brandData.brand_name
          );

          const newEnvAssets: { [id: string]: EnvAsset } = {};
          assets.forEach((asset) => {
            newEnvAssets[asset.id] = asset;
            assetLibraryRef.current[asset.id] = asset; // Use ref instead of local variable
          });
          
          setEnvAssets(newEnvAssets);
          setAssetLibraryLoaded(true);
        }
      } catch (err) {
        console.error("Products error:", err);
      }
    }

    async function fetchAssets() {
      try {
        if (brandData && !envItemsLoading && !envItemsLoaded) {
          const response = await AssetService.importAssetFiles(
            brandData.brand_name
          );

          const newEnvAssets: { [id: string]: EnvAsset } = {...assetLibraryRef.current};

          for (const asset of Object.values(response)) {
            newEnvAssets[asset.id] = {
              ...asset,
              isEnvironmentAsset: false,
            };
          }
          setEnvAssets(newEnvAssets);

          // Preload asset models
          Object.keys(envAssets).forEach((envAsset) => {
            if (envAssets[envAsset].type === "MODEL_3D")
              useGLTF.preload(envAssets[envAsset].src);
          });
          
          return newEnvAssets; // Return the loaded assets
        }
      } catch (err) {
        console.error("Assets error:", err);
      }
      return {}; // Return empty object on error
    }

    async function fetchEnvData(currentAssets: { [id: string]: EnvAsset }) {
      try {
        if (!envItemsLoaded && !envItemsLoading && brandData) {
          setEnvItemsLoading(true);
          await EnvStoreService.getEnvData(brandData.brand_name).then(
            (response) => {
              const newEnvProducts: { [id: number]: EnvProduct } = {};
              for (const envProduct of Object.values(response.envProducts)) {
                newEnvProducts[envProduct.id] = {
                  ...envProduct,
                  isEnvironmentProduct: true,
                };
                if (
                  envProduct.type === "MODEL_3D" &&
                  envProduct.modelIndex !== undefined
                ) {
                  useGLTF.preload(
                    products.find((product) => product.id === envProduct.id)
                      ?.models[envProduct.modelIndex].sources?.[0].url || ""
                  );
                }
                if (newEnvProducts[envProduct.id].placeHolderId === -1) {
                  newEnvProducts[envProduct.id].placeHolderId = undefined;
                }
              }

              const newEnvAssets: { [id: string]: EnvAsset } = {...currentAssets};

              for (const envAsset of Object.values(response.envAssets)) {
                const cleanId = envAsset.id.replace('.shackit.in', '');
                
                if (newEnvAssets[cleanId]) {
                  // Asset already exists (from library or personal), update it
                  newEnvAssets[cleanId] = {
                    ...newEnvAssets[cleanId], // Keep existing data
                    ...envAsset,             // Overlay env data
                    id: cleanId,               // Ensure clean ID
                    isEnvironmentAsset: true,  // Set as active
                  };
                } else {
                  // New asset from env data
                  newEnvAssets[cleanId] = {
                    ...envAsset,
                    id: cleanId,
                    isEnvironmentAsset: true,
                  };
                }
              }

              async function setResults() {
                setEnvProducts(newEnvProducts);
                setEnvAssets(newEnvAssets);
                
                // Compare final state after environment data is loaded
                try {
                  compareProductsWithEnvironment(products, newEnvProducts);
                } catch (error) {
                  console.error("Error during environment comparison:", error);
                }
                
                // Reset cleanup flag when environment data is loaded
                cleanupPerformedRef.current = false;
              }

              setResults().then(() => setEnvItemsLoaded(true));
            }
          );
        }
      } catch (err) {
        console.error("Env data error:", err);
      }
    }

    async function fetchModels() {
      // Preload asset models
      Object.values(envAssets).forEach((envAsset) => {
        if (envAsset.type === "MODEL_3D") useGLTF.preload(envAsset.src);
      });

      // Preload product models
      Object.values(envProducts).forEach((envProduct) => {
        if (
          envProduct.isEnvironmentProduct &&
          envProduct.type === "MODEL_3D" &&
          envProduct.modelIndex
        ) {
          useGLTF.preload(
            products.find((product) => product.id === envProduct.id)?.models[
              envProduct.modelIndex
            ].sources?.[0].url || ""
          );
        }
      });
    }

    (async () => {
      if (brandData && brandStatus === "VALID") {
        await fetchProducts();
        setProgress(myProgress > 24 ? myProgress : 24);
        await fetchLibraryAssets();
        setProgress(myProgress > 47 ? myProgress : 47);
        const currentAssets = await fetchAssets();
        setProgress(myProgress > 62 ? myProgress : 62);
        await fetchEnvData(currentAssets);
        setProgress(myProgress > 76 ? myProgress : 76);
        await fetchModels();
        setProgress(myProgress > 99 ? myProgress : 99);
        await new Promise(() => {
          setTimeout(() => setProgress(100), 800);
        }); // Delay to show fully loaded progress bar
      }
    })();
  }, [brandStatus]);

  // Compare products when both fetched and environment data are loaded
  useEffect(() => {
    const performComparisonAndCleanup = async () => {
      if (productsLoaded && envItemsLoaded && products.length > 0 && Object.keys(envProducts).length > 0 && !cleanupPerformedRef.current) {
        try {
          console.log("=== FINAL COMPARISON: Fetched Products vs Environment Products ===");
          compareProductsWithEnvironment(products, envProducts);
          
                  // Fix unavailable 3D models first
        const has3DModelFixes = fixUnavailable3DModels(products, envProducts);
        
        // Clean up orphaned products - only if there are orphaned products to clean
        const orphanedProductIds = Object.keys(envProducts).filter(id => 
          !products.some(product => product.id === parseInt(id))
        );
        if (orphanedProductIds.length > 0 || has3DModelFixes) {
          console.log(`🧹 Cleaning up ${orphanedProductIds.length} orphaned products and fixing 3D models...`);
          await cleanupOrphanedProducts(products, envProducts);
        }
          
          // Mark cleanup as performed to prevent infinite loops
          cleanupPerformedRef.current = true;
        } catch (error) {
          console.error("Error during product comparison:", error);
        }
      }
    };

    performComparisonAndCleanup();
  }, [productsLoaded, envItemsLoaded, products]); // Removed envProducts from dependencies

  return (
    <div id="container">
      {myProgress >= 100 ? (
        <UI />
      ) : (
        <Load progress={myProgress} />
      )}
      {myProgress >= 100 && (
        <div className="canvas-container">
          <Canvas camera={{ fov: 45 }} 
          gl={{
            toneMapping: environmentType && linearToneMappingEnvironments.includes(environmentType) ? LinearToneMapping : ACESFilmicToneMapping,
          }}
          shadows>
            <React.Suspense fallback={null}>
              {isAdvancedPerfVisible && <Perf position="top-right" />}
              <App />
            </React.Suspense>
          </Canvas>
        </div>
      )}

      {/* Tutorial Overlay - rendered at app level to appear above canvas */}
      {isTutorialOpen && (
        <TutorialOverlay
          url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          onClose={closeTutorial}
        />
      )}
    </div>
  );
}
