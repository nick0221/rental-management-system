import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/shared/page-header';
import { update, destroy, index } from '@/routes/admin/users';
import type { User } from '@/types/auth';

export default function EditUser({ user }: { user: User }) {
    return (
        <>
            <Head title={`Edit ${user.name}`} />
            <div className="p-6">
                <PageHeader
                    title={`Edit ${user.name}`}
                    description="Update user details and role."
                    actions={
                        <Button variant="outline" asChild>
                            <Link href={index().url}>Back to Users</Link>
                        </Button>
                    }
                />

                <div className="max-w-lg space-y-8">
                    <Form
                        action={update(user.id)}
                        method="patch"
                        defaults={{
                            name: user.name,
                            email: user.email,
                            role: user.role ?? 'renter',
                            phone: user.phone ?? '',
                        }}
                    >
                        {({ errors, processing }) => (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" required />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" required />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select name="role" defaultValue={user.role ?? 'renter'}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="renter">Renter</SelectItem>
                                            <SelectItem value="owner">Owner</SelectItem>
                                            <SelectItem value="super_admin">Super Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.role && (
                                        <p className="text-sm text-destructive">{errors.role}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" name="phone" />
                                </div>

                                <Button type="submit" disabled={processing}>
                                    Update User
                                </Button>
                            </div>
                        )}
                    </Form>

                    <div className="border-t pt-6">
                        <Form
                            action={destroy(user.id)}
                            method="delete"
                            onSubmit={(e) => {
                                if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            <Button variant="destructive" type="submit">
                                Delete User
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}
