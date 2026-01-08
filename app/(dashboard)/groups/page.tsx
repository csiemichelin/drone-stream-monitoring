"use client"

import Link from "next/link"
import { useLayoutEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { dataStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Plus,
  Star,
  Phone,
  Mail,
  MessageSquare,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

const PAGE_SIZE = 5

function getPageItems(current: number, total: number) {
  const items: Array<number | "ellipsis"> = []
  if (total <= 7) {
    for (let i = 1; i <= total; i += 1) items.push(i)
    return items
  }
  items.push(1)
  if (current > 3) items.push("ellipsis")
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i += 1) items.push(i)
  if (current < total - 2) items.push("ellipsis")
  items.push(total)
  return items
}

export default function GroupsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const groups = dataStore.getGroups()
  const totalPages = Math.max(1, Math.ceil(groups.length / PAGE_SIZE))
  const currentPage = Math.min(totalPages, Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1))

  const startIndex = (currentPage - 1) * PAGE_SIZE
  const pagedGroups = groups.slice(startIndex, startIndex + PAGE_SIZE)
  const favoriteGroups = pagedGroups.filter((g) => g.favorite)
  const otherGroups = pagedGroups.filter((g) => !g.favorite)

  // ✅ 讓切頁後視窗停留在原本高度：以 pager 作為 anchor
  const pagerRef = useRef<HTMLDivElement | null>(null)
  const pendingAnchorTopRef = useRef<number | null>(null)

  const pushPage = (nextPage: number) => {
    const clamped = Math.min(totalPages, Math.max(1, nextPage))
    pendingAnchorTopRef.current = pagerRef.current?.getBoundingClientRect().top ?? null

    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(clamped))
    router.push(`?${params.toString()}`, { scroll: false })
  }

  useLayoutEffect(() => {
    const prevTop = pendingAnchorTopRef.current
    if (prevTop == null) return
    const nextTop = pagerRef.current?.getBoundingClientRect().top
    if (typeof nextTop !== "number") {
      pendingAnchorTopRef.current = null
      return
    }
    window.scrollBy(0, nextTop - prevTop)
    pendingAnchorTopRef.current = null
  }, [currentPage, favoriteGroups.length, otherGroups.length])

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

      {groups.length > PAGE_SIZE && (
        <div ref={pagerRef} className="flex flex-col items-end gap-2 text-sm text-muted-foreground">
          <span>
            Showing {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, groups.length)} of {groups.length} groups
          </span>

          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => pushPage(1)}
              className="h-8 w-8 grid place-items-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => pushPage(Math.max(1, currentPage - 1))}
              className="h-8 w-8 grid place-items-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {getPageItems(currentPage, totalPages).map((item, index) =>
              item === "ellipsis" ? (
                <span key={`${item}-${index}`} className="px-2 text-slate-400">
                  …
                </span>
              ) : (
                <button
                  key={`${item}-${index}`}
                  type="button"
                  onClick={() => pushPage(item)}
                  className={`h-8 w-8 grid place-items-center rounded-full border ${
                    item === currentPage
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-blue-50"
                  }`}
                >
                  {item}
                </button>
              ),
            )}

            <button
              type="button"
              onClick={() => pushPage(Math.min(totalPages, currentPage + 1))}
              className="h-8 w-8 grid place-items-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => pushPage(totalPages)}
              className="h-8 w-8 grid place-items-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
              aria-label="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>

            <form
              className="flex items-center gap-2 text-xs text-muted-foreground"
              onSubmit={(e) => {
                e.preventDefault()
                const raw = (e.currentTarget.elements.namedItem("page") as HTMLInputElement | null)?.value ?? ""
                const target = Number.parseInt(raw, 10)
                if (Number.isNaN(target)) return
                pushPage(target)
              }}
            >
              <input
                name="page"
                type="number"
                min={1}
                max={totalPages}
                defaultValue={currentPage}
                className="w-16 rounded-md border border-slate-300 px-2 py-1 text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <span>of {groups.length} items</span>
              <button
                type="submit"
                className="rounded-md border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 hover:bg-blue-50"
              >
                Go
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
