import withBlock from '../components/with-block';
import { IconPlayerPlayFilled } from '@tabler/icons-react';

function ProgramStart() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <IconPlayerPlayFilled
        size={20}
        stroke={2.5}
        style={{ color: '#25A244' }} // Green play icon
      />
      <span>start</span>
    </div>
  );
}

export default withBlock(ProgramStart);
