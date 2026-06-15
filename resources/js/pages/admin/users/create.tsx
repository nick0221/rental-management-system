import { Head } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/shared/page-header';
import { store } from '@/routes/admin/users';
import { index } from '@/routes/admin/users';
import { Link } from '@inertiajs/react';

export default function CreateUser() {
    return (
        <>
            <Head title="Create User" />
            <div className="p-6">
                <PageHeader
                    title="Create User"
                    description="Add a new user to the system."
                    actions={
                        <Button variant="outline" asChild>
                            <Link href={index().url}>Cancel</Link>
                        </Button>
                    }
                />

                <div className="max-w-lg">
                    <Form
                        action={store()}
                        method="post"
                        resetOnSuccess
                        setDefaultsOnSuccess
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
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" name="password" type="password" required />
                                    {errors.password && (
                                        <p className="text-sm text-destructive">{errors.password}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select name="role" defaultValue="renter">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
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
                                    <Label htmlFor="phone">Phone (optional)</Label>
                                    <Input id="phone" name="phone" />
                                </div>

                                <Button type="submit" disabled={processing}>
                                    Create User
                                </Button>
                            </div>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}
