import { Stack, Title, Group, Button, Modal, Text, Loader } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useState } from 'react';
import { DocumentUpload } from './DocumentUpload';
import { DocumentsList } from './DocumentsList';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useAuth } from '../../features/auth/AuthContext';
import { DocumentEditModal } from './DocumentEditModal';
import { Document, ProcessingStatus } from '../../types';
import { documentsApi } from '../../api/documents';
import { notifications } from '@mantine/notifications';

export function Documents() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<string | null>(null);
  const [processingDocument, setProcessingDocument] = useState<Document | null>(null);
  const queryClient = useQueryClient();
  const { state: { user } } = useAuth();

  // Add query for documents
  const { data: documents } = useQuery({
    queryKey: ['documents', user?.id],
    queryFn: () => user ? documentsApi.getByUser(user.id) : Promise.resolve([]),
    enabled: !!user,
  });

  const waitForProcessing = async (documentId: string): Promise<Document> => {
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      // Force a fresh fetch instead of using cache
      const documents = await documentsApi.getByUser(user!.id);
      const document = documents.find(d => d.id === documentId);
      
      if (!document) throw new Error('Document not found');
      
      if (document.status === ProcessingStatus.COMPLETED || 
          document.status === ProcessingStatus.FAILED) {
        return document;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }
    
    throw new Error('Document processing timed out');
  };

  const handleUploadSuccess = async (document: Document) => {
    setUploadModalOpen(false); // Close upload modal first
    setProcessingDocument(document);
    
    try {
      // Wait for processing to complete
      const processedDoc = await waitForProcessing(document.id);
      
      // Refresh the documents list
      await queryClient.invalidateQueries({ queryKey: ['documents', user?.id] });
      
      if (processedDoc.status === ProcessingStatus.COMPLETED) {
        setProcessingDocument(null);
        setEditingDocument(processedDoc.id);
      } else {
        notifications.show({
          title: 'Processing Failed',
          message: processedDoc.error || 'Failed to process document',
          color: 'red',
        });
        setProcessingDocument(null);
      }
    } catch (error) {
      console.error('Error waiting for document processing:', error);
      notifications.show({
        title: 'Processing Error',
        message: error instanceof Error ? error.message : 'Failed to process document',
        color: 'red',
      });
      setProcessingDocument(null);
    }
  };

  return (
    <Stack spacing="lg">
      <Group justify="space-between" align="center">
        <Title order={1}>Documents</Title>
        <Button 
          leftSection={<IconUpload size="1rem" />}
          onClick={() => setUploadModalOpen(true)}
        >
          Upload Document
        </Button>
      </Group>

      <DocumentsList 
        onEditDocument={setEditingDocument}
        editingDocument={editingDocument}
        onCloseEdit={() => setEditingDocument(null)}
      />

      {/* Upload Modal */}
      <Modal
        opened={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload CME Document"
        size="lg"
      >
        <DocumentUpload onSuccess={handleUploadSuccess} />
      </Modal>

      {/* Processing Modal */}
      <Modal
        opened={!!processingDocument}
        onClose={() => {}} // Prevent closing during processing
        title="Processing Document"
        size="sm"
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
      >
        <Stack align="center" py="md">
          <Loader size="lg" />
          <Text>Analyzing document: {processingDocument?.fileName}</Text>
          <Text size="sm" c="dimmed">This may take a few moments...</Text>
        </Stack>
      </Modal>

      {/* Edit Modal */}
      {editingDocument && documents && (
        <DocumentEditModal
          opened={!!editingDocument}
          onClose={() => setEditingDocument(null)}
          onSave={async (values) => {
            if (!editingDocument) return;
            await documentsApi.update({
              id: editingDocument,
              ...values,
            });
            queryClient.invalidateQueries({ queryKey: ['documents', user?.id] });
            setEditingDocument(null);
          }}
          initialData={documents.find(d => d.id === editingDocument)}
          documentId={editingDocument}
        />
      )}
    </Stack>
  );
}

export default Documents; 