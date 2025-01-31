import { useDroppable } from '@dnd-kit/core';

export default function Bin() {
  const { setNodeRef } = useDroppable({ id: 'bin' });

  const style: React.CSSProperties = {
    width: '100%',
    height: '80px',
    backgroundColor: '#ff4d4d', // Softer red
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '15px',
  };

  return (
    <div ref={setNodeRef} style={style}>
      bin
    </div>
  );
}
