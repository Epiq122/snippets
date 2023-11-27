'use server';
import { db } from '@/db';
import { redirect } from 'next/navigation';

export async function editSnippet(id: number, code: string) {
  await db.snippet.update({
    where: { id },
    data: { code },
  });
  redirect(`/snippets/${id}`);
}

export async function deleteSnippet(id: number) {
  await db.snippet.delete({ where: { id } });
  redirect(`/`);
}

export async function createSnippet(
  formState: { message: string },
  formData: FormData,
) {
  try {
    // check the users inputs and make sure they're valid
    const title = formData.get('title') as string;
    const code = formData.get('code') as string;

    // form validation checks
    if (typeof title !== 'string' || title.length < 3) {
      return {
        message: 'Title must be at least 3 characters long',
      };
    }
    if (typeof code !== 'string' || code.length < 10) {
      return {
        message: 'Code must be at least 10 characters long',
      };
    }

    // create a new record in the db
    const snippet = await db.snippet.create({
      data: {
        title,
        code,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        message: err.message,
      };
    } else {
      return {
        message: 'Something went wrong',
      };
    }
  }

  // redirect the user back to the root route
  redirect('/');
}
