"use client"

import { Plus, Ellipsis, Pencil, Trash2, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatPhone } from "@/lib/utils"
import type { Contact } from "@/types"

interface ContactsListProps {
  contacts: Contact[]
  onAdd: () => void
  onEdit: (contact: Contact) => void
  onDelete: (contact: Contact) => void
}

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
}

export function ContactsList({ contacts, onAdd, onEdit, onDelete }: ContactsListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Contatos</h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Pessoas vinculadas a este projeto
          </p>
        </div>
        <Button
          onClick={onAdd}
          className="bg-[var(--button-default)] text-white hover:bg-[var(--button-default)]/90"
        >
          <Plus size={16} />
          Novo Contato
        </Button>
      </div>

      {contacts.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
          <p className="text-sm text-[var(--text-secondary)]">
            Nenhum contato vinculado
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-[#F8FAFC] dark:bg-muted">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                  Cargo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                  E-mail
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                  Telefone
                </th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="border-b last:border-b-0 hover:bg-[#FAFBFC] dark:hover:bg-muted"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-muted text-[11px] font-semibold text-foreground">
                          {initials(contact.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {contact.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[var(--text-secondary)]">
                      {contact.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`mailto:${contact.email}`}
                      className="inline-flex items-center gap-1.5 text-sm text-[var(--text-primary)] hover:underline"
                    >
                      <Mail size={12} className="text-[var(--text-secondary)]" />
                      {contact.email}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`tel:${contact.phone}`}
                      className="inline-flex items-center gap-1.5 text-sm text-[var(--text-primary)] hover:underline"
                    >
                      <Phone size={12} className="text-[var(--text-secondary)]" />
                      {formatPhone(contact.phone)}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            aria-label="Ações do contato"
                          >
                            <Ellipsis size={16} />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(contact)}>
                          <Pencil size={14} />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(contact)}
                          className="text-[var(--text-danger)] focus:text-[var(--text-danger)]"
                        >
                          <Trash2 size={14} />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
