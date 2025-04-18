import { IconShare } from '@tabler/icons-react';
import { Button } from '@mantine/core';
import { generateShareLink } from '../utils/actions';

interface CollaborateButtonProps {
  projectId: string;
}

export default function CollaborateButton({
  projectId,
}: CollaborateButtonProps) {
  const handleClick = async () => {
    const result = await generateShareLink(projectId);

    console.log(result);
  };

  return (
    <Button bg='violet' leftSection={<IconShare />} onClick={handleClick}>
      Collaborate
    </Button>
  );
}
