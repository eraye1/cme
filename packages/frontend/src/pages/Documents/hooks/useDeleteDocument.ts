import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '../../../api/documents';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../../../features/auth/AuthContext';

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  const { state: { user } } = useAuth();

  return useMutation({
    mutationFn: documentsApi.delete,
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Document deleted successfully',
        color: 'green',
      });
      queryClient.invalidateQueries({ queryKey: ['documents', user?.id] });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to delete document',
        color: 'red',
      });
    },
  });
} 