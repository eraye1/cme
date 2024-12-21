import { Text, Paper, Container, Title, Button, Stack, Checkbox, Group, List } from '@mantine/core';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { termsApi } from '../../api/terms';
import { notifications } from '@mantine/notifications';

export function TermsOfService() {
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/app';

  const handleAccept = async () => {
    try {
      setIsSubmitting(true);
      await termsApi.acceptTerms();
      localStorage.setItem('tosAccepted', 'true');
      localStorage.setItem('tosAcceptedAt', new Date().toISOString());
      localStorage.setItem('tosVersion', '1.0');
      navigate(from, { replace: true });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to record terms acceptance. Please try again.',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Stack gap="lg">
          <Title order={2}>Terms of Service</Title>
          
          <Paper h={400} p="md" withBorder style={{ overflowY: 'auto' }}>
          <Text size="sm" mb="md" weight={700}>Last Updated: December 21st, 2024</Text>
            <Text weight={700} mb="xs">1. Introduction and Acceptance</Text>
            <Text mb="lg" size="sm">
            Welcome to CME Tracker ("Service"). By accessing or using this Service, you agree to be bound by these Terms of Service. This Service is intended for licensed medical professionals in the United States. If you do not agree to these terms, please do not use the Service.
            </Text>

            <Text weight={700} mb="xs">2. Professional Responsibility Disclaimer</Text>
            <Text mb="lg" size="sm">
            While our Service assists in tracking Continuing Medical Education (CME) credits, you acknowledge that:
            <List size="sm" mt="xs">
                <List.Item>You remain solely responsible for maintaining your medical license and meeting all CME requirements</List.Item>
                <List.Item>It is your responsibility to verify the accuracy of all CME records</List.Item>
                <List.Item>This Service does not guarantee compliance with state medical board requirements</List.Item>
                <List.Item>You should maintain independent records of your CME activities</List.Item>
            </List>
            </Text>

            <Text weight={700} mb="xs">3. Data Accuracy and Verification</Text>
            <Text mb="lg" size="sm">
            You agree to:
            <List size="sm" mt="xs">
                <List.Item>Provide accurate and complete information about your CME activities</List.Item>
                <List.Item>Review all automatically processed CME data for accuracy</List.Item>
                <List.Item>Promptly report any discrepancies or errors in credit calculations</List.Item>
                <List.Item>Maintain original certificates and documentation of completed CME activities</List.Item>
            </List>
            </Text>

            <Text weight={700} mb="xs">4. Privacy and Data Security</Text>
            <Text mb="lg" size="sm">
            We implement reasonable security measures to protect your information. However:
            <List size="sm" mt="xs">
                <List.Item>We are not a HIPAA-covered entity for the purposes of this Service</List.Item>
                <List.Item>You agree not to upload any protected health information (PHI)</List.Item>
                <List.Item>You are responsible for maintaining the confidentiality of your account credentials</List.Item>
                <List.Item>You must notify us immediately of any unauthorized access</List.Item>
            </List>
            </Text>

            <Text weight={700} mb="xs">5. Limitation of Liability</Text>
            <Text mb="lg" size="sm">
            To the fullest extent permitted by law:
            <List size="sm" mt="xs">
                <List.Item>We are not liable for any licensing issues, missed deadlines, or non-compliance with CME requirements</List.Item>
                <List.Item>Our liability is limited to the amount paid for the Service in the 12 months preceding any claim</List.Item>
                <List.Item>We are not liable for any consequential, incidental, or special damages</List.Item>
                <List.Item>We do not guarantee uninterrupted access to the Service</List.Item>
            </List>
            </Text>

            <Text weight={700} mb="xs">6. Data Retention and Backup</Text>
            <Text mb="lg" size="sm">
            You acknowledge that:
            <List size="sm" mt="xs">
                <List.Item>We maintain records for up to 7 years from the date of CME completion</List.Item>
                <List.Item>You are responsible for maintaining backup copies of your CME certificates</List.Item>
                <List.Item>We may delete inactive accounts after 36 months of non-use</List.Item>
                <List.Item>You should export your data before closing your account</List.Item>
            </List>
            </Text>

            <Text weight={700} mb="xs">7. Service Modifications and Updates</Text>
            <Text mb="lg" size="sm">
            We reserve the right to:
            <List size="sm" mt="xs">
                <List.Item>Modify or discontinue any part of the Service with reasonable notice</List.Item>
                <List.Item>Update these terms with 30 days notice for material changes</List.Item>
                <List.Item>Require acceptance of updated terms for continued Service use</List.Item>
            </List>
            </Text>

            <Text weight={700} mb="xs">8. Governing Law and Jurisdiction</Text>
            <Text mb="lg" size="sm">
            These terms are governed by the laws of the State of Delaware. Any disputes shall be resolved in the courts of Delaware, and you consent to personal jurisdiction in these courts.
            </Text>

            <Text weight={700} mb="xs">9. Indemnification</Text>
            <Text mb="lg" size="sm">
            You agree to indemnify and hold harmless our company, its officers, directors, employees, and agents from any claims, damages, or expenses arising from:
            <List size="sm" mt="xs">
                <List.Item>Your use of the Service</List.Item>
                <List.Item>Any violation of these terms</List.Item>
                <List.Item>Any inaccurate information you provide</List.Item>
                <List.Item>Any licensing or compliance issues related to your CME requirements</List.Item>
            </List>
            </Text>

            <Text weight={700} mb="xs">10. Severability and Waiver</Text>
            <Text mb="lg" size="sm">
            If any provision of these terms is found to be unenforceable, the remaining provisions will remain in effect. No waiver of any term shall be deemed a further or continuing waiver of such term.
            </Text>
          </Paper>

          <Group>
            <Checkbox
              checked={accepted}
              onChange={(e) => setAccepted(e.currentTarget.checked)}
              label="I have read and agree to the Terms of Service"
            />
          </Group>

          <Group justify="flex-end">
            <Button 
              onClick={handleAccept} 
              disabled={!accepted || isSubmitting}
              loading={isSubmitting}
            >
              Accept & Continue
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
} 