'use client';

import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Email } from '@/lib/types';
import { useConfig } from '@/lib/config-context';
import { addEmail, deleteEmail, updateEmail } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';

export default function EmailTable({ emails }: { emails: Email[] }) {
  const { source } = useConfig();
  const [modfifiedEmails, setModifiedEmails] = useState<Email[]>([]);
  const [hasNewEmail, setHasNewEmail] = useState(false);

  useEffect(() => {
    setModifiedEmails(emails);
  }, [emails]);

  const addNewEntry = () => {
    if (!source) return;

    const newEntry: Email = {
      name: '',
      email: '',
      settings: {
        cat3: false,
        cat2c: false,
        cat2b: false,
        cat2a: false,
        cat1: false,
      },
      source: source,
      id: 'fake-id',
    };
    setModifiedEmails([...modfifiedEmails, newEntry]);
    setHasNewEmail(true);
  };

  const addEntry = async (id: string) => {
    const email = modfifiedEmails.find((email) => email.id === id);

    if (!email || !email.email || !validateEmail(email.email)) {
      toast({
        title: 'Add email',
        description: 'Please enter a valid email address.',
      });
      return;
    }

    if (!source) return;

    try {
      const response = await addEmail(source, email as Email);
      if (response) {
        // update the fake id with the real id
        setModifiedEmails(
          modfifiedEmails.map((email) => {
            if (email.id === 'fake-id') {
              return { ...email, id: response.id };
            }
            return email;
          }),
        );
        toast({
          title: 'Add email',
          description: 'Email added successfully.',
        });
        setHasNewEmail(false);
      }
    } catch (error) {
      console.error('Failed to add entry:', error);
    }
  };

  const updateEntry = async (id: string) => {
    if (!source) return;
    // In a real application, this would make an API call
    // find email by id
    const email = modfifiedEmails.find((email) => email.id === id);
    try {
      const response = await updateEmail(email as Email);
      if (response) {
        toast({
          title: 'Update email',
          description: 'Email updated successfully.',
        });
      }
    } catch (error) {
      console.error('Failed to update entry:', error);
    }
  };

  const deleteEntry = async (id: string) => {
    if (!source) return;

    try {
      await deleteEmail(id);

      toast({
        title: 'Delete event',
        description: 'Event deleted successfully.',
      });
      setModifiedEmails(modfifiedEmails.filter((email) => email.id !== id));
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  const removeNewEntry = () => {
    setModifiedEmails(modfifiedEmails.slice(0, -1));
    setHasNewEmail(false);
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const updateField = (id: string, field: string, value: string) => {
    setModifiedEmails(
      modfifiedEmails.map((email) => {
        if (email.id === id) {
          return { ...email, [field]: value };
        }
        return email;
      }),
    );
  };

  const updateCategory = (
    id: string,
    category: keyof Email['settings'],
    checked: boolean,
  ) => {
    setModifiedEmails(
      modfifiedEmails.map((email) => {
        if (email.id === id) {
          return {
            ...email,
            settings: {
              ...email.settings,
              [category]: checked,
            },
          };
        }
        return email;
      }),
    );
  };

  return (
    <div className="space-y-4 rounded-lg bg-slate-900 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Email</h2>
        <Button
          onClick={addNewEntry}
          className="bg-cyan-500 text-white hover:bg-cyan-600"
          disabled={hasNewEmail}
        >
          <Plus className="mr-2 h-4 w-4" />
          New email
        </Button>
      </div>
      <div className="rounded-md border border-slate-700">
        <Table>
          <TableHeader className="bg-slate-700">
            <TableRow>
              <TableHead className="font-medium text-white">Name</TableHead>
              <TableHead className="font-medium text-white">Email</TableHead>
              <TableHead className="font-medium text-white">Cat. 3</TableHead>
              <TableHead className="font-medium text-white">Cat. 2c</TableHead>
              <TableHead className="font-medium text-white">Cat. 2b</TableHead>
              <TableHead className="font-medium text-white">Cat. 2a</TableHead>
              <TableHead className="font-medium text-white">Cat. 1</TableHead>
              <TableHead className="font-medium text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modfifiedEmails.map((email) => (
              <TableRow key={email.id}>
                <TableCell>
                  <Input
                    value={email.name}
                    onChange={(e) =>
                      updateField(email.id!, 'name', e.target.value)
                    }
                    className="bg-white text-primary-foreground"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="email"
                    value={email.email}
                    onChange={(e) =>
                      updateField(email.id, 'email', e.target.value)
                    }
                    className="bg-white text-primary-foreground"
                    readOnly={email.id !== 'fake-id'}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={email.settings.cat3}
                    onCheckedChange={(checked) =>
                      updateCategory(email.id, 'cat3', checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={email.settings.cat2c}
                    onCheckedChange={(checked) =>
                      updateCategory(email.id, 'cat2c', checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={email.settings.cat2b}
                    onCheckedChange={(checked) =>
                      updateCategory(email.id, 'cat2b', checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={email.settings.cat2a}
                    onCheckedChange={(checked) =>
                      updateCategory(email.id, 'cat2a', checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={email.settings.cat1}
                    onCheckedChange={(checked) =>
                      updateCategory(email.id, 'cat1', checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>
                  {email.id === 'fake-id' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => addEntry(email.id)}
                        className="bg-cyan-500 text-white hover:bg-cyan-600"
                        size="sm"
                      >
                        Add
                      </Button>
                      <Button
                        onClick={() => removeNewEntry()}
                        className="bg-cyan-500 text-white hover:bg-cyan-600"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                  {email.id !== 'fake-id' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateEntry(email.id)}
                        className="bg-cyan-500 text-white hover:bg-cyan-600"
                        size="sm"
                      >
                        Update
                      </Button>
                      <Button
                        onClick={() => deleteEntry(email.id)}
                        className="bg-cyan-500 text-white hover:bg-cyan-600"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
