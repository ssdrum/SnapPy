import withBlock from '../components/with-block';
import classes from './blocks.module.css';

function Number() {
  return <input type='text' className={classes.inputText} />;
}

export default withBlock(Number);
