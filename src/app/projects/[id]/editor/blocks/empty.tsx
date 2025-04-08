import classes from '../blocks/blocks.module.css';

function Empty() {
  return (
    <div
      className={classes.base}
      style={{
        backgroundColor: '#4C97FF',
      }}
    >
      Empty Block
    </div>
  );
}

export default Empty;
