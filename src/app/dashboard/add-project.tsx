import { createProject } from '@/app/lib/data';
import { revalidatePath } from 'next/cache';

export default function AddProject() {
  // Write to db using server actions
  async function handleSubmit(formData: FormData) {
    'use server';

    const name = formData.get('name') as string;
    await createProject(name);
    revalidatePath('/dashboard'); // Update UI with new data
  }

  return (
    <form action={handleSubmit}>
      <input type='text' name='name' placeholder='Enter name'></input>
      <button type='submit'>Create Project</button>
    </form>
  );
}
