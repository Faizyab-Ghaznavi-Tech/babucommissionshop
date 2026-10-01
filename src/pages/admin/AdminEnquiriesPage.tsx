import { useState, useEffect, useMemo } from 'react';
import { Search, Mail, MailOpen, Archive, Trash2, Phone, MessageSquare } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { Modal, ConfirmDialog } from '@/components/admin/Dialogs';
import { LoadingSpinner, EmptyState } from '@/components/States';
import { supabase } from '@/lib/supabase';
import { formatDateTime } from '@/lib/storage';
import type { ContactMessage } from '@/types/database';

type FilterType = 'all' | 'unread' | 'read' | 'archived';

export function AdminEnquiriesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [operationError, setOperationError] = useState('');
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) setOperationError(error.message);
      else setMessages(data as ContactMessage[]);
    } catch (fetchError) {
      setOperationError(fetchError instanceof Error ? fetchError.message : 'Could not load enquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const filtered = useMemo(() => {
    return messages.filter(m => {
      if (filter === 'unread' && m.is_read) return false;
      if (filter === 'read' && (!m.is_read || m.is_archived)) return false;
      if (filter === 'archived' && !m.is_archived) return false;
      if (filter === 'all' && m.is_archived) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        (m.business_name || '').toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    });
  }, [messages, search, filter]);

  const counts = useMemo(() => ({
    all: messages.filter(m => !m.is_archived).length,
    unread: messages.filter(m => !m.is_read && !m.is_archived).length,
    read: messages.filter(m => m.is_read && !m.is_archived).length,
    archived: messages.filter(m => m.is_archived).length,
  }), [messages]);

  const openDetail = (msg: ContactMessage) => {
    setSelected(msg);
    setDetailOpen(true);
    if (!msg.is_read) {
      markRead(msg.id, true);
    }
  };

  const markRead = async (id: string, read: boolean) => {
    setOperationError('');
    try {
      const { error } = await supabase.from('contact_messages').update({ is_read: read }).eq('id', id);
      if (error) { setOperationError(error.message); return; }
      await fetchMessages();
    } catch (updateError) {
      setOperationError(updateError instanceof Error ? updateError.message : 'Could not update this enquiry.');
    }
  };

  const toggleArchive = async (msg: ContactMessage) => {
    setOperationError('');
    try {
      const { error } = await supabase.from('contact_messages').update({ is_archived: !msg.is_archived }).eq('id', msg.id);
      if (error) { setOperationError(error.message); return; }
      if (selected?.id === msg.id) setSelected({ ...msg, is_archived: !msg.is_archived });
      await fetchMessages();
    } catch (updateError) {
      setOperationError(updateError instanceof Error ? updateError.message : 'Could not update this enquiry.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setOperationError('');
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', deleteTarget.id);
      if (error) { setOperationError(error.message); return; }
      setDeleteTarget(null);
      if (selected?.id === deleteTarget.id) { setDetailOpen(false); setSelected(null); }
      await fetchMessages();
    } catch (deleteError) {
      setOperationError(deleteError instanceof Error ? deleteError.message : 'Could not delete this enquiry.');
    }
  };

  const filterTabs: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'unread', label: 'Unread', count: counts.unread },
    { key: 'read', label: 'Read', count: counts.read },
    { key: 'archived', label: 'Archived', count: counts.archived },
  ];

  return (
    <AdminLayout title="Enquiries">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-date-400" />
          <input type="search" aria-label="Search enquiries" placeholder="Search enquiries..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
      </div>

      {operationError && <div role="alert" className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{operationError}</div>}

      <div className="flex gap-2 mb-6 flex-wrap">
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            aria-pressed={filter === tab.key}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key ? 'bg-date-700 text-cream' : 'bg-cream text-date-600 border border-date-200 hover:bg-date-50'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner label="Loading enquiries..." />
      ) : filtered.length === 0 ? (
        <EmptyState title="No enquiries found" message="Contact form submissions will appear here." icon={<Mail size={48} />} />
      ) : (
        <div className="bg-cream rounded-xl border border-date-100 overflow-hidden">
          <div className="divide-y divide-date-50">
            {filtered.map((msg) => (
              <div key={msg.id} className="flex items-center gap-3 p-2 transition-colors hover:bg-date-50/50 sm:p-4">
                <button type="button" onClick={() => openDetail(msg)} className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-md px-2 py-1 text-left">
                  <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${msg.is_read ? 'bg-date-200' : 'bg-palm-500'}`} />
                  <span className="block min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className={`truncate font-medium text-date-800 ${!msg.is_read ? 'font-bold' : ''}`}>{msg.name}</span>
                      {!msg.is_read && <span className="rounded-full bg-palm-100 px-2 py-0.5 text-xs text-palm-700">New</span>}
                      {msg.is_archived && <span className="rounded-full bg-date-100 px-2 py-0.5 text-xs text-date-500">Archived</span>}
                    </span>
                    <span className="block truncate text-sm text-date-500">{[msg.business_name, msg.subject || msg.message || 'No subject'].filter(Boolean).join(' · ')}</span>
                  </span>
                  <span className="hidden shrink-0 text-xs text-date-500 sm:block">{formatDateTime(msg.created_at)}</span>
                </button>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => markRead(msg.id, !msg.is_read)}
                    className="p-1.5 rounded-lg hover:bg-date-100 transition-colors text-date-600"
                    title={msg.is_read ? 'Mark as unread' : 'Mark as read'}
                    aria-label={msg.is_read ? `Mark ${msg.name}'s enquiry as unread` : `Mark ${msg.name}'s enquiry as read`}
                  >
                    {msg.is_read ? <MailOpen size={16} /> : <Mail size={16} />}
                  </button>
                  <button
                    onClick={() => toggleArchive(msg)}
                    className="p-1.5 rounded-lg hover:bg-date-100 transition-colors text-date-600"
                    title={msg.is_archived ? 'Unarchive' : 'Archive'}
                    aria-label={`${msg.is_archived ? 'Unarchive' : 'Archive'} ${msg.name}'s enquiry`}
                  >
                    <Archive size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(msg)}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-500"
                    title="Delete"
                    aria-label={`Delete ${msg.name}'s enquiry`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail modal */}
      <Modal open={detailOpen} title="Enquiry Details" onClose={() => setDetailOpen(false)} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-date-50 rounded-lg p-4">
                <p className="text-xs text-date-400 uppercase tracking-wider mb-1">Name</p>
                <p className="font-medium text-date-800">{selected.name}</p>
              </div>
              <div className="bg-date-50 rounded-lg p-4">
                <p className="text-xs text-date-400 uppercase tracking-wider mb-1">Date</p>
                <p className="font-medium text-date-800">{formatDateTime(selected.created_at)}</p>
              </div>
              {selected.business_name && <div className="bg-date-50 rounded-lg p-4">
                <p className="text-xs text-date-400 uppercase tracking-wider mb-1">Business</p>
                <p className="font-medium text-date-800">{selected.business_name}</p>
              </div>}
              <div className="bg-date-50 rounded-lg p-4">
                <p className="text-xs text-date-400 uppercase tracking-wider mb-1">Phone</p>
                <a href={`tel:${selected.phone}`} className="font-medium text-date-800 flex items-center gap-2 hover:text-palm-600 transition-colors">
                  <Phone size={14} /> {selected.phone}
                </a>
              </div>
              <div className="bg-date-50 rounded-lg p-4">
                <p className="text-xs text-date-400 uppercase tracking-wider mb-1">Email</p>
                <p className="font-medium text-date-800 break-all">{selected.email || 'Not provided'}</p>
              </div>
            </div>

            {selected.subject && (
              <div className="bg-date-50 rounded-lg p-4">
                <p className="text-xs text-date-400 uppercase tracking-wider mb-1">Subject</p>
                <p className="font-medium text-date-800">{selected.subject}</p>
              </div>
            )}

            {(selected.product_name || selected.service_name) && (
              <div className="grid sm:grid-cols-2 gap-4">
                {selected.product_name && (
                  <div className="bg-date-50 rounded-lg p-4">
                    <p className="text-xs text-date-400 uppercase tracking-wider mb-1">Product Interest</p>
                    <p className="font-medium text-date-800">{selected.product_name}</p>
                  </div>
                )}
                {selected.service_name && (
                  <div className="bg-date-50 rounded-lg p-4">
                    <p className="text-xs text-date-400 uppercase tracking-wider mb-1">Service Interest</p>
                    <p className="font-medium text-date-800">{selected.service_name}</p>
                  </div>
                )}
              </div>
            )}

            {selected.quantity && (
              <div className="bg-date-50 rounded-lg p-4">
                <p className="text-xs text-date-400 uppercase tracking-wider mb-1">Quantity</p>
                <p className="font-medium text-date-800">{selected.quantity}</p>
              </div>
            )}

            <div className="bg-date-50 rounded-lg p-4">
              <p className="text-xs text-date-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MessageSquare size={12} /> Message
              </p>
              <p className="text-date-700 leading-relaxed whitespace-pre-line">{selected.message}</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => markRead(selected.id, !selected.is_read)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-date-200 text-date-600 font-medium text-sm hover:bg-date-50 transition-colors flex items-center justify-center gap-2"
              >
                {selected.is_read ? <Mail size={16} /> : <MailOpen size={16} />}
                {selected.is_read ? 'Mark Unread' : 'Mark Read'}
              </button>
              <button
                onClick={() => toggleArchive(selected)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-date-200 text-date-600 font-medium text-sm hover:bg-date-50 transition-colors flex items-center justify-center gap-2"
              >
                <Archive size={16} />
                {selected.is_archived ? 'Unarchive' : 'Archive'}
              </button>
              <a
                href={`tel:${selected.phone}`}
                className="btn-accent flex items-center justify-center gap-2 text-sm"
              >
                <Phone size={16} /> Call
              </a>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Enquiry"
        message={`Are you sure you want to delete the enquiry from "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
