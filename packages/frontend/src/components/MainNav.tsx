import { NavLink } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import {
  IconDashboard,
  IconCertificate,
  IconFiles,
  IconClipboardList,
} from '@tabler/icons-react';

interface MainNavProps {
  onNavigate?: () => void;
}

export function MainNav({ onNavigate }: MainNavProps) {
  const location = useLocation();

  const links = [
    { icon: IconDashboard, label: 'Dashboard', to: '/app' },
    { icon: IconCertificate, label: 'Credits', to: '/app/credits' },
    { icon: IconFiles, label: 'Documents', to: '/app/documents' },
    { icon: IconClipboardList, label: 'Requirements', to: '/app/requirements' },
  ];

  return (
    <nav>
      {links.map((link) => (
        <NavLink
          key={link.to}
          component={Link}
          to={link.to}
          label={link.label}
          leftSection={<link.icon size="1rem" stroke={1.5} />}
          active={
            link.to === '/app'
              ? location.pathname === '/app'
              : location.pathname.startsWith(link.to)
          }
          onClick={onNavigate}
        />
      ))}
    </nav>
  );
} 