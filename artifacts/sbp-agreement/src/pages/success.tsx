import { useState, useRef, useEffect } from "react";
import { useRoute } from "wouter";
import { useGetAgreement } from "@workspace/api-client-react";
import { DocumentTemplate } from "@/components/DocumentTemplate";
import { Download, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function SuccessPage() {
  const [, params] = useRoute("/agreement/:id/success");
  const id = params?.id;
  const { toast } = useToast();
  
  const { data: agreement, isLoading } = useGetAgreement(id || "");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDownloadPdf = async () => {
    if (!documentRef.current || !agreement) return;

    try {
      setIsGeneratingPdf(true);
      toast({
        title: "Menyiapkan PDF...",
        description: "Mohon tunggu sebentar, dokumen sedang di-generate.",
      });

      // Dynamically import html2pdf.js only when needed
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = documentRef.current;
      const opt = {
        margin: 0,
        filename: `Perjanjian_Pemasaran_${agreement.nama_owner.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg' as const, quality: 1 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
      
      toast({
        title: "Berhasil",
        description: "PDF berhasil diunduh.",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Gagal mengunduh PDF",
        description: "Terjadi kesalahan saat memproses dokumen.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p>Dokumen tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 mb-8 border border-border/50">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-4">
            PERJANJIAN BERHASIL DITANDATANGANI
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
            Terima kasih Bapak/Ibu <strong>{agreement.nama_owner}</strong>. Dokumen perjanjian pemasaran properti telah sah dan tersimpan di sistem kami.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              {isGeneratingPdf ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Memproses PDF...</>
              ) : (
                <><Download className="w-5 h-5" /> Download Dokumen (PDF)</>
              )}
            </button>
            
            <Link 
              href="/"
              className="w-full sm:w-auto px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" /> Kembali ke Admin
            </Link>
          </div>
        </div>

        {/* Hidden document rendering for PDF export */}
        <div className="h-0 overflow-hidden opacity-0 pointer-events-none absolute top-[-9999px] left-[-9999px]">
          <DocumentTemplate ref={documentRef} agreement={agreement} isSigning={false} />
        </div>
        
        {/* Visual Preview */}
        <div className="mt-12 opacity-50 scale-75 origin-top pointer-events-none hidden md:block">
          <DocumentTemplate agreement={agreement} isSigning={false} />
        </div>
      </div>
    </div>
  );
}
