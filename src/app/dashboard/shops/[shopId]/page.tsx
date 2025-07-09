'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GenericButton } from "@/components/ui/generic-button";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Store, 
  Package, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  ShoppingBag,
  TrendingUp,
  Star
} from 'lucide-react';
import { Shop } from '@/types/shop';
import { Product } from '@/types/product';
import { ShopService } from '@/app/services/shopServices';
import { toast } from 'sonner';
import { getUserDataFromLocalStorage } from '@/app/utils/middlewares/UserCredentions';
import axios from 'axios';

// Extended interfaces for shop profile
interface ExtendedShop extends Shop {
  sellerName?: string;
  sellerEmail?: string;
  productCount?: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  location?: string;
  rating?: number;
  totalSales?: number;
}

interface ShopStats {
  totalProducts: number;
  totalSales: number;
  averageRating: number;
  totalOrders: number;
}

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const shopId = params.shopId as string;
  
  const [shop, setShop] = useState<ExtendedShop | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [stats, setStats] = useState<ShopStats>({
    totalProducts: 0,
    totalSales: 0,
    averageRating: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchShopAndProducts = async () => {
      setLoading(true);
      try {
        const USER = getUserDataFromLocalStorage();
        const authToken = USER?.token;
        if (!authToken) {
          toast.error('Authentication required');
          setLoading(false);
          return;
        }
        // Fetch shop details (real API)
        const shopData = await ShopService.getShopById(shopId);
        setShop({
          ...shopData,
          sellerName: shopData.seller?.businessName || '',
          status: shopData.isActive ? 'active' : 'inactive',
          createdAt: shopData.createdAt || new Date().toISOString(),
        });
        // Fetch products for this sellerId
        let sellerId = shopData.seller?.sellerId || shopData.seller?.id;
        let fetchedProducts: any[] = [];
        if (sellerId) {
          setProductsLoading(true);
          try {
            const { products } = await ShopService.getProductsBySellerId(sellerId, 1, 10, authToken);
            setProducts(products);
            fetchedProducts = products;
          } catch (err) {
            console.error('Failed to fetch products:', err);
            setProducts([]);
            fetchedProducts = [];
          } finally {
            setProductsLoading(false);
          }
        } else {
          setProducts([]);
          fetchedProducts = [];
        }
        setStats((prev) => ({
          ...prev,
          totalProducts: fetchedProducts.length,
        }));
      } catch (error) {
        console.error('Failed to fetch shop details:', error);
        toast.error('Failed to fetch shop details');
        setShop(null);
      } finally {
        setLoading(false);
      }
    };
    if (shopId) {
      fetchShopAndProducts();
    }
  }, [shopId]);

 
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading shop details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="p-6">
        <div className="text-center">
          <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600">Shop not found</h2>
          <p className="text-gray-500 mt-2">The shop you're looking for doesn't exist.</p>
          <GenericButton 
            onClick={() => router.push('/dashboard/shops')}
            className="mt-4"
          >
            Back to Shops
          </GenericButton>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <GenericButton
            variant="outline"
            onClick={() => router.push('/dashboard/shops')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shops
          </GenericButton>
          <div>
            <h1 className="text-2xl font-semibold">{shop.name}</h1>
            <p className="text-sm text-gray-500">Shop Profile</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Removed approve, edit, and delete buttons for admin read-only view */}
        </div>
      </div>

      {/* Shop Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-xl font-semibold">{stats.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Sales</p>
                <p className="text-xl font-semibold">{formatCurrency(stats.totalSales)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Rating</p>
                <p className="text-xl font-semibold">{stats.averageRating}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-xl font-semibold">{stats.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shop Details */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Store className="w-5 h-5" />
                <span>Shop Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {shop.logo ? (
                    <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
                  ) : (
                    <Store className="w-8 h-8 text-gray-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{shop.name}</h3>
                  <p className="text-sm text-gray-500">{shop.slug}</p>
                  {getStatusBadge(shop.status)}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Seller</p>
                    <p className="text-sm text-gray-600">{shop.seller?.businessName || ''}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-gray-600">{shop.phone || ''}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-gray-600">{shop.location || ''}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-gray-600">{formatDate(shop.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-gray-600">{shop.description || ''}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="border-b">
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Shop Overview</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Created At</p>
                          <p className="text-base">{formatDate(shop.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <p className="text-base">{shop.status}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Products Count</p>
                          <p className="text-base">{stats.totalProducts}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="products" className="p-6">
                  <ProductsTab products={products} loading={productsLoading} />
                </TabsContent>

                <TabsContent value="analytics" className="p-6">
                  <div className="h-64 flex items-center justify-center">
                    {/* Placeholder chart, replace with real chart if you have data */}
                    <p>Analytics chart coming soon...</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

function ProductsTab({ products, loading }: { products: any[]; loading: boolean }) {
  if (loading) return <div>Loading products...</div>;
  if (!products.length) return <div>No products found for this shop.</div>;
  return (
    <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-2">
      {products.map(product => (
        <div key={product.id} className="flex items-center gap-3 p-2 border rounded-md shadow-sm bg-white">
          <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-base">{product.name}</h4>
            <p className="text-xs text-gray-500">Price: ${product.price}</p>
            <p className="text-xs text-gray-500">Stock: {product.inventory}</p>

          </div>
        </div>
      ))}
    </div>
  );
}

export default Page; 