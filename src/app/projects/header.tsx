'use client';

import {
  Group,
  Menu,
  Title,
  MenuTarget,
  MenuDropdown,
  MenuItem,
  Anchor,
  MenuDivider,
  MenuLabel,
  UnstyledButton,
  Text,
  Avatar,
} from '@mantine/core';
import { signOut } from 'next-auth/react';
import { IconChevronDown, IconLogout } from '@tabler/icons-react';
import { Session } from '@/app/lib/session';

import classes from './header.module.css';

interface HeaderProps {
  session: Session;
}

export default function Header({ session }: HeaderProps) {
  const { name, email, image } = session;

  return (
    <div className={classes.container}>
      <Group justify='space-between'>
        <Anchor href='/projects' underline='never'>
          <Title>Snap-Py</Title>
        </Anchor>

        <Menu width={220}>
          <MenuTarget>
            <UnstyledButton className={classes.user}>
              <Group gap={7}>
                <Avatar src={image} alt={name} size={30} />
                <Text fw={500} size='sm' lh={1} mr={3}>
                  {name}
                </Text>
                <IconChevronDown size={12} stroke={1.5} />
              </Group>
            </UnstyledButton>
          </MenuTarget>

          <MenuDropdown>
            <MenuLabel>{email}</MenuLabel>

            <MenuDivider />

            <MenuItem
              color='red'
              onClick={() => signOut()}
              leftSection={<IconLogout />}
            >
              Log Out
            </MenuItem>
          </MenuDropdown>
        </Menu>
      </Group>
    </div>
  );
}
