import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CreateProductInput } from '../app/utils/middlewares/Validation';

export function useCreateProduct() {
  return useMutation({
    mutationFn: async (data: CreateProductInput) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Creating product:', data);
      return { success: true, data };
    },
    onSuccess: () => {
      toast.success('Product created successfully!');
    },
    onError: () => {
      toast.error('Failed to create product');
    },
  });
}