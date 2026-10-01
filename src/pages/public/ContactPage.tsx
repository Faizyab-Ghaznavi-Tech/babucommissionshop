import { useState, useEffect, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';
import { PageHeader } from '@/components/SectionTitle';
import { LoadingSpinner } from '@/components/States';
import { useProducts, useServices, useWebsiteSettings } from '@/hooks/useData';
import { supabase } from '@/lib/supabase';

const SUBJECTS = [
  'General Enquiry',
  'Product Enquiry',
  'Service Enquiry',
  'Commission-Based Buying',
  'Bulk Supply',
  'Custom Packaging',
  'Ramadan Packaging',
  'Export Enquiry',
  'Other',
];

export function ContactPage() {
  const { products } = useProducts();
  const { services } = useServices();
  const { settings } = useWebsiteSettings();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    product_id: '',
    service_id: '',
    quantity: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const productSlug = searchParams.get('product');
    const serviceName = searchParams.get('service');

    if (productSlug && products.length > 0) {
      const product = products.find(p => p.slug === productSlug);
      if (product) {
        setFormData(prev => ({
          ...prev,
          product_id: product.id,
          subject: 'Product Enquiry',
        }));
      }
    }

    if (serviceName && services.length > 0) {
      const service = services.find(s => s.name === serviceName);
      if (service) {
        setFormData(prev => ({
          ...prev,
          service_id: service.id,
          subject: 'Service Enquiry',
        }));
      }
    }
  }, [searchParams, products, services]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = 'Please enter your name';
    if (!formData.phone.trim()) e.phone = 'Please enter your phone number';
    else if (formData.phone.trim().length < 7) e.phone = 'Please enter a valid phone number';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) e.message = 'Please enter your message';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    setErrorMessage('');

    const selectedProduct = products.find(p => p.id === formData.product_id);
    const selectedService = services.find(s => s.id === formData.service_id);

    const { error } = await supabase.from('contact_messages').insert({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      subject: formData.subject,
      product_id: formData.product_id || null,
      service_id: formData.service_id || null,
      product_name: selectedProduct?.name || '',
      service_name: selectedService?.name || '',
      quantity: formData.quantity.trim(),
      message: formData.message.trim(),
    });

    if (error) {
      setStatus('error');
      setErrorMessage('We could not send your enquiry at this time. Please try again or call us directly.');
    } else {
      setStatus('success');
      setFormData({
        name: '', phone: '', email: '', subject: '',
        product_id: '', service_id: '', quantity: '', message: '',
      });
    }
  };

  return (
    <PublicLayout
      title="Contact Us"
      description="Get in touch with Babu Commission Shop for date sourcing, commission buying, bulk supply, and custom packaging."
    >
      <PageHeader
        title="Get In Touch"
        subtitle="Have a question about our dates or services? Send us an enquiry and we'll get back to you as soon as possible."
      />

      <section className="section-padding bg-cream">
        <div className="container-prose">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="card p-6">
                <div className="w-12 h-12 rounded-xl bg-date-100 flex items-center justify-center mb-4">
                  <MapPin size={24} className="text-date-700" />
                </div>
                <h3 className="font-display font-semibold text-date-800 mb-2">Our Location</h3>
                <p className="text-sm text-date-500 leading-relaxed">
                  {settings?.address ?? 'New Khajoor Mandi, Khairpur, Sindh, Pakistan'}
                </p>
              </div>

              <div className="card p-6">
                <div className="w-12 h-12 rounded-xl bg-date-100 flex items-center justify-center mb-4">
                  <Phone size={24} className="text-date-700" />
                </div>
                <h3 className="font-display font-semibold text-date-800 mb-2">Phone</h3>
                <a href={`tel:${settings?.phone ?? ''}`} className="text-sm text-date-500 hover:text-date-700 transition-colors">
                  {settings?.phone ?? ''}
                </a>
              </div>

              <div className="card p-6">
                <div className="w-12 h-12 rounded-xl bg-date-100 flex items-center justify-center mb-4">
                  <Mail size={24} className="text-date-700" />
                </div>
                <h3 className="font-display font-semibold text-date-800 mb-2">Email</h3>
                <a href={`mailto:${settings?.email ?? ''}`} className="text-sm text-date-500 hover:text-date-700 transition-colors break-all">
                  {settings?.email ?? ''}
                </a>
              </div>

              {settings?.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-6 flex items-center gap-4 hover:border-palm-400 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-palm-100 flex items-center justify-center">
                    <MessageCircle size={24} className="text-palm-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-date-800">WhatsApp</h3>
                    <p className="text-sm text-date-500 group-hover:text-palm-600 transition-colors">Chat with us</p>
                  </div>
                </a>
              )}
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="card p-6 md:p-8">
                {status === 'success' ? (
                  <div className="flex flex-col items-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-palm-100 flex items-center justify-center mb-4">
                      <CheckCircle size={32} className="text-palm-600" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-date-800 mb-2">Enquiry Sent Successfully</h3>
                    <p className="text-date-500 max-w-md mb-6">
                      Thank you for your enquiry. We'll get back to you as soon as possible. For urgent matters, please call us directly.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="btn-secondary"
                    >
                      Send Another Enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="text-xl font-display font-bold text-date-800 mb-2">Send Us an Enquiry</h2>

                    {status === 'error' && (
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                        <p className="text-sm">{errorMessage}</p>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="label-text" htmlFor="name">Name *</label>
                        <input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          className="input-field"
                          placeholder="Your full name"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="label-text" htmlFor="phone">Phone *</label>
                        <input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          className="input-field"
                          placeholder="Your phone number"
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="label-text" htmlFor="email">Email</label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="input-field"
                        placeholder="Your email address (optional)"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="label-text" htmlFor="subject">Subject / Requirement</label>
                      <select
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        className="input-field"
                      >
                        <option value="">Select a subject...</option>
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="label-text" htmlFor="product">Product Interest</label>
                        <select
                          id="product"
                          value={formData.product_id}
                          onChange={(e) => handleChange('product_id', e.target.value)}
                          className="input-field"
                        >
                          <option value="">Select a date variety...</option>
                          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="label-text" htmlFor="service">Service Interest</label>
                        <select
                          id="service"
                          value={formData.service_id}
                          onChange={(e) => handleChange('service_id', e.target.value)}
                          className="input-field"
                        >
                          <option value="">Select a service...</option>
                          {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="label-text" htmlFor="quantity">Quantity (optional)</label>
                      <input
                        id="quantity"
                        type="text"
                        value={formData.quantity}
                        onChange={(e) => handleChange('quantity', e.target.value)}
                        className="input-field"
                        placeholder="e.g. 10 maunds, 100 kg, container load"
                      />
                    </div>

                    <div>
                      <label className="label-text" htmlFor="message">Message *</label>
                      <textarea
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        className="input-field resize-none"
                        placeholder="Tell us about your requirements..."
                      />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === 'submitting' ? (
                        <LoadingSpinner size={18} />
                      ) : (
                        <>
                          Send Enquiry
                          <Send size={18} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
