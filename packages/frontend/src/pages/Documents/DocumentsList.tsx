import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Text, Group, Badge, Stack, ActionIcon, Center, Paper, Button } from '@mantine/core';
import { IconDownload, IconTrash, IconEdit } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { documentsApi } from '../../api/documents';
import { useAuth } from '../../features/auth/AuthContext';
import { ProcessingStatus } from '../../types';
import { useState } from 'react';
import { DocumentEditModal } from './DocumentEditModal';
import { modals } from '@mantine/modals';

interface DocumentsListProps {
  onEditDocument: (id: string) => void;
  editingDocument: string | null;
  onCloseEdit: () => void;
}

export function DocumentsList({ onEditDocument, editingDocument, onCloseEdit }: DocumentsListProps) {
  const { state: { user } } = useAuth();
  const queryClient = useQueryClient();

  const { data: documents, isLoading, error } = useQuery({
    queryKey: ['documents', user?.id],
    queryFn: () => user ? documentsApi.getByUser(user.id) : Promise.resolve([]),
    enabled: !!user,
  });

  const updateDocument = useMutation({
    mutationFn: documentsApi.update,
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Document updated successfully',
        color: 'green',
      });
      queryClient.invalidateQueries({ queryKey: ['documents', user?.id] });
    },
  });

  const deleteDocument = useMutation({
    mutationFn: (documentId: string) => {
      return documentsApi.delete(documentId);
    },
    onSuccess: () => {
      notifications.show({
        title: 'Success',
        message: 'Document deleted successfully',
        color: 'green',
      });
      queryClient.invalidateQueries({ queryKey: ['documents', user?.id] });
    },
    onError: (error) => {
      throw error;
    },
  });

  const handleDelete = (id: string, fileName: string) => {
    modals.openConfirmModal({
      title: 'Delete Document',
      children: (
        <Text size="sm">
          Are you sure you want to delete "{fileName}"? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteDocument.mutateAsync(id);
        } catch (error) {
        }
      },
    });
  };

  const handleDownload = async (id: string, fileName: string) => {
    try {
      await documentsApi.download(id);
    } catch (error) {
      notifications.show({
        title: 'Download Failed',
        message: 'Failed to download document. Please try again.',
        color: 'red',
      });
    }
  };

  if (isLoading) {
    return (
      <Paper p="xl" withBorder>
        <Center>
          <Text>Loading documents...</Text>
        </Center>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper p="xl" withBorder>
        <Center>
          <Text c="red">Error loading documents. Please try again later.</Text>
        </Center>
      </Paper>
    );
  }

  if (!documents?.length) {
    return (
      <Paper p="xl" withBorder>
        <Center>
          <Stack align="center" spacing="xs">
            <Text size="lg">No documents uploaded yet</Text>
            <Text size="sm" c="dimmed">Upload your first document using the button above</Text>
          </Stack>
        </Center>
      </Paper>
    );
  }

  const getStatusColor = (status: ProcessingStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'green';
      case 'PROCESSING':
        return 'yellow';
      case 'FAILED':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <>
      <Stack>
        {documents?.map((doc) => (
          <Card key={doc.id} withBorder>
            <Group justify="space-between" align="flex-start">
              <div>
                <Text fw={500}>{doc.title || doc.fileName}</Text>
                <Group gap="xs" mb={8}>
                  {doc.category && (
                    <Badge variant="light" color="blue">
                      {doc.category.replace(/_/g, ' ')}
                    </Badge>
                  )}
                  {doc.credits && (
                    <Badge variant="light">
                      {doc.credits} Credits
                    </Badge>
                  )}
                  <Badge color={getStatusColor(doc.status)}>
                    {doc.status}
                  </Badge>
                </Group>

                <Text size="sm" c="dimmed">
                  Uploaded on {new Date(doc.createdAt).toLocaleDateString()}
                </Text>
                <Text size="sm" c="dimmed">
                  Completed on {new Date(doc.completedDate).toLocaleDateString()}
                </Text>
                {doc.provider && (
                  <Text size="sm">Provider: {doc.provider}</Text>
                )}

                {doc.specialRequirements?.length > 0 && (
                  <Group gap="xs" mt={8}>
                    {doc.specialRequirements.map((req) => (
                      <Badge 
                        key={req} 
                        variant="dot" 
                        color="green"
                        size="sm"
                      >
                        {req.replace(/_/g, ' ').toLowerCase()
                          .replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </Group>
                )}

                {doc.topics?.length > 0 && (
                  <Group gap="xs" mt={8}>
                    {doc.topics.map((topic) => (
                      <Badge 
                        key={topic} 
                        variant="outline" 
                        color="gray"
                        size="sm"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </Group>
                )}

                {doc.description && (
                  <Text size="sm" mt={4}>Description: {doc.description}</Text>
                )}
                {doc.notes && (
                  <Text size="sm" mt={4} c="dimmed">Notes: {doc.notes}</Text>
                )}
                {doc.error && (
                  <Text size="sm" c="red" mt={4}>
                    Error: {doc.error}
                  </Text>
                )}
              </div>

              <Group>
                <ActionIcon
                  variant="light"
                  onClick={() => handleDownload(doc.id, doc.fileName)}
                  disabled={doc.status === 'PROCESSING'}
                  title="Download document"
                >
                  <IconDownload size="1rem" />
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  color="blue"
                  onClick={() => onEditDocument(doc.id)}
                  title="Edit details"
                >
                  <IconEdit size="1rem" />
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => {
                    handleDelete(doc.id, doc.fileName);
                  }}
                  loading={deleteDocument.isPending && deleteDocument.variables === doc.id}
                  disabled={doc.status === 'PROCESSING'}
                  title="Delete document"
                >
                  <IconTrash size="1rem" />
                </ActionIcon>
              </Group>
            </Group>
          </Card>
        ))}
      </Stack>

      <DocumentEditModal
        opened={!!editingDocument}
        onClose={onCloseEdit}
        onSave={async (values) => {
          if (!editingDocument) return;
          await updateDocument.mutateAsync({
            id: editingDocument,
            ...values,
          });
        }}
        initialData={documents?.find(d => d.id === editingDocument)}
        documentId={editingDocument!}
      />
    </>
  );
} 