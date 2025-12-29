import Link from "next/link"
import { dataStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Star, Phone, Mail, MessageSquare, Users } from "lucide-react"

export default function GroupsPage() {
  const groups = dataStore.getGroups()
  const favoriteGroups = groups.filter((g) => g.favorite)
  const otherGroups = groups.filter((g) => !g.favorite)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notification Groups</h1>
          <p className="text-muted-foreground">Manage groups that receive alert notifications</p>
        </div>
        <Link href="/groups/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Group
          </Button>
        </Link>
      </div>

      {favoriteGroups.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-warning text-warning" />
            <h2 className="text-xl font-semibold">Favorite Groups</h2>
          </div>
          <div className="grid gap-4">
            {favoriteGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <Star className="h-4 w-4 fill-warning text-warning" />
                      </div>
                      <CardDescription>{group.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/groups/${group.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/groups/${group.id}`}>
                        <Button variant="default" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{group.members.length}</p>
                        <p className="text-xs text-muted-foreground">Members</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{group.notifyPhones.length}</p>
                        <p className="text-xs text-muted-foreground">Phones</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{group.notifyEmails.length}</p>
                        <p className="text-xs text-muted-foreground">Emails</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{group.notifyChannels.length}</p>
                        <p className="text-xs text-muted-foreground">Channels</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {otherGroups.length > 0 && (
        <div className="space-y-4">
          {favoriteGroups.length > 0 && <h2 className="text-xl font-semibold">Other Groups</h2>}
          <div className="grid gap-4">
            {otherGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{group.name}</CardTitle>
                      <CardDescription>{group.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/groups/${group.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/groups/${group.id}`}>
                        <Button variant="default" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{group.members.length}</p>
                        <p className="text-xs text-muted-foreground">Members</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{group.notifyPhones.length}</p>
                        <p className="text-xs text-muted-foreground">Phones</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{group.notifyEmails.length}</p>
                        <p className="text-xs text-muted-foreground">Emails</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{group.notifyChannels.length}</p>
                        <p className="text-xs text-muted-foreground">Channels</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {groups.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No notification groups yet. Create your first group.</p>
            <Link href="/groups/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
