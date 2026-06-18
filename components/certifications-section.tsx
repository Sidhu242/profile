'use client';

import { useState } from 'react';
import { Award, ExternalLink, Calendar, Download, ZoomIn, CheckCircle } from 'lucide-react';
import { Certificate } from '@/lib/types';
import SectionHeader from './section-header';
import Modal, { ModalCloseButton } from '@/components/ui/modal';
import Image from 'next/image';

interface CertificationsSectionProps {
  certificates: Certificate[];
}

function CertificateCard({ certificate, onClick }: { certificate: Certificate; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative h-40 bg-muted overflow-hidden">
        {certificate.image_url ? (
          <Image
            src={certificate.image_url}
            alt={certificate.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
            <Award size={36} className="text-primary/15" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {certificate.name}
        </h3>
        <p className="text-xs text-primary font-medium">{certificate.issuer}</p>
        <div className="flex items-center justify-between pt-1">
          {certificate.issue_date && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar size={10} />
              {new Date(certificate.issue_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          )}
          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle size={9} />
            Completed
          </span>
        </div>
      </div>
    </button>
  );
}

function CertificateModal({ certificate, open, onClose }: { certificate: Certificate | null; open: boolean; onClose: () => void }) {
  const [imageZoomed, setImageZoomed] = useState(false);

  if (!certificate) return null;

  return (
    <>
      {/* Detail Modal */}
      <Modal open={open && !imageZoomed} onClose={onClose} maxWidth="max-w-5xl">
        <div className="overflow-y-auto" style={{ maxHeight: '90vh' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Certificate image */}
            <div className="relative bg-muted border-b lg:border-b-0 lg:border-r border-border min-h-[300px]">
              {certificate.image_url ? (
                <button
                  onClick={() => setImageZoomed(true)}
                  className="w-full h-full relative group/img cursor-zoom-in"
                >
                  <Image
                    src={certificate.image_url}
                    alt={certificate.name}
                    fill
                    className="object-contain p-6"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                    <div className="flex items-center gap-2 px-4 py-2 bg-black/60 text-white rounded-full text-sm backdrop-blur-sm">
                      <ZoomIn size={16} />
                      Click to zoom
                    </div>
                  </div>
                </button>
              ) : (
                <div className="w-full h-full flex items-center justify-center p-8">
                  <div className="text-center">
                    <Award size={48} className="text-primary/20 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No image available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="p-6 sm:p-8 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Award size={18} className="text-primary" />
                </div>
                <span className="text-xs font-medium text-primary uppercase tracking-wider">Certification</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">{certificate.name}</h2>
              <p className="text-primary font-medium mb-5">{certificate.issuer}</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {certificate.issue_date && (
                  <div className="bg-background border border-border rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">Issue Date</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(certificate.issue_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                )}
                {certificate.credential_id && (
                  <div className="bg-background border border-border rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">Credential ID</p>
                    <p className="text-sm font-medium text-foreground truncate">{certificate.credential_id}</p>
                  </div>
                )}
                {certificate.expiry_date && (
                  <div className="bg-background border border-border rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">Expiry Date</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(certificate.expiry_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>

              {certificate.description && (
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-md">{certificate.description}</p>
                </div>
              )}

              {certificate.skills_gained && certificate.skills_gained.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Skills Gained</h3>
                  <div className="flex flex-wrap gap-2">
                    {certificate.skills_gained.map((skill) => (
                      <span key={skill} className="px-3 py-1.5 text-xs bg-primary/10 text-primary border border-primary/20 rounded-full font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto flex flex-wrap gap-3 pt-4 border-t border-border">
                {certificate.credential_url && (
                  <a
                    href={certificate.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-primary/20"
                  >
                    <ExternalLink size={15} />
                    View Credential
                  </a>
                )}
                {certificate.image_url && (
                  <a
                    href={certificate.image_url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <Download size={15} />
                    Download
                  </a>
                )}
                <div className="flex-1" />
                <ModalCloseButton onClose={onClose} />
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Full-screen image zoom */}
      <Modal open={imageZoomed} onClose={() => setImageZoomed(false)} maxWidth="max-w-6xl" className="bg-transparent border-0 shadow-none">
        <div className="relative bg-muted/95 backdrop-blur-sm rounded-2xl overflow-hidden" style={{ maxHeight: '90vh' }}>
          {certificate.image_url && (
            <div className="relative w-full" style={{ minHeight: '400px', maxHeight: '85vh' }}>
              <Image
                src={certificate.image_url}
                alt={certificate.name}
                fill
                className="object-contain p-6"
                sizes="100vw"
              />
            </div>
          )}
          <div className="absolute top-4 right-4">
            <ModalCloseButton onClose={() => setImageZoomed(false)} className="bg-card/90 backdrop-blur-sm" />
          </div>
        </div>
      </Modal>
    </>
  );
}

export default function CertificationsSection({ certificates }: CertificationsSectionProps) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  if (!certificates.length) return null;

  return (
    <section id="certifications" className="section-padding">
      <div className="container-max">
        <SectionHeader
          label="Certifications"
          title="Professional Credentials"
          description="Industry-recognized certifications that validate my expertise."
        />

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {certificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onClick={() => setSelectedCert(cert)}
            />
          ))}
        </div>
      </div>

      <CertificateModal
        certificate={selectedCert}
        open={!!selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </section>
  );
}
