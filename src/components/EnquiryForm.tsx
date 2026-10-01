import { useEffect, useId, useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, LoaderCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product, Service } from '@/types/database';

type FormMode = 'contact' | 'wholesale';
type EnquiryField = 'name' | 'phone' | 'email' | 'message';

interface EnquiryFormProps {
  products: Product[];
  services: Service[];
  mode?: FormMode;
  initialProduct?: Product;
  initialService?: Service;
}

const WHOLESALE_SUBJECTS = [
  'Bulk Supply',
  'Commission-Based Buying',
  'Custom Packaging',
  'Product Enquiry',
  'Other',
];

export function EnquiryForm({
  products,
  services,
  mode = 'contact',
  initialProduct,
  initialService,
}: EnquiryFormProps) {
  const id = useId();
  const isWholesale = mode === 'wholesale';
  const initialProductId = initialProduct?.id ?? '';
  const initialServiceId = initialService?.id ?? '';
  const defaultSubject = isWholesale
    ? 'Bulk Supply'
    : initialProduct
      ? 'Product Enquiry'
      : initialService
        ? 'Service Enquiry'
        : '';
  const [formData, setFormData] = useState({
    name: '',
    business_name: '',
    phone: '',
    email: '',
    subject: defaultSubject,
    product_id: initialProductId,
    service_id: initialServiceId,
    quantity: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<EnquiryField, string>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (initialProductId || initialServiceId) {
      setFormData((current) => ({
        ...current,
        product_id: initialProductId || current.product_id,
        service_id: initialServiceId || current.service_id,
        subject: initialProductId ? 'Product Enquiry' : 'Service Enquiry',
      }));
    }
  }, [initialProductId, initialServiceId]);

  const setField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setStatus('idle');
    if (field in errors) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const validate = () => {
    const nextErrors: Partial<Record<EnquiryField, string>> = {};
    if (!formData.name.trim()) nextErrors.name = 'Enter your name.';
    if (!formData.phone.trim()) nextErrors.phone = 'Enter a phone or WhatsApp number.';
    else if (formData.phone.replace(/\D/g, '').length < 7) nextErrors.phone = 'Enter a valid phone number.';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!formData.message.trim()) nextErrors.message = 'Tell us a little about your requirements.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    const product = products.find((item) => item.id === formData.product_id);
    const service = services.find((item) => item.id === formData.service_id);

    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: formData.name.trim(),
        business_name: formData.business_name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        subject: formData.subject,
        product_id: formData.product_id || null,
        service_id: formData.service_id || null,
        product_name: product?.name ?? '',
        service_name: service?.name ?? '',
        quantity: formData.quantity.trim(),
        message: formData.message.trim(),
      });

      if (error) {
        setStatus('error');
        return;
      }

      setFormData({
        name: '',
        business_name: '',
        phone: '',
        email: '',
        subject: isWholesale ? 'Bulk Supply' : '',
        product_id: '',
        service_id: '',
        quantity: '',
        message: '',
      });
      setErrors({});
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div role="status" aria-live="polite" className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center">
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-palm-100 text-palm-800">
          <CheckCircle2 size={28} aria-hidden="true" />
        </span>
        <h3 className="font-display text-2xl font-semibold text-date-950">Enquiry received</h3>
        <p className="mt-3 max-w-sm text-sm leading-6 text-date-700">
          Thank you for getting in touch. We have received your enquiry and will follow up using the contact details you provided.
        </p>
        <button type="button" onClick={() => setStatus('idle')} className="btn-text mt-6">
          Send another enquiry <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    );
  }

  const fieldError = (field: EnquiryField) => errors[field];
  const fieldId = (field: string) => `${id}-${field}`;
  const errorId = (field: EnquiryField) => `${fieldId(field)}-error`;
  const fieldClass = 'input-field';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-busy={status === 'submitting'}>
      {status === 'error' && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          We couldn’t send your enquiry. Please try again, or use the contact details on this page.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-text" htmlFor={fieldId('name')}>Your name <span aria-hidden="true">*</span></label>
          <input
            id={fieldId('name')}
            name="name"
            autoComplete="name"
            required
            value={formData.name}
            onChange={(event) => setField('name', event.target.value)}
            className={fieldClass}
            aria-invalid={!!fieldError('name')}
            aria-describedby={fieldError('name') ? errorId('name') : undefined}
            placeholder="Full name"
          />
          {fieldError('name') && <p className="field-error" id={errorId('name')}>{fieldError('name')}</p>}
        </div>
        <div>
          <label className="label-text" htmlFor={fieldId('business_name')}>Business or company</label>
          <input
            id={fieldId('business_name')}
            name="organization"
            autoComplete="organization"
            value={formData.business_name}
            onChange={(event) => setField('business_name', event.target.value)}
            className={fieldClass}
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-text" htmlFor={fieldId('phone')}>Phone or WhatsApp <span aria-hidden="true">*</span></label>
          <input
            id={fieldId('phone')}
            name="tel"
            type="tel"
            autoComplete="tel"
            required
            value={formData.phone}
            onChange={(event) => setField('phone', event.target.value)}
            className={fieldClass}
            aria-invalid={!!fieldError('phone')}
            aria-describedby={fieldError('phone') ? errorId('phone') : undefined}
            placeholder="Include country code if possible"
          />
          {fieldError('phone') && <p className="field-error" id={errorId('phone')}>{fieldError('phone')}</p>}
        </div>
        <div>
          <label className="label-text" htmlFor={fieldId('email')}>Email</label>
          <input
            id={fieldId('email')}
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={(event) => setField('email', event.target.value)}
            className={fieldClass}
            aria-invalid={!!fieldError('email')}
            aria-describedby={fieldError('email') ? errorId('email') : undefined}
            placeholder="you@example.com"
          />
          {fieldError('email') && <p className="field-error" id={errorId('email')}>{fieldError('email')}</p>}
        </div>
      </div>

      {isWholesale ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-text" htmlFor={fieldId('subject')}>What can we help with?</label>
            <select id={fieldId('subject')} value={formData.subject} onChange={(event) => setField('subject', event.target.value)} className={fieldClass}>
              {WHOLESALE_SUBJECTS.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
            </select>
          </div>
          <div>
            <label className="label-text" htmlFor={fieldId('quantity')}>Approximate quantity</label>
            <input
              id={fieldId('quantity')}
              value={formData.quantity}
              onChange={(event) => setField('quantity', event.target.value)}
              className={fieldClass}
              placeholder="Optional"
            />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-text" htmlFor={fieldId('subject')}>Subject</label>
            <select id={fieldId('subject')} value={formData.subject} onChange={(event) => setField('subject', event.target.value)} className={fieldClass}>
              <option value="">Select a subject</option>
              {['General Enquiry', 'Product Enquiry', 'Service Enquiry', 'Commission-Based Buying', 'Bulk Supply', 'Custom Packaging', 'Other'].map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-text" htmlFor={fieldId('quantity')}>Quantity</label>
            <input id={fieldId('quantity')} value={formData.quantity} onChange={(event) => setField('quantity', event.target.value)} className={fieldClass} placeholder="Optional" />
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label-text" htmlFor={fieldId('product')}>Product interest</label>
          <select
            id={fieldId('product')}
            value={formData.product_id}
            onChange={(event) => setField('product_id', event.target.value)}
            className={fieldClass}
          >
            <option value="">Select a date variety</option>
            {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
          </select>
        </div>
        {!isWholesale && (
          <div>
            <label className="label-text" htmlFor={fieldId('service')}>Service interest</label>
            <select
              id={fieldId('service')}
              value={formData.service_id}
              onChange={(event) => setField('service_id', event.target.value)}
              className={fieldClass}
            >
              <option value="">Select a service</option>
              {services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
            </select>
          </div>
        )}
      </div>

      <div>
        <label className="label-text" htmlFor={fieldId('message')}>How can we help? <span aria-hidden="true">*</span></label>
        <textarea
          id={fieldId('message')}
          name="message"
          rows={4}
          required
          value={formData.message}
          onChange={(event) => setField('message', event.target.value)}
          className={`${fieldClass} min-h-28 resize-y`}
          aria-invalid={!!fieldError('message')}
          aria-describedby={fieldError('message') ? errorId('message') : undefined}
          placeholder="Share the varieties, quantities, or packaging you have in mind."
        />
        {fieldError('message') && <p className="field-error" id={errorId('message')}>{fieldError('message')}</p>}
      </div>

      <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full sm:w-auto">
        {status === 'submitting' ? <LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> : null}
        {status === 'submitting' ? 'Sending…' : isWholesale ? 'Request a quote' : 'Send enquiry'}
        {status !== 'submitting' && <ArrowRight size={17} aria-hidden="true" />}
      </button>
      <p className="text-xs leading-5 text-date-600">Your enquiry is sent to Babu Commission Shop. We use your details only to respond to your request.</p>
    </form>
  );
}
