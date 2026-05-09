import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/lib/utils';
import { updateWorkspaceSchema } from '@/lib/validations';
import { z } from 'zod';

interface SettingsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const session = await auth();
  if (!session) redirect('/login');

  const { slug } = await params;

  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
        orderBy: { joinedAt: 'asc' },
      },
      subscription: true,
      _count: { select: { projects: true, members: true } },
    },
  });

  if (!workspace) redirect('/onboarding');

  const membership = workspace.members.find((m) => m.userId === session.user.id);
  if (!membership || (membership.role !== 'OWNER' && membership.role !== 'ADMIN')) {
    redirect(`/${slug}`);
  }

  async function updateWorkspace(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const parsed = updateWorkspaceSchema.safeParse({ name });
    if (parsed.success && parsed.data.name) {
      await prisma.workspace.update({
        where: { slug },
        data: { name: parsed.data.name },
      });
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Workspace Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your workspace preferences</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">General</CardTitle>
          <CardDescription>Workspace name and details</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateWorkspace} className="space-y-4 max-w-md">
            <Input
              label="Workspace name"
              name="name"
              defaultValue={workspace.name}
              placeholder="Workspace name"
            />
            <Input
              label="Workspace URL"
              value={`${slug}.taskflow.app`}
              disabled
              helperText="Contact support to change your workspace URL"
            />
            <Button type="submit" size="sm">
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Plan & Billing</CardTitle>
          <CardDescription>Current subscription details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900 capitalize">{workspace.plan} Plan</p>
              <p className="text-xs text-gray-500">
                {workspace._count.projects} projects · {workspace._count.members} members
              </p>
            </div>
            <Badge variant={workspace.plan === 'FREE' ? 'secondary' : 'default'}>
              {workspace.plan}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Members */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Members</CardTitle>
          <CardDescription>{workspace.members.length} members in this workspace</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {workspace.members.map((member) => (
              <div key={member.id} className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {getInitials(member.user.name)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{member.user.name}</p>
                    <p className="text-xs text-gray-500">{member.user.email}</p>
                  </div>
                </div>
                <Badge
                  variant={member.role === 'OWNER' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {member.role.toLowerCase()}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Delete workspace</p>
              <p className="text-xs text-gray-500">Permanently delete this workspace and all its data</p>
            </div>
            <Button variant="destructive" size="sm" disabled>
              Delete workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
