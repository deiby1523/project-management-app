"use client"

import { useState, useEffect } from "react"
import { projectsApi, usersApi } from "@/lib/api"
import type { User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { UserPlus, Check, ChevronsUpDown } from "lucide-react"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"

interface AddMemberDialogProps {
  projectId: number
  existingMemberIds: number[]
  onMemberAdded: () => void
}

export function AddMemberDialog({
  projectId,
  existingMemberIds,
  onMemberAdded,
}: AddMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)

  const [openCombobox, setOpenCombobox] = useState(false)

  useEffect(() => {
    if (open) {
      setIsLoadingUsers(true)
      usersApi
        .getAll()
        .then((allUsers) => {
          const availableUsers = allUsers.filter(
            (u) => !existingMemberIds.includes(u.id)
          )
          setUsers(availableUsers)
        })
        .catch((error) => {
          toast.error("Failed to load users")
          console.error(error)
        })
        .finally(() => setIsLoadingUsers(false))
    }
  }, [open, existingMemberIds])

  const selectedUser = users.find(
    (u) => u.id.toString() === selectedUserId
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUserId) return

    setIsLoading(true)
    try {
      await projectsApi.addMember(projectId, parseInt(selectedUserId))
      toast.success("Member added successfully")
      setOpen(false)
      setSelectedUserId("")
      onMemberAdded()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add member"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
            <DialogDescription>
              Add a collaborator to this project.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Field>
              <FieldLabel>Select User</FieldLabel>

              {isLoadingUsers ? (
                <div className="flex items-center justify-center py-4">
                  <Spinner />
                </div>
              ) : users.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">
                  No available users to add
                </p>
              ) : (
                <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {selectedUser
                        ? `${selectedUser.name} (${selectedUser.email})`
                        : "Select user"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search user..." />
                      <CommandEmpty>No users found.</CommandEmpty>

                      <CommandGroup className="max-h-60 overflow-y-auto">
                        {users.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={`${user.name} ${user.email}`}
                            onSelect={() => {
                              setSelectedUserId(user.id.toString())
                              setOpenCombobox(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedUserId === user.id.toString()
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {user.name} ({user.email})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            </Field>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                isLoading || !selectedUserId || users.length === 0
              }
            >
              {isLoading ? <Spinner className="mr-2" /> : null}
              Add Member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}