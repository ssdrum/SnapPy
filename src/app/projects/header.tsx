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
import Image from 'next/image';

import classes from './header.module.css';

interface HeaderProps {
  session: Session;
}

export default function Header({ session }: HeaderProps) {
  const { name, email } = session;

  return (
    <div className={classes.container}>
      <Group justify='space-between'>
        <Anchor href='/projects' underline='never'>
          <Group align='center'>
            <Image
              src='/block-svgrepo-com.svg'
              width={50}
              height={50}
              alt='SnapPy'
            ></Image>

            <Title c='black'>SnapPy</Title>
          </Group>
        </Anchor>

        <Menu width={220}>
          <MenuTarget>
            <UnstyledButton className={classes.user}>
              <Group gap={7}>
                <Avatar
                  key={name}
                  alt={name}
                  name={name}
                  color='initials'
                  size={30}
                />
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
