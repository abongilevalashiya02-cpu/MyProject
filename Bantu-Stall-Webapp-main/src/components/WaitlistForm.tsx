
import React, { useState } from 'react';
import WaitlistFormDialog from './waitlist/WaitlistFormDialog';

const WaitlistForm = () => {
  const [open, setOpen] = useState(false);

  return <WaitlistFormDialog open={open} setOpen={setOpen} />;
};

export default WaitlistForm;
