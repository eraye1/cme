import { useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  Text, 
  Badge, 
  Stack,
  Group,
  List,
  Anchor,
  Loader,
  Alert
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { JurisdictionRequirement, requirementsApi, LicenseType } from '../../api/requirements';

interface RequirementsListProps {
  selectedStates: string[];
  selectedLicenseType: LicenseType | null;
  sortBy: 'state' | 'hours' | 'cycle';
  groupByLicense: boolean;
}

export function RequirementsList({ 
  selectedStates, 
  selectedLicenseType,
  sortBy,
  groupByLicense 
}: RequirementsListProps) {
  const [requirements, setRequirements] = useState<JurisdictionRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadRequirements();
  }, []);

  const loadRequirements = async () => {
    try {
      const data = await requirementsApi.getAll();
      setRequirements(data);
      setError(null);
    } catch (err) {
      setError('Failed to load requirements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequirements = requirements
    .filter((req) => {
      if (selectedStates.length > 0 && !selectedStates.includes(req.state)) {
        return false;
      }
      if (selectedLicenseType && req.licenseType !== selectedLicenseType) {
        return false;
      }
      
      if (searchQuery) {
        const search = searchQuery.toLowerCase();
        return (
          req.state.toLowerCase().includes(search) ||
          req.requirements.some(r => 
            r.categoryName.toLowerCase().includes(search) ||
            r.notes?.toLowerCase().includes(search)
          ) ||
          req.specialRequirements.some(r => 
            r.topic.toLowerCase().includes(search) ||
            r.description.toLowerCase().includes(search)
          )
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'hours':
          return b.totalHours - a.totalHours;
        case 'cycle':
          return b.cycleLength - a.cycleLength;
        default:
          return a.state.localeCompare(b.state);
      }
    });

  if (loading) return <Loader />;
  if (error) return (
    <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red">
      {error}
    </Alert>
  );

  if (filteredRequirements.length === 0) {
    return (
      <Alert color="blue">
        {selectedStates.length > 0 || selectedLicenseType 
          ? "No requirements found for the selected filters"
          : "Please select states and/or license type to view requirements"}
      </Alert>
    );
  }

  return (
    <Grid>
      {filteredRequirements.map((req) => (
        <Grid.Col xs={12} md={6} lg={4} key={req.id}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack spacing="xs">
              <Group position="apart">
                <Text size="lg" weight={500}>
                  {req.state} - {req.licenseType}
                </Text>
                {req.verified && (
                  <Badge color="green" variant="light">
                    Verified
                  </Badge>
                )}
              </Group>

              <Text size="sm" color="dimmed">
                {req.totalHours} hours every {req.cycleLength} months
              </Text>

              {req.requirements.length > 0 && (
                <Stack spacing="xs">
                  <Text weight={500}>Category Requirements</Text>
                  <List size="sm" spacing="xs">
                    {req.requirements.map((cat) => (
                      <List.Item key={cat.id}>
                        <Text>
                          {cat.categoryName}: {cat.requiredHours} hours required
                          {cat.maximumHours && ` (max ${cat.maximumHours} hours)`}
                        </Text>
                        {cat.notes && (
                          <Text size="xs" color="dimmed">
                            {cat.notes}
                          </Text>
                        )}
                      </List.Item>
                    ))}
                  </List>
                </Stack>
              )}

              {req.specialRequirements.length > 0 && (
                <Stack spacing="xs">
                  <Text weight={500}>Special Requirements</Text>
                  <List size="sm" spacing="xs">
                    {req.specialRequirements.map((special) => (
                      <List.Item key={special.id}>
                        <Group spacing="xs">
                          <Text>{special.topic}</Text>
                          {special.oneTime && (
                            <Badge size="sm" variant="dot">
                              One-time
                            </Badge>
                          )}
                        </Group>
                        <Text size="sm">
                          {special.requiredHours} hours - {special.description}
                        </Text>
                      </List.Item>
                    ))}
                  </List>
                </Stack>
              )}

              {req.legalCitations.length > 0 && (
                <Stack spacing="xs">
                  <Text weight={500}>Legal Citations</Text>
                  <List size="sm" spacing="xs">
                    {req.legalCitations.map((citation) => (
                      <List.Item key={citation.id}>
                        <Text>{citation.citation}</Text>
                        {citation.url && (
                          <Anchor 
                            href={citation.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            size="sm"
                          >
                            View Source
                          </Anchor>
                        )}
                      </List.Item>
                    ))}
                  </List>
                </Stack>
              )}
            </Stack>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
} 