import React, { useEffect, useState } from 'react';
import ProductCard from '@/app/(components)/ProductCard';
import { productService } from '@/app/services/productServices';
import { useTranslations } from '@/app/hooks/useTranslations';
import { dashboardFakes } from '@/app/utils/fakes/DashboardFakes';

interface RelatedProductsProps {
  category: string; // category slug
  productId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ category, productId }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslations();

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    setError(null);
    productService.getProductsByCategorySlug(category, 1, 10)
      .then(products => {
        // Filter out the current product
        const filtered = products.filter((p: any) => p.id !== productId);
        setProducts(filtered);
      })
      .catch(() => setError('Failed to load related products.'))
      .finally(() => setLoading(false));
  }, [category, productId]);

  return (
    <div className="w-[100%] sm:w-[100%] mt-[50px]">
      <h2 className="font-bold text-2xl">{t(dashboardFakes.relatedProducts.title)}</h2>
      <div className="flex gap-3 mt-5 overflow-x-auto flex-nowrap sm:flex-wrap scrollbar-hide">
        {loading ? (
          <p>{t(dashboardFakes.relatedProducts.loading)}</p>
        ) : error ? (
          <p className="text-red-500 w-full flex self-center">{t(dashboardFakes.relatedProducts.error)}</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="min-w-[250px] flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <p className="text-red-500 w-full flex self-center">
            {t(dashboardFakes.relatedProducts.none)}
          </p>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;