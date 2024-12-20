import { Group, Text, useMantineTheme, rem, Stack, Box, List } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { IconUpload, IconX, IconFile, IconCircleCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../../features/auth/AuthContext';
import { documentsApi } from '../../api/documents';
import { useState } from 'react';
import { Document } from '../../types';

interface DocumentUploadProps {
  onSuccess: (document: Document) => void;
}

export function DocumentUpload({ onSuccess }: DocumentUploadProps) {
  const theme = useMantineTheme();
  const { state: { user } } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleDrop = async (files: FileWithPath[]) => {
    if (!user || uploading || !files.length) return;

    const file = files[0];
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const document = await documentsApi.upload(user.id, formData);
      notifications.show({
        title: 'Success',
        message: 'Document uploaded successfully',
        color: 'green',
      });
      onSuccess(document);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to upload document',
        color: 'red',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box p="md">
      <Stack spacing="md">
        <Stack spacing="xs">
          <Text fw={500}>Accepted CME Documentation:</Text>
          <List
            spacing="xs"
            size="sm"
            c="dimmed"
            icon={
              <IconCircleCheck
                style={{ width: rem(16), height: rem(16) }}
                color={theme.colors.blue[6]}
              />
            }
          >
            <List.Item>Receipts of CME activities</List.Item>
            <List.Item>CME certificates</List.Item>
            <List.Item>Conference attendance certificates</List.Item>
            <List.Item>CME transcripts from organizations</List.Item>
            <List.Item>Hospital CME activity records</List.Item>
          </List>

          <Text size="sm" c="dimmed" mt={5}>
            Supported formats: PDF, JPG, PNG (max 5MB)
          </Text>
        </Stack>
        
        <Dropzone
          onDrop={handleDrop}
          maxSize={5 * 1024 ** 2}
          accept={['application/pdf', 'image/jpeg', 'image/png']}
          loading={uploading}
          multiple={false}
          styles={(theme) => ({
            root: {
              borderWidth: 2,
              padding: theme.spacing.xl,
            }
          })}
        >
          <Stack align="center" spacing="xs" style={{ pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <IconUpload
                style={{ width: rem(52), height: rem(52), color: theme.colors.blue[6] }}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                style={{ width: rem(52), height: rem(52), color: theme.colors.red[6] }}
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconFile
                style={{ width: rem(52), height: rem(52), color: theme.colors.dimmed }}
                stroke={1.5}
              />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline fw={700} ta="center">
                {uploading ? 'Uploading...' : 'Drag documents here'}
              </Text>
              <Text size="sm" c="dimmed" ta="center" mt={7}>
                or click to browse files
              </Text>
            </div>
          </Stack>
        </Dropzone>
      </Stack>
    </Box>
  );
} 