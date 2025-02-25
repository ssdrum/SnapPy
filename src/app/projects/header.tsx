'use client';

import {
  Box,
  Button,
  Group,
  Menu,
  Title,
  MenuTarget,
  MenuDropdown,
  MenuItem,
  Anchor,
  MenuDivider,
  MenuLabel,
} from '@mantine/core';
import { signOut } from 'next-auth/react';
import { IconLogout } from '@tabler/icons-react';

import classes from './header.module.css';

interface HeaderProps {
  userName: string;
  userEmail: string;
}

export default function Header({ userName, userEmail }: HeaderProps) {
  return (
    <Box mb={10}>
      <header className={classes.header}>
        <Group justify='space-between'>
          <Anchor href='/projects' underline='never'>
            <Title>Snap-Py</Title>
          </Anchor>

          <Menu width={200}>
            <MenuTarget>
              <Button>{userName}</Button>
            </MenuTarget>

            <MenuDropdown>
              <MenuLabel>{userEmail}</MenuLabel>

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
      </header>
    </Box>
  );
}
